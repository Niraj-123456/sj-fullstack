import { BaseEntity } from '../../common/entity/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class UserToken extends BaseEntity {
  // UUIDs are 36 character long
  @Column({ type: 'uuid', nullable: true })
  emailVerificationUserToken: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  // createdAtEmailVerificationuserToken: Date;
  createdAtEmailVerificationUserToken: Date;

  @Column({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP + INTERVAL '2 DAYS'",
    nullable: true,
  })
  // expireAtEmailVerificationuserToken: Date;
  expireAtEmailVerificationUserToken: Date;

  @Column({ type: 'varchar', default: '', length: 6, nullable: true })
  // phoneVerificationOtp: string;
  phoneVerificationOtp: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  // createdAtPhoneVerificationuserToken: Date;
  createdAtPhoneVerificationUserToken: Date;

  @Column({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP + INTERVAL '1 HOURS'",
    nullable: true,
  })
  // expireAtPhoneVerificationuserToken: Date;
  expireAtPhoneVerificationUserToken: Date;

  @Column({ type: 'varchar', default: '', length: 6, nullable: true })
  // forgotPassworduserToken: string;
  forgotPasswordUserToken: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  // createdAtForgotPassworduserToken: Date;
  createdAtForgotPasswordUserToken: Date;

  @Column({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP + INTERVAL '2 DAYS'",
    nullable: true,
  })
  // expireAtForgotPassworduserToken: Date;
  expireAtForgotPasswordUserToken: Date;

  @Column({ type: 'varchar', default: '', nullable: true })
  accessToken: string;

  @Column({
    type: 'timestamptz',
    default: () => "CURRENT_TIMESTAMP + INTERVAL '1 hour'",
    nullable: true,
  })
  expireAtAccessToken: Date;

  @Column({ type: 'varchar', nullable: true })
  userReferralCode: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  // createdAtEmailVerificationuserToken: Date;
  createdAtUserReferralCode: Date;

  @Column({
    type: 'timestamptz',
    default: null,
    nullable: true,
  })
  // expireAtEmailVerificationuserToken: Date;
  expireAtUserReferralCode: Date;

  @OneToOne(() => User, (user) => user.userToken) // specify inverse side as a second parameter
  associatedUser: User;
}

// export interface IUserToken extends IBaseEntity {

//   emailVerificationUserToken: string;

//   createdAtEmailVerificationUserToken: Date;

//   expireAtEmailVerificationUserToken: Date;

//   phoneVerificationOtp: string;

//   createdAtPhoneVerificationUserToken: Date;

//   expireAtPhoneVerificationUserToken: Date;

//   forgotPasswordUserToken: string;

//   createdAtForgotPasswordUserToken: Date;

//   expireAtForgotPasswordUserToken: Date;

//   refreshToken: string;

//   id: string;

//   isActive: boolean;

//   isArchived: boolean;

//   createdDateTime: Date;

//   createdBy: string;

//   lastChangedDateTime: Date;

//   lastChangedBy: string;

//   internalComment: string | null;
// }
