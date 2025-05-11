import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacilityEntity } from '../facility/entities/facility.entity';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserEntity, UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createOwner(createOwnerDto: CreateOwnerDto): Promise<UserEntity> {
    // Create owner with email (and later, send confirmation email)

    const existingUser = await this.userRepository.findOne({
      where: {
        email: createOwnerDto.email,
      },
    });

    if (existingUser) {
      throw new ValidationException(ErrorCode.E001);
    }

    const user = new UserEntity();
    user.id = createOwnerDto.id;
    user.createdAt = createOwnerDto.createdAt;
    user.updatedAt = createOwnerDto.updatedAt;
    user.email = createOwnerDto.email;
    user.role = UserRole.OWNER;

    const savedUser = await this.userRepository.save(user);

    this.logger.debug(savedUser);

    return savedUser;
  }

  async inviteUser(
    inviteUserDto: InviteUserDto,
    tenantId: Uuid,
  ): Promise<UserEntity> {
    // For invited users, email may be null or optional.
    const userData = {
      ...inviteUserDto,
      tenant: { id: tenantId },
      role: UserRole.STAFF,
    };
    return await this.userRepository.save(userData);
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
}
