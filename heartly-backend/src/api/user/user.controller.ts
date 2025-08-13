import { ApiPublic } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import { SuperTokensRolesGuard } from '@/guards/supertokens-roles.guard';
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

@ApiTags('users')
@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPublic({ summary: 'user test' })
  async test(@Session() _session: SessionContainer) {
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

  @UseGuards(SuperTokensAuthGuard, SuperTokensRolesGuard)
  @Get('/onboarding-status')
  @VerifySession()
  async getOnboardingStatus(@Session() session: SessionContainer) {
    try {
      const userId = session.getUserId();
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check email verification
      const payload = session.getAccessTokenPayload();
      const isEmailVerified = payload['st-ev']?.v || false;

      if (!isEmailVerified) {
        throw new UnauthorizedException(
          'Email verification required for accessing onboarding status',
        );
      }

      return {
        status: 'OK',
        onboarding_step: user.onboarding_step || 0,
        onboarding_completed_at: user.onboarding_completed_at,
        completed_steps: user.onboarding_step ? Array.from({ length: user.onboarding_step }, (_, i) => i) : [],
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
      };
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return {
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to get onboarding status',
      };
    }
  }

  @UseGuards(SuperTokensAuthGuard, SuperTokensRolesGuard)
  @Post('/onboarding-progress')
  @VerifySession()
  async updateOnboardingProgress(
    @Session() session: SessionContainer,
    @Body() body: { onboarding_step: number; completed_steps?: number[] },
  ) {
    try {
      const userId = session.getUserId();
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check email verification
      const payload = session.getAccessTokenPayload();
      const isEmailVerified = payload['st-ev']?.v || false;

      if (!isEmailVerified) {
        throw new UnauthorizedException(
          'Email verification required for updating onboarding progress',
        );
      }

      // Validate onboarding step
      if (body.onboarding_step < 0 || body.onboarding_step > 10) {
        return {
          status: 'ERROR',
          message: 'Invalid onboarding step value',
        };
      }

      // Update user's onboarding progress
      const updatedUser = await this.userService.updateOnboardingProgress(
        userId,
        body.onboarding_step,
      );

      console.log(`Updated onboarding progress for user ${userId}:`, {
        previous_step: user.onboarding_step,
        new_step: body.onboarding_step,
        timestamp: new Date().toISOString(),
      });

      return {
        status: 'OK',
        message: 'Onboarding progress updated successfully',
        onboarding_step: updatedUser.onboarding_step,
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        },
      };
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      return {
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to update onboarding progress',
      };
    }
  }

  @UseGuards(SuperTokensAuthGuard, SuperTokensRolesGuard)
  @Post('/complete-onboarding')
  @VerifySession()
  async completeOnboarding(@Session() session: SessionContainer) {
    try {
      const userId = session.getUserId();
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check email verification
      const payload = session.getAccessTokenPayload();
      const isEmailVerified = payload['st-ev']?.v || false;

      if (!isEmailVerified) {
        throw new UnauthorizedException(
          'Email verification required for completing onboarding',
        );
      }

      // Complete onboarding
      const updatedUser = await this.userService.completeOnboarding(userId);

      console.log(`Onboarding completed for user ${userId}:`, {
        completion_timestamp: updatedUser.onboarding_completed_at,
        final_step: updatedUser.onboarding_step,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId,
      });

      return {
        status: 'OK',
        message: 'Onboarding completed successfully',
        onboarding_completed_at: updatedUser.onboarding_completed_at,
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return {
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Failed to complete onboarding',
      };
    }
  }
}
