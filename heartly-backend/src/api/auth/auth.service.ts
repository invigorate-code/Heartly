import { UserEntity } from '@/api/user/entities/user.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import UserMetadata from 'supertokens-node/recipe/usermetadata';
import UserRoles from 'supertokens-node/recipe/userroles';
import { Repository } from 'typeorm';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { CreateInvitedUserDto } from './dto/create-invite-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FacilityEntity)
    private facilityRepository: Repository<FacilityEntity>,
  ) {}

  async createTenantUserAndAssignToFacility(
    dto: CreateInvitedUserDto,
  ): Promise<Partial<UserEntity> & { tempPassword: string }> {
    // 1) Generate a temporary password
    const tempPassword = randomBytes(4).toString('hex'); // 8 chars

    // 2) Call SuperTokens to create the auth user
    const signUpResponse = await EmailPassword.signUp(
      'public',
      dto.username,
      tempPassword,
    );

    if (signUpResponse.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
      throw new ConflictException('Username already in use');
    }

    if (!signUpResponse.user) {
      throw new Error('Failed to create auth user');
    }

    const authUserId = signUpResponse.user.id;

    // 3) Persist your own UserEntity, linking to that authUserId
    const user = this.userRepository.create({
      id: authUserId, // use the same UUID
      tenantId: dto.tenantId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username,
      email: dto.actualEmail,
      company: dto.company,
      role: dto.role,
    });

    // Save the user to the database
    await this.userRepository.save(user);

    // await UserMetadata.updateUserMetadata(user.id, { tenantId: user.tenantId });
    console.log(
      `About to update metadata for user ${user.id} with tenantId ${user.tenantId}`,
    );

    try {
      const result = await UserMetadata.updateUserMetadata(user.id, {
        tenantId: user.tenantId,
      });
      console.log('Metadata update result:', result);
    } catch (error) {
      console.error('Failed to update user metadata:', error);
      // Continue execution even if metadata update fails
    }

    // 4) Assign the user to the facility (this is the first facility)
    const facility = await this.facilityRepository.findOne({
      where: { id: dto.facilityId },
    });

    if (!facility) {
      throw new NotFoundException(
        `Facility with ID ${dto.facilityId} not found`,
      );
    }

    // Add the facility to the user's facilities
    user.facilities = [facility]; // Since this is the first facility, just assign it
    await this.userRepository.save(user); // Save again to persist the relationship in the join table

    // 4.5) Assign SuperTokens role to the invited user
    try {
      await UserRoles.addRoleToUser(
        dto.tenantId, // tenantId
        authUserId, // userId
        dto.role, // role - ADMIN or STAFF as specified in the DTO
      );
    } catch (error) {
      console.error('Failed to assign role to invited user:', error);
    }

    // 5) Return the created user info + temp password so the UI can show "here's your creds"
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      company: user.company,
      role: user.role,
      tempPassword,
    };
  }

  async getUserById(userId: string) {
    try {
      const userInfo = await supertokens.getUser(userId);
      return userInfo;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async createEmailVerificationLink(
    recipeUserId: supertokens.RecipeUserId,
    email: string,
  ): Promise<string> {
    try {
      // Create an email verification link for the user
      const linkResponse = await EmailVerification.createEmailVerificationLink(
        'public',
        recipeUserId,
        email,
      );

      if (linkResponse.status === 'OK') {
        console.log(linkResponse.link);
        return linkResponse.link;
      } else {
        // user's email is already verified
      }
    } catch (err) {
      console.error(err);
    }
  }
}
