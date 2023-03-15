import { ApiProperty } from '@nestjs/swagger';
import { IBasicResponse } from 'common/interface/response.interface';
import {
  ICommonUserDetails,
  ICommonUserDetailsDTO,
  ICommonUserDetailsLogin,
} from 'modules/users/interfaces/user.interface';

// export interface IGenericResponse {
//   success: boolean;
//   data?: {} | [];
//   message?: string;
// }

// export interface ILoginResponse {
//   success: boolean;
//   data:
//     | {
//         user: ICommonUserDetailsLogin;
//         authUserToken: {
//           accessUserToken: string;
//           accessTokenExpiresIn: string;
//           refreshUserToken: string;
//           refreshTokenExpiresIn: string;
//         };
//       }
//     | {
//         errorField: string;
//       }
//     | null;

//   message: string;
// }

// export interface IUpdateAccessTokenResponse {
//   success: boolean;
//   data:
//     | {
//         accessUserToken: string;
//         accessTokenExpiresIn: string;
//       }
//     | {
//         errorField: string;
//       }
//     | null;

//   message: string;
// }

// export interface IUpdateRefreshTokenResponse {
//   success: boolean;
//   data:
//     | {
//         refreshUserToken: string;
//         refreshTokenExpiresIn: string;
//       }
//     | {
//         errorField: string;
//       }
//     | null;

//   message: string;
// }

// export interface ILogoutResponse {
//   success: boolean;
//   data: {
//     errorField: string;
//   } | null;

//   message: string;
// }

// export interface IPhoneRegisterResponse {
//   success: boolean;
//   data: { user: ICommonUserDetails } | object | null; //object field allowed for manual Error
//   message: string;
// }

// export interface ISubmitOTPResponse {
//   success: boolean;
//   message: string;
// }

///// email subscription ////////
export class EmailSubscriptionRegisterResponseDataDTO {
  @ApiProperty({ type: ICommonUserDetailsDTO })
  user: ICommonUserDetailsDTO; //object field allowed for manual Error
}
export class EmailSubscriptionRegisterResponseDTO implements IBasicResponse {
  @ApiProperty()
  success: boolean;
  @ApiProperty({ type: EmailSubscriptionRegisterResponseDataDTO })
  data: EmailSubscriptionRegisterResponseDataDTO; //object field allowed for manual Error
  @ApiProperty()
  message: string;
}

///// phone register subscription ////////
export class IPhoneRegisterResponseDataDTO {
  @ApiProperty({ type: ICommonUserDetailsDTO })
  user: ICommonUserDetailsDTO; //object field allowed for manual Error
}
export class IPhoneRegisterResponseDTO implements IBasicResponse {
  @ApiProperty()
  success: boolean;
  @ApiProperty({ type: IPhoneRegisterResponseDataDTO })
  data: IPhoneRegisterResponseDataDTO | object | null; //object field allowed for manual Error
  @ApiProperty()
  message: string;
}

////// submit otp ////////
export class ISubmitOTPResponseDTO implements IBasicResponse {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  message: string;
}

////// login and session ////////
export class ILoginResponseUserTokenDTO {
  @ApiProperty()
  accessUserToken: string;
  @ApiProperty()
  refreshUserToken: string;

  @ApiProperty()
  accessTokenExpiresIn: string;

  @ApiProperty()
  refreshTokenExpiresIn: string;
}
export class ILoginResponseUserDTO {
  @ApiProperty({ type: ICommonUserDetailsDTO })
  user: ICommonUserDetailsDTO; //object field allowed for manual Error
  @ApiProperty({ type: ILoginResponseUserTokenDTO })
  authUserToken: ILoginResponseUserTokenDTO;
}

export class ILoginResponseDTO implements IBasicResponse {
  @ApiProperty()
  success: boolean;
  @ApiProperty({ type: ILoginResponseUserDTO })
  data: ILoginResponseUserDTO;
  @ApiProperty()
  message: string;
}

export class IUpdateAccessTokenResponseDTO {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  data:
    | {
        accessUserToken: string;
        accessTokenExpiresIn: string;
      }
    | {
        errorField: string;
      }
    | null;
  @ApiProperty()
  message: string;
}

export class IUpdateRefreshTokenResponseDTO {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  data:
    | {
        refreshUserToken: string;
        refreshTokenExpiresIn: string;
      }
    | {
        errorField: string;
      }
    | null;
  @ApiProperty()
  message: string;
}
