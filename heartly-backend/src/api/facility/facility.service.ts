import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SessionContainer } from 'supertokens-node/recipe/session';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import { UserEntity, UserRole } from '../user/entities/user.entity';
import { CreateFacilityDto } from './dto/createFacility.req.dto';
import { FacilityResDto } from './dto/getFacility.res.dto';
import { UpdateFacilityDto } from './dto/updateFacility.req.dto';
import { FacilityEntity } from './entities/facility.entity';

@Injectable()
export class FacilityService {
  constructor(
    @InjectRepository(FacilityEntity)
    private readonly facilityRepository: Repository<FacilityEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tenantService: TenantService,
  ) {}

  async createFacility(
    facility: CreateFacilityDto,
    session: SessionContainer,
  ): Promise<FacilityEntity> {
    const userId = session.getUserId();

    const { metadata } = await UserMetadata.getUserMetadata(userId);

    const tenant = await this.tenantService.findTenantById(metadata.tenantId);
    if (!tenant) {
      throw new NotFoundException(
        `Tenant with id ${metadata.tenantId} not found`,
      );
    }

    const facilityWithTenantId: Partial<FacilityEntity> = {
      ...facility,
      tenant: tenant,
    };

    const newFacility = this.facilityRepository.create({
      ...facilityWithTenantId,
      users: [{ id: userId }],
    });

    return await this.facilityRepository.save(newFacility);
  }

  async getFacilityById(
    id: string,
    session: SessionContainer,
  ): Promise<FacilityResDto> {
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;

    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

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

    // Additional security check to ensure facility belongs to user's tenant
    if (facility.tenant.id !== userTenantId) {
      throw new ForbiddenException(
        'You do not have permission to access this facility',
      );
    }

    return plainToInstance(FacilityResDto, facility);
  }

  async getLoggedInUserFacilities(
    session: SessionContainer,
  ): Promise<FacilityResDto[]> {
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;

    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

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
  ): Promise<FacilityEntity> {
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;

    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

    return this.facilityRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const existingFacility = await transactionalEntityManager.findOne(
          FacilityEntity,
          {
            where: { id: updateFacilityDto.id, tenant: { id: userTenantId } },
            relations: { tenant: true, users: true },
          },
        );

        // is this an owner

        if (!existingFacility) {
          throw new NotFoundException(
            `Facility with id ${updateFacilityDto.id} not found`,
          );
        }

        if (existingFacility.tenant.id !== userTenantId) {
          throw new ForbiddenException(
            'You do not have permission to update this facility',
          );
        }

        const mergedFacility = transactionalEntityManager.merge(
          FacilityEntity,
          existingFacility,
          updateFacilityDto,
        );

        return await transactionalEntityManager.save(
          FacilityEntity,
          mergedFacility,
        );
      },
    );
  }

  async deleteFacility(id: string, session: SessionContainer): Promise<void> {
    const existingFacility = await this.facilityRepository.findOne({
      where: { id },
      relations: { tenant: true },
    });

    // TODO: Check if the facility has PHI in it to soft delete otherwise hard delete

    if (!existingFacility) {
      throw new NotFoundException(`Facility with id ${id} not found`);
    }

    // Check if user has permission to delete this facility
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;

    if (existingFacility.tenant.id !== userTenantId) {
      throw new ForbiddenException(
        'You do not have permission to delete this facility',
      );
    }

    // Soft delete
    existingFacility.isDeleted = true;
    existingFacility.deletedAt = new Date();
    await this.facilityRepository.save(existingFacility);
  }
}
