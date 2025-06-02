import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiPublic({ summary: 'auth test' })
  async test(@Session() session: SessionContainer) {
    return 'test';
  }

  @UseGuards(SuperTokensAuthGuard) // Will throw session not found error if missing supertoken auth guard decorator
  @Post('/getUserSession')
  @VerifySession()
  async getUserSession(@Session() session: SessionContainer) {
    const recipeUserId = session.getRecipeUserId();
    // const isVerified = await EmailVerification.isEmailVerified(recipeUserId);
    // const tenantId = session.getTenantId();
    const user = await this.userService.findById(session.getUserId());
    return {
      session: session.getAccessTokenPayload(),
      userProfile: user,
    };
  }

  @Get('/user/:userId')
  @VerifySession({
    roles: ['admin'],
  })
  async deleteUser(@Session() session: SessionContainer) {}

  @Post('/reset-password')
  async createResetPasswordLink(
    @Body() body: { userId: string; email: string },
  ) {
    const linkResponse = await EmailPassword.createResetPasswordLink(
      'public',
      body.userId,
      body.email,
    );

    if (linkResponse.status === 'OK') {
      console.log(linkResponse.link);
    } else {
      // user does not exist or is not an email password user
    }
  }
}
