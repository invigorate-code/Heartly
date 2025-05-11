import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './entities/tenant.entity';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity])],
  exports: [TypeOrmModule, TenantService],
  controllers: [TenantController],
  providers: [TenantService],
})
export class TenantModule {}
