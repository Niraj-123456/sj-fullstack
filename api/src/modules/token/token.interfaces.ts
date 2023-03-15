import { ApiProperty } from '@nestjs/swagger';

export interface ICommonTokenDetails {
  phoneVerificationOtp: string | undefined;
  emailVerificationUserToken: string | undefined;
  forgotPasswordUserToken: string | undefined;
}

// for swagger
export class ICommonTokenDetailsDTO {
  @ApiProperty()
  phoneVerificationOtp: string | undefined;

  @ApiProperty()
  emailVerificationUserToken: string | undefined;

  @ApiProperty()
  forgotPasswordUserToken: string | undefined;
}
