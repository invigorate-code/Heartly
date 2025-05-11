// invite-user.dto.ts
import { Uuid } from '@/common/types/common.type';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class InviteUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  role: UserRole;

  @IsNotEmpty()
  @IsString()
  tenantId: Uuid;
}
