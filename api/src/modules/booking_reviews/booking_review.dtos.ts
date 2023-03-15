import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import // BookingReviewFilteredSourceTypeWithAnonymityEnum,
// BookingReviewStatusEnum,
// BookingReviewTypeEnum,
'common/constants/enum-constant';
import {
  BookingFilterTypeCriteriaEnum,
  BookingReviewFilterTypeCriteriaEnum,
  BookingReviewSortCriteriaEnum,
  BookingSortCriteriaEnum,
  SearchSortValueEnum,
} from 'common/constants/enum-constant';
import { User } from 'modules/users/users.entity';

export class CreateBookingReviewDTO {
  /////// common in  both Booking review and EmployeeRating //////////////

  // when the client, himself submits the review this field is not necessary as it will be extracted from jwt
  // but when the staff submits the review  on the client's behalf, client id is needed because the client might make
  // the booking for others and it might be the new customers id
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  customerId: string;
  // reviewerClientId
  // or raterClient: User;

  // this will be extracted from jwt token
  // reviewerRegistrationStaffId: string;
  // or registrationStaffId: string

  @ApiProperty()
  @IsNotEmpty()
  bookingId: string;
  // reviewedBookingId
  // or bookingWhenRatedId

  /////// booking review information /////////////////////

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  serviceRating: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serviceRatingExplanation: string;

  // ///////////// Employee Rating
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  ratedEmployeeId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  employeeRating: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employeeRatingExplanation: string;
}

export class SearchBookingReviewsBasedOnFiltersDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  numberOfMaxResultsInEachPage: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageNumber: number;

  //////////// filter fields ///////////////
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BookingReviewFilterTypeCriteriaEnum)
  filterType: string;

  @ApiPropertyOptional()
  @IsOptional()
  bookingId: string;

  @ApiPropertyOptional()
  @IsOptional()
  ratedEmployeeNumber: string;

  //////////// sort fields ///////////////
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BookingReviewSortCriteriaEnum)
  bookingSortCriteria: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SearchSortValueEnum)
  sortValue: string;

  @ApiPropertyOptional()
  @IsOptional()
  startingDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endingDate: Date;
}
