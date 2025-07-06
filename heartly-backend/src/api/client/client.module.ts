import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientEntity } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  exports: [TypeOrmModule, ClientService],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
