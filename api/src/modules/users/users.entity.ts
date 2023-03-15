import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsEmail } from 'class-validator';

import { File } from '../file/file.entity';
import { BaseEntity } from '../../common/entity/base.entity';
import { UserToken } from '../token/token.entity';
import { Role } from '../role/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  UserGenderTypeEnum,
  UserTypeEnum,
} from '../../common/constants/enum-constant';
import { Booking } from '../booking/booking.entity';
import { Discount } from '../discount/discount.entity';
import { CustomerInteraction } from '../customer-interaction/customer-interaction.entity';
import { Permission } from '../permission/permission.entity';
import { BookingReview } from 'modules/booking_reviews/booking_review.entity';

@Entity()
export class User extends BaseEntity {
  // Dont forget to update allAssociationRelations in User entity when you make update in the User entity

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  fullAddress: string;

  @Column({
    type: 'enum',
    enum: UserGenderTypeEnum,
    default: UserGenderTypeEnum.NOTSET,
    nullable: true,
  })
  gender: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  //If we need age, we can extract from here
  dob: Date;

  // Phone number will be the main unique identifier for all  users (customers/staffs)
  // For staff the phonenumber will not be an actual number but a 6 digit number which has to be unique and will be stored as phonenumber because
  @Column({ type: 'varchar', unique: true, nullable: true })
  phoneNumber: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isPhoneNumberVerified: boolean;

  // an extra contact field except personal phonenumber
  // suitable for landline phone of home or offices
  @Column({ type: 'varchar', default: null, nullable: true })
  landlineNumber: string;

  @Column({ type: 'varchar', nullable: true, unique: false })
  @IsEmail()
  email: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isEmailVerified: boolean;

  // Whenever the user gives his email on subscribe, a new user is created with all field blank but isEmailSubscribed boolean to true
  // for usual case, there will be a default value
  @Column({ type: 'boolean', nullable: true, default: false })
  isEmailSubscribedForNewsLetter: boolean;

  // it will be different from isDeleted
  // isActive can used when user is temporarily banned | or less priviledge is given
  @Column({ type: 'boolean', nullable: true, default: false })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  hashPassword: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  isPasswordSet: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  isPasswordChangeActionPending: boolean;

  @OneToOne(() => File, (file) => file.userWhoseMainDisplayImage)
  @JoinColumn()
  mainDisplayImage: File;

  @Column({ type: 'timestamptz', default: null })
  invitedAt: Date;

  @Column({ type: 'timestamptz', default: null })
  joinedAt: Date;

  @OneToOne(() => UserToken, (userToken) => userToken.associatedUser)
  @JoinColumn()
  userToken: UserToken;

  @ManyToOne(() => Role, (role) => role.users)
  userRole: Role;

  @ManyToMany(() => Permission, (permission) => permission.users)
  @JoinTable()
  userPermissions: Permission[];

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    nullable: true,
    default: UserTypeEnum.UNREGISTERED,
  })
  userType: string;

  // bookings made by client himself
  @OneToMany(() => Booking, (booking) => booking.clientWhoUses)
  // @JoinTable()
  bookingsToBeUsedForSelf: Booking[];

  // bookings made by client himself for others
  @OneToMany(() => Booking, (booking) => booking.clientWhoBooked)
  // @JoinTable()
  bookingsMadeAsAClientForOtherCustomer: Booking[];

  // bookings made by Staff for customer
  @OneToMany(() => Booking, (booking) => booking.staffWhoBooked)
  // @JoinTable()
  bookingsMadeAsAStaffForOtherCustomer: Booking[];

  // List of booking served by Service provider
  @OneToMany(() => Booking, (booking) => booking.serviceProvider)
  servedBookings: Booking[];

  // @OneToMany(() => CustomerContact, (customerContact) => customerContact.reviewer)
  // Just like customerInteraction, it is all in one customer contact issues such as query, feedback
  // customerContact: CustomerContact[];

  @OneToMany(() => Discount, (discount) => discount.associatedSingleUser)
  associatedSingleDiscounts: Discount[];

  @ManyToMany(() => Discount, (discount) => discount.associatedMultipleUsers)
  @JoinTable()
  associatedMultipleDiscounts: Discount[];

  @Column({ type: 'boolean', nullable: true, default: false })
  isUserReferred: boolean;

  @ManyToOne(
    () => CustomerInteraction,
    (customerReq) => customerReq.userWhoInteracted,
  )
  customerInteractions: CustomerInteraction[];

  @OneToMany(
    () => BookingReview,
    (employeeRating) => employeeRating.ratedEmployee,
  )
  employeeRatingsReceivedForSelfProvidedService: BookingReview[];

  @OneToMany(() => BookingReview, (review) => review.reviewerClient)
  bookingReviewGivenAsClient: BookingReview[];

  @OneToMany(() => BookingReview, (review) => review.reviewerRegistrationStaff)
  bookingReviewRegisteredAsStaff: BookingReview[];
}
