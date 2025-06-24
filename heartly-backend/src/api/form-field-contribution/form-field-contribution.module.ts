import { CommonModule } from '@/common/common.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormFieldContributionEntity } from '../../common/entities/form-field-contribution.entity';
import { FormFieldContributionService } from '../../common/services/form-field-contribution.service';
import { FormFieldContributionController } from './form-field-contribution.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FormFieldContributionEntity]),
    CommonModule,
  ],
  providers: [FormFieldContributionService],
  controllers: [FormFieldContributionController],
  exports: [FormFieldContributionService],
})
export class FormFieldContributionModule {}
