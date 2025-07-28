import { ClientEntity } from '@/api/client/entities/client.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('medication')
export class MedicationEntity extends AbstractEntity {
  @ManyToOne(() => ClientEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId' })
  client!: ClientEntity;

  @Column({ type: 'bytea', nullable: true })
  name?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  requiredDosage?: Buffer;

  @Column({ type: 'bytea', nullable: true })
  timeFrequency?: Buffer;

  @Column({ type: 'boolean', nullable: true })
  isPrescription?: boolean;

  @Column({ type: 'bytea', nullable: true })
  prescribingMd?: Buffer;

  @Column({ type: 'date', nullable: true })
  filledDate?: Date;

  @Column({ type: 'integer', nullable: true })
  refillsRemaining?: number;

  @Column({ type: 'boolean', nullable: true })
  isDailyMed?: boolean;

  @Column({ type: 'varchar', nullable: false })
  tenantId!: string;

  @Column({ nullable: true })
  placementInfoId?: string;
}
