import { ApiProperty } from '@nestjs/swagger';
import { File } from 'modules/file/file.entity';
import { Permission } from 'modules/permission/permission.entity';
import { Role } from 'modules/role/role.entity';
import { UserToken } from 'modules/token/token.entity';
import {
  ICommonTokenDetails,
  ICommonTokenDetailsDTO,
} from 'modules/token/token.interfaces';

export interface ICommonUserDetails {
  id: string;
  firstName: string;
  middleName: string | null;
  fullName: string | null;
  lastName: string;
  phoneNumber: string;
  landlineNumber: string | null;
  fullAddress: string;
  isPhoneNumberVerified: boolean;
  email: string | null;
  isEmailVerified: boolean;
  isEmailSubscribedForNewsLetter: boolean;
  isPasswordSet: boolean;
  mainDisplayImage: File;
  // userToken: ICommonTokenDetails;
  userRole: Role;
  // userPermissions: Permission[];

  userType: string;
  gender: string;
  dob: Date;
}

export interface ICommonUserDetailsLogin {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isPhoneNumberVerified: boolean;
  email: string;
  isEmailVerified: boolean;
  isEmailSubscribedForNewsLetter: boolean;
  isPasswordSet: boolean;
  mainDisplayImage: File;
  // userToken: ICommonTokenDetails;
  userRole: Role;
  userPermissions: Permission[];

  userType: string;
  gender: string;
  dob: Date;
}

// For swagger
export class ICommonUserDetailsDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty({ type: Boolean })
  isPhoneNumberVerified: boolean;
  @ApiProperty()
  email: string;
  @ApiProperty({ type: Boolean })
  isEmailVerified: boolean;

  @ApiProperty({ type: Boolean })
  isEmailSubscribedForNewsLetter: boolean;

  @ApiProperty({ type: Boolean })
  isPasswordSet: boolean;

  @ApiProperty()
  userType: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  dob: Date;

  @ApiProperty({ type: () => File })
  mainDisplayImage: File;

  // @ApiProperty({ type: ICommonTokenDetailsDTO })
  // userToken: ICommonTokenDetailsDTO;

  @ApiProperty({ type: Role })
  userRole: Role;

  @ApiProperty()
  referralToken?: string;
}
