import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';

@ApiTags('placementInfo')
@UseGuards(SuperTokensAuthGuard)
@Controller({ path: 'placementInfo' })
export class PlacementInfoController {}
