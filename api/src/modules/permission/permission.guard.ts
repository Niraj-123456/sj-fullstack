import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AllPermissionsEnum,
  FilteredClientSourceTypeEnum,
} from 'common/constants/enum-constant';
import { APPVars } from 'config/config.service';
import { Permission } from './permission.entity';
@Injectable()
export class JWTPermissionsGuard extends AuthGuard('jwt') {
  constructor(private permissions: string[]) {
    super();
  }
  filteredSourceType: FilteredClientSourceTypeEnum;

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    let validAPIKeys = [
      APPVars.clientKeys.androidAppClientKey,
      APPVars.clientKeys.androidBrowserClientKey,
      APPVars.clientKeys.iosAppClientKey,
      APPVars.clientKeys.iosBrowserClientKey,
      APPVars.clientKeys.pcBrowserKey,

      APPVars.staffKeys.staffAdminKey,
      APPVars.superAdminKey.superAdminKey,
    ];
    const request = context.switchToHttp().getRequest();
    const apiKeyFromClient = request.headers['sj-client-api-key'];

    // check if the key is valid
    // TODO there is function getClientTypeByApiKey in Auth service , use that to reduce redundancy
    if (!validAPIKeys.includes(apiKeyFromClient)) {
      throw new UnauthorizedException('Expecting valid client api key');
      // return false;
    } else {
      // if valid, now, check for which type of client this is
      if (apiKeyFromClient === APPVars.clientKeys.androidAppClientKey) {
        this.filteredSourceType = FilteredClientSourceTypeEnum.ANDROID_APP;
      } else if (
        apiKeyFromClient === APPVars.clientKeys.androidBrowserClientKey
      ) {
        this.filteredSourceType = FilteredClientSourceTypeEnum.ANDROID_BROWSER;
      } else if (apiKeyFromClient === APPVars.clientKeys.iosAppClientKey) {
        this.filteredSourceType = FilteredClientSourceTypeEnum.IOS_APP;
      } else if (apiKeyFromClient === APPVars.clientKeys.iosBrowserClientKey) {
        this.filteredSourceType = FilteredClientSourceTypeEnum.IOS_BROWSER;
      } else if (apiKeyFromClient === APPVars.clientKeys.pcBrowserKey) {
        this.filteredSourceType = FilteredClientSourceTypeEnum.PC_BROWSER;
      }
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: string) {
    const requiredPermissions = this.permissions;

    if (!requiredPermissions) {
      return user || null;
    }

    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const userPermissions: Permission[] = user.userPermissions;

    const doesPermissionMatch = userPermissions.some((eachPermission) => {
      console.debug(eachPermission.name);
      return requiredPermissions.includes(eachPermission.name);
    });

    if (!doesPermissionMatch) {
      throw new UnauthorizedException('User does not have valid permissions.');
    }

    user = { ...user, filteredSourceType: this.filteredSourceType };

    return user;
  }
}
