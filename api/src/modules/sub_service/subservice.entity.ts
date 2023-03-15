import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from '../../common/entity/base.entity';
import { File } from '../file/file.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../service/service.entity';

@Entity()
export class SubService extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ManyToOne(() => Service, (service) => service.associatedBookings)
  associatedService: Service;

  // @ManyToMany(() => Booking, (booking) => booking.associatedSubServices)
  // associatedBookings: Booking[];

  @ApiProperty()
  @Column({ type: 'decimal', default: 0.0, nullable: true })
  price: number;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  description: string;

  // in case of subServices, isDeleted is used for tracking deleted subService
  // isVisible will be used to determine whether the subService is displayable or not
  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @OneToOne(() => File, (file) => file.subServiceWhoseMainThumbnailImage)
  @JoinColumn()
  mainThumbnailImage: File;
}
