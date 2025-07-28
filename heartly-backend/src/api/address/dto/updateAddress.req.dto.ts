import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './createAddress.req.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
