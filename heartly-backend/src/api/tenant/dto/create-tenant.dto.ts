// create-tenant.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty({ message: 'Tenant name is required.' })
  name: string;
}
