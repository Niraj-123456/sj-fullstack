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
import { AllPermissionsEnum } from 'common/constants/enum-constant';
import { JWTPermissionsGuard } from 'modules/permission/permission.guard';
import { DashboardService } from './dashboard.service';
@ApiTags('pages/staff-web-app/dashboard/')
@Controller('pages/staff-web-app/dashboard/')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Get all the data for logged in user',
    description:
      'The logged in user is first redirected towards Dashboards page. This api fetches data for the same page.Currently, it will be consumed by Dashboard frontend in staff web app',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  // @UseGuards(new JWTPermissionsGuard([AllPermissionsEnum.ViewBooking]))
  @Get('get-page-data')
  getDashboardData(@Req() req) {
    return this.dashboardService.getWebStaffAppDashboardPageData(req.user);
  }

  // @ApiOperation({
  //   summary: 'Get users booking list as in search result format',
  //   description:
  //     'When the staff wants to see his own booking list in a searchable format, this api will be used. Currently, it will be consumed by Dashboard frontend in staff side (web app)',
  // })
  // @ApiHeader({ name: 'sj-staff-api-key' })
  // @UseGuards(CompulsoryJwtAndStaffApiKeyToGetTheStaffGuard)
  // @Get('get-user-bookings-by-filter')
  // getBookingList(@Req() req, @Query() searchDetails: StaffDashboardSearchDTO) {
  //   //: Promise<GenericResponseDTO> {
  //   return this.dashboardService.getFilteredBookingList(
  //     req.user,
  //     searchDetails,
  //   );
  // }
}
