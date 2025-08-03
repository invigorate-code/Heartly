import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AddressEntity } from '../../../api/address/entities/address.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';

export enum SpecialistEnum {
  THERAPIST = 'therapist',
  PSYCHIATRIST = 'psychiatrist',
  COUNSELOR = 'counselor',
  PRIMARY_PHYSICIAN = 'primaryPhysician',
  DENTIST = 'dentist',
}

@Entity('specialist')
export class SpecialistEntity extends AbstractEntity {
  // Replace standard columns with bytea columns for encrypted data
  @Column({ type: 'bytea', nullable: true })
  type?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  name?: Buffer;

  @OneToOne(() => AddressEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'addressId' })
  address?: AddressEntity;
}
