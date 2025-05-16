import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from '../tenant/tenant.module';
import { UserEntity } from '../user/entities/user.entity';
import { FacilityEntity } from './entities/facility.entity';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacilityEntity, UserEntity]),
    TenantModule,
  ],
  exports: [TypeOrmModule, FacilityService],
  providers: [FacilityService],
  controllers: [FacilityController],
})
export class FacilityModule {}
