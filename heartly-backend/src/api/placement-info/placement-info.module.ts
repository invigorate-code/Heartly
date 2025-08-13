import { CommonModule } from '@/common/common.module';
import { FormFieldContributionEntity } from '@/common/entities/form-field-contribution.entity';
import { MetadataEntity } from '@/common/entities/form-metadata.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PHIModule } from '../../phi/phi.module';
import { ClientEntity } from '../client/entities/client.entity';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { MedicationEntity } from '../medication/entities/medication.entity';
import { TenantModule } from '../tenant/tenant.module';
import { PlacementInfoEntity } from './entities/placement-info.entity';
import { PlacementInfoController } from './placement-info.controller';
import { PlacementInfoService } from './placement-info.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlacementInfoEntity,
      FacilityEntity,
      ClientEntity,
      MetadataEntity,
      FormFieldContributionEntity,
      MedicationEntity,
    ]),
    CommonModule,
    TenantModule,
    PHIModule,
  ],
  providers: [PlacementInfoService],
  controllers: [PlacementInfoController],
  exports: [PlacementInfoService],
})
export class PlacementInfoModule {}
