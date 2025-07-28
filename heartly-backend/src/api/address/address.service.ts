import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  findAll() {
    return this.addressRepository.find();
  }

  findOne(id: string) {
    return this.addressRepository.findOneOrFail({ where: { id } });
  }

  create(addressData: Partial<AddressEntity>) {
    const address = this.addressRepository.create(addressData);
    return this.addressRepository.save(address);
  }

  async update(id: string, addressData: Partial<AddressEntity>) {
    await this.addressRepository.update(id, addressData);
    return this.findOne(id);
  }

  async remove(id: string) {
    const address = await this.findOne(id);
    return this.addressRepository.remove(address);
  }
}
