// tenant.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantEntity } from './entities/tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async createTenant(createTenantDto: CreateTenantDto): Promise<TenantEntity> {
    // Create a new Tenant. Later, you can also link the current logged-in owner here.
    const tenant = this.tenantRepository.create(createTenantDto);
    return await this.tenantRepository.save(tenant);
  }

  async findTenantById(id: string): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['owner', 'facilities'],
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${id} not found`);
    }
    return tenant;
  }

  async findAllTenants(): Promise<TenantEntity[]> {
    return await this.tenantRepository.find({
      relations: ['owner', 'facilities'],
    });
  }
}
