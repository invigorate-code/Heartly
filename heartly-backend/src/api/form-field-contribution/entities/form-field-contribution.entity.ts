import { PlacementInfoEntity } from '@/api/placement-info/entities/placement-info.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('form_field_contribution')
export class FormFieldContributionEntity extends AbstractEntity {
  @Column({ length: 255, nullable: false })
  fieldName!: string;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contributorId' })
  contributor!: UserEntity;

  @Column({ name: 'contributorId' })
  contributorId!: string;

  @ManyToOne(() => PlacementInfoEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'placementInfoId' })
  placementInfo!: PlacementInfoEntity;

  @Column({ name: 'placementInfoId' })
  placementInfoId!: string;
}
