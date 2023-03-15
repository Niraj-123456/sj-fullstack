// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthService } from '../services/auth.service';

// @Injectable()
// export class UserExistsGuard implements CanActivate {
//   constructor(private authService: AuthService) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     try {
//       const request = context.switchToHttp().getRequest();

//       if (request.body && request.body.phoneNumber) {
//         const user = await this.authService.checkIfUserExists(
//           request.body.phoneNumber,
//         );
//         if (user) {
//           return true;
//         }
//         return false;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       throw error;
//     }
//   }
// }
