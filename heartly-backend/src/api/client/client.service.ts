import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Repository } from 'typeorm';
import { BaseTenantService } from '../../common/base-tenant-service';
import { FacilityService } from '../facility/facility.service';
import { TenantService } from '../tenant/tenant.service';
import { clientHasPHI } from './client.utils';
import { CreateClientDto } from './dto/createClient.req.dto';
import { ClientResDto } from './dto/getClient.res.dto';
import { UpdateClientNameDto } from './dto/updateClientName.req.dto';
import { UpdateClientPhotoDto } from './dto/updateClientPhoto.req.dto';
import { ClientEntity } from './entities/client.entity';

@Injectable()
export class ClientService extends BaseTenantService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly tenantService: TenantService,
    private readonly facilityService: FacilityService,
  ) {
    super();
  }

  async createClient(
    client: CreateClientDto,
    session: SessionContainer,
  ): Promise<ClientEntity> {
    const userTenantId = await this.verifyTenantAccess(
      session,
      client.tenantId,
    );

    const tenant = await this.tenantService.findTenantById(userTenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${userTenantId} not found`);
    }

    const facility = await this.facilityService.getFacilityById(
      client.facilityId,
      session,
    );

    if (!facility) {
      throw new NotFoundException(
        `Facility with id ${client.facilityId} not found`,
      );
    }

    const clientWithMetadata: Partial<ClientEntity> = {
      ...client,
      tenantId: tenant.id,
      facilityId: client.facilityId,
    };

    const newClient = this.clientRepository.create(clientWithMetadata);

    return await this.clientRepository.save(newClient);
  }

  async getClientById(
    id: string,
    session: SessionContainer,
  ): Promise<ClientResDto> {
    const userTenantId = await this.verifyTenantAccess(session);

    const client = await this.clientRepository.findOne({
      where: { id: id, tenantId: userTenantId },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return plainToInstance(ClientResDto, client);
  }

  async getClientsByFacilityId(
    facilityId: string,
    session: SessionContainer,
  ): Promise<ClientResDto[]> {
    const userTenantId = await this.verifyTenantAccess(session);

    const facility = await this.facilityService.getFacilityById(
      facilityId,
      session,
    );

    if (!facility) {
      throw new NotFoundException(`Facility with id ${facilityId} not found`);
    }

    const clients = await this.clientRepository.find({
      where: { facilityId: facility.id, tenantId: userTenantId },
      relations: { facility: true, tenant: true },
    });

    return clients.map((client) => plainToInstance(ClientResDto, client));
  }

  async getClientsByTenantId(
    tenantId: string,
    session: SessionContainer,
  ): Promise<ClientResDto[]> {
    const userTenantId = await this.verifyTenantAccess(session, tenantId);

    const clients = await this.clientRepository.find({
      where: { tenantId: userTenantId },
      relations: { facility: true, tenant: true },
    });

    return clients.map((client) => plainToInstance(ClientResDto, client));
  }

  async updateClientName(
    id: string,
    updateClientNameDto: UpdateClientNameDto,
    session: SessionContainer,
  ): Promise<ClientEntity> {
    const userTenantId = await this.verifyTenantAccess(session);

    const client = await this.clientRepository.findOne({
      where: { id, tenantId: userTenantId },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    Object.assign(client, updateClientNameDto);

    return await this.clientRepository.save(client);
  }

  async updateClientPhoto(
    id: string,
    updateClientPhotoDto: UpdateClientPhotoDto,
    session: SessionContainer,
  ): Promise<ClientEntity> {
    const userTenantId = await this.verifyTenantAccess(session);

    const client = await this.clientRepository.findOne({
      where: { id, tenantId: userTenantId },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    client.photo = updateClientPhotoDto.photo;
    return await this.clientRepository.save(client);
  }

  async updateClientFacility(
    id: string,
    updateClientFacilityDto: { facilityId: string },
    session: SessionContainer,
  ): Promise<ClientEntity> {
    const userTenantId = await this.verifyTenantAccess(session);

    const newFacility = await this.facilityService.getFacilityById(
      updateClientFacilityDto.facilityId,
      session,
    );

    if (!newFacility) {
      throw new NotFoundException(
        `Facility with id ${updateClientFacilityDto.facilityId} not found`,
      );
    }

    const client = await this.clientRepository.findOne({
      where: { id, tenantId: userTenantId },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    client.facilityId = updateClientFacilityDto.facilityId;

    return await this.clientRepository.save(client);
  }

  async deleteClient(id: string, session: SessionContainer): Promise<void> {
    const userTenantId = await this.verifyTenantAccess(session);

    const client = await this.clientRepository.findOne({
      where: { id, tenantId: userTenantId },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    // Check if client has PHI
    const hasPHI = await clientHasPHI(id, this.clientRepository);

    if (hasPHI) {
      // Soft delete - keep records for HIPAA compliance but mark as deleted
      client.isDeleted = true;
      client.deletedAt = new Date();
      await this.clientRepository.save(client);

      this.logger.log(`Client ${id} was soft-deleted due to presence of PHI`);
    } else {
      // Hard delete - completely remove the client as no PHI exists
      await this.clientRepository.remove(client);

      this.logger.log(`Client ${id} was hard-deleted (no PHI detected)`);
    }
  }
}
