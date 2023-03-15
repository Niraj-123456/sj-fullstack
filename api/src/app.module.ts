import { Module } from '@nestjs/common';
import { CoreModule } from '././modules/core/core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from 'config/config.service';
import { AuthModule } from './modules/auth/auth.module';

import { CommonModule } from 'common/common.module';
import { ClientPageModule } from './modules/pages/client-web-app/client-pages.module';
import { UserModule } from './modules/users/users.module';
import { BookingModule } from './modules/booking/booking.module';
import { ServiceModule } from './modules/service/service.module';
import { FileModule } from './modules/file/file.module';
import { DiscountModule } from './modules/discount/discount.module';
import { UserTokenModule } from './modules/token/token.module';
import { CustomerInteractionModule } from './modules/customer-interaction/customer-interaction.module';
import { RoleModule } from './modules/role/role.module';
import { StaffPageModule } from 'modules/pages/staff-web-app/staff-pages.module';
import { PermissionModule } from 'modules/permission/permission.module';
import { BookingReviewModule } from 'modules/booking_reviews/booking_review.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    CoreModule,
    UserModule,
    BookingModule,
    ClientPageModule,
    ServiceModule,
    FileModule,
    DiscountModule,
    UserTokenModule,
    CustomerInteractionModule,
    RoleModule,
    PermissionModule,
    StaffPageModule,
    BookingReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: InternalServerErrorFilter,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
