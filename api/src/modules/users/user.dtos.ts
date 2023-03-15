import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { File } from 'modules/file/file.entity';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  isHash,
  IsHash,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserToken } from 'modules/token/token.entity';
import { Role } from 'modules/role/role.entity';
// import { Business } from 'modules/business/business.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BookingFilterTypeCriteriaEnum,
  BookingStatusEnum,
  RoleTypeEnum,
  SearchableRolesEnum,
  UserGenderTypeEnum,
  UserSearchCriteriaEnum,
  UserTypeEnum,
} from 'common/constants/enum-constant';
import { ApiFile } from 'common/swagger/swagger-decorators';
import { Booking } from 'modules/booking/booking.entity';
import { Discount } from 'modules/discount/discount.entity';
import { CustomerInteraction } from 'modules/customer-interaction/customer-interaction.entity';
import { Permission } from 'modules/permission/permission.entity';
import { BookingReview } from 'modules/booking_reviews/booking_review.entity';

export class UserDTO {
  @IsString() firstName: string;

  @IsString() lastName: string;

  @IsNumberString() phoneNumber: number;

  @IsBoolean() isPhoneNumberVerified: boolean;

  @IsEmail() email: string;

  @IsBoolean() isEmailVerified: boolean;

  @IsBoolean() isEmailSubscribedForNewsLetter: boolean;

  @IsBoolean() isActive: boolean;

  @IsString() hashPassword: string;

  @IsBoolean() isPasswordSet: boolean;

  mainDisplayImage: File;

  @IsDate() invitedAt: Date;

  userToken: UserToken;

  userRole: Role;
}

export class UserWithClientTypeDTO {
  id: string;

  firstName: string | null;

  middleName: string | null;

  lastName: string | null;

  fullName: string | null;

  gender: string | null;

  dob: Date | null;

  fullAddress: string | null;

  phoneNumber: string | null;

  isPhoneNumberVerified: boolean | null;

  isPasswordChangeActionPending: boolean | null;

  landlineNumber: string | null;

  email: string | null;

  isEmailVerified: boolean | null;

  isEmailSubscribedForNewsLetter: boolean | null;

  isActive: boolean | null;

  isDeleted: boolean | null;

  createdDateTime: Date | null;

  lastChangedDateTime: Date | null;

  invitedAt: Date | null;

  joinedAt: Date | null;

  hashPassword: string | null;

  isPasswordSet: boolean | null;

  mainDisplayImage: File | null;

  userToken: UserToken | null;

  userRole: Role | null;

  userType: string | null;

  bookingsToBeUsedForSelf: Booking[] | null;

  bookingsMadeAsAClientForOtherCustomer: Booking[] | null;

  bookingsMadeAsAStaffForOtherCustomer: Booking[] | null;

  associatedSingleDiscounts: Discount[] | null;

  associatedMultipleDiscounts: Discount[] | null;

  filteredSourceType: string;

  filteredSourceTypeWithAnonymity: string;

  // status: BookingStatusEnum;
  isUserReferred: boolean;

  customerInteractions: CustomerInteraction[];

  userPermissions: Permission[];

  servedBookings: Booking[];

  employeeRatingsReceivedForSelfProvidedService: BookingReview[] | null;

  bookingReviewGivenAsClient: BookingReview[] | null;

  bookingReviewRegisteredAsStaff: BookingReview[] | null;
}

export class CreateUserDTO {
  @IsNumberString() phoneNumber: string | null;

  @IsEmail() email: string | null;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsDateString()
  dob: Date;

  @IsOptional()
  @IsEnum(UserGenderTypeEnum)
  gender: string;

  @IsOptional()
  @IsString()
  fullAddress: string;

  @IsOptional()
  @IsString()
  referralCode: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsOptional()
  @IsString()
  landlineNumber: string;

  @IsOptional()
  @IsUUID()
  roleId: string;
}

export class CreateUserWithEmailDTO {
  @IsString() firstName: string;

  @IsString() lastName: string;

  @IsNumberString() phoneNumber: string;

  @IsEmail() email: string;

  @IsBoolean() isEmailSubscribedForNewsLetter: boolean;
  // mainDisplayImage: File;
}

export class AssociateBusinessToAUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  businessId: string;
}

export class IAssociateBusinessToAUserResponse {
  success: boolean;
  message: string;
}

export class ForgotPasswordDTO {
  @IsNumberString() phoneNumber: string;
}

export class UserProfileUpdateDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserGenderTypeEnum)
  gender: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dob: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(RoleTypeEnum)
  associatedRoleName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserTypeEnum)
  userType: string;
}

export class UserProfileDisplayImageUpdateDTO {
  @ApiFile()
  mainDisplayImage: Express.Multer.File;
}

export class IUserProfileUpdateDTO {
  success: boolean;
  message: string;
}

export class IUserDPUpdateDTO {
  success: boolean;
  message: string;
}

export class IUserDPRemoveDTO {
  success: boolean;
  message: string;
}

export class ActiveUserSearchDTO {
  // pagination parameters
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  numberOfMaxResultsInEachPage: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageNumber: number;

  // role should always be present
  @ApiProperty()
  @IsEnum(SearchableRolesEnum)
  role: string;

  // if specific searchCriteria is too be used
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserSearchCriteriaEnum)
  searchCriteria: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber: string;
}

export class SingleUserSearchByPhoneNumberDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber: string;
}
