import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Query,
  Get,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AllPermissionsEnum,
  FilteredSourceTypeWithAnonymityEnum,
} from 'common/constants/enum-constant';
import { GenericResponseDTO } from 'common/dto/response.dto';
import {
  CompulsoryJwtAndClientApiKeyToGetTheClientGuard,
  CompulsoryJwtAndStaffApiKeyToGetTheClientGuard,
  OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard,
  OptionalJwtButCompulsoryClientOrStaffApiKeyToGetTheClientGuard,
} from 'modules/auth/guards/jwt-auth.guard';
import { JWTPermissionsGuard } from 'modules/permission/permission.guard';
import {
  BookingSearchBasedOnFiltersDTO,
  CreateBookingDTO,
  UpdateBookingDTO,
} from './booking.dtos';
import { Booking } from './booking.entity';
import { BookingService } from './booking.service';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({
    summary: 'Registers a booking',
    description:
      'When a user make a booking to us, we use this api to register the request. Initially, the request can be made from both Forms of Webapp (now) and Mob app (later)',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: CreateBookingDTO })
  @UseGuards(OptionalJwtButCompulsoryClientOrStaffApiKeyToGetTheClientGuard)
  @Post('register-booking')
  register(
    @Req() req,
    @Body() bookingInfo: CreateBookingDTO,
  ): Promise<GenericResponseDTO> {
    return this.bookingService.addBooking(req.user, bookingInfo);
  }

  /// THIS ENDPOINT will be used by STAFF
  /// Client booking will come from pages/client-web-app/my-booking
  /// For service provider will make a new endpoint
  @ApiOperation({
    summary: 'Get booking list as in search result format',
    description:
      'When the staff wants to see the booking list in a searchable format, this api will be used. Currently, it will be consumed by Dashboard frontend in staff side (web app)',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @UseGuards(CompulsoryJwtAndStaffApiKeyToGetTheClientGuard)
  @Get('get-booking-list-by-filter')
  getBookingList(
    @Req() req,
    @Query() searchDetails: BookingSearchBasedOnFiltersDTO,
  ) {
    //: Promise<GenericResponseDTO> {
    return this.bookingService.getFilteredBookingList(req.user, searchDetails);
  }

  @ApiOperation({
    summary: 'Update a booking',
    description:
      'When a staff wants to make changes to the booking, this api will be used.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: UpdateBookingDTO })
  @UseGuards(new JWTPermissionsGuard([AllPermissionsEnum.UpdateBooking]))
  @Put('update-booking')
  updateBooking(
    @Req() req,
    @Body() bookingInfo: UpdateBookingDTO,
  ): Promise<GenericResponseDTO> {
    return this.bookingService.updateBooking(req.user, bookingInfo);
  }
}
