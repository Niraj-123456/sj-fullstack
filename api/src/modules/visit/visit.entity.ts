import { BaseEntity } from '../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FilteredClientSourceTypeEnum } from '../../common/constants/enum-constant';

@Entity()
export class Visit extends BaseEntity {
  @ApiProperty()
  @Column({
    type: 'enum',
    enum: FilteredClientSourceTypeEnum,
    nullable: true,
  })
  filteredSourceType: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  unfilteredSourceInfo: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  deviceInfo: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  ipAddress: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  browserInfo: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  locationInfo: string;
}
