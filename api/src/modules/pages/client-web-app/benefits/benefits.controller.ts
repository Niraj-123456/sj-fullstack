import {
  Controller,
  Get,
  UseGuards,
  Query,
  Req,
  Post,
  Body,
} from '@nestjs/common';

import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompulsoryJwtAndClientApiKeyToGetTheClientGuard } from 'modules/auth/guards/jwt-auth.guard';
import { ClientDiscountSearchDTO } from './benefits.dtos';

import { BenefitService } from './benefits.service';
@ApiTags('pages/client-web-app/benefit/')
@Controller('pages/client-web-app/benefit/')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @ApiOperation({
    summary: 'Get users discount list as in search result format',
    description:
      'When the client wants to see his own referral list in a searchable format, this api will be used. Currently, it will be consumed by Benefit page of in client side (web app). The client side only has sorting and pagination feature.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @UseGuards(CompulsoryJwtAndClientApiKeyToGetTheClientGuard)
  @Get('get-user-discounts-by-filter')
  getBenefitList(@Req() req, @Query() searchDetails: ClientDiscountSearchDTO) {
    //: Promise<GenericResponseDTO> {

    // Good practise to link all those services to Discount services because the api are just too straight forward
    return this.benefitService.getFilteredBenefitListSortedByDate(
      req.user,
      searchDetails,
    );
  }
}
