import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormFieldContributionEntity } from './entities/form-field-contribution.entity';
import { FormFieldContributionController } from './form-field-contribution.controller';
import { FormFieldContributionService } from './form-field-contribution.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormFieldContributionEntity])],
  providers: [FormFieldContributionService],
  controllers: [FormFieldContributionController],
  exports: [FormFieldContributionService],
})
export class FormFieldContributionModule {}
