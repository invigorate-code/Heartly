import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SessionContainer } from 'supertokens-node/recipe/session';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import { UserEntity } from '../user/entities/user.entity';
import { CreateFacilityDto } from './dto/createFacility.req.dto';
import { FacilityResDto } from './dto/getFacility.res.dto';
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

    console.log('metadata', metadata, session.getUserId());

    const facilityWithTenantId = {
      ...facility,
      tenantId: metadata.tenantId,
      // projected client count
    };

    const newFacility = this.facilityRepository.create(facilityWithTenantId);
    return await this.facilityRepository.save(newFacility);
  }

  async getFacilityById(id: string): Promise<FacilityResDto> {
    const facility = await this.facilityRepository.findOne({
      where: { id },
      relations: ['tenant', 'staff'],
    });

    if (!facility) {
      throw new NotFoundException(`Facility with id ${id} not found`);
    }

    return plainToInstance(FacilityResDto, facility, {
      excludeExtraneousValues: true,
    });
  }

  async getAllFacilities(): Promise<FacilityResDto[]> {
    const allFacilityEntities = await this.facilityRepository.find();
    if (allFacilityEntities.length === 0) {
      throw new NotFoundException('No facilities found');
    }
    const allFacilities = allFacilityEntities.map((facility) =>
      plainToInstance(FacilityResDto, facility, {
        excludeExtraneousValues: true,
      }),
    );

    // QUESTION(@thompson): Do we want to paginate full volume sets like this?
    // QUESTION(@thompson): Do we want to filter this by tenantId only or keep for our sake?
    return allFacilities;
  }

  async getFacilitiesByTenantId(tenantId: string): Promise<FacilityResDto[]> {
    const allFacilitiesEntitiesByTenantId = await this.facilityRepository.find({
      where: { tenantId },
      relations: ['tenant', 'staff'],
    });

    if (allFacilitiesEntitiesByTenantId.length === 0) {
      throw new NotFoundException(
        `Facilities with tenantId ${tenantId} not found`,
      );
    }

    const allFacilitiesByTenantId = allFacilitiesEntitiesByTenantId.map(
      (facility) =>
        plainToInstance(FacilityResDto, facility, {
          excludeExtraneousValues: true,
        }),
    );

    return allFacilitiesByTenantId;
  }

  async getLoggedInUsersFacilities(id: string): Promise<FacilityResDto[]> {
    const userFacilityEntities = (
      await this.userRepository.findOne({ where: { id } })
    ).facilities;

    if (userFacilityEntities.length === 0) {
      throw new NotFoundException(
        `Facilities for user with id ${id} not found`,
      );
    }
    const userFacilities = userFacilityEntities.map((facility) =>
      plainToInstance(FacilityResDto, facility, {
        excludeExtraneousValues: true,
      }),
    );
    return userFacilities;
  }

  // Question(@thompson): Do we want to update all fields or just some?
  // Question(@thompson): Do we want to do this in a transaction?
  async updateFacility(
    id: string,
    facility: Partial<CreateFacilityDto>,
  ): Promise<FacilityEntity> {
    return this.facilityRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Load with relations to ensure complete entity state
        const existingFacility = await transactionalEntityManager.findOne(
          FacilityEntity,
          {
            where: { id },
            relations: ['tenant', 'staff'],
          },
        );

        if (!existingFacility) {
          throw new NotFoundException(`Facility with id ${id} not found`);
        }

        // Prevent tenant changes entirely

        // if (
        //   facility.tenantId &&
        //   facility.tenantId !== existingFacility.tenantId
        // ) {
        //   throw new Error('Changing the tenant of a facility is not allowed');
        // }

        // QUESTION(@thompson): Do we want to allow this?
        if (
          facility.tenantId &&
          facility.tenantId !== existingFacility.tenantId
        ) {
          try {
            await this.tenantService.findTenantById(facility.tenantId);
          } catch (_error) {
            throw new NotFoundException(
              `Tenant with id ${facility.tenantId} not found`,
            );
          }
        }

        // Update and save
        Object.assign(existingFacility, facility);
        return await transactionalEntityManager.save(
          FacilityEntity,
          existingFacility,
        );
      },
    );
  }

  // Question(@thompson): Do we want to do a soft delete?
  async deleteFacility(id: string): Promise<void> {
    const existingFacility = await this.facilityRepository.findOne({
      where: { id },
    });
    if (!existingFacility) {
      throw new NotFoundException(`Facility with id ${id} not found`);
    }
    await this.facilityRepository.delete(id);
  }
}
