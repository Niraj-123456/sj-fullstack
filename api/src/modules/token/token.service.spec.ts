import { Test, TestingModule } from '@nestjs/testing';
import { getModeluserToken, SequelizeModule } from '@nestjs/sequelize';
import { UserTokenService } from './userToken.service';
import { UserToken } from './userToken.entity';
import { User } from '../users/users.entity';
import { UserService } from '../users/services/users.service';

describe('UserTokenService', () => {
  let service: UserTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SequelizeModule],
      providers: [
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
      ],
    }).compile();

    service = module.get<UserTokenService>(UserTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
