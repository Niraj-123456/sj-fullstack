import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

class ConfigService {
  constructor(private env: { [key: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = process.env[`${key}`];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return process.env.NODE_API_PORT || true;
  }

  public isProduction() {
    return process.env.MODE === 'prod';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    // SeederOptions // DataSourceOptions & // &
    const migrationString = `migration-${process.env.MODE}`;

    return {
      type: 'postgres',

      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,

      entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],

      migrationsTableName: 'migrations',

      migrations: [path.join(__dirname, `../database/migrations/*{.ts,.js}`)],

      // synchronize: process.env.MODE === "dev",
      synchronize: true,

      // cli: {
      //   migrationsDir: `src/database/migrations`,
      // },

      // ssl: this.isProduction(),
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      ssl: false,

      // cache: true,
      logging: true,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USERNAME',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',

  'JWT_SECRET',
  'DEFAULT_PASSPORT_STRATEGY',

  'MODE',

  'NEXT_PUBLIC_PC_BROWSER_KEY_CLIENT_KEY',
  'NEXT_PUBLIC_ANDROID_BROWSER_CLIENT_KEY',
  'NEXT_PUBLIC_ANDROID_APP_CLIENT_KEY',
  'NEXT_PUBLIC_IOS_BROWSER_CLIENT_KEY',
  'NEXT_PUBLIC_IOS_APP_CLIENT_KEY',

  'REFERRAL_DISCOUNT_PERCENTAGE',
  'REFEREE_DISCOUNT_PERCENTAGE',
  'USER_REFERRAL_TOKEN_EXPIRY_PERIOD_IN_MONTH',

  'NEXT_PUBLIC_SUPERADMIN_KEY',

  'SPARROW_SMS_TOKEN',
  'SMS_SENDER',
]);
export { configService };

export const APPVars = {
  clientKeys: {
    pcBrowserKey: process.env.NEXT_PUBLIC_PC_BROWSER_KEY_CLIENT_KEY,
    androidBrowserClientKey: process.env.NEXT_PUBLIC_ANDROID_BROWSER_CLIENT_KEY,
    androidAppClientKey: process.env.NEXT_PUBLIC_ANDROID_APP_CLIENT_KEY,
    iosBrowserClientKey: process.env.NEXT_PUBLIC_IOS_BROWSER_CLIENT_KEY,
    iosAppClientKey: process.env.NEXT_PUBLIC_IOS_APP_CLIENT_KEY,
  },
  superAdminKey: {
    superAdminKey: process.env.NEXT_PUBLIC_SUPERADMIN_KEY,
  },
  staffKeys: {
    staffAdminKey: process.env.NEXT_PUBLIC_STAFF_ADMIN_KEY,
  },
  serviceProviderKeys: {
    servicePAdminKey: process.env.NEXT_PUBLIC_SERVICE_PROVIDER_KEY,
  },
  jwtSecrets: {
    passport: {
      defaultStrategy: process.env.DEFAULT_PASSPORT_STRATEGY,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  },
  expiryDuration: {
    secretExpiration: {
      otp: {
        valueInHours: 1,
        timePeriod: 'h',
        timeValueString: '1h',
      },
      accessToken: {
        // valueInSeconds: 40,
        // timePeriod: 's',
        // timeValueString: '40s',

        valueInSeconds: 120,
        timePeriod: 's',
        timeValueString: '120s',
      },
      // RefreshToken: {
      //   valueInDays: 15,
      //   timePeriod: 'd',
      //   timeValueString: '15d',
      // },
      refreshToken: {
        valueInDays: 86400,
        timePeriod: 's',
        timeValueString: '86400s',
      },
    },
    entityExpiration: {
      bannerAds: {
        valueInDays: 10,
        timePeriod: 'd',
        timeValueString: '10d',
      },
      sales: {
        valueInDays: 10,
        timePeriod: 'd',
        timeValueString: '10d',
      },
      referralToken: {
        valueInMonths: parseInt(
          process.env.USER_REFERRAL_TOKEN_EXPIRY_PERIOD_IN_MONTH,
        ),
        timePeriod: `${process.env.USER_REFERRAL_TOKEN_EXPIRY_PERIOD_IN_MONTH}m`,
        timeValueString: `${process.env.USER_REFERRAL_TOKEN_EXPIRY_PERIOD_IN_MONTH}m`,
      },
    },
  },

  AWSVars: {
    dev: {
      AWS_ACCESS_KEY: 'AKIAZABBRQRUCIIQXUEP',
      AWS_SECRET_KEY: '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',
      AWS_S3_BUCKET: 'sahaj-nepal',
      AWS_REGION: 'us-east-2',
      AWS_S3_BASE_PROJECT_PATH_COMMON: 'public/dev/images/product-images',
      // AWS_S3_BUCKET_PATH_FOR_BRAND_IMAGE: 'public/dev/images/brand-images',
      AWS_S3_BUCKET_PATH_FOR_SERVICE_IMAGE: 'public/dev/images/service-images',
      // AWS_S3_BUCKET_PATH_FOR_BUSINESS_IMAGE: 'public/dev/images/business-images',

      // AWS_S3_BUCKET_PATH_FOR_BUSINESS_DOCS: 'public/dev/documents/business-docs',

      // AWS_S3_BUCKET_PATH_FOR_STORY: 'public/dev/media/story',
      // AWS_S3_BUCKET_PATH_FOR_BANNER_AD_IMAGE: 'public/dev/images/banner-ads',
      // AWS_S3_BUCKET_PATH_FOR_SALES_IMAGE: 'public/dev/images/sales',
    },
    stage: {
      AWS_ACCESS_KEY: 'AKIAZABBRQRUCIIQXUEP',
      AWS_SECRET_KEY: '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',
      AWS_S3_BUCKET: 'choose-my-basket',
      AWS_REGION: 'us-east-2',

      // AWS_S3_BUCKET_PATH_FOR_PRODUCT_IMAGE: 'public/stage/images/product-images',
      // AWS_S3_BUCKET_PATH_FOR_BRAND_IMAGE: 'public/stage/images/brand-images',
      AWS_S3_BUCKET_PATH_FOR_SERVICE_IMAGE:
        'public/stage/images/service-images',
      // AWS_S3_BUCKET_PATH_FOR_BUSINESS_IMAGE: 'public/stage/images/business-images',

      // AWS_S3_BUCKET_PATH_FOR_BUSINESS_DOCS: 'public/stage/documents/business-docs',

      // AWS_S3_BUCKET_PATH_FOR_STORY: 'public/stage/media/story',
      // AWS_S3_BUCKET_PATH_FOR_BANNER_AD_IMAGE: 'public/stage/images/banner-ads',
      // AWS_S3_BUCKET_PATH_FOR_SALES_IMAGE: 'public/stage/images/sales',
    },
    prod: {
      AWS_ACCESS_KEY: 'AKIAZABBRQRUCIIQXUEP',
      AWS_SECRET_KEY: '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',
      AWS_S3_BUCKET: 'choose-my-basket',
      AWS_REGION: 'us-east-2',

      // AWS_S3_BUCKET_PATH_FOR_PRODUCT_IMAGE: 'public/prod/images/product-images',
      // AWS_S3_BUCKET_PATH_FOR_BRAND_IMAGE: 'public/prod/images/brand-images',
      AWS_S3_BUCKET_PATH_FOR_SERVICE_IMAGE: 'public/prod/images/service-images',
      // AWS_S3_BUCKET_PATH_FOR_BUSINESS_IMAGE: 'public/prod/images/business-images',

      // AWS_S3_BUCKET_PATH_FOR_BUSINESS_DOCS: 'public/prod/documents/business-docs',

      // AWS_S3_BUCKET_PATH_FOR_STORY: 'public/prod/media/story',
      // AWS_S3_BUCKET_PATH_FOR_BANNER_AD_IMAGE: 'public/prod/images/banner-ads',
      // AWS_S3_BUCKET_PATH_FOR_SALES_IMAGE: 'public/prod/images/sales',
    },
  },
};
