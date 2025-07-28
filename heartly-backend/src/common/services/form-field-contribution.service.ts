import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormFieldContributionEntity } from '../entities/form-field-contribution.entity';
import { MetadataEntity } from '../entities/form-metadata.entity';

@Injectable()
export class FormFieldContributionService {
  constructor(
    @InjectRepository(FormFieldContributionEntity)
    private formFieldContributionRepository: Repository<FormFieldContributionEntity>,
    @InjectRepository(MetadataEntity)
    private metadataRepository: Repository<MetadataEntity>,
  ) {}

  async trackFieldContributions(
    contributions: Array<{
      fieldName: string;
      contributorId: string;
      formType: string;
      metadataId: string;
    }>,
  ): Promise<FormFieldContributionEntity[]> {
    const contributionEntities = contributions.map((contribution) =>
      this.formFieldContributionRepository.create(contribution),
    );

    return this.formFieldContributionRepository.save(contributionEntities);
  }

  async getContributorsForForm(formType: string): Promise<string[]> {
    const metadata = await this.metadataRepository.findOne({
      where: { formType },
      relations: ['contributors'],
    });

    if (!metadata) return [];

    return metadata.contributors.map((user) => user.id);
  }

  async getFieldContributions(
    formType: string,
  ): Promise<FormFieldContributionEntity[]> {
    const metadata = await this.metadataRepository.findOne({
      where: { formType },
    });

    if (!metadata) return [];

    return this.formFieldContributionRepository.find({
      where: { metadata: { id: metadata.id } },
      relations: ['contributor'],
    });
  }
}
