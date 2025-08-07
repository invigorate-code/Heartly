import { MetadataEntity } from '@/common/entities/form-metadata.entity';
import { BaseTenantService } from '@/common/services/base-tenant.service';
import { FormFieldContributionService } from '@/common/services/form-field-contribution.service';
import { FormRegistryService } from '@/common/services/form-registry.service';
import { RlsContextService } from '@/common/services/rls-context.service';
import { FORM_TYPE } from '@/constants/form-types.constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PHIService } from 'src/phi/phi.service';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Repository } from 'typeorm';
import { ClientEntity } from '../client/entities/client.entity';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { MedicationEntity } from '../medication/entities/medication.entity';
import { TenantService } from '../tenant/tenant.service';
import { CreatePlacementInfoDto } from './dto/CreatePlacementInfo.req.dto';
import { PlacementInfoResponseDto } from './dto/getPlacementInfo.res.dto';
import { PlacementInfoEntity } from './entities/placement-info.entity';
import {
  addTenantToAddress,
  decryptPlacementInfoData,
  mapPlacementInfoToDto,
  processMedications,
  processSpecialistObject,
  processSpecialists,
} from './placement-info.utils';

@Injectable()
export class PlacementInfoService extends BaseTenantService {
  constructor(
    @InjectRepository(PlacementInfoEntity)
    private readonly placementInfoRepository: Repository<PlacementInfoEntity>,
    @InjectRepository(MetadataEntity)
    private readonly metadataRepository: Repository<MetadataEntity>,
    @InjectRepository(MedicationEntity)
    private readonly medicationRepository: Repository<MedicationEntity>,
    private readonly formFieldContributionService: FormFieldContributionService,
    @InjectRepository(FacilityEntity)
    private readonly facilityRepository: Repository<FacilityEntity>,
    private readonly tenantService: TenantService,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly phiService: PHIService,
    private readonly formRegistryService: FormRegistryService,
    rlsContextService: RlsContextService,
  ) {
    super(rlsContextService);
  }

  async findOne(id: string): Promise<PlacementInfoEntity> {
    // Load only the minimal essential relations for now
    const placementInfo = await this.placementInfoRepository.findOne({
      where: { id },
      relations: ['client', 'facility', 'metadata'],
    });

    if (!placementInfo) {
      throw new NotFoundException(`Placement info with id ${id} not found`);
    }

    // Decrypt the main placementInfo fields only
    const decryptedPlacementInfo = this.phiService.decryptPHIFields(
      placementInfo,
      'placementInfo',
    );

    return decryptedPlacementInfo;
  }

  async createPlacementInfo(
    placementInfo: CreatePlacementInfoDto,
    session: SessionContainer,
  ): Promise<string> {
    const userTenantId = await this.verifyTenantAccess(session);
    const userId = session.getUserId();

    const encryptedPlacementInfo = this.phiService.encryptPHIFieldsToBuffer(
      placementInfo,
      'placementInfo',
    );

    const tenant = await this.tenantService.findTenantById(userTenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${userTenantId} not found`);
    }

    const facility = await this.facilityRepository.findOne({
      where: { id: placementInfo.facilityId, tenant: { id: userTenantId } },
    });

    if (!facility) {
      throw new NotFoundException(
        `Facility with id ${placementInfo.facilityId} not found or not accessible`,
      );
    }

    const client = await this.clientRepository.findOne({
      where: { id: placementInfo.clientId, tenant: { id: userTenantId } },
    });

    if (!client) {
      throw new NotFoundException(
        `Client with id ${placementInfo.clientId} not found`,
      );
    }

    const formDefinition = this.formRegistryService.getFormDefinition(
      FORM_TYPE.PLACEMENT_INFO,
    );

    if (!formDefinition) {
      throw new Error(
        `No form definition found for ${FORM_TYPE.PLACEMENT_INFO}`,
      );
    }

    const completionPercentage = this.formRegistryService.calculateCompletion(
      FORM_TYPE.PLACEMENT_INFO,
      placementInfo,
    );

    const isCompleted = this.formRegistryService.isFormCompleted(
      FORM_TYPE.PLACEMENT_INFO,
      placementInfo,
    );

    const excludedFields = formDefinition.excludedContributionFields || [];
    const fieldsToTrack = Object.keys(placementInfo).filter(
      (key) => !excludedFields.includes(key),
    );

    const placementInfoObj = {
      ...encryptedPlacementInfo,
      client,
      facility,
      tenantId: tenant.id,
      completionPercentage,
      isCompleted,
      metadata: {
        formType: FORM_TYPE.PLACEMENT_INFO,
        entityId: 'temp-id',
        lastUpdatedBy: { id: userId },
        contributors: [{ id: userId }],
        formFieldContributions: fieldsToTrack.map((fieldName) => ({
          fieldName,
          formType: FORM_TYPE.PLACEMENT_INFO,
          contributor: { id: userId },
        })),
      },
      // Address relationships with tenant ID
      previousPlacement: addTenantToAddress(
        placementInfo.previousPlacement,
        tenant.id,
      ),
      placementAgency: addTenantToAddress(
        placementInfo.placementAgency,
        tenant.id,
      ),
      otherAgency: addTenantToAddress(placementInfo.otherAgency, tenant.id),
      legalRep: addTenantToAddress(placementInfo.legalRep, tenant.id),
      otherRep: addTenantToAddress(placementInfo.otherRep, tenant.id),
      religiousPrefAddress: addTenantToAddress(
        placementInfo.religiousPrefAddress,
        tenant.id,
      ),
      // Handle individual specialist objects
      primaryPhysician: processSpecialistObject(
        placementInfo.primaryPhysician,
        tenant.id,
        this.phiService,
      ),
      dentist: processSpecialistObject(
        placementInfo.dentist,
        tenant.id,
        this.phiService,
      ),
      otherSpecialists: processSpecialists(
        placementInfo.otherSpecialists,
        tenant.id,
        this.phiService,
      ),
      medications: placementInfo.medications?.length
        ? processMedications(
            placementInfo.medications,
            tenant.id,
            this.phiService,
            client.id,
            'temp-id', // Temporary ID that will be updated after saving
          )
        : [],
    };

    // Create the placement info object first to get its ID
    const newPlacementInfo =
      this.placementInfoRepository.create(placementInfoObj);
    const savedPlacementInfo =
      await this.placementInfoRepository.save(newPlacementInfo);

    // Update the medication references with the correct placement info ID
    if (savedPlacementInfo.medications?.length) {
      await this.medicationRepository.update(
        { placementInfoId: 'temp-id' },
        { placementInfoId: savedPlacementInfo.id },
      );
    }

    // Update the entityId in metadata to match the placement info id
    if (savedPlacementInfo.metadata) {
      await this.metadataRepository.update(
        { id: savedPlacementInfo.metadata.id },
        { entityId: savedPlacementInfo.id },
      );
    }

    // Return the complete entity with relations
    return savedPlacementInfo.id;
  }

  async getPlacementInfo(
    id: string,
    session: SessionContainer,
  ): Promise<PlacementInfoResponseDto> {
    const userTenantId = await this.verifyTenantAccess(session);

    const placementInfo = await this.placementInfoRepository.findOne({
      where: { id, tenantId: userTenantId },
      relations: [
        'client',
        'facility',
        'metadata',
        // 'medications',
        'metadata.lastUpdatedBy',
        'previousPlacement',
        'placementAgency',
        'otherAgency',
        'legalRep',
        'otherRep',
        'religiousPrefAddress',
        'primaryPhysician',
        'primaryPhysician.address',
        'dentist',
        'dentist.address',
        'otherSpecialists',
        'otherSpecialists.address',
      ],
    });

    if (!placementInfo) {
      throw new NotFoundException(
        `Placement info with ID ${id} not found or not accessible`,
      );
    }

    const decryptedData = decryptPlacementInfoData(
      placementInfo,
      this.phiService,
    );
    return mapPlacementInfoToDto(decryptedData);
  }

  async delete(id: string): Promise<void> {
    await this.placementInfoRepository.delete(id);
  }
}
