import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceModule } from 'modules/service/service.module';
import { UserModule } from 'modules/users/users.module';
import { DiscountController } from './discount.controller';
import { Discount } from './discount.entity';
import { DiscountService } from './discount.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount]),
    forwardRef(() => UserModule),
    forwardRef(() => ServiceModule),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
