import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  BookingStatusEnum,
  FilteredSourceTypeWithAnonymityEnum,
  DiscountTypeEnum,
  BookingSourceFormEnum,
  FilteredClientSourceTypeEnumList,
  BookingTypeByInitiatorEnum,
} from '../../common/constants/enum-constant';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { Service } from '../service/service.entity';
import { CustomerInteraction } from '../customer-interaction/customer-interaction.entity';
import { Discount } from '../discount/discount.entity';
import { BookingReview } from 'modules/booking_reviews/booking_review.entity';

@Entity()
///   Not extending Base entity due to conflict with primarygeneratedcolumn type of id column in base entity
///   but we have different requirement here
export class Booking {
  @PrimaryColumn()
  // a unique column consisting of 5 randomly generated string and 5 randomly generated number
  id: string;

  @Column({ type: 'boolean', default: false, select: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  // dateOfBooking is createdDateTime
  @ApiProperty({
    enum: BookingSourceFormEnum,
  })
  @Column({
    type: 'enum',
    enum: BookingSourceFormEnum,
    nullable: true,
  })
  bookingSourceForm: string;

  @ApiProperty({
    enum: BookingTypeByInitiatorEnum,
  })
  @Column({
    type: 'enum',
    enum: BookingTypeByInitiatorEnum,
    nullable: true,
  })
  bookingTypeByInitiator: string;

  // client who did the booking for other customer
  // filled when bookingTypeByInitiator=BookedByCustomerForSelf
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.bookingsMadeAsAClientForOtherCustomer)
  clientWhoBooked: User;

  // client who will use the services
  // filled when bookingTypeByInitiator=BookedByCustomerForOthers
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.bookingsToBeUsedForSelf)
  clientWhoUses: User;

  // staff who did the booking for the customer
  // filled when bookingTypeByInitiator=BookedByStaffForCustomer
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.bookingsMadeAsAStaffForOtherCustomer)
  staffWhoBooked: User;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.servedBookings)
  serviceProvider: User;

  @ManyToMany(() => Service, (service) => service.associatedBookings)
  @JoinTable()
  associatedServices: Service[];

  @ApiProperty({
    enum: FilteredClientSourceTypeEnumList,
  })
  @Column({
    type: 'enum',
    enum: FilteredClientSourceTypeEnumList,
    nullable: true,
  })
  filteredSourceType: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  unfilteredSourceInfo: string;

  @ApiProperty({
    enum: FilteredSourceTypeWithAnonymityEnum,
  })
  @Column({
    type: 'enum',
    enum: FilteredSourceTypeWithAnonymityEnum,
    nullable: true,
  })
  filteredSourceTypeWithAnonymity: string;

  @ApiProperty({
    enum: BookingStatusEnum,
  })
  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
    default: BookingStatusEnum.Submitted,
    nullable: true,
  })
  status: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  explanation: string;

  // @ApiProperty()
  // @Column({ type: 'varchar', nullable: true })
  // contactNumber: string;

  // @ApiProperty()
  // @Column({ type: 'varchar', nullable: true })
  // contactName: string;

  @ApiProperty({
    enum: DiscountTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: DiscountTypeEnum,
    default: DiscountTypeEnum.NoDiscount,
    nullable: true,
  })
  discountSource: string;

  // @ApiProperty()
  // @Column({ type: 'decimal', default: 0.0, nullable: true })
  // discountPercentage: number;

  @OneToOne(
    () => CustomerInteraction,
    (customerInt) => customerInt.sourceBooking,
  )
  customerInteraction: CustomerInteraction;

  @ManyToMany(() => Discount, (discount) => discount.bookingsWhereApplied)
  @JoinTable()
  discounts: Discount[];

  @ApiProperty()
  @Column({ type: 'decimal', nullable: true })
  initialBookingValue: number;

  @ApiProperty()
  @Column({ type: 'decimal', nullable: true })
  totalDiscountValue: number;

  @ApiProperty()
  @Column({ type: 'decimal', nullable: true })
  taxValue: number;

  @ApiProperty()
  @Column({ type: 'decimal', nullable: true })
  bookingValueAfterTaxAndDiscount: number;

  @OneToOne(
    () => BookingReview,
    (bookingReview) => bookingReview.reviewedBooking,
  )
  @JoinColumn()
  bookingReview: BookingReview;
}
