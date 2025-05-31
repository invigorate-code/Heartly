import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SessionContainer } from 'supertokens-node/recipe/session';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { Repository } from 'typeorm';
import { FacilityService } from '../facility/facility.service';
import { TenantService } from '../tenant/tenant.service';
import { clientHasPHI } from './client.utils';
import { CreateClientDto } from './dto/createClient.req.dto';
import { ClientResDto } from './dto/getClient.res.dto';
import { UpdateClientNameDto } from './dto/updateClientName.req.dto';
import { UpdateClientPhotoDto } from './dto/updateClientPhoto.req.dto';
import { ClientEntity } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    private readonly tenantService: TenantService,
    private readonly facilityService: FacilityService, // Assuming UserService is imported correctly
  ) {}

  async createClient(
    client: CreateClientDto,
    session: SessionContainer,
  ): Promise<ClientEntity> {
    const userId = session.getUserId();

    const { metadata } = await UserMetadata.getUserMetadata(userId);

    const tenant = await this.tenantService.findTenantById(metadata.tenantId);

    if (!tenant) {
      throw new NotFoundException(
        `Tenant with id ${metadata.tenantId} not found`,
      );
    }

    if (client.tenantId !== metadata.tenantId) {
      throw new ForbiddenException(
        `Client tenantId ${client.tenantId} does not match session tenantId ${metadata.tenantId}`,
      );
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

    // overkill?
    if (facility.tenantId !== metadata.tenantId) {
      throw new ForbiddenException(
        `Facility with id ${client.facilityId} does not belong to tenant ${metadata.tenantId}`,
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
    const userId = session.getUserId();

    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;
    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

    const client = await this.clientRepository.findOne({
      where: { id: id },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    if (client.tenantId !== userTenantId) {
      throw new ForbiddenException(
        `Client with id ${id} does not belong to tenant ${userTenantId}`,
      );
    }

    return plainToInstance(ClientResDto, client);
  }

  async getClientsByFacilityId(
    facilityId: string,
    session: SessionContainer,
  ): Promise<ClientResDto[]> {
    const userId = session.getUserId();

    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;
    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

    const facility = await this.facilityService.getFacilityById(
      facilityId,
      session,
    );

    if (!facility) {
      throw new NotFoundException(`Facility with id ${facilityId} not found`);
    }

    if (facility.tenantId !== userTenantId) {
      throw new ForbiddenException(
        `Facility with id ${facilityId} does not belong to tenant ${userTenantId}`,
      );
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
    const userId = session.getUserId();

    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;
    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

    if (tenantId !== userTenantId) {
      throw new ForbiddenException(
        `Tenant ID ${tenantId} does not match session tenant ID ${userTenantId}`,
      );
    }

    const clients = await this.clientRepository.find({
      where: { tenantId: tenantId },
      relations: { facility: true, tenant: true },
    });

    return clients.map((client) => plainToInstance(ClientResDto, client));
  }

  async updateClientName(
    id: string,
    updateClientNameDto: UpdateClientNameDto,
    session: SessionContainer,
  ): Promise<ClientEntity> {
    const userId = session.getUserId();

    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;
    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

    const client = await this.clientRepository.findOne({
      where: { id },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    if (client.tenantId !== userTenantId) {
      throw new ForbiddenException(
        `Client with id ${id} does not belong to tenant ${userTenantId}`,
      );
    }

    Object.assign(client, updateClientNameDto);

    return await this.clientRepository.save(client);
  }

  async updateClientPhoto(
    id: string,
    updateClientPhotoDto: UpdateClientPhotoDto,
    session: SessionContainer,
  ): Promise<ClientEntity> {
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;
    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }
    if (client.tenantId !== userTenantId) {
      throw new ForbiddenException(
        `Client with id ${id} does not belong to tenant ${userTenantId}`,
      );
    }
    client.photo = updateClientPhotoDto.photo;
    return await this.clientRepository.save(client);
  }

  async updateClientFacility(
    id: string,
    updateClientFacilityDto: { facilityId: string },
    session: SessionContainer,
  ): Promise<ClientEntity> {
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;
    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

    // Verify the new facility exists and belongs to the same tenant
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
      where: { id },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    if (client.tenantId !== userTenantId) {
      throw new ForbiddenException(
        `Client with id ${id} does not belong to tenant ${userTenantId}`,
      );
    }

    client.facilityId = updateClientFacilityDto.facilityId;

    return await this.clientRepository.save(client);
  }

  async deleteClient(id: string, session: SessionContainer): Promise<void> {
    const userId = session.getUserId();
    const { metadata } = await UserMetadata.getUserMetadata(userId);
    const userTenantId = metadata.tenantId;
    if (!userTenantId || typeof userTenantId !== 'string') {
      throw new Error('Valid tenant ID not found in user metadata');
    }

    const client = await this.clientRepository.findOne({
      where: { id },
      relations: { facility: true, tenant: true },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    if (client.tenantId !== userTenantId) {
      throw new ForbiddenException(
        `Client with id ${id} does not belong to tenant ${userTenantId}`,
      );
    }

    // Check if client has PHI
    const hasPHI = await clientHasPHI(id, this.clientRepository);

    if (hasPHI) {
      // Soft delete - keep records for HIPAA compliance but mark as deleted
      client.isDeleted = true;
      client.deletedAt = new Date();
      await this.clientRepository.save(client);

      console.log(`Client ${id} was soft-deleted due to presence of PHI`);
    } else {
      // Hard delete - completely remove the client as no PHI exists
      await this.clientRepository.remove(client);

      console.log(`Client ${id} was hard-deleted (no PHI detected)`);
    }
  }
}
