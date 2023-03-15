import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FileTypeEnum } from 'common/constants/enum-constant';

export class CreateFileDTO {
  @IsNotEmpty() @IsString() fileName: string;

  @IsNotEmpty() @IsString() @IsEnum(FileTypeEnum) type: string;

  @IsNotEmpty() @IsString() s3Url: string;

  @IsOptional() @IsBoolean() isActive: boolean;

  @IsOptional() userId: string;

  @IsOptional() serviceWhoseMainThumbnailImageId: string;

  // @IsOptional() productWhoseMainThumbnailImageId: string;

  // @IsOptional() brandWhoseMainThumbnailImageId: string;

  // @IsOptional() industryWhoseMainThumbnailImageId: string;

  // @IsOptional() productWhoseMainImagesId: string;

  // @IsOptional() businessWhoseRegistrationDocumentsId: string;

  // @IsOptional() businessWhoseMainLogoImageId: string;

  // @IsOptional() representativeId: string;

  // @IsOptional() storyWhoseMainMediaFileId: string;
}

export class ICommonDetailsFileObjectDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  s3Url: string;
}

export interface ICommonDetailsFileObject {
  id: string;

  fileName: string;

  type: string;

  s3Url: string;
}
