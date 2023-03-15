import { Test, TestingModule } from '@nestjs/testing';
import { getModeluserToken } from '@nestjs/sequelize';

import { UsersController } from './users.controller';
import { UserService } from '../services/users.service';
import { UserTokenService } from '../../token/token.service';
import { User } from '../users.entity';
import { UserToken } from '../../userToken/userToken.entity';

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
