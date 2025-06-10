import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { CreatePlacementInfoDto } from './dto/CreatePlacementInfo.req.dto';
import { PlacementInfoEntity } from './entities/placement-info.entity';
import { PlacementInfoService } from './placement-info.service';

@ApiTags('placementInfo')
@UseGuards(SuperTokensAuthGuard)
@Controller({ path: 'placementInfo' })
export class PlacementInfoController {
  constructor(private readonly placementInfoService: PlacementInfoService) {}

  @Post('/create')
  @VerifySession()
  async createPlacementInfo(
    @Body() createPlacementInfoDto: CreatePlacementInfoDto,
    @Session() session: SessionContainer,
  ): Promise<PlacementInfoEntity> {
    return await this.placementInfoService.createPlacementInfo(
      createPlacementInfoDto,
      session,
    );
  }
}
