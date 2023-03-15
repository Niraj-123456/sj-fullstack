import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Query,
  Put,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllPermissionsEnum } from 'common/constants/enum-constant';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { JWTPermissionsGuard } from 'modules/permission/permission.guard';
import {
  CreateBookingReviewDTO,
  SearchBookingReviewsBasedOnFiltersDTO,
} from './booking_review.dtos';
import { BookingReviewService } from './booking_review.service';

@ApiTags('booking-review')
@Controller('booking-review')
export class BookingReviewController {
  constructor(private readonly bookingReviewService: BookingReviewService) {}

  @ApiOperation({
    summary:
      'Registers Booking review with both service rating and employee rating for the booking',
    description:
      'When a staff/customer makes a new booking review with both service rating and employee rating ,we use this api to register both at once. Initially, the api will be used from staff side of Staff webapp',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: CreateBookingReviewDTO })
  @UseGuards(new JWTPermissionsGuard([AllPermissionsEnum.CreateBookingReview]))
  @Put('add-service-and-employee-ratings')
  addBothBookingEmployeeReview(
    @Req() req,
    @Body() bookingReviewInfo: CreateBookingReviewDTO,
  ): Promise<GenericResponseDTO> {
    return this.bookingReviewService.addBookingReview(
      req.user,
      bookingReviewInfo,
    );
  }

  @ApiOperation({
    summary: 'Get booking reviews list as in search result format',
    description:
      'When the staff wants to see the review list in a searchable format, this api will be used. Currently, it will be consumed by Dashboard frontend in staff side (web app)',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @UseGuards(new JWTPermissionsGuard([AllPermissionsEnum.ViewBookingReview]))
  @Get('get-booking-reviews-list-by-filter')
  getBookingList(
    @Req() req,
    @Query() searchDetails: SearchBookingReviewsBasedOnFiltersDTO,
  ) {
    //: Promise<GenericResponseDTO> {
    return this.bookingReviewService.getFilteredBookingReviewList(
      req.user,
      searchDetails,
    );
  }
}
