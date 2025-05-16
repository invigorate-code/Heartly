import { Uuid } from '@/common/types/common.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const existingUser = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (existingUser) {
      this.logger.error(`User with username ${user.username} already exists`);
      throw new ValidationException(ErrorCode.E002);
    }

    // const newUser = this.userRepository.create({
    //   ...user,
    //   tenantId,
    //   facilityId
    // });
    return;
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
