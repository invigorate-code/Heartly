// src/api/user/dto/create-invited-user.dto.ts
import { UserRole } from '@/api/user/entities/user.entity';
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateInvitedUserDto {
  @IsNotEmpty() @Length(2, 50) firstName!: string;
  @IsNotEmpty() @Length(2, 50) lastName!: string;
  @IsNotEmpty() @Length(3, 50) username!: string; // login ID
  @IsOptional() @Length(5, 100) actualEmail?: string; // optional real email
  @IsNotEmpty() @Length(1, 100) company!: string;
  @IsEnum(UserRole) role!: UserRole; // ADMIN or STAFF
  @IsNotEmpty() @Length(1, 100) tenantId!: string;
  @IsNotEmpty() @Length(1, 100) facilityId!: string;
}
