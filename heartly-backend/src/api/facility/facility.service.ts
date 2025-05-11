import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { FacilityEntity } from './entities/facility.entity';

@Injectable()
export class FacilityService {
  constructor(
    @InjectRepository(FacilityEntity)
    private readonly facilityRepository: Repository<FacilityEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createFacility(facility: FacilityEntity): Promise<FacilityEntity> {
    return this.facilityRepository.save(facility);
  }

  async getFacilityById(id: string): Promise<FacilityEntity> {
    return this.facilityRepository.findOne({ where: { id } });
  }

  async getLoggedInUsersFacilities(id: string): Promise<FacilityEntity[]> {
    return (await this.userRepository.findOne({ where: { id } })).facilities;
  }

  async getFacilityByTenantId(tenantId: string): Promise<FacilityEntity[]> {
    return this.facilityRepository.find({ where: { tenantId } });
  }
}
