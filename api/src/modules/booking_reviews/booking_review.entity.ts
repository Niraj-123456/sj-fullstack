import { Column, Entity, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '../../common/entity/base.entity';
import { User } from '../users/users.entity';
import { ColumnNumericTransformer } from '../../common/utils/type-transform.utils';
import { Booking } from 'modules/booking/booking.entity';

@Entity()
export class BookingReview extends BaseEntity {
  // Booking Review contains both ServiceRating and EmployeeRating

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.bookingReviewGivenAsClient)
  reviewerClient: User;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.bookingReviewRegisteredAsStaff)
  reviewerRegistrationStaff: User;

  @ApiProperty()
  @OneToOne(() => Booking, (booking) => booking.bookingReview)
  reviewedBooking: Booking;

  ////////////////////////// Service Rating //////////////////////////
  @ApiProperty()
  @Column({
    type: 'numeric',
    precision: 3,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
  })
  serviceRating: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  serviceRatingExplanation: string;

  ////////////////////////// Employee Rating //////////////////////////
  @ApiProperty()
  @ManyToOne(
    () => User,
    (user) => user.employeeRatingsReceivedForSelfProvidedService,
  )
  ratedEmployee: User;

  @ApiProperty()
  @Column({
    type: 'numeric',
    precision: 3,
    scale: 1,
    transformer: new ColumnNumericTransformer(),
    nullable: true,
  })
  employeeRating: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  employeeFeedbackExplanation: string;
}
