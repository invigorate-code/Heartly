import { ApiPublic } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import { SessionContainer } from 'supertokens-node/recipe/session';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import { CreateUserDto } from './dto/create-user.req.dto';
import { UserRole } from './entities/user.entity';
import { UserService } from './user.service';
import { Roles } from '@/decorators/roles.decorator';
import { SuperTokensRolesGuard } from '@/guards/supertokens-roles.guard';

@ApiTags('users')
@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPublic({ summary: 'user test' })
  async test(@Session() session: SessionContainer) {
    return 'test';
  }

  @UseGuards(SuperTokensAuthGuard, SuperTokensRolesGuard) // Will throw session not found error if missing supertoken auth guard decorator
  @Post('/createUser')
  @VerifySession()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async createUser(
    @Session() session: SessionContainer,
    @Body() body: CreateUserDto,
  ) {
    // Check email verification manually
    const payload = session.getAccessTokenPayload();
    const isEmailVerified = payload['st-ev']?.v || false;

    if (!isEmailVerified) {
      throw new UnauthorizedException(
        'Email verification required for user creation',
      );
    }
    const { metadata } = await UserMetadata.getUserMetadata(
      session.getUserId(),
    );
    const user = await this.userService.createUser(body, metadata.tenantId);
    return user;
  }

  @UseGuards(SuperTokensAuthGuard) // Will throw session not found error if missing supertoken auth guard decorator
  @Post('/getUserById')
  @VerifySession()
  async getUserById(
    @Session() session: SessionContainer,
    @Body() body: { userId: string },
  ) {
    // Check email verification manually
    const payload = session.getAccessTokenPayload();
    const isEmailVerified = payload['st-ev']?.v || false;

    if (!isEmailVerified) {
      throw new UnauthorizedException(
        'Email verification required for accessing user data',
      );
    }
    const user = await this.userService.findById(body.userId);
    return user;
  }

  @UseGuards(SuperTokensAuthGuard, SuperTokensRolesGuard) // Will throw session not found error if missing supertoken auth guard decorator
  @Post('/getAllUserPermissions')
  @VerifySession()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getAllUserPermissions(
    @Session() session: SessionContainer,
    @Body() body: { userId: string },
  ) {
    const user = await this.userService.findById(body.userId);
    return user.permissions;
  }
}
