import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
  Session,
  SuperTokensAuthGuard,
  VerifySession,
} from 'supertokens-nestjs';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import SessionNode, { SessionContainer } from 'supertokens-node/recipe/session';
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
  async test() {
    return 'test';
  }

  @UseGuards(SuperTokensAuthGuard) // Will throw session not found error if missing supertoken auth guard decorator
  @Post('/getUserSession')
  @VerifySession() // SuperTokens automatically enforces email verification in REQUIRED mode
  async getUserSession(@Session() session: SessionContainer) {
    const user = await this.userService.findById(session.getUserId());
    return {
      session: session.getAccessTokenPayload(),
      userProfile: user,
    };
  }
  @Post('/getBasicUserInfo')
  @ApiPublic({
    summary:
      'Get basic user info for unverified users during verification process',
  })
  async getBasicUserInfo(@Req() req: Request) {
    try {
      // Try to get session but don't require it
      const session = await SessionNode.getSession(req, undefined, {
        sessionRequired: false,
      });

      if (session) {
        console.log(
          'getBasicUserInfo: Session found for userId:',
          session.getUserId(),
        );

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
      } else {
        return {
          status: 'NO_SESSION',
          message: 'No active session found',
        };
      }
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
    roles: ['admin'], // SuperTokens automatically enforces email verification in REQUIRED mode
  })
  async deleteUser(@Param('userId') userId: string) {
    // TODO: Implement user deletion logic in appropriate story
    // This endpoint exists but is not fully implemented yet
    // Email verification is automatically enforced by SuperTokens REQUIRED mode
    return {
      status: 'NOT_IMPLEMENTED',
      message: 'User deletion functionality to be implemented in future story',
      userId,
    };
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

  @Post('/resendVerificationEmail')
  @ApiPublic({
    summary: 'Resend verification email for unverified users',
  })
  async resendVerificationEmail(
    @Req() req: Request,
    @Body() body: { email: string },
  ) {
    let session: SessionContainer | undefined;
    try {
      // Try to get session for unverified users
      session = await SessionNode.getSession(req, undefined, {
        sessionRequired: false,
      });
    } catch (sessionErr) {
      console.error('Error retrieving session:', sessionErr);
      return {
        status: 'ERROR',
        message: 'Failed to retrieve session for verification email',
      };
    }

    if (!session) {
      return {
        status: 'ERROR',
        message: 'Session required to resend verification email',
      };
    }

    try {
      const linkResponse = await EmailVerification.createEmailVerificationLink(
        'public',
        session.getRecipeUserId(),
        body.email,
      );

      if (linkResponse.status === 'OK') {
        console.log(linkResponse.link);
        return {
          status: 'OK',
          message: 'Verification email sent successfully',
        };
      } else {
        console.log("user's email is already verified");
        return {
          status: 'OK',
          message: "User's email is already verified",
        };
      }
    } catch (err) {
      console.error(err);
      return {
        status: 'ERROR',
        message: 'Failed to send verification email',
      };
    }
  }
}
