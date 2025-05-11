import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserService } from './user.service';
import { UserRole } from './entities/user.entity';
@ApiTags('users')
@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPublic({ summary: 'user test' })
  async test(@Session() session: SessionContainer) {
    return 'test';
  }

  @UseGuards(SuperTokensAuthGuard) // Will throw session not found error if missing supertoken auth guard decorator
  @Post('/getUserById')
  @VerifySession()
  async getUserById(
    @Session() session: SessionContainer,
    @Body() body: { userId: string },
  ) {
    const user = await this.userService.findById(body.userId);
    return user;
  }

  @UseGuards(SuperTokensAuthGuard) // Will throw session not found error if missing supertoken auth guard decorator
  @Post('/getAllUserPermissions')
  @VerifySession({
    roles: [UserRole.ADMIN, UserRole.OWNER],
  })
  async getAllUserPermissions(
    @Session() session: SessionContainer,
    @Body() body: { userId: string },
  ) {
    const user = await this.userService.findById(body.userId);
    return user.permissions;
  }
}
