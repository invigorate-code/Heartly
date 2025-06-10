import { FormFieldContributionService } from '@/api/form-field-contribution/form-field-contribution.service';
import { BaseTenantService } from '@/common/base-tenant-service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Repository } from 'typeorm';
import { ClientEntity } from '../client/entities/client.entity';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { TenantService } from '../tenant/tenant.service';
import { UserEntity } from '../user/entities/user.entity';
import { CreatePlacementInfoDto } from './dto/CreatePlacementInfo.req.dto';
import { MetadataEntity } from './entities/metadata.entity';
import { PlacementInfoEntity } from './entities/placement-info.entity';

@Injectable()
export class PlacementInfoService extends BaseTenantService {
  constructor(
    @InjectRepository(PlacementInfoEntity)
    private readonly placementInfoRepository: Repository<PlacementInfoEntity>,
    private readonly formFieldContributionService: FormFieldContributionService,
    private readonly facilityRepository: Repository<FacilityEntity>,
    private readonly tenantService: TenantService,
    @InjectRepository(ClientEntity) // Add this line
    private readonly clientRepository: Repository<ClientEntity>, // And this line
  ) {
    super();
  }

  async findOne(id: string): Promise<PlacementInfoEntity> {
    return this.placementInfoRepository.findOne({
      where: { id },
      relations: [
        'client',
        'facility',
        'previousPlacement',
        'placementAgency',
        'otherAgency',
        'legalRep',
        'otherRep',
        'metadata',
        'contributors',
        'formFieldContributions',
        'formFieldContributions.contributor',
      ],
    });
  }

  async createPlacementInfo(
    placementInfo: Partial<CreatePlacementInfoDto>,
    session: SessionContainer,
  ): Promise<PlacementInfoEntity> {
    const userId = session.getUserId();
    const userTenantId = await this.verifyTenantAccess(session);

    // Use a transaction
    return this.placementInfoRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Fetch tenant within the transaction
        const tenant = await this.tenantService.findTenantById(userTenantId);
        if (!tenant) {
          throw new NotFoundException(
            `Tenant with id ${userTenantId} not found`,
          );
        }

        // Fetch facility within the transaction
        const facility = await transactionalEntityManager.findOne(
          FacilityEntity,
          {
            where: {
              id: placementInfo.facilityId,
              tenant: { id: userTenantId },
            },
          },
        );

        if (!facility) {
          throw new NotFoundException(
            `Valid Facility with id ${placementInfo.facilityId} not found`,
          );
        }

        // Fetch client within the transaction
        const client = await transactionalEntityManager.findOne(ClientEntity, {
          where: { id: placementInfo.clientId, tenant: { id: userTenantId } },
        });

        if (!client) {
          throw new NotFoundException(
            `Client with id ${placementInfo.clientId} not found`,
          );
        }

        // Create metadata entity within the transaction
        const metadata = new MetadataEntity();
        metadata.lastUpdatedBy = { id: userId } as UserEntity;
        metadata.contributors = [{ id: userId } as UserEntity];

        // Save metadata first to get an ID
        const savedMetadata = await transactionalEntityManager.save(metadata);

        const placementInfoWithRelationships: Partial<PlacementInfoEntity> = {
          ...placementInfo,
          client,
          tenantId: tenant.id,
          facility,
          metadata: savedMetadata,
        };

        // Create and save placement info using the transaction manager
        const newPlacementInfo = transactionalEntityManager.create(
          PlacementInfoEntity,
          placementInfoWithRelationships,
        );

        // Add the user as a contributor
        newPlacementInfo.contributors = [{ id: userId } as UserEntity];

        // Save the placement info with transaction manager
        const savedPlacementInfo =
          await transactionalEntityManager.save(newPlacementInfo);

        // Track field contributions within the same transaction
        const excludedFields = [
          'clientId',
          'facilityId',
          'placementAgencyId',
          'otherAgencyId',
          'legalRepId',
          'otherRepId',
          'previousPlacementId',
          'tenantId',
          'metadata',
          'contributors',
        ];

        const fieldsToTrack = Object.keys(placementInfo).filter(
          (key) => !excludedFields.includes(key),
        );

        // Create contribution entities directly with the transaction manager
        if (fieldsToTrack.length > 0) {
          // Use batch processing
          const contributions = fieldsToTrack.map((fieldName) => ({
            fieldName,
            contributorId: userId,
            placementInfoId: savedPlacementInfo.id,
          }));

          // Option 1: Use the service which should handle the saving internally
          await this.formFieldContributionService.trackFieldContributions(
            contributions,
          );
        }

        // Return the fully populated entity after transaction completes
        return this.findOne(savedPlacementInfo.id);
      },
    );
  }

  // async update(
  //   id: string,
  //   updates: Partial<PlacementInfoEntity>,
  //   userId: string,
  //   changedFields: string[] = [],
  // ): Promise<PlacementInfoEntity> {
  //   // Get the existing record
  //   const existingPlacementInfo = await this.findOne(id);

  //   // Apply updates
  //   Object.assign(existingPlacementInfo, updates);

  //   // Track field contributions if fields were specified
  //   if (changedFields.length > 0) {
  //     await Promise.all(
  //       changedFields.map((fieldName) =>
  //         this.formFieldContributionService.trackFieldContributions(
  //           fieldName,
  //           userId,
  //           id,
  //         ),
  //       ),
  //     );
  //   }

  //   // Save updated placement info
  //   return this.placementInfoRepository.save(existingPlacementInfo);
  // }

  async delete(id: string): Promise<void> {
    await this.placementInfoRepository.delete(id);
  }
}
