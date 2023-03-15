import { BaseEntity } from '../../common/entity/base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SeedEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  name: string;
}
