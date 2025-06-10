import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormFieldContributionEntity } from './entities/form-field-contribution.entity';

@Injectable()
export class FormFieldContributionService {
  constructor(
    @InjectRepository(FormFieldContributionEntity)
    private readonly formFieldContributionRepository: Repository<FormFieldContributionEntity>,
  ) {}

  async trackFieldContributions(
    contributions: Array<{
      fieldName: string;
      contributorId: string;
      placementInfoId: string;
    }>,
  ): Promise<FormFieldContributionEntity[]> {
    const contributionEntities = contributions.map((contribution) =>
      this.formFieldContributionRepository.create(contribution),
    );

    return this.formFieldContributionRepository.save(contributionEntities);
  }

  async getFieldContributionsByPlacementInfo(
    placementInfoId: string,
  ): Promise<FormFieldContributionEntity[]> {
    return this.formFieldContributionRepository.find({
      where: { placementInfoId },
      relations: ['contributor'],
    });
  }

  async getFieldContributionsByContributor(
    contributorId: string,
  ): Promise<FormFieldContributionEntity[]> {
    return this.formFieldContributionRepository.find({
      where: { contributorId },
      relations: ['placementInfo'],
    });
  }

  async getFieldContribution(
    placementInfoId: string,
    fieldName: string,
  ): Promise<FormFieldContributionEntity | null> {
    return this.formFieldContributionRepository.findOne({
      where: { placementInfoId, fieldName },
      relations: ['contributor'],
    });
  }
}
