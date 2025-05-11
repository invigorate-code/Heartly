// src/common/entities/abstract.entity.ts
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  /** Primary key UUID */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** When the record was created */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /** When the record was last updated */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  /**
   * Soft-delete flag.
   * If set, the record is treated as deleted but remains in the DB
   * (use repository.softRemove() or manually set this).
   * Remove this column if you prefer hard deletes.
   */
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
