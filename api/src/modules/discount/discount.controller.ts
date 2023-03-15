import { Controller, UseGuards, Post, Body, Req, Query } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilteredSourceTypeWithAnonymityEnum } from 'common/constants/enum-constant';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard } from 'modules/auth/guards/jwt-auth.guard';

import { Discount } from './discount.entity';
import { DiscountService } from './discount.service';

@ApiTags('discount')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // @ApiOperation({
  //   summary: 'Registers a discount',
  //   description:
  //     'When a user make a discount to us, we use this api to register the request. Initially, the request can be made from both Forms of Webapp (now) and Mob app (later)',
  // })
  // @ApiHeader({ name: 'sj-client-api-key' })
  // @ApiBody({ type: CreateDiscountDTO })
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @Post('register-discount')
  // register(
  //   @Req() req,
  //   @Body() discountInfo: CreateDiscountDTO,
  // ): Promise<GenericResponseDTO> {
  //   return this.discountService.addDiscount(req.user, discountInfo);
  // }

  // TODO
  // an api for fetching List of Customer Reqest types
}
