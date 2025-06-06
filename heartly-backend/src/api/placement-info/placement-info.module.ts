import { FormFieldContributionModule } from '@/api/form-field-contribution/form-field-contribution.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetadataEntity } from './entities/metadata.entity';
import { PlacementInfoEntity } from './entities/placement-info.entity';
import { PlacementInfoController } from './placement-info.controller';
import { PlacementInfoService } from './placement-info.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlacementInfoEntity, MetadataEntity]),
    FormFieldContributionModule,
  ],
  providers: [PlacementInfoService],
  controllers: [PlacementInfoController],
  exports: [PlacementInfoService],
})
export class PlacementInfoModule {}
