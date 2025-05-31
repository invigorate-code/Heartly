import { ClassField, StringField } from '@/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

Exclude();
export class ClientResDto {
  @ApiProperty({
    description: 'Unique identifier for the client',
    example: '11e9df6b-391c-4f74-8846-77c5083bee0f',
  })
  @StringField()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'First name of the client',
    example: 'John',
  })
  @StringField()
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the client',
    example: 'Doe',
  })
  @StringField()
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'Birthdate of the client in ISO format',
    example: '2000-01-01T00:00:00Z',
  })
  @ClassField(() => Date)
  @Expose()
  birthDate: Date;

  @ApiProperty({
    description: 'Unique Client Identifier (UCI)',
    example: '1234567890',
  })
  @StringField()
  @Expose()
  uci: string;

  @ApiProperty({
    description: 'ID of the facility where the client is registered',
    example: 'f45sh223',
  })
  @StringField()
  @Expose()
  facilityId: string;

  @ApiProperty({
    description: 'ID of the tenant where the client is registered',
    example: 'h45sh223',
  })
  @StringField()
  @Expose()
  tenantId: string;

  @ApiProperty({
    description: 'Indicates if the client is deleted',
    example: false,
  })
  @ClassField(() => Boolean)
  @Expose()
  isDeleted: boolean;

  @ApiProperty({
    description: 'Date when the client was deleted',
    example: '2023-06-15T14:30:00Z',
    required: false,
  })
  @ClassField(() => Date, { nullable: true })
  @Expose()
  deletedAt?: Date | null;

  @ApiProperty({
    description: 'Photo URL of the client',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @StringField({ nullable: true })
  @Expose()
  photo?: string;

  @ApiProperty({
    description: 'When the client was created',
    example: '2023-06-15T14:30:00Z',
  })
  @ClassField(() => Date)
  createdAt: Date;

  updatedAt: Date;
}
