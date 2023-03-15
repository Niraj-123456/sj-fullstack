import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ServiceEnum } from 'common/constants/enum-constant';
import {
  ApiFile,
  IsNonPrimitiveArray,
} from 'common/swagger/swagger-decorators';

export class CreateServiceDTO {
  @ApiFile()
  serviceImage: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ServiceEnum)
  @ApiProperty({
    enum: ServiceEnum,
  })
  name: string;

  @IsString()
  @ApiProperty()
  label: string;

  @IsString()
  @ApiProperty()
  description: string;
}

export class CreateServiceSwaggerDTO {
  @ApiFile()
  serviceImage: Express.Multer.File;

  @ApiProperty({
    enum: ServiceEnum,
  })
  name: string;

  @ApiProperty()
  label: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;
}
