import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import {
  BookingFilterTypeCriteriaEnum,
  BookingSortCriteriaEnum,
  BookingStatusEnum,
  BookingStatusEnumWhileSearching,
  ClientSideBookingsDivisionEnum,
  ClientSideBookingsFilterTypeCriteriaEnum,
  SearchSortValueEnum,
} from 'common/constants/enum-constant';

export class ClientMyBookingSearchDTO {
  //////////// search related fields ///////////////
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ClientSideBookingsDivisionEnum)
  bookingsDivision: string;

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
  @IsEnum(ClientSideBookingsFilterTypeCriteriaEnum)
  filterType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BookingStatusEnumWhileSearching)
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  startingDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endingDate: Date;

  //////////// sorting related fields ///////////////
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BookingSortCriteriaEnum)
  bookingSortCriteria: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SearchSortValueEnum)
  sortValue: string;
}
