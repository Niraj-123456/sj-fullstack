import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AllPermissionsEnum } from 'common/constants/enum-constant';
// import { PermissionTypeEnum } from 'common/constants/enum-constant';

export class PermissionDTO {
  @IsString()
  @IsEnum(AllPermissionsEnum)
  name: string;

  @IsString() description: string;
}

export class AddPermissionToUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AllPermissionsEnum, { each: true })
  permissionNames: AllPermissionsEnum[];
}
