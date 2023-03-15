import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from 'modules/booking/booking.module';
import { UserModule } from 'modules/users/users.module';
import { BookingReviewController } from './booking_review.controller';
import { BookingReview } from './booking_review.entity';
import { BookingReviewService } from './booking_review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingReview]),
    forwardRef(() => UserModule),
    forwardRef(() => BookingModule),
  ],
  controllers: [BookingReviewController],
  providers: [BookingReviewService],
  exports: [BookingReviewService],
})
export class BookingReviewModule {}
