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
    { cascade: true },
  )
  formFieldContributions!: FormFieldContributionEntity[];

  @ManyToMany(() => UserEntity, {
    cascade: true,
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
