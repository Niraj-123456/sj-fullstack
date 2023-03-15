import {
  Controller,
  UseGuards,
  Get,
  Query,
  HttpException,
} from '@nestjs/common';

import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CheckReferalTokenValidityDTO } from './token.dtos';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { UserTokenService } from './token.service';
import { IsClientHeaderValidGuard } from 'modules/auth/guards/client-header.guard';

@ApiTags('token')
@Controller('token')
export class UserTokenController {
  constructor(private tokenService: UserTokenService) {}
  //#region Single User UserToken routes

  // Utimate
  @ApiOperation({
    summary: 'Checks if the refer token is valid or not',
    description:
      'Basically, you can use this route when you want to check for the validity of the token. This api is consumped in the places like when user enters referral code while signing up to get extra discount.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: CheckReferalTokenValidityDTO })
  @ApiOkResponse({ type: GenericResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Get('check-referral-code')
  async checkReferralCode(
    @Query() tokenInfo: CheckReferalTokenValidityDTO,
  ): // : any {
  Promise<GenericResponseDTO> {
    return await this.tokenService.checkIfReferralCodeIsValid(
      tokenInfo.referralToken,
    );
  }
}
