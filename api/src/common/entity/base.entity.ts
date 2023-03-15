import { PrimaryGeneratedColumn } from 'typeorm';

import { Column } from 'typeorm';

import { UpdateDateColumn } from 'typeorm';
import { CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false, select: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  // @Column({ type: 'varchar', length: 300, nullable: true })
  // internalComment: string | null;
}

// export interface IBaseEntity {
//   id: string;

//   isActive: boolean;

//   isArchived: boolean;

//   createdDateTime: Date;

//   createdBy: string;

//   lastChangedDateTime: Date;

//   lastChangedBy: string;

//   internalComment: string | null;
// }
