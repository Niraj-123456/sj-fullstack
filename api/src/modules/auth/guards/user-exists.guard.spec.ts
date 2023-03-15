import { UserExistsGuard } from './user-exists.guard';
import { AuthService } from '../services/auth.service';

describe('UserExistsGuard', () => {
  let authService: AuthService;

  it('should be defined', () => {
    expect(new UserExistsGuard(authService)).toBeDefined();
  });
  //   it('should return a boolean', ()=>{
  //       expect(typeof new UserExistsGuard(authService).canActivate()).toEqual('boolean')
  //   })
});
