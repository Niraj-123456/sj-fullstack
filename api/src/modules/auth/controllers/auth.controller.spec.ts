import { Test, TestingModule } from '@nestjs/testing';
import { getModeluserToken } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from '../local.strategy';
import { JwtStrategy } from '../jwt.strategy';
import { JWT_SECRET, EXPIRY_TIME } from '../constants';
import { User } from '../../users/users.entity';
import { UserToken } from '../../userToken/userToken.entity';
import { UserService } from '../../users/services/users.service';
import { UserTokenService } from '../../token/token.service';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        //   MulterModule.register({
        //   dest: './static/uploaded/teamlogo',
        //   // limits: { fileSize: config.maxImageSizeInByte },
        //   }),
        // UserModule,
        // PassportModule.register({defaultStrategy:DEFAULT_STRATEGY}),
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: EXPIRY_TIME },
        }),
        //   EmailModule,
        //   CoreModule
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: getModeluserToken(User),
          useValue: User,
        },
        UserTokenService,
        {
          provide: getModeluserToken(UserToken),
          useValue: UserToken,
        },

        LocalStrategy,
        JwtStrategy,
      ],

      controllers: [AuthController],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
