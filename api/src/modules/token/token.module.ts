import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common/common.module';
import { User } from 'modules/users/users.entity';
import { UserModule } from 'modules/users/users.module';
import { UserTokenController } from './token.controller';
import { UserToken } from './token.entity';
import { UserTokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
    CommonModule,
    forwardRef(() => UserModule),
  ],
  controllers: [UserTokenController],
  providers: [UserTokenService],
  exports: [UserTokenService],
})
export class UserTokenModule {}
