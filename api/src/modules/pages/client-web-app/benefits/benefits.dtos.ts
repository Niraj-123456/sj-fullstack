import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import {
  ClientDiscountSortCriteriaEnum,
  SearchSortValueEnum,
} from 'common/constants/enum-constant';

export class ClientDiscountSearchDTO {
  //////////// search related fields ///////////////
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  numberOfMaxResultsInEachPage: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  pageNumber: number;

  //////////// sorting related fields ///////////////
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ClientDiscountSortCriteriaEnum)
  discountSortCriteria: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SearchSortValueEnum)
  sortValue: string;
}
