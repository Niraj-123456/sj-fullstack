import { Test, TestingModule } from '@nestjs/testing';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule, getModeluserToken } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from '../local.strategy';
import { JwtStrategy } from '../jwt.strategy';
import { JWT_SECRET, EXPIRY_TIME } from '../constants';
import { UserService } from '../../users/services/users.service';
import { User } from '../../users/users.entity';
import { UserTokenService } from '../../token/token.service';
import { UserToken } from '../../userToken/userToken.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule,
        MulterModule.register({
          dest: './static/uploaded/teamlogo',
          // limits: { fileSize: config.maxImageSizeInByte },
        }),
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: EXPIRY_TIME },
        }),
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
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
