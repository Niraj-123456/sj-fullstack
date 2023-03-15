import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { FilteredClientSourceTypeEnum } from 'common/constants/enum-constant';

export class CreateVisitRequestDTO {
  @ApiPropertyOptional({
    description:
      'No need to send this field because this field will be determined from the header key file by backend.',
  })
  @IsOptional()
  @IsString()
  @IsEnum(FilteredClientSourceTypeEnum)
  filteredSourceType: string;

  @ApiPropertyOptional({
    description: 'Here you need to send the unfiltered string from the client',
  })
  @IsOptional()
  @IsString()
  unfilteredSourceInfo: string;

  @ApiPropertyOptional({
    description:
      'However this field is expected. If nothing can be figured out, send empty string here',
  })
  @IsOptional()
  @IsString()
  ipAddress: string;

  @ApiPropertyOptional({
    description:
      'If this field can be figured out, send it in the request body.Else no need to include this field in the body.',
  })
  @IsOptional()
  @IsString()
  browserInfo: string;

  @ApiPropertyOptional({
    description:
      'If this field can be figured out, send it in the request body.Else no need to include this field in the body.',
  })
  @IsOptional()
  @IsString()
  deviceInfo: string;

  @ApiPropertyOptional({
    description:
      'This field is expected if user gives the app permission to access the location otherwise you can exclude this field as well.',
  })
  @IsOptional()
  @IsString()
  locationInfo: string;
}

// export class CreateVisitResponseDTO {
//   @ApiPropertyOptional({
//     description:
//       'No need to send this field because this field will be determined from the header key file by backend.',
//   })
//   @IsOptional()
//   @IsString()
//   @IsEnum(FilteredClientSourceTypeEnum)
//   filteredSourceType: string;

//   @ApiPropertyOptional({
//     description:
//       'However this field is expected. If nothing can be figured out, send empty string here',
//   })
//   @IsOptional()
//   @IsString()
//   ipAddress: string;

//   @ApiPropertyOptional({
//     description:
//       'If this field can be figured out, send it in the request body.Else no need to include this field in the body.',
//   })
//   @IsOptional()
//   @IsString()
//   browserInfo: string;

//   @ApiPropertyOptional({
//     description:
//       'If this field can be figured out, send it in the request body.Else no need to include this field in the body.',
//   })
//   @IsOptional()
//   @IsString()
//   deviceInfo: string;

//   @ApiPropertyOptional({
//     description:
//       'This field is expected if user gives the app permission to access the location otherwise you can exclude this field as well.',
//   })
//   @IsOptional()
//   @IsString()
//   locationInfo: string;
// }

export class DeleteVisitDTO {
  @IsNotEmpty() @IsUUID() visitId: string;
}
