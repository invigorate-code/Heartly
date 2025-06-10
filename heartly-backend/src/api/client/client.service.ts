import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Repository } from 'typeorm';
import { BaseTenantService } from '../../common/base-tenant-service';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { FacilityService } from '../facility/facility.service';
import { TenantService } from '../tenant/tenant.service';
import { UserEntity, UserRole } from '../user/entities/user.entity';
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
    @InjectRepository(FacilityEntity)
    private readonly facilityRepository: Repository<FacilityEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  async createClient(
    client: CreateClientDto,
    session: SessionContainer,
  ): Promise<ClientResDto> {
    // Parse the birthDate string into a proper Date object if it's a string
    if (typeof client.birthDate === 'string') {
      client.birthDate = new Date(client.birthDate);
    }

    const userTenantId = await this.verifyTenantAccess(
      session,
      client.tenantId,
    );

    // Check for existing client with the same UCI in this tenant
    const existingClient = await this.clientRepository.findOne({
      where: {
        uci: client.uci,
        tenantId: client.tenantId,
      },
    });

    if (existingClient) {
      throw new ConflictException(
        `Client with UCI ${client.uci} already exists in this tenant`,
      );
    }

    const tenant = await this.tenantService.findTenantById(userTenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${userTenantId} not found`);
    }

    const facility = await this.facilityRepository.findOne({
      where: {
        id: client.facilityId,
        tenant: { id: userTenantId },
      },
    });

    if (!facility) {
      throw new NotFoundException(
        `Facility with id ${client.facilityId} not found`,
      );
    }

    const clientWithMetadata: Partial<ClientEntity> = {
      ...client,
      tenant,
      facility,
      // Ensure IDs are explicitly set to match the entities
      tenantId: tenant.id,
      facilityId: facility.id,
    };

    const newClient = this.clientRepository.create(clientWithMetadata);

    const savedClient = await this.clientRepository.save(newClient);

    return plainToInstance(ClientResDto, savedClient, {
      excludeExtraneousValues: true,
    });
  }

  async getClientById(
    id: string,
    session: SessionContainer,
  ): Promise<ClientResDto> {
    const userTenantId = await this.verifyTenantAccess(session);
    const userId = session.getUserId();

    // Get user to determine role
    const user = await this.userRepository.findOne({
      where: { id: userId, tenant: { id: userTenantId } },
    });

    // Build the where clause based on user role
    const whereClause =
      user.role === UserRole.OWNER
        ? { id, tenant: { id: userTenantId } } // OWNER can see soft-deleted clients
        : { id, isDeleted: false, tenant: { id: userTenantId } }; // Others only see active clients

    const client = await this.clientRepository.findOne({
      where: whereClause,
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
    const userId = session.getUserId();

    // Get user to determine role
    const user = await this.userRepository.findOne({
      where: { id: userId, tenant: { id: userTenantId } },
    });

    const facility = await this.facilityService.getFacilityById(
      facilityId,
      session,
    );

    if (!facility) {
      throw new NotFoundException(`Facility with id ${facilityId} not found`);
    }

    // Build the where clause based on user role
    const whereClause =
      user.role === UserRole.OWNER
        ? { facility: { id: facility.id }, tenant: { id: userTenantId } } // OWNER can see soft-deleted clients
        : {
            facility: { id: facility.id },
            tenant: { id: userTenantId },
            isDeleted: false,
          }; // Others only see active clients

    const clients = await this.clientRepository.find({
      where: whereClause,
      relations: { facility: true, tenant: true },
    });

    return clients.map((client) => plainToInstance(ClientResDto, client));
  }

  async getClientsByTenantId(
    tenantId: string,
    session: SessionContainer,
  ): Promise<ClientResDto[]> {
    const userTenantId = await this.verifyTenantAccess(session, tenantId);
    const userId = session.getUserId();

    // Get user to determine role
    const user = await this.userRepository.findOne({
      where: { id: userId, tenant: { id: userTenantId } },
    });

    // Build the where clause based on user role
    const whereClause =
      user.role === UserRole.OWNER
        ? { tenant: { id: userTenantId } } // OWNER can see soft-deleted clients
        : { tenant: { id: userTenantId }, isDeleted: false }; // Others only see active clients

    const clients = await this.clientRepository.find({
      where: whereClause,
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
      where: { id, tenant: { id: userTenantId } },
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
      where: { id, tenant: { id: userTenantId } },
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

    const newFacility = await this.facilityRepository.findOne({
      where: {
        id: updateClientFacilityDto.facilityId,
        tenant: { id: userTenantId },
      },
    });

    if (!newFacility) {
      throw new NotFoundException(
        `Facility with id ${updateClientFacilityDto.facilityId} not found`,
      );
    }

    const client = await this.clientRepository.findOne({
      where: { id, tenant: { id: userTenantId } },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    // Update both the facilityId and the facility relation
    client.facilityId = updateClientFacilityDto.facilityId;
    client.facility = newFacility;

    return await this.clientRepository.save(client);
  }

  async deleteClient(id: string, session: SessionContainer): Promise<void> {
    const userTenantId = await this.verifyTenantAccess(session);

    const client = await this.clientRepository.findOne({
      where: { id, tenant: { id: userTenantId } },
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
