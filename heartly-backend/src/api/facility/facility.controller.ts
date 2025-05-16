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
import { CreateFacilityDto } from './dto/createFacility.req.dto';
import { FacilityResDto } from './dto/getFacility.res.dto';
import { FacilityEntity } from './entities/facility.entity';
import { FacilityService } from './facility.service';

@ApiTags('facility')
@UseGuards(SuperTokensAuthGuard)
@Controller({ path: 'facility' })
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post('/create')
  @VerifySession()
  async createFacility(
    @Body() createFacilityDto: CreateFacilityDto,
    @Session() session: SessionContainer,
  ): Promise<FacilityEntity> {
    return await this.facilityService.createFacility(
      createFacilityDto,
      session,
    );
  }

  @Get('/getFacilityById')
  @VerifySession()
  async getFacilityById(@Body() body: { id: string }): Promise<FacilityResDto> {
    //
    return await this.facilityService.getFacilityById(body.id);
  }

  @Get('/getAllFacilities')
  @VerifySession({
    roles: [UserRole.OWNER],
  })
  async getAllFacilities(): Promise<FacilityResDto[]> {
    return await this.facilityService.getAllFacilities();
  }

  @Get('/getAllFacilitiesByTenantId')
  @VerifySession({
    roles: [UserRole.OWNER, UserRole.ADMIN],
  })
  async getAllFacilitiesByTenantId(
    @Body() body: { tenantId: string },
  ): Promise<FacilityResDto[]> {
    return await this.facilityService.getFacilitiesByTenantId(body.tenantId);
  }

  @Get('/getAllFacilitiesByStaffId')
  @VerifySession({ roles: [UserRole.STAFF] })
  async getAllFacilitiesByStaffId(
    @Body() body: { staffId: string },
  ): Promise<FacilityResDto[]> {
    return await this.facilityService.getLoggedInUsersFacilities(body.staffId);
  }

  @Patch('/:id')
  @VerifySession({
    roles: [UserRole.ADMIN, UserRole.OWNER],
  })
  async updateFacility(
    @Param('id') id: string,
    @Body() updateFacilityDto: Partial<CreateFacilityDto>,
  ): Promise<FacilityEntity> {
    return await this.facilityService.updateFacility(id, updateFacilityDto);
  }

  @Delete('/:id')
  @VerifySession({
    roles: [UserRole.ADMIN, UserRole.OWNER],
  })
  async deleteFacility(@Param('id') id: string): Promise<void> {
    return await this.facilityService.deleteFacility(id);
  }
}
