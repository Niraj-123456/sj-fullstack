// import { Test, TestingModule } from '@nestjs/testing';
// // import { getModeluserToken, SequelizeModule } from '@nestjs/sequelize';
// import { UserService } from './users.service';
// import { UsersController } from '../controllers/users.controller';
// import { User } from '../users.entity';
// // import { UserToken } from '../../userToken/userToken.entity';
// import { UserTokenService } from '../../token/token.service';

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [SequelizeModule],
//       providers: [
//         UserService,
//         {
//           provide: getModeluserToken(User),
//           useValue: User,
//         },
//         UserTokenService,
//         {
//           provide: getModeluserToken(UserToken),
//           useValue: UserToken,
//         },
//       ],
//       controllers: [UsersController],
//     }).compile();

//     service = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
