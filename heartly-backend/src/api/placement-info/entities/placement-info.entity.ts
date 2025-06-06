import { AddressEntity } from '@/api/address/entities/address.entity';
import { ClientEntity } from '@/api/client/entities/client.entity';
import { FacilityEntity } from '@/api/facility/entities/facility.entity';
import { FormFieldContributionEntity } from '@/api/form-field-contribution/entities/form-field-contribution.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
// import { MetadataEntity } from '@/api/metadata/entities/metadata.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { MetadataEntity } from './metadata.entity';

@Entity('placement_info')
export class PlacementInfoEntity extends AbstractEntity {
  @OneToOne(() => ClientEntity, {
    nullable: true,
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

  @Column({ length: 500, nullable: true })
  distinguisingMarks?: string;

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
  religiousPrefAdvisor?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  religiouPrefAddress?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  dangerouPropensities?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  dangerouPropensitiesDescription?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  diagnosis?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  medicalNeeds?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  communicableConditions?: Buffer;

  @Column({ type: 'date', nullable: true })
  dateOfPlacement?: Date;

  @ManyToOne(() => FacilityEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'facility' })
  facility?: FacilityEntity;

  @Column({ length: 500, nullable: true })
  burialArrangements?: string;

  @OneToOne(() => FacilityEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'previous_placement' })
  previousPlacement?: FacilityEntity;

  @OneToOne(() => AddressEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'placement_agency' })
  placementAgency?: AddressEntity;

  @OneToOne(() => AddressEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'other_agency' })
  otherAgency?: AddressEntity;

  @OneToOne(() => AddressEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'legal_rep' })
  legalRep?: AddressEntity;

  @OneToOne(() => AddressEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'other_rep' })
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
  @JoinColumn({ name: 'metadata' })
  metadata!: MetadataEntity;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'placement_info_contributors',
    joinColumn: {
      name: 'placementInfoId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  contributors!: UserEntity[];

  @OneToMany(
    () => FormFieldContributionEntity,
    (formFieldContribution) => formFieldContribution.placementInfo,
  )
  formFieldContributions?: FormFieldContributionEntity[];
}
