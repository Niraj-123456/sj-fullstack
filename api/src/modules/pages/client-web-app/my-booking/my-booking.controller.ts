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
import { BookingSearchBasedOnFiltersDTO } from 'modules/booking/booking.dtos';
import { ClientMyBookingSearchDTO } from './my-booking.dtos';
import { MyBookingService } from './my-booking.service';
@ApiTags('pages/client-web-app/my-booking/')
@Controller('pages/client-web-app/my-booking/')
export class MyBookingController {
  constructor(private readonly myBookingService: MyBookingService) {}

  @ApiOperation({
    summary: 'Get all the data for logged in user',
    description:
      'The logged in user is first redirected towards MyBookings page. This api fetches data for the same page.Currently, it will be consumed by Dashboard frontend in client web app',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @UseGuards(CompulsoryJwtAndClientApiKeyToGetTheClientGuard)
  @Get('get-page-data')
  getMyBookingData(@Req() req) {
    return this.myBookingService.getWebClientAppMyBookingPageData(req.user);
  }

  @ApiOperation({
    summary: 'Get users booking list as in search result format',
    description:
      'When the client wants to see his own booking list in a searchable format, this api will be used. Currently, it will be consumed by Dashboard frontend in client side (web app)',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @UseGuards(CompulsoryJwtAndClientApiKeyToGetTheClientGuard)
  @Get('get-user-bookings-by-filter')
  getBookingList(@Req() req, @Query() searchDetails: ClientMyBookingSearchDTO) {
    //: Promise<GenericResponseDTO> {
    return this.myBookingService.getFilteredBookingList(
      req.user,
      searchDetails,
    );
  }
}
