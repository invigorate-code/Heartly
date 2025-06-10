import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Repository } from 'typeorm';
import { BaseTenantService } from '../../common/base-tenant-service';
import { TenantService } from '../tenant/tenant.service';
import { UserEntity, UserRole } from '../user/entities/user.entity';
import { CreateFacilityDto } from './dto/createFacility.req.dto';
import { FacilityResDto } from './dto/getFacility.res.dto';
import { UpdateFacilityDto } from './dto/updateFacility.req.dto';
import { FacilityEntity } from './entities/facility.entity';
import { facilityHasPHI } from './facility.utils';

@Injectable()
export class FacilityService extends BaseTenantService {
  constructor(
    @InjectRepository(FacilityEntity)
    private readonly facilityRepository: Repository<FacilityEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tenantService: TenantService,
  ) {
    super();
  }

  async createFacility(
    facility: CreateFacilityDto,
    session: SessionContainer,
  ): Promise<FacilityResDto> {
    const userId = session.getUserId();
    const userTenantId = await this.verifyTenantAccess(session);

    const tenant = await this.tenantService.findTenantById(userTenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${userTenantId} not found`);
    }

    const facilityWithTenantId: Partial<FacilityEntity> = {
      ...facility,
      tenant: tenant,
    };

    const newFacility = this.facilityRepository.create({
      ...facilityWithTenantId,
      users: [{ id: userId }],
    });

    const savedFacility = await this.facilityRepository.save(newFacility);
    return plainToInstance(FacilityResDto, savedFacility);
  }

  async getFacilityById(
    id: string,
    session: SessionContainer,
  ): Promise<FacilityResDto> {
    const userId = session.getUserId();
    const userTenantId = await this.verifyTenantAccess(session);

    // Get the user to check their role
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Build the where clause based on user role
    const whereClause =
      user.role === UserRole.OWNER
        ? { id, tenant: { id: userTenantId } } // OWNER can see soft-deleted facilities
        : { id, isDeleted: false, tenant: { id: userTenantId } }; // Others only see active facilities

    const facility = await this.facilityRepository.findOne({
      where: whereClause,
      relations: { tenant: true, users: true },
    });

    if (!facility) {
      throw new NotFoundException(`Facility with id ${id} not found`);
    }

    return plainToInstance(FacilityResDto, facility);
  }

  async getLoggedInUserFacilities(
    session: SessionContainer,
  ): Promise<FacilityResDto[]> {
    const userId = session.getUserId();
    const userTenantId = await this.verifyTenantAccess(session);

    const userWithFacilities = await this.userRepository.findOne({
      where: { id: userId, tenant: { id: userTenantId } },
      relations: { facilities: true },
    });

    if (!userWithFacilities) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // OWNER users can see both active and soft-deleted facilities
    // Other users only see active facilities
    const facilitiesToReturn =
      userWithFacilities.role === UserRole.OWNER
        ? userWithFacilities.facilities
        : userWithFacilities.facilities.filter(
            (facility) => !facility.isDeleted,
          );

    if (facilitiesToReturn.length === 0) {
      throw new NotFoundException(
        `No facilities found for user with id ${userId}`,
      );
    }

    return facilitiesToReturn.map((facility) =>
      plainToInstance(FacilityResDto, facility),
    );
  }

  async updateFacility(
    session: SessionContainer,
    updateFacilityDto: UpdateFacilityDto,
  ): Promise<FacilityResDto> {
    const userTenantId = await this.verifyTenantAccess(session);

    return this.facilityRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const existingFacility = await transactionalEntityManager.findOne(
          FacilityEntity,
          {
            where: { id: updateFacilityDto.id, tenant: { id: userTenantId } },
            relations: { tenant: true, users: true },
          },
        );

        if (!existingFacility) {
          throw new NotFoundException(
            `Facility with id ${updateFacilityDto.id} not found`,
          );
        }

        const mergedFacility = transactionalEntityManager.merge(
          FacilityEntity,
          existingFacility,
          updateFacilityDto,
        );

        const savedFacility = await transactionalEntityManager.save(
          FacilityEntity,
          mergedFacility,
        );

        return plainToInstance(FacilityResDto, savedFacility);
      },
    );
  }

  async deleteFacility(id: string, session: SessionContainer): Promise<void> {
    const userTenantId = await this.verifyTenantAccess(session);

    const existingFacility = await this.facilityRepository.findOne({
      where: { id: id, tenant: { id: userTenantId } },
      relations: { tenant: true },
    });

    if (!existingFacility) {
      throw new NotFoundException(`Facility with id ${id} not found`);
    }

    const hasPHI = await facilityHasPHI(id, this.facilityRepository);

    if (hasPHI) {
      // Soft delete - keep records for HIPAA compliance but mark as deleted
      existingFacility.isDeleted = true;
      existingFacility.deletedAt = new Date();
      await this.facilityRepository.save(existingFacility);

      this.logger.log(`Facility ${id} was soft-deleted due to presence of PHI`);
    } else {
      // Hard delete - completely remove the facility as no PHI exists
      await this.facilityRepository.remove(existingFacility);
      this.logger.log(`Facility ${id} was hard-deleted (no PHI detected)`);
    }
  }

  async restoreFacility(
    id: string,
    session: SessionContainer,
  ): Promise<FacilityResDto> {
    const userId = session.getUserId();
    const userTenantId = await this.verifyTenantAccess(session);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Only OWNER role should be able to undelete facilities
    if (user.role !== UserRole.OWNER) {
      throw new ForbiddenException(
        'Only owners can restore deleted facilities',
      );
    }

    const existingFacility = await this.facilityRepository.findOne({
      where: { id, tenant: { id: userTenantId }, isDeleted: true },
      relations: { tenant: true },
    });

    if (!existingFacility) {
      throw new NotFoundException(`Deleted facility with id ${id} not found`);
    }

    existingFacility.isDeleted = false;
    existingFacility.deletedAt = null;

    const restoredFacility =
      await this.facilityRepository.save(existingFacility);

    return plainToInstance(FacilityResDto, restoredFacility);
  }
}
