// start building the update client photo request DTO
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
export class UpdateClientPhotoDto {
  @ApiProperty({
    description: 'Base64 encoded photo of the client',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000) // Adjust length as needed for base64 strings
  photo?: string;
}
// This DTO is used to update the client's photo with a base64 encoded string.
