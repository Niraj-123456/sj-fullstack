import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APPVars, configService } from 'config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common/common.module';
import { UserService } from '../users/services/users.service';
import { User } from '../users/users.entity';
import { UserToken } from '../token/token.entity';
import { UserModule } from '../users/users.module';
import { UserTokenModule } from '../token/token.module';
import { SMSModule } from '../sms/sms.module';
import { DiscountModule } from '../discount/discount.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from 'modules/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
    UserModule,
    UserTokenModule,

    CommonModule,
    SMSModule,
    PassportModule.register({
      defaultStrategy: APPVars.jwtSecrets.passport.defaultStrategy,
    }),
    JwtModule.register({
      secret: APPVars.jwtSecrets.jwt.secret,
      signOptions: {
        expiresIn:
          APPVars.expiryDuration.secretExpiration.accessToken.timeValueString,
      },
    }),
    forwardRef(() => DiscountModule),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // UserService,
    // UserTokenService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
