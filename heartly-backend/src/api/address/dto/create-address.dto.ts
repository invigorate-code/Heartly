import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  relation?: string;

  @IsNotEmpty()
  @IsString()
  streetAddress!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  zipCode!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
