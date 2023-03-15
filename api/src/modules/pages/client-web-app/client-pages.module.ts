import { forwardRef, Module } from '@nestjs/common';
import { BookingModule } from 'modules/booking/booking.module';
import { DiscountModule } from 'modules/discount/discount.module';
import { ServiceModule } from 'modules/service/service.module';
import { BenefitController } from './benefits/benefits.controller';
import { BenefitService } from './benefits/benefits.service';
import { HomePageController } from './home-page/home-page.controller';
import { HomePageService } from './home-page/home-page.service';
import { MyBookingController } from './my-booking/my-booking.controller';
import { MyBookingService } from './my-booking/my-booking.service';

@Module({
  imports: [
    forwardRef(() => ServiceModule),
    forwardRef(() => BookingModule),
    forwardRef(() => DiscountModule),
  ],
  controllers: [HomePageController, MyBookingController, BenefitController],
  providers: [HomePageService, MyBookingService, BenefitService],
  exports: [HomePageService, MyBookingService, BenefitService],
})
export class ClientPageModule {}
