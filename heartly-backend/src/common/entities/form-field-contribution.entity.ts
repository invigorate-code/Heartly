import { UserEntity } from '@/api/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MetadataEntity } from './form-metadata.entity';

@Entity('form_field_contribution')
export class FormFieldContributionEntity extends AbstractEntity {
  @Column({ name: 'field_name', type: 'varchar', nullable: false })
  fieldName!: string;

  @Column({ name: 'form_type', type: 'varchar', nullable: false })
  formType!: string;

  @ManyToOne(
    () => MetadataEntity,
    (metadata) => metadata.formFieldContributions,
  )
  @JoinColumn({ name: 'metadataId' })
  metadata!: MetadataEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'contributorId' })
  contributor?: UserEntity;
}
