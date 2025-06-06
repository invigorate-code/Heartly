import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('address')
export class AddressEntity extends AbstractEntity {
  @Column({ length: 255, nullable: true })
  name?: string;

  @Column({ length: 100, nullable: true })
  relation?: string;

  @Column({ length: 200, nullable: false })
  streetAddress!: string;

  @Column({ length: 100, nullable: false })
  city!: string;

  @Column({ length: 20, nullable: false })
  zipCode!: string;

  @Column({ length: 20, nullable: true })
  phone?: string;
}
