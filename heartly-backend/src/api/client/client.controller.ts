import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserRole } from '../user/entities/user.entity';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/createClient.req.dto';
import { ClientResDto } from './dto/getClient.res.dto';
import { UpdateClientNameDto } from './dto/updateClientName.req.dto';
import { UpdateClientPhotoDto } from './dto/updateClientPhoto.req.dto';
import { ClientEntity } from './entities/client.entity';

@ApiTags('client')
@UseGuards(SuperTokensAuthGuard)
@Controller({ path: 'client' })
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('/create')
  @VerifySession({ roles: [UserRole.OWNER, UserRole.ADMIN] })
  async createClient(
    @Body() client: CreateClientDto,
    @Session() session: SessionContainer,
  ): Promise<ClientEntity> {
    return await this.clientService.createClient(client, session);
  }

  @Get('/getClientById/:id')
  @VerifySession()
  async getClientById(
    @Param() id: string,
    @Session() session: SessionContainer,
  ): Promise<ClientResDto> {
    return await this.clientService.getClientById(id, session);
  }

  @Get('/getClientsByFacilityId/:facilityId')
  @VerifySession()
  async getClientsByFacilityId(
    @Param('facilityId') facilityId: string,
    @Session() session: SessionContainer,
  ): Promise<ClientResDto[]> {
    return await this.clientService.getClientsByFacilityId(facilityId, session);
  }

  @Get('/getClientsByTenantId/:tenantId')
  @VerifySession({ roles: [UserRole.OWNER, UserRole.ADMIN] })
  async getClientsByTenantId(
    @Param('tenantId') tenantId: string,
    @Session() session: SessionContainer,
  ): Promise<ClientResDto[]> {
    return await this.clientService.getClientsByTenantId(tenantId, session);
  }

  @Patch('/updateClientName/:id')
  @VerifySession()
  async updateClientName(
    @Param('id') id: string,
    @Body() updateClientNameDto: UpdateClientNameDto,
    @Session() session: SessionContainer,
  ): Promise<ClientEntity> {
    return await this.clientService.updateClientName(
      id,
      updateClientNameDto,
      session,
    );
  }

  @Patch('/updateClientPhoto/:id')
  @VerifySession()
  async updateClientPhoto(
    @Param('id') id: string,
    @Body() updateClientPhotoDto: UpdateClientPhotoDto,
    @Session() session: SessionContainer,
  ): Promise<ClientEntity> {
    return await this.clientService.updateClientPhoto(
      id,
      updateClientPhotoDto,
      session,
    );
  }

  @Delete('/deleteClient/:id')
  @VerifySession({ roles: [UserRole.OWNER, UserRole.ADMIN] })
  async deleteClient(
    @Param('id') id: string,
    @Session() session: SessionContainer,
  ): Promise<void> {
    return await this.clientService.deleteClient(id, session);
  }
}
