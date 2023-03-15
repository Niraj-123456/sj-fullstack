import { forwardRef, Module } from '@nestjs/common';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common/common.module';
import { UserService } from './services/users.service';
import { UserTokenModule } from 'modules/token/token.module';

import { UsersController } from './controllers/users.controller';
import { RoleModule } from 'modules/role/role.module';
import { AWSModule } from 'modules/aws/aws.module';
import { DiscountModule } from 'modules/discount/discount.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CommonModule),
    forwardRef(() => UserTokenModule),
    // forwardRef(() => BusinessModule),
    // forwardRef(() => RepresentativeModule),
    // forwardRef(() => FileModule),
    forwardRef(() => RoleModule),
    forwardRef(() => AWSModule),
    forwardRef(() => DiscountModule),
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
