import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { Repository } from 'typeorm';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { CreateUserDto } from './dto/create-user.req.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: CreateUserDto, tenantId: string): Promise<UserEntity> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { username: user.username },
      });

      if (existingUser) {
        this.logger.error(`User with username ${user.username} already exists`);
        throw new ValidationException(ErrorCode.E002);
      }

      const facilityEntity = await this.userRepository.findOne({
        where: { id: user.facilityId },
      });

      if (!facilityEntity) {
        this.logger.error(`Facility with id ${user.facilityId} not found`);
        throw new ValidationException(ErrorCode.E003);
      }

      const newUser = this.userRepository.create({
        ...user,
        tenantId,
        facilities: [facilityEntity],
      });

      await this.userRepository.save(newUser);

      EmailPassword.signUp('public', user.username, user.password);

      return newUser;
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new ValidationException(error.message);
    }
  }

  async getUserFacilities(userId: string): Promise<FacilityEntity[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['facilities'],
    });
    return user?.facilities ?? [];
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: Uuid, user: UserEntity): Promise<UserEntity> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new ValidationException(ErrorCode.E001);
    }
    return this.userRepository.save({ ...existingUser, ...user });
  }

  async delete(id: Uuid): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateOnboardingProgress(
    userId: string,
    onboardingStep: number,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (!user) {
      throw new ValidationException(ErrorCode.E002);
    }

    // Update onboarding step
    user.onboarding_step = onboardingStep;
    
    const updatedUser = await this.userRepository.save(user);
    
    this.logger.log(`Onboarding progress updated for user ${userId}:`, {
      onboarding_step: updatedUser.onboarding_step,
      timestamp: new Date().toISOString(),
    });

    return updatedUser;
  }

  async completeOnboarding(userId: string): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (!user) {
      throw new ValidationException(ErrorCode.E002);
    }

    // Mark onboarding as completed
    user.onboarding_completed_at = new Date();
    
    // Set final onboarding step (total number of steps)
    const totalSteps = 2; // facilities + staff-invite
    user.onboarding_step = totalSteps;
    
    const updatedUser = await this.userRepository.save(user);
    
    this.logger.log(`Onboarding completed for user ${userId}:`, {
      onboarding_completed_at: updatedUser.onboarding_completed_at,
      final_step: updatedUser.onboarding_step,
      timestamp: new Date().toISOString(),
    });

    return updatedUser;
  }
}
