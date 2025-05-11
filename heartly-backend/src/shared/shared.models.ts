import { UserRole } from '@/api/user/entities/user.entity';

export class UserResponseDto {
  id!: string;
  firstName!: string;
  lastName!: string;
  username!: string;
  email?: string;
  role!: UserRole;
}
