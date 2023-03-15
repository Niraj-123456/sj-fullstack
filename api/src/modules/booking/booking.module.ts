import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerInteractionModule } from 'modules/customer-interaction/customer-interaction.module';
import { DiscountModule } from 'modules/discount/discount.module';
import { ServiceModule } from 'modules/service/service.module';
import { UserModule } from 'modules/users/users.module';
import { BookingController } from './booking.controller';
import { Booking } from './booking.entity';
import { BookingService } from './booking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    forwardRef(() => UserModule),
    forwardRef(() => ServiceModule),
    CustomerInteractionModule,
    forwardRef(() => DiscountModule),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
