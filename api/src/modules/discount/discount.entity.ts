import { BaseEntity } from '../../common/entity/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  DiscountStatusEnum,
  DiscountReceivedNatureEnum,
  DiscountOfferingTypeEnum,
  DiscountExpirationTypeEnum,
  DiscountUserAssociationTypeEnum,
} from '../../common/constants/enum-constant';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import { ColumnNumericTransformer } from '../../common/utils/type-transform.utils';
import { Booking } from '../booking/booking.entity';

@Entity()
// Please refer to the enum type for understanding about the columns more
export class Discount {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ApiProperty()
  @Column({ type: 'boolean', default: false, select: false })
  isDeleted: boolean;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdDateTime: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  @ApiProperty({
    enum: DiscountReceivedNatureEnum,
  })
  @Column({
    type: 'enum',
    enum: DiscountReceivedNatureEnum,
    nullable: true,
  })
  receivedNature: string;

  @ApiProperty({
    enum: DiscountOfferingTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: DiscountOfferingTypeEnum,
    nullable: true,
  })
  offeringType: string;

  @ApiProperty({
    enum: DiscountStatusEnum,
  })
  @Column({
    type: 'enum',
    enum: DiscountStatusEnum,
    default: DiscountStatusEnum.CREATED,
    nullable: true,
  })
  status: string;

  @ApiProperty()
  @Column({
    type: 'integer',
    nullable: true,
  })
  discountedFlatAmount: number;

  @ApiProperty()
  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  discountedPercentage: number;

  @ApiProperty({
    enum: DiscountExpirationTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: DiscountExpirationTypeEnum,
    nullable: true,
  })
  expirationType: string;

  @ApiProperty({
    enum: DiscountUserAssociationTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: DiscountUserAssociationTypeEnum,
    nullable: true,
  })
  userAssociation: string;

  @ApiProperty()
  @Column({
    type: 'integer',
    default: 1,
    nullable: true,
  })
  initialReusuableCount: number;

  @ApiProperty()
  @Column({
    type: 'integer',
    default: 1,
    nullable: true,
  })
  reusuableCountLeft: number;

  // @Column({
  //   type: 'timestamptz',
  //   nullable: true,
  // })
  // endingDateTime: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  expiryDateTime: Date;

  @Column({ type: 'varchar', nullable: true })
  discountCode: string;

  @Column({ type: 'varchar', nullable: true })
  // used to connect associated discount for eg: Referral and Referee discounts will have the same linkerUUID and thus they are associated
  linkerUUID: string;

  @ManyToOne(() => User, (user) => user.associatedSingleDiscounts)
  associatedSingleUser: User;

  @ManyToMany(() => User, (user) => user.associatedMultipleDiscounts)
  associatedMultipleUsers: User[];

  @Column({ type: 'boolean', nullable: true, default: false })
  // scenarios when we dont want other to be able to use this discount
  // eg: referralDiscount is registered but till the referee creates an account in our system, we cant let both referrer and referee use their individual discount
  isDiscountUsable: boolean;

  @ManyToMany(() => Booking, (booking) => booking.discounts)
  bookingsWhereApplied: Booking[];
}
