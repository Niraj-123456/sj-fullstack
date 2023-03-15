import { IsEnum, IsString } from 'class-validator';
import { RoleTypeEnum } from 'common/constants/enum-constant';

export class RoleDTO {
  @IsString() @IsEnum(RoleTypeEnum) name: string;

  @IsString() description: string;
}
