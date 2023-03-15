import {
  Controller,
  Get,
  UseGuards,
  Query,
  Req,
  Post,
  Body,
} from '@nestjs/common';

// import { IsClientHeaderValidGuard } from 'modules/auth/guards/mobile-client-header.guard';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { GetMobileHomePageDataResponseDTO } from './home-page.dtos';
import {
  JwtAuthGuard,
  OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard,
} from 'modules/auth/guards/jwt-auth.guard';
import { HomePageService } from './home-page.service';
import { CreateBookingDTO } from 'modules/booking/booking.dtos';
import { Booking } from 'modules/booking/booking.entity';
import { ClientWebAppHomePageDataResponseDTO } from './home-page.dtos';
@ApiTags('pages/client-web-app/home-page/')
@Controller('pages/client-web-app/home-page/')
export class HomePageController {
  constructor(private readonly homePageService: HomePageService) {}

  // home page uses general search from search module
  // @ApiHeader({ name: 'cb-client-api-key' })
  @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  @ApiOperation({
    summary: 'Gets relevent data for the MVP client webapp home page',
    description:
      'This route is supposed to be used to fetch all the data required for the home page of client MVP webapp.Client API key is complusory in the header.',
  })
  @ApiResponse({
    type: ClientWebAppHomePageDataResponseDTO,

    description:
      'All information needed for client webapp home page has been received.',
  })
  // @UseGuards(IsClientHeaderValidGuard)
  @Get('get-data')
  getDataForMobHome(@Req() req): Promise<ClientWebAppHomePageDataResponseDTO> {
    return this.homePageService.getWebClientAppHomePage();
  }
}
