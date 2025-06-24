import { AddressEntity } from '@/api/address/entities/address.entity';
import { ClientEntity } from '@/api/client/entities/client.entity';
import { FacilityEntity } from '@/api/facility/entities/facility.entity';
import { MedicationEntity } from '@/api/medication/entities/medication.entity';
import { SpecialistEntity } from '@/api/specialist/entities/specialist.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { MetadataEntity } from '../../../common/entities/form-metadata.entity';

@Entity('placement_info')
export class PlacementInfoEntity extends AbstractEntity {
  @OneToOne(() => ClientEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'clientId' })
  client!: ClientEntity;

  @Column({ length: 100, nullable: true })
  nickname?: string;

  @Column({ length: 20, nullable: true })
  gender?: string;

  @Column({ length: 50, nullable: true })
  maritalStatus?: string;

  @Column({ type: 'bytea', nullable: true })
  distinguishingMarks?: Buffer;

  @Column({ length: 200, nullable: true })
  languages?: string;

  @Column({ type: 'bytea', nullable: true })
  uci?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  height?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  weight?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  eyes?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  hair?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  allergies?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  dietarySensitivities?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  socialSecurity?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  ssi?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  ssiPayee?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  ssa?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  ssaPayee?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  otherBenefits?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  otherBenefitsPayee?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  medical?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  medicare?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  otherInsurance?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  religiousPreference?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  religiousPrefAdvisor?: Buffer;

  @OneToOne(() => AddressEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'religiousPrefAddressId' })
  religiousPrefAddress?: AddressEntity;

  @Column({ type: 'bytea', nullable: true })
  dangerousPropensities?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  dangerousPropensitiesDescription?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  diagnosis?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  medicalNeeds?: Buffer;

  @OneToOne(() => SpecialistEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'primaryPhysicianId' })
  primaryPhysician?: SpecialistEntity;

  @OneToOne(() => SpecialistEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'dentistId' })
  dentist?: SpecialistEntity;

  @ManyToOne(() => SpecialistEntity, {
    cascade: ['insert', 'update'],
    nullable: true,
  })
  @JoinColumn({ name: 'otherSpecialistsId' })
  otherSpecialists?: SpecialistEntity[];

  @OneToMany(
    () => MedicationEntity,
    (medication) => medication.placementInfoId,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  medications?: MedicationEntity[];

  @Column({ type: 'bytea', nullable: true })
  communicableConditions?: Buffer;

  @Column({ type: 'date', nullable: true })
  dateOfPlacement?: Date;

  @ManyToOne(() => FacilityEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'facilityId' })
  facility?: FacilityEntity;

  @Column({ length: 500, nullable: true })
  burialArrangements?: string;

  @OneToOne(() => AddressEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'previousPlacement' })
  previousPlacement?: AddressEntity;

  @OneToOne(() => AddressEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'placementAgency' })
  placementAgency?: AddressEntity;

  @OneToOne(() => AddressEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'otherAgency' })
  otherAgency?: AddressEntity;

  @OneToOne(() => AddressEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'legalRep' })
  legalRep?: AddressEntity;

  @OneToOne(() => AddressEntity, {
    nullable: true,
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'otherRep' })
  otherRep?: AddressEntity;

  @Column({ length: 1000, nullable: true })
  specialInstructions?: string;

  @Column({ length: 1000, nullable: true })
  visitationRestrictions?: string;

  @Column({ length: 1000, nullable: true })
  personsAuthorizedClientFromHome?: string;

  @Column({ length: 1000, nullable: true })
  otherSignificantInfo?: string;

  @Column({ length: 100, nullable: true })
  tenantId?: string;

  @Column('boolean', { default: false })
  isCompleted!: boolean;

  @Column('int', { default: 0 })
  completionPercentage!: number;

  @OneToOne(() => MetadataEntity, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'metadataId' })
  metadata!: MetadataEntity;
}
