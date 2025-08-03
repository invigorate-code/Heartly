import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityModule } from '../facility/facility.module';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientEntity } from './entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]),
    UserModule,
    TenantModule,
    FacilityModule,
  ],
  exports: [TypeOrmModule, ClientService],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
