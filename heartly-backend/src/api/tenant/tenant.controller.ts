// tenant.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantEntity } from './entities/tenant.entity';
import { TenantService } from './tenant.service';
@ApiTags('tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async create(
    @Body() createTenantDto: CreateTenantDto,
  ): Promise<TenantEntity> {
    return await this.tenantService.createTenant(createTenantDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TenantEntity> {
    return await this.tenantService.findTenantById(id);
  }

  @Get()
  async findAll(): Promise<TenantEntity[]> {
    return await this.tenantService.findAllTenants();
  }
}
