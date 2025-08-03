import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
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
    // Email verification is already enforced by @VerifySession() when EmailVerification mode is REQUIRED
    const user = await this.userService.findById(session.getUserId());
    return {
      session: session.getAccessTokenPayload(),
      userProfile: user,
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Post('/getBasicUserInfo')
  // No @VerifySession() here - this allows unverified users
  async getBasicUserInfo(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    const userInfo = await this.authService.getUserById(userId);

    // Extract email and verification status from user info
    const emailLoginMethod = userInfo.loginMethods.find(
      (method) => method.recipeId === 'emailpassword',
    );

    return {
      status: 'OK',
      userId,
      email: emailLoginMethod?.email || '',
      isEmailVerified: emailLoginMethod?.verified || false,
      tenantIds: userInfo.tenantIds,
    };
  }

  @UseGuards(SuperTokensAuthGuard)
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

  @Post('/verify-email')
  @ApiPublic({ summary: 'verify email' })
  async verifyEmail(@Body() body: { token: string; tenantId: string }) {
    try {
      await EmailVerification.verifyEmailUsingToken(body.tenantId, body.token);
      return {
        status: 'OK',
        message: 'Email verified successfully',
      };
    } catch (err) {
      console.error(err);
    }
  }

  @UseGuards(SuperTokensAuthGuard)
  @Post('/resendVerificationEmail')
  @VerifySession()
  async resendVerificationEmail(
    @Session() session: SessionContainer,
    @Body() body: { email: string },
  ) {
    try {
      const linkResponse = await EmailVerification.createEmailVerificationLink(
        'public',
        session.getRecipeUserId(),
        body.email,
      );

      if (linkResponse.status === 'OK') {
        console.log(linkResponse.link);
      } else {
        console.log("user's email is already verified");
        return {
          status: 'OK',
          message: "User's email is already verified",
        };
      }
    } catch (err) {
      console.error(err);
    }
  }
}
