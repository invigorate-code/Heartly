import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { FormFieldContributionEntity } from './form-field-contribution.entity';

@Entity('metadata')
export class MetadataEntity extends AbstractEntity {
  // Add formType and entityId to make it universal
  @Column({ name: 'formType', nullable: false })
  formType!: string;

  @Column({ name: 'entityId', nullable: false })
  entityId!: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'lastUpdatedBy' })
  lastUpdatedBy!: UserEntity;

  @UpdateDateColumn({ type: 'timestamp' })
  lastUpdatedAt!: Date;

  @OneToMany(
    () => FormFieldContributionEntity,
    (formFieldContribution) => formFieldContribution.metadata,
    { cascade: true }, // Add this
  )
  formFieldContributions!: FormFieldContributionEntity[];

  // Add cascade: true to contributors
  @ManyToMany(() => UserEntity, {
    cascade: true, // Add this
  })
  @JoinTable({
    name: 'contributor',
    joinColumn: {
      name: 'metadataId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  contributors!: UserEntity[];
}
