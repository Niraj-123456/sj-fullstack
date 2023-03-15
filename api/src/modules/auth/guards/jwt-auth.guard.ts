import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  FilteredClientSourceTypeEnum,
  FilteredSourceTypeWithAnonymityEnum,
} from 'common/constants/enum-constant';
import { APPVars } from 'config/config.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    // if (err || !user) {
    //   throw err || new UnauthorizedException();
    // }

    // if (!user) {
    //   console.debug('User', user);
    // }
    // if (info) {
    //   console.debug('Info', info);
    // }
    // if (err) {
    //   console.debug('Err', err);
    // }
    return user;
  }
}

@Injectable()
//JWT is optinal but MobileClientAPI key is compulsory
export class OptionalJwtCompulsoryMobileClientApiGuard extends AuthGuard(
  'jwt',
) {
  // requesterType: APPVars;
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (
      request.headers['sj-client-api-key'] !==
      '6df22a6a-c971-493f-9161-6ecfc72ddc35'
    ) {
      return false;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    return user;
  }
}

@Injectable()
//JWT is optinal but API key is compulsory
export class OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard extends AuthGuard(
  'jwt',
) {
  filteredSourceType: FilteredClientSourceTypeEnum;
  filteredSourceTypeWithAnonymity: FilteredSourceTypeWithAnonymityEnum;

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    let validAPIKeys = [
      APPVars.clientKeys.androidAppClientKey,
      APPVars.clientKeys.androidBrowserClientKey,
      APPVars.clientKeys.iosAppClientKey,
      APPVars.clientKeys.iosBrowserClientKey,
      APPVars.clientKeys.pcBrowserKey,
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

    //Till now we have checked the validity of the keys
    // Now in the next function, we will populate other variables such as anonymity
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.debug('Inside jwt', user);

    ///////////////////////////////////////////
    //no-user case
    if (!user) {
      // we decide the source type based on the filteredSourceType created
      if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.ANDROID_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromAndroidBrowser;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.ANDROID_APP
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromAndroidApp;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.IOS_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromIOSBrowser;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.IOS_APP
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromIosApp;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.PC_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromPcBrowser;
      } else {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousWithoutSource;
      }
    } else {
      // Case where User is extracted from jwt
      // we decide the filteredSourceTypeWithAnonymity based on the filteredSourceType created
      if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.ANDROID_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromAndroidBrowser;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.ANDROID_APP
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromAndroidApp;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.IOS_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromIOSBrowser;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.IOS_APP
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromIosApp;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.PC_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromPcBrowser;
      } else {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserWithoutSource;
      }
    }

    ///////////////////////////////////////////
    user = {
      ...user,
      filteredSourceType: this.filteredSourceType,
      filteredSourceTypeWithAnonymity: this.filteredSourceTypeWithAnonymity,
    };
    return user;
  }
}

export class OptionalJwtButCompulsoryClientOrStaffApiKeyToGetTheClientGuard extends AuthGuard(
  'jwt',
) {
  filteredSourceType: FilteredClientSourceTypeEnum;
  filteredSourceTypeWithAnonymity: FilteredSourceTypeWithAnonymityEnum;

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

    //Till now we have checked the validity of the keys
    // Now in the next function, we will populate other variables such as anonymity
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.debug('Inside jwt', user);

    ///////////////////////////////////////////
    //no-user case
    if (!user) {
      // we decide the source type based on the filteredSourceType created
      if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.ANDROID_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromAndroidBrowser;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.ANDROID_APP
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromAndroidApp;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.IOS_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromIOSBrowser;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.IOS_APP
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromIosApp;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.PC_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousFromPcBrowser;
      } else {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.AnonymousWithoutSource;
      }
    } else {
      // Case where User is extracted from jwt
      // we decide the filteredSourceTypeWithAnonymity based on the filteredSourceType created
      if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.ANDROID_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromAndroidBrowser;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.ANDROID_APP
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromAndroidApp;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.IOS_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromIOSBrowser;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.IOS_APP
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromIosApp;
      } else if (
        this.filteredSourceType === FilteredClientSourceTypeEnum.PC_BROWSER
      ) {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserFromPcBrowser;
      } else {
        this.filteredSourceTypeWithAnonymity =
          FilteredSourceTypeWithAnonymityEnum.UserWithoutSource;
      }
    }

    ///////////////////////////////////////////
    user = {
      ...user,
      filteredSourceType: this.filteredSourceType,
      filteredSourceTypeWithAnonymity: this.filteredSourceTypeWithAnonymity,
    };
    return user;
  }
}

export class CompulsoryJwtAndClientApiKeyToGetTheClientGuard extends AuthGuard(
  'jwt',
) {
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

  handleRequest(err, user, info) {
    if (!user || !user.userToken.accessToken) {
      throw new HttpException('Invalid Bearer token', HttpStatus.UNAUTHORIZED);
    }

    user = { ...user, filteredSourceType: this.filteredSourceType };
    return user;
  }
}

export class CompulsoryJwtAndStaffApiKeyToGetTheClientGuard extends AuthGuard(
  'jwt',
) {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    let validAPIKeys = [APPVars.staffKeys.staffAdminKey];
    const request = context.switchToHttp().getRequest();
    const apiKeyFromClient = request.headers['sj-client-api-key'];

    // check if the key is valid
    // TODO there is function getClientTypeByApiKey in Auth service , use that to reduce redundancy
    if (!validAPIKeys.includes(apiKeyFromClient)) {
      throw new UnauthorizedException('Expecting valid client api key');
      // return false;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (!user || !user.userToken.accessToken) {
      throw new HttpException('Invalid Bearer token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}

export class CompulsoryJwtAndOneApiKeyToGetTheUserGuard extends AuthGuard(
  'jwt',
) {
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
      APPVars.serviceProviderKeys.servicePAdminKey,

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

  handleRequest(err, user, info) {
    if (!user || !user.userToken.accessToken) {
      throw new HttpException('Invalid Bearer token', HttpStatus.UNAUTHORIZED);
    }

    user = { ...user, filteredSourceType: this.filteredSourceType };
    return user;
  }
}
