import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  DiscountReceivedNatureEnum,
  DiscountOfferingTypeEnum,
  DiscountExpirationTypeEnum,
  DiscountUserAssociationTypeEnum,
} from 'common/constants/enum-constant';

export class CreateDiscountDTO {
  @ApiProperty({
    enum: DiscountReceivedNatureEnum,
  })
  @IsEnum(DiscountReceivedNatureEnum)
  @IsString()
  @IsNotEmpty()
  receivedNature: string;

  @ApiProperty({
    enum: DiscountOfferingTypeEnum,
  })
  @IsEnum(DiscountOfferingTypeEnum)
  @IsString()
  @IsNotEmpty()
  offeringType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discountedFlatAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDecimal()
  discountedPercentage: number;

  @ApiProperty({
    enum: DiscountExpirationTypeEnum,
  })
  @IsEnum(DiscountExpirationTypeEnum)
  @IsString()
  @IsNotEmpty()
  expirationType: string;

  @ApiProperty({
    enum: DiscountUserAssociationTypeEnum,
  })
  @IsEnum(DiscountUserAssociationTypeEnum)
  @IsString()
  @IsNotEmpty()
  userAssociation: string;

  @ApiProperty()
  @IsNumber()
  initialReusuableCount: number;

  @ApiProperty()
  @IsDate()
  endingDateTime: Date;

  @ApiProperty()
  @IsDate()
  expiryDateTime: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  discountCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  linkerUUID: string;
}
