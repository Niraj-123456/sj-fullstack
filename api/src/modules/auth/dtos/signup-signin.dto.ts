import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { UserGenderTypeEnum } from 'common/constants/enum-constant';

export class RegisterPhoneNumberDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsDateString()
  dob: Date;

  @ApiProperty()
  @IsEnum(UserGenderTypeEnum)
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referralCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  middleName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  landlineNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  isUserReferred: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roleId: string;
}

export class RegisterStaffDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  dob: Date;

  @ApiProperty()
  @IsEnum(UserGenderTypeEnum)
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roleId: string;
}

export class DeleteStaffDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class RegisterServiceProviderDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  dob: Date;

  @ApiProperty()
  @IsEnum(UserGenderTypeEnum)
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roleId: string;
}

export class DeleteServiceProviderDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class RegisterEmailDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class ResendOTPDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class SubmitOTPDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class SubmitForgotPasswordOTPDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  forgotPasswordOtp: string;
}

export class SetPasswordDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // phoneVerificationOtp: string;
}

export class SetNewPasswordDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class LoginUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateRefreshTokenDTO {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class DeleteAccessTokenDTO {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
}

// export class VerifyRegistrationDTO {
//   @IsEmail() @IsNotEmpty() email: string;
//   logo: string | null;
//   @IsString() @IsNotEmpty() password: string;
// }

// export class LoginUserDTO {
//   @IsEmail() @IsNotEmpty() email: string;
//   @IsString() @IsNotEmpty() password: string;
// }

// //there will be many cases where only email will be required. this is for the same generic purpose
// export class OnlyEmailDTO {
//   @IsEmail() @IsNotEmpty() email: string;
// }

// export class ChangePasswordDTO {
//   @IsEmail() @IsNotEmpty() email: string;
//   @IsNotEmpty() password: string;
// }

// export class ResendInviteEmailDTO {
//   @IsEmail() @IsNotEmpty() email: string;
// }

// export class CancelInviteDTO {
//   @IsEmail() @IsNotEmpty() email: string;
// }
// export class InviteUserDTO {
//   // this is the invitation sender. "email" is used and sender is not used because
//   // guards are using the same key value
//   @IsEmail() @IsNotEmpty() email: string;
//   @IsString() @IsNotEmpty() firstName: string;
//   @IsString() @IsNotEmpty() lastName: string;
//   @IsOptional() @IsNumber() roleId: number;
//   @IsNumber() @IsNotEmpty() businessId: number;
//   @IsOptional() phoneNumber: string;
// }

// note since it is common DTO used after the req body already goes through their respective DTOs,
// so if a field is optional in one of RegistrationDTO or InviteDTO,then it will be optional here as well
// export class RegistrationAndInviteCommonDTO {
//   @IsEmail() @IsNotEmpty() email: string;
//   @IsString() @IsNotEmpty() firstName: string;
//   @IsString() @IsNotEmpty() lastName: string;
//   @IsNumber() @IsNotEmpty() roleId: number;
//   @IsOptional() team: string;
// }

// export class ReinviteDTO {
//   @IsEmail() @IsNotEmpty() email: string; //invitation sender
//   @IsEmail() @IsNotEmpty() invitedEmail: string; //invitation receiver
// }

// export class CancelInvitationDTO {
//   @IsEmail() @IsNotEmpty() email: string; //invitation cancellor
//   @IsEmail() @IsNotEmpty() invitedEmail: string; //invitation receiver
// }
