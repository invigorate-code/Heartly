import { UserEntity } from '@/api/user/entities/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('metadata')
export class MetadataEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'lastUpdatedBy' })
  lastUpdatedBy!: UserEntity;

  @UpdateDateColumn({ type: 'timestamp' })
  lastUpdatedAt!: Date;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'contributor', // Custom name for the junction table
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
