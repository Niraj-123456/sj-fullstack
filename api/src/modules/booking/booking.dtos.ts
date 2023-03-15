import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  FilteredSourceTypeWithAnonymityEnum,
  BookingStatusEnum,
  BookingSourceFormEnum,
  FilteredClientSourceTypeEnum,
  SearchSortValueEnum,
  BookingSortCriteriaEnum,
  BookingFilterTypeCriteriaEnum,
  // BookingSourceFormEnum,
} from 'common/constants/enum-constant';
import { User } from 'modules/users/users.entity';

export class CreateBookingDTO {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isForSelf: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @ApiProperty({
    enum: BookingSourceFormEnum,
  })
  @IsEnum(BookingSourceFormEnum)
  @IsNotEmpty()
  bookingSourceForm: string;

  @ApiPropertyOptional({
    enum: FilteredClientSourceTypeEnum,
  })
  @IsOptional()
  @IsEnum(FilteredClientSourceTypeEnum)
  filteredSourceType: string;

  @ApiPropertyOptional({
    description: 'Here you need to send the unfiltered string from the client',
  })
  @IsOptional()
  @IsString()
  unfilteredSourceInfo: string;

  @ApiPropertyOptional({
    enum: FilteredSourceTypeWithAnonymityEnum,
  })
  @IsOptional()
  @IsEnum(FilteredSourceTypeWithAnonymityEnum)
  filteredSourceTypeWithAnonymity: string;

  // @ApiPropertyOptional({
  //   enum: BookingStatusEnum,
  // })
  // @IsOptional()
  // @IsEnum(BookingStatusEnum)
  // status: string;

  // this will come from JWT
  @ApiPropertyOptional({ type: () => User })
  clientWhoUses: User;

  @ApiPropertyOptional({ type: () => User })
  staffWhoBooked: User;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  servicesIds: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  explanation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  newRequestedServices: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  discountId: number;
}

export class BookingSearchBasedOnFiltersDTO {
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
  @IsEnum(BookingFilterTypeCriteriaEnum)
  filterType: string;

  @ApiPropertyOptional()
  @IsOptional()
  contactNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  bookingUserName: string;

  //////////// sort fields ///////////////
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BookingSortCriteriaEnum)
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

export class UpdateBookingDTO {
  @ApiProperty()
  @IsNotEmpty()
  bookingId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  // @ApiProperty({
  //   enum: BookingSourceFormEnum,
  // })
  // @IsEnum(BookingSourceFormEnum)
  // @IsNotEmpty()
  // bookingSourceForm: string;

  // @ApiPropertyOptional({
  //   enum: FilteredClientSourceTypeEnum,
  // })
  // @IsOptional()
  // @IsEnum(FilteredClientSourceTypeEnum)
  // filteredSourceType: string;

  // @ApiPropertyOptional({
  //   description: 'Here you need to send the unfiltered string from the client',
  // })
  // @IsOptional()
  // @IsString()
  // unfilteredSourceInfo: string;

  // @ApiPropertyOptional({
  //   enum: FilteredSourceTypeWithAnonymityEnum,
  // })
  // @IsOptional()
  // @IsEnum(FilteredSourceTypeWithAnonymityEnum)
  // filteredSourceTypeWithAnonymity: string;

  @ApiPropertyOptional({
    enum: BookingStatusEnum,
  })
  @IsOptional()
  @IsEnum(BookingStatusEnum)
  status: string;

  // this will come from JWT
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  clientWhoUsesId: string;

  // @ApiPropertyOptional({ type: () => User })
  // staffWhoBooked: User;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  servicesIds: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  contactNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  discountId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  serviceProviderId: string;
}
