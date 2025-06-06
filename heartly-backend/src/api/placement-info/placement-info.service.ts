import { FormFieldContributionService } from '@/api/form-field-contribution/form-field-contribution.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlacementInfoEntity } from './entities/placement-info.entity';

@Injectable()
export class PlacementInfoService {
  constructor(
    @InjectRepository(PlacementInfoEntity)
    private readonly placementInfoRepository: Repository<PlacementInfoEntity>,
    private readonly formFieldContributionService: FormFieldContributionService,
  ) {}

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

  async create(
    placementInfo: Partial<PlacementInfoEntity>,
    userId: string,
  ): Promise<PlacementInfoEntity> {
    const newPlacementInfo = this.placementInfoRepository.create(placementInfo);

    // Add the user as a contributor
    newPlacementInfo.contributors = [{ id: userId } as any];

    return this.placementInfoRepository.save(newPlacementInfo);
  }

  async update(
    id: string,
    updates: Partial<PlacementInfoEntity>,
    userId: string,
    changedFields: string[] = [],
  ): Promise<PlacementInfoEntity> {
    // Get the existing record
    const existingPlacementInfo = await this.findOne(id);

    // Apply updates
    Object.assign(existingPlacementInfo, updates);

    // Track field contributions if fields were specified
    if (changedFields.length > 0) {
      await Promise.all(
        changedFields.map((fieldName) =>
          this.formFieldContributionService.trackFieldContribution(
            fieldName,
            userId,
            id,
          ),
        ),
      );
    }

    // Save updated placement info
    return this.placementInfoRepository.save(existingPlacementInfo);
  }

  async delete(id: string): Promise<void> {
    await this.placementInfoRepository.delete(id);
  }
}
