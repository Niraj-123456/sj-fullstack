import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { APPVars } from 'config/config.service';

@Injectable()
export class IsClientHeaderValidGuard implements CanActivate {
  //   constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const apiKeyFromClient = request.headers['sj-client-api-key'];

      let validAPIKeys = [
        APPVars.clientKeys.androidAppClientKey,
        APPVars.clientKeys.androidBrowserClientKey,
        APPVars.clientKeys.iosAppClientKey,
        APPVars.clientKeys.iosBrowserClientKey,
        APPVars.clientKeys.pcBrowserKey,

        APPVars.superAdminKey.superAdminKey,
        APPVars.staffKeys.staffAdminKey,
        APPVars.serviceProviderKeys.servicePAdminKey,
      ];

      // check if the key is valid
      // TODO there is function getClientTypeByApiKey in Auth service , use that to reduce redundancy
      if (!validAPIKeys.includes(apiKeyFromClient)) {
        throw new UnauthorizedException('Expecting valid client api key');
        // return false;
      } else {
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
}

@Injectable()
export class IsSuperAdminHeaderValidGuard implements CanActivate {
  //   constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      // sj-superadmin-api-key
      return (
        request.headers['sj-client-api-key'] ===
        APPVars.superAdminKey.superAdminKey
      );
    } catch (error) {
      throw error;
    }
  }
}
