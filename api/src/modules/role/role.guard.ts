import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleTypeEnum } from 'common/constants/enum-constant';
@Injectable()
export class JWTRolesGuard extends AuthGuard('jwt') {
  constructor(private roles: RoleTypeEnum[] | null) {
    super();
  }

  handleRequest(err: any, user: any, info: string) {
    const requiredRoles = this.roles;

    if (!requiredRoles) {
      return user || null;
    }

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const userRole = user.userRole;
    const doesRoleMatch = requiredRoles.includes(userRole?.name);
    if (!doesRoleMatch) {
      throw new UnauthorizedException('User does not have valid role.');
    }

    return user;
  }
}
