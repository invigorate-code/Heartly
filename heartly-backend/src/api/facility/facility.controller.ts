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
import { UpdateFacilityDto } from './dto/updateFacility.req.dto';
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
  async getFacilityById(
    @Body() body: { id: string },
    @Session() session: SessionContainer,
  ): Promise<FacilityResDto> {
    return await this.facilityService.getFacilityById(body.id, session);
  }

  @Get('/getLoggedInUserFacilities')
  @VerifySession()
  async getLoggedInUserFacilities(
    @Session() session: SessionContainer,
  ): Promise<FacilityResDto[]> {
    return await this.facilityService.getLoggedInUserFacilities(session);
  }

  @Patch('/updateFacility')
  @VerifySession()
  async updateFacility(
    @Session() session: SessionContainer,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ): Promise<FacilityEntity> {
    return await this.facilityService.updateFacility(
      session,
      updateFacilityDto,
    );
  }

  @Delete('/:id')
  @VerifySession({
    roles: [UserRole.OWNER],
  })
  async deleteFacility(
    @Param('id') id: string,
    @Session() session: SessionContainer,
  ): Promise<void> {
    return await this.facilityService.deleteFacility(id, session);
  }

  @Patch('/:id/restore')
  @VerifySession({
    roles: [UserRole.OWNER],
  })
  async restoreFacility(
    @Param('id') id: string,
    @Session() session: SessionContainer,
  ): Promise<FacilityEntity> {
    return await this.facilityService.restoreFacility(id, session);
  }
}
