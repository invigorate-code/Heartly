import { MetadataEntity } from '@/common/entities/form-metadata.entity';
import { BaseTenantService } from '@/common/services/base-tenant.service';
import { FormFieldContributionService } from '@/common/services/form-field-contribution.service';
import { FormRegistryService } from '@/common/services/form-registry.service';
import { FORM_TYPE } from '@/constants/form-types.constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PHIService } from 'src/phi/phi.service';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Repository } from 'typeorm';
import { CreateAddressDto } from '../address/dto/create-address.dto';
import { ClientEntity } from '../client/entities/client.entity';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { CreateMedicationDto } from '../medication/dto/CreateMedication.req.dto';
import { CreateSpecialistDto } from '../specialist/dto/CreateSpecialist.dto';
import { TenantService } from '../tenant/tenant.service';
import { CreatePlacementInfoDto } from './dto/CreatePlacementInfo.req.dto';
import { PlacementInfoEntity } from './entities/placement-info.entity';

@Injectable()
export class PlacementInfoService extends BaseTenantService {
  constructor(
    @InjectRepository(PlacementInfoEntity)
    private readonly placementInfoRepository: Repository<PlacementInfoEntity>,
    @InjectRepository(MetadataEntity)
    private readonly metadataRepository: Repository<MetadataEntity>,
    private readonly formFieldContributionService: FormFieldContributionService,
    @InjectRepository(FacilityEntity)
    private readonly facilityRepository: Repository<FacilityEntity>,
    private readonly tenantService: TenantService,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly phiService: PHIService,
    private readonly formRegistryService: FormRegistryService,
  ) {
    super();
  }

  async findOne(id: string): Promise<PlacementInfoEntity> {
    const placementInfo = await this.placementInfoRepository.findOne({
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
        'primaryPhysician',
        'dentist',
        'otherSpecialists',
        'medications',
      ],
    });

    if (!placementInfo) {
      throw new NotFoundException(`Placement info with id ${id} not found`);
    }

    // Decrypt the main placementInfo fields
    const decryptedPlacementInfo = this.phiService.decryptPHIFields(
      placementInfo,
      'placementInfo',
    );

    // Decrypt related specialists
    if (decryptedPlacementInfo.primaryPhysician) {
      decryptedPlacementInfo.primaryPhysician =
        this.phiService.decryptPHIFields(
          decryptedPlacementInfo.primaryPhysician,
          'specialist',
        );
    }

    if (decryptedPlacementInfo.dentist) {
      decryptedPlacementInfo.dentist = this.phiService.decryptPHIFields(
        decryptedPlacementInfo.dentist,
        'specialist',
      );
    }

    // Decrypt other specialists if present
    if (decryptedPlacementInfo.otherSpecialists) {
      if (Array.isArray(decryptedPlacementInfo.otherSpecialists)) {
        decryptedPlacementInfo.otherSpecialists =
          decryptedPlacementInfo.otherSpecialists.map((specialist) =>
            this.phiService.decryptPHIFields(specialist, 'specialist'),
          );
      } else {
        decryptedPlacementInfo.otherSpecialists =
          this.phiService.decryptPHIFields(
            decryptedPlacementInfo.otherSpecialists,
            'specialist',
          );
      }
    }

    // Decrypt medications if present
    if (decryptedPlacementInfo.medications) {
      if (Array.isArray(decryptedPlacementInfo.medications)) {
        decryptedPlacementInfo.medications =
          decryptedPlacementInfo.medications.map((medication) =>
            this.phiService.decryptPHIFields(medication, 'medication'),
          );
      } else {
        decryptedPlacementInfo.medications = this.phiService.decryptPHIFields(
          decryptedPlacementInfo.medications,
          'medication',
        );
      }
    }

    // Return the decrypted entity
    return decryptedPlacementInfo;
  }

  async createPlacementInfo(
    placementInfo: CreatePlacementInfoDto,
    session: SessionContainer,
  ): Promise<PlacementInfoEntity> {
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

    const addTenantToAddress = (
      address?: CreateAddressDto,
    ): CreateAddressDto | undefined => {
      if (!address) return undefined;
      return { ...address, tenantId: tenant.id };
    };

    // Use the PHI service's processEntityWithPHI method
    const processEntityWithPHI = <T>(
      data: any,
      entityType: string,
      additionalFields?: Record<string, any>,
    ): T | undefined => {
      return this.phiService.processEntityWithPHI<T>(
        data,
        entityType,
        tenant.id,
        additionalFields,
        addTenantToAddress,
      );
    };

    const processSpecialistObject = (specialist?: CreateSpecialistDto) => {
      return processEntityWithPHI(specialist, 'specialist');
    };

    const processSpecialists = (specialists?: CreateSpecialistDto[]) => {
      if (!specialists || specialists.length === 0) return undefined;

      return specialists.map((specialist) => ({
        type: specialist.type
          ? this.phiService.encryptToBuffer(specialist.type)
          : null,
        name: specialist.name
          ? this.phiService.encryptToBuffer(specialist.name)
          : null,
        address: specialist.address
          ? addTenantToAddress(specialist.address)
          : undefined,
        tenantId: tenant.id,
      }));
    };

    const processMedications = (medications?: CreateMedicationDto[]) => {
      if (!medications || medications.length === 0) return undefined;

      return medications.map((medication) => ({
        name: medication.name
          ? this.phiService.encryptToBuffer(medication.name)
          : null,
        requiredDosage: medication.requiredDosage
          ? this.phiService.encryptToBuffer(medication.requiredDosage)
          : null,
        timeFrequency: medication.timeFrequency
          ? this.phiService.encryptToBuffer(medication.timeFrequency)
          : null,
        prescribingMd: medication.prescribingMd
          ? this.phiService.encryptToBuffer(medication.prescribingMd)
          : null,
        isPrescription: medication.isPrescription,
        filledDate: medication.filledDate,
        refillsRemaining: medication.refillsRemaining,
        isDailyMed: medication.isDailyMed,
        tenantId: tenant.id,
      }));
    };

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
      previousPlacement: addTenantToAddress(placementInfo.previousPlacement),
      placementAgency: addTenantToAddress(placementInfo.placementAgency),
      otherAgency: addTenantToAddress(placementInfo.otherAgency),
      legalRep: addTenantToAddress(placementInfo.legalRep),
      otherRep: addTenantToAddress(placementInfo.otherRep),
      religiousPrefAddress: addTenantToAddress(
        placementInfo.religiousPrefAddress,
      ),
      // Handle individual specialist objects
      primaryPhysician: processSpecialistObject(placementInfo.primaryPhysician),
      dentist: processSpecialistObject(placementInfo.dentist),
      // Handle arrays
      specialists: processSpecialists(placementInfo.specialists),
      medications: processMedications(placementInfo.medications),
    };

    const newPlacementInfo =
      this.placementInfoRepository.create(placementInfoObj);
    const savedPlacementInfo =
      await this.placementInfoRepository.save(newPlacementInfo);

    // Update the entityId in metadata to match the placement info id
    if (savedPlacementInfo.metadata) {
      await this.metadataRepository.update(
        { id: savedPlacementInfo.metadata.id },
        { entityId: savedPlacementInfo.id },
      );
    }

    // Return the complete entity with relations
    return this.findOne(savedPlacementInfo.id);
  }

  async delete(id: string): Promise<void> {
    await this.placementInfoRepository.delete(id);
  }
}
