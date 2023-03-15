import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class UserTokenDTO {
  @IsString()
  emailVerificationUserToken: string;

  @IsDate()
  createdAtEmailVerificationUserToken: Date;

  @IsDate()
  expireAtEmailVerificationUserToken: Date;

  @IsDate()
  phoneVerificationOtp: string;

  @IsDate()
  createdAtPhoneVerificationUserToken: Date;

  @IsDate()
  expireAtPhoneVerificationUserToken: Date;

  @IsString()
  forgotPasswordUserToken: string;

  @IsDate()
  createdAtForgotPasswordUserToken: Date;

  @IsDate()
  expireAtForgotPasswordUserToken: Date;

  @IsString()
  refreshToken: string;
}

export class CheckReferalTokenValidityDTO {
  @IsNotEmpty()
  @IsString()
  referralToken: string;
}
