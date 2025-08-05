import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import SuperTokensSession, {
  SessionContainer,
} from 'supertokens-node/recipe/session';
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
    // Check email verification manually since it's now OPTIONAL
    const payload = session.getAccessTokenPayload();
    const isEmailVerified = payload['st-ev']?.v || false;
    
    if (!isEmailVerified) {
      throw new UnauthorizedException('Email verification required');
    }

    const recipeUserId = session.getRecipeUserId();
    const user = await this.userService.findById(session.getUserId());
    return {
      session: session.getAccessTokenPayload(),
      userProfile: user,
    };
  }
  @UseGuards(SuperTokensAuthGuard)
  @Post('/getBasicUserInfo')
  @ApiPublic({
    summary: 'Get basic user info without email verification requirement',
  })
  @VerifySession() // No overrides needed since EmailVerification is now OPTIONAL
  async getBasicUserInfo(@Session() session: SessionContainer) {
    try {
      console.log('getBasicUserInfo: Session found for userId:', session.getUserId());

      // Get basic info from session payload
      const payload = session.getAccessTokenPayload();
      console.log('getBasicUserInfo: Session payload:', payload);

      return {
        status: 'OK',
        userId: session.getUserId(),
        email: payload.email || '',
        isEmailVerified: payload['st-ev']?.v || false,
        tenantIds: [payload.tId || 'public'],
      };
    } catch (error) {
      console.error('Error in getBasicUserInfo:', error);
      return {
        status: 'ERROR',
        message: 'Failed to get user information',
      };
    }
  }

  @UseGuards(SuperTokensAuthGuard)
  @Get('/user/:userId')
  @VerifySession({
    roles: ['admin'],
  })
  async deleteUser(@Session() session: SessionContainer) {
    // Check email verification manually
    const payload = session.getAccessTokenPayload();
    const isEmailVerified = payload['st-ev']?.v || false;
    
    if (!isEmailVerified) {
      throw new UnauthorizedException('Email verification required for admin operations');
    }
  }

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
  @VerifySession() // No email verification required - this is for unverified users to get verification emails
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
