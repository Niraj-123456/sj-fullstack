import { BaseEntity } from '../../common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import {
  CustomerInteractionStatusEnum,
  CustomerInteractionTypeEnum,
} from '../../common/constants/enum-constant';
import { Booking } from '../booking/booking.entity';

@Entity()
export class CustomerInteraction extends BaseEntity {
  @ApiProperty({
    enum: CustomerInteractionTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: CustomerInteractionTypeEnum,
    nullable: true,
  })
  type: string;

  @ApiProperty({
    enum: CustomerInteractionStatusEnum,
  })
  @Column({
    type: 'enum',
    enum: CustomerInteractionStatusEnum,
    default: CustomerInteractionStatusEnum.Submitted,
    nullable: true,
  })
  status: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  explanation: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.customerInteractions)
  userWhoInteracted: User;

  // for RequestServiceWhileBooking, we need to register the booking from which the interaction was received
  @ApiProperty({ type: () => Booking })
  @OneToOne(() => Booking, (booking) => booking.customerInteraction)
  @JoinColumn()
  sourceBooking: User;

  @Column('text', { array: true, nullable: true })
  requestedServices: string[];
}
