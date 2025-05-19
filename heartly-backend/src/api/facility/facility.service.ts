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
import { UserEntity } from '../user/entities/user.entity';
import { CreateFacilityDto } from './dto/createFacility.req.dto';
import { FacilityResDto } from './dto/getFacility.res.dto';
import { UpdateFacilityDto } from './dto/updateFacility.reg.dto';
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

    const facilityWithTenantId = {
      ...facility,
      tenant: tenant,
      // projected client count
    };

    const newFacility = this.facilityRepository.create(facilityWithTenantId);
    return await this.facilityRepository.save(newFacility);
  }

  async getFacilityById(id: string): Promise<FacilityResDto> {
    const facility = await this.facilityRepository.findOne({
      where: { id },
      relations: { tenant: true, users: true },
    });

    if (!facility) {
      throw new NotFoundException(`Facility with id ${id} not found`);
    }

    return plainToInstance(FacilityResDto, facility);
  }

  async getFacilitiesByTenantId(
    session: SessionContainer,
  ): Promise<FacilityResDto[]> {
    // Get user metadata to retrieve the proper tenantId
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const tenantId = metadata.tenantId;

    if (!tenantId || typeof tenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user session');
    }

    const allFacilitiesEntitiesByTenantId = await this.facilityRepository.find({
      where: {
        tenant: { id: tenantId },
      },
      relations: { tenant: true, users: true },
    });

    if (allFacilitiesEntitiesByTenantId.length === 0) {
      throw new NotFoundException(
        `Facilities with tenantId ${tenantId} not found`,
      );
    }

    const allFacilitiesByTenantId = allFacilitiesEntitiesByTenantId.map(
      (facility) => plainToInstance(FacilityResDto, facility),
    );

    return allFacilitiesByTenantId;
  }

  async getAllFacilities(): Promise<FacilityResDto[]> {
    const allFacilityEntities = await this.facilityRepository.find();
    if (allFacilityEntities.length === 0) {
      throw new NotFoundException('No facilities found');
    }
    const allFacilities = allFacilityEntities.map((facility) =>
      plainToInstance(FacilityResDto, facility),
    );

    return allFacilities;
  }

  async getLoggedInStaffFacilities(
    session: SessionContainer,
  ): Promise<FacilityResDto[]> {
    const userId = session.getUserId();

    const userWithFacilities = await this.userRepository.findOne({
      where: { id: userId },
      relations: { facilities: true },
    });

    if (!userWithFacilities) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (userWithFacilities.facilities.length === 0) {
      throw new NotFoundException(
        `No facilities found for user with id ${userId}`,
      );
    }

    return userWithFacilities.facilities.map((facility) =>
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
            where: { id: updateFacilityDto.id },
            relations: ['tenant', 'users'],
          },
        );

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

  // Question(@thompson): Do we want to do a soft delete?
  async deleteFacility(id: string, session: SessionContainer): Promise<void> {
    const existingFacility = await this.facilityRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

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
    // existingFacility.isDeleted = true;
    // existingFacility.deletedAt = new Date();
    // await this.facilityRepository.save(existingFacility);

    // Hard delete
    await this.facilityRepository.delete(id);
  }
}
