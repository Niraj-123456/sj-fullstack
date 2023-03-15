import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
// import {
//   AllCatCommonItemParametersEnum,
//   OwnedSubServiceListSearchTypeEnum,
//   SearchSortValueEnum,
// } from 'common/constants/enum-constant';
import {
  ApiFile,
  IsNonPrimitiveArray,
} from 'common/swagger/swagger-decorators';

export class ItemParameterReceivingFormatObject {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiProperty()
  value;
}

// export class CommonItemParameterReceivingFormatObject {
//   @ApiProperty()
//   @IsNotEmpty()
//   @IsEnum(AllCatCommonItemParametersEnum)
//   label: string;

//   @ApiProperty()
//   @IsNotEmpty()
//   value;
// }

// export class CreateSubServiceItemParameterDTO {
//   @ApiProperty()
//   @ValidateNested()
//   @IsArray()
//   @Type(() => CommonItemParameterReceivingFormatObject)
//   allCategoriesParams: CommonItemParameterReceivingFormatObject[];

//   @ApiProperty()
//   @ValidateNested()
//   @IsArray()
//   @Type(() => ItemParameterReceivingFormatObject)
//   categorySpecificParams: ItemParameterReceivingFormatObject[];

//   @ApiProperty()
//   @ValidateNested()
//   @IsArray()
//   @Type(() => ItemParameterReceivingFormatObject)
//   subCategorySpecificParams: ItemParameterReceivingFormatObject[];

//   @ApiProperty()
//   @ValidateNested()
//   @IsArray()
//   @Type(() => ItemParameterReceivingFormatObject)
//   subServiceGroupSpecificParams: ItemParameterReceivingFormatObject[];

//   @ApiProperty()
//   @ValidateNested()
//   @IsArray()
//   @Type(() => ItemParameterReceivingFormatObject)
//   subServiceSpecificParams: ItemParameterReceivingFormatObject[];
// }

export class CreateSubServiceDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 5)
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  // Per Unit for which the above price is designated (eg per "pair"  or per "piece")",
  perUnitLabel: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  // added fields for warranty, return , delivery
  @ApiProperty()
  @IsNotEmpty()
  @IsBooleanString()
  isWarantyValid: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  warrantyDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBooleanString()
  isReturnValid: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  returnDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  estimatedDaysForDeliveryInValley: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  estimatedDaysForDeliveryOutOfValley: number;
  ////////////////

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  associatedSubServiceGroupId: string;

  // user will be extracted from JWT request

  // @ApiProperty()
  // @IsNotEmptyObject()
  // @ValidateNested()
  // @Type(() => CreateSubServiceItemParameterDTO)
  // @IsObject()
  // itemParameters: CreateSubServiceItemParameterDTO;

  @ApiProperty()
  @ApiFile()
  mainThumbnailImage: Express.Multer.File;

  @ApiProperty()
  @ApiFile()
  mainImage1: Express.Multer.File;

  @ApiProperty()
  @ApiFile()
  mainImage2: Express.Multer.File;

  @ApiProperty()
  @ApiFile()
  mainImage3: Express.Multer.File;
}

////////////////// Same Replica for Swagger /////////////////////////////
export class ItemParameterReceivingFormatSwaggerObject {
  @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  label: string;

  @ApiProperty()
  value;
}

export class CommonItemParameterReceivingFormatSwaggerObject {
  @ApiProperty()
  // @IsNotEmpty()
  // @IsEnum(AllCatCommonItemParametersEnum)
  label: string;

  @ApiProperty()
  // @IsNotEmpty()
  value;
}

export class CreateSubServiceItemParameterSwaggerDTO {
  @ApiProperty({ type: CommonItemParameterReceivingFormatSwaggerObject })
  // @ValidateNested()
  // @IsArray()
  // @Type(() => CommonItemParameterReceivingFormatSwaggerObject)
  allCategoriesParams: CommonItemParameterReceivingFormatSwaggerObject[];

  @ApiProperty({ type: ItemParameterReceivingFormatSwaggerObject })
  // @ValidateNested()
  // @IsArray()
  // @Type(() => ItemParameterReceivingFormatSwaggerObject)
  categorySpecificParams: ItemParameterReceivingFormatSwaggerObject[];

  @ApiProperty({ type: ItemParameterReceivingFormatSwaggerObject })
  // @ValidateNested()
  // @IsArray()
  // @Type(() => ItemParameterReceivingFormatSwaggerObject)
  subCategorySpecificParams: ItemParameterReceivingFormatSwaggerObject[];

  @ApiProperty({ type: ItemParameterReceivingFormatSwaggerObject })
  // @ValidateNested()
  // @IsArray()
  // @Type(() => ItemParameterReceivingFormatSwaggerObject)
  subServiceGroupSpecificParams: ItemParameterReceivingFormatSwaggerObject[];

  @ApiProperty({ type: ItemParameterReceivingFormatSwaggerObject })
  // @ValidateNested()
  // @IsArray()
  // @Type(() => ItemParameterReceivingFormatSwaggerObject)
  subServiceSpecificParams: ItemParameterReceivingFormatSwaggerObject[];
}

export class CreateSubServiceSwaggerDTO {
  @ApiProperty()
  // @IsNotEmpty()
  // @IsUUID()
  associatedSubServiceGroupId: string;

  // user will be extracted from JWT request

  @ApiProperty({
    description: `Inside itemParameters,there is allCategoriesParams which is common for all subServices so it has Fixed Labels.
      The actuall format goes like:
      \n
      {
        "allCategoriesParams":[
          {
          "label":"SubService/Service Name",
          "value":"name"
          },
          {
          "label":"Price(optional)",
          "value":"Rs100"
          },
          {
          "label":"Per Unit (for prices eg: Pair, Piece, etc)",
          "value":"piece"
          },
          {
          "label":"SubService/Service Description",
          "value":"some description"
          },
          {
          "label":"Is Warranty available?",
          "value":1
          },
          {
          "label":"Warrantly description",
          "value":"some description"
          },
          {
          "label":"Is SubService/Service Returnable?",
          "value":0
          },
          {
          "label":"Return Case description",
          "value":"some description"
          },
          {
          "label":"Estimated Delivery Time Inside Valley(in days)",
          "value":1
          },
          {
          "label":"Estimated Delivery Time Outside Valley(in days)",
          "value":3
          }
        ],
        "categorySpecificParams":[
          {
          "label":"label1",
          "value":2
          }
        ],
        "subCategorySpecificParams":[
          {
          "label":"label1",
          "value":2
          }
        ],
        "subServiceGroupSpecificParams":[
          {
          "label":"label1",
          "value":2
          }
        ],
        "subServiceSpecificParams":[
          {
          "label":"label1",
          "value":2
          }
        ]
      }
      `,
    type: CreateSubServiceItemParameterSwaggerDTO,
  })
  // @IsNotEmptyObject()
  // @ValidateNested()
  // @Type(() => CreateSubServiceItemParameterSwaggerDTO)
  // @IsObject()
  itemParameters: CreateSubServiceItemParameterSwaggerDTO;

  @ApiProperty()
  @ApiFile()
  mainThumbnailImage: Express.Multer.File;

  @ApiPropertyOptional()
  @ApiFile()
  mainImage1: Express.Multer.File;
  @ApiPropertyOptional()
  @ApiFile()
  mainImage2: Express.Multer.File;
  @ApiPropertyOptional()
  @ApiFile()
  mainImage3: Express.Multer.File;
}

export class SubServiceListOwnedByTheUserDTO {
  // @ApiPropertyOptional()
  // @IsEnum(OwnedSubServiceListSearchTypeEnum)
  // searchType: string;

  // @ApiPropertyOptional()
  // @IsEnum(SearchSortValueEnum)
  // sortType: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  numberOfMaxResultsInEachPage: number;

  @ApiPropertyOptional()
  @IsOptional()
  pageNumber: number;
}

export class UpdateSubServiceVisibilityDTO {
  @ApiProperty()
  @IsBoolean()
  newVisibility: boolean;

  @ApiProperty()
  @IsUUID()
  subServiceId: string;
}

export class DeleteSubServiceDTO {
  @ApiProperty()
  @IsUUID()
  subServiceId: string;
}

export class GetSubServiceDetailsDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  subServiceId: string;
}
