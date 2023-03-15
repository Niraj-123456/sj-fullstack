import { forwardRef, Module } from '@nestjs/common';
import { BookingModule } from 'modules/booking/booking.module';
import { DiscountModule } from 'modules/discount/discount.module';
import { ServiceModule } from 'modules/service/service.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';

@Module({
  imports: [
    forwardRef(() => ServiceModule),
    forwardRef(() => BookingModule),
    forwardRef(() => DiscountModule),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class StaffPageModule {}
