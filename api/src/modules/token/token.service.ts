import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { UtilsService } from 'common/utils/mapper.service';
import { AfterDate, BeforeDate } from 'common/utils/time.utils';
import { APPVars, configService } from 'config/config.service';
import { UserService } from 'modules/users/services/users.service';
import { v4 as uuid } from 'uuid';
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { UserTokenDTO } from './token.dtos';
import { UserToken } from './token.entity';
import { ICommonTokenDetails } from './token.interfaces';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
    private readonly utilsService: UtilsService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  //Primary crud functions
  async findOne(id): Promise<UserToken | undefined> {
    try {
      const token = await this.userTokenRepository.findOne({
        where: { id: id },
      });
      return token;
    } catch (error) {
      throw error;
    }
  }

  async add(userToken: UserTokenDTO): Promise<UserToken> {
    try {
      return await this.userTokenRepository.save(userToken);
    } catch (error) {
      throw error;
    }
  }

  async update(id: uuid, newUserTokenInfo: UserToken): Promise<UserToken> {
    try {
      await this.userTokenRepository.update(id, newUserTokenInfo);

      return await this.userTokenRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  // Refresh token does not make sense because we will be using only access token
  // async updateRefreshToken(
  //   existingUserToken: UserToken,
  //   newRefreshToken,
  // ): Promise<UserToken> {
  //   try {
  //     existingUserToken.refreshToken = newRefreshToken;
  //     existingUserToken.expireAtRefreshToken =
  //       this.getExpiryDateForRefreshToken(new Date());

  //     await this.userTokenRepository.update(
  //       existingUserToken.id,
  //       existingUserToken,
  //     );

  //     return await this.userTokenRepository.findOne({
  //       where: { id: existingUserToken.id },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updateAccessToken(
    existingUserToken: UserToken,
    newAccessToken,
  ): Promise<UserToken> {
    try {
      existingUserToken.accessToken = newAccessToken;
      existingUserToken.expireAtAccessToken = this.getExpiryDateForRefreshToken(
        new Date(),
      );

      await this.userTokenRepository.update(
        existingUserToken.id,
        existingUserToken,
      );

      return await this.userTokenRepository.findOne({
        where: { id: existingUserToken.id },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAccessToken(existingUserToken: UserToken): Promise<UserToken> {
    try {
      // setting current date so the token will expire immediately
      existingUserToken.expireAtAccessToken = new Date();
      existingUserToken.accessToken = '';

      await this.userTokenRepository.update(
        existingUserToken.id,
        existingUserToken,
      );

      return await this.userTokenRepository.findOne({
        where: { id: existingUserToken.id },
      });
    } catch (error) {
      throw error;
    }
  }

  // async remove(id: number): Promise<boolean> {
  //   try {
  //     const token = await this.userTokenRepository.findOne({
  //       where: { id: id },
  //     });
  //     await user.destroy();
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

  //private methods

  generateOTP(): string {
    try {
      return this.getRandomNumberBetween(999999, 100000).toString();
    } catch (error) {
      throw error;
    }
  }

  generateRandomPassword(passwordLenght) {
    var pwdChars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return Array(passwordLenght)
      .fill(pwdChars)
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
  }

  makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateUserReferalCode(): string {
    try {
      return this.makeid(6).toString();
    } catch (error) {
      throw error;
    }
  }

  getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getExpiryDateForOTP(currentDate: Date): Date {
    const expiryDate = currentDate;
    expiryDate.setHours(
      currentDate.getHours() +
        APPVars.expiryDuration.secretExpiration.otp.valueInHours,
    ); //Adding one hour
    return expiryDate;
  }

  private getExpiryDateForRefreshToken(currentDate: Date): Date {
    const expiryDate = currentDate;
    expiryDate.setDate(
      currentDate.getDate() +
        APPVars.expiryDuration.secretExpiration.refreshToken.valueInDays,
    ); //Adding 15 days
    return expiryDate;
  }

  private getExpiryDateForAccessToken(currentDate: Date): Date {
    const expiryDate = currentDate;
    expiryDate.setDate(
      currentDate.getSeconds() +
        APPVars.expiryDuration.secretExpiration.accessToken.valueInSeconds,
    ); //Adding 15 days
    return expiryDate;
  }

  isNowExpired(expireDate: Date): boolean {
    const currentDate = new Date();
    if (currentDate.getTime() >= expireDate.getTime()) {
      return false;
    }
    return true;
  }

  private addMonthsToReferralTokenExpiryDate(
    baseDate: Date,
    numberOfMonthsToBeAdded: number,
  ): Date {
    baseDate.setMonth(baseDate.getMonth() + numberOfMonthsToBeAdded); //Adding one hour
    return baseDate;
  }

  async createNewOTPUserToken(): Promise<UserToken> {
    try {
      console.log('Creating new UserToken With phoneOTP........');

      const newToken = new UserToken();
      newToken.phoneVerificationOtp = this.generateOTP();
      newToken.createdAtPhoneVerificationUserToken = new Date();
      newToken.expireAtPhoneVerificationUserToken = this.getExpiryDateForOTP(
        new Date(),
      );

      newToken.userReferralCode = this.generateUserReferalCode();
      newToken.createdAtUserReferralCode = new Date();
      newToken.expireAtUserReferralCode =
        this.addMonthsToReferralTokenExpiryDate(
          new Date(),
          APPVars.expiryDuration.entityExpiration.referralToken.valueInMonths,
        );

      console.log('Created UserToken With phoneOTP');

      return await this.userTokenRepository.save(newToken);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createNewReferralCodeUserToken(): Promise<UserToken> {
    try {
      console.log('Creating new UserToken with Referral code........');

      const newToken = new UserToken();
      newToken.userReferralCode = this.generateUserReferalCode();
      newToken.createdAtPhoneVerificationUserToken = new Date();
      newToken.expireAtPhoneVerificationUserToken = null;

      console.log('Created UserToken with Referral code.');

      return await this.userTokenRepository.save(newToken);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateOldOTPUserToken(id: uuid): Promise<UserToken> {
    try {
      const oldUserToken = await this.userTokenRepository.findOne({
        where: { id: id },
      });

      // console.debug("oldUserToken",oldUserToken)

      oldUserToken.phoneVerificationOtp = this.generateOTP();
      oldUserToken.createdAtPhoneVerificationUserToken = new Date();
      oldUserToken.expireAtPhoneVerificationUserToken =
        this.getExpiryDateForOTP(new Date());

      oldUserToken.userReferralCode = this.generateUserReferalCode();
      oldUserToken.createdAtUserReferralCode = new Date();
      oldUserToken.expireAtUserReferralCode = null;

      return await this.update(id, oldUserToken);
    } catch (error) {
      return null;
    }
  }

  async updateOldPhoneVerificationOTPUserToken(id: uuid): Promise<UserToken> {
    try {
      const oldUserToken = await this.userTokenRepository.findOne({
        where: { id: id },
      });

      // console.debug("oldUserToken",oldUserToken)

      oldUserToken.phoneVerificationOtp = this.generateOTP();
      oldUserToken.createdAtPhoneVerificationUserToken = new Date();
      oldUserToken.expireAtPhoneVerificationUserToken =
        this.getExpiryDateForOTP(new Date());

      return await this.update(id, oldUserToken);
    } catch (error) {
      return null;
    }
  }

  async updateForgotPasswordUserToken(id: uuid): Promise<UserToken> {
    try {
      const oldUserToken = await this.userTokenRepository.findOne({
        where: { id: id },
      });

      // console.debug("oldUserToken",oldUserToken)

      oldUserToken.forgotPasswordUserToken = this.generateOTP();
      oldUserToken.createdAtForgotPasswordUserToken = new Date();
      oldUserToken.expireAtForgotPasswordUserToken = this.getExpiryDateForOTP(
        new Date(),
      );

      return await this.update(id, oldUserToken);
    } catch (error) {
      return null;
    }
  }

  async getCommonTokenDetails(
    fullUserToken: UserToken | ICommonTokenDetails,
  ): Promise<ICommonTokenDetails> {
    const extractICommonTokenDetails =
      this.utilsService.extract<ICommonTokenDetails>({
        //the field in T of extract<T> should match exactly
        phoneVerificationOtp: true,
        emailVerificationUserToken: true,
        forgotPasswordUserToken: true,
      });

    return extractICommonTokenDetails(fullUserToken);
  }

  async isPhoneOTPValid(phoneNumber: string, otp: string): Promise<any> {
    try {
      const user = await this.userService.findOneByPhoneNumber(phoneNumber);

      // body:'',statusMessage: 'User with that phone number not registered',statusCode:
      //   body: string|Buffer|Uint8Array;
      //   /**
      //    * A map of response header keys and their respective values.
      //    */
      //   headers: {
      //       [key: string]: string;
      //   }
      //   /**
      //    * The HTTP status code of the response (e.g., 200, 404).
      //    */
      //   statusCode: number;
      //   /**
      //    * The HTTP status message of the response (e.g., 'Bad Request', 'Not Found')
      //    */
      //   statusMessage: string;
      // }

      // console.debug("oldUserToken",oldUserToken)
      return (
        otp === user.userToken.phoneVerificationOtp &&
        new Date() < user.userToken.expireAtPhoneVerificationUserToken
      );

      // const isPhoneOTPValid = userToken.
      // return phoneNumber.phoneVerificationOtp = this.generateOTP()
      // oldUserToken.createdAtPhoneVerificationUserToken = new Date()
      // oldUserToken.expireAtPhoneVerificationUserToken = this.getExpiryDateForOTP(new Date())

      // return await this.update(id, oldUserToken);
    } catch (error) {
      console.debug(error);
      throw error;
      // return false;
    }
  }

  async isForgotPasswordOTPValid(
    phoneNumber: string,
    otp: string,
  ): Promise<any> {
    try {
      const user = await this.userService.findOneByPhoneNumber(phoneNumber);

      return (
        otp === user.userToken.forgotPasswordUserToken &&
        new Date() < user.userToken.expireAtForgotPasswordUserToken
      );
    } catch (error) {
      console.debug(error);
      throw error;
      // return false;
    }
  }

  async checkIfReferralCodeIsValid(
    referralCode: string,
  ): Promise<GenericResponseDTO> {
    try {
      if (await this.isReferralCodeValid(referralCode)) {
        return { success: true, message: 'The referral code is valid' };
      } else {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'referralCode',
            },
            message: 'referralCode is not valid anymore',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      console.debug(error);
      throw error;
    }
  }

  async isReferralCodeValid(referralCode: string): Promise<any> {
    try {
      console.log(referralCode);
      const userToken = await this.userTokenRepository.findOne({
        where: {
          userReferralCode: referralCode,
          isDeleted: false,
          // createdAtUserReferralCode: AfterDate(new Date()),
          // expireAtUserReferralCode: BeforeDate(new Date()),
        },
      });

      if (userToken) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.debug(error);
      throw error;
      // return false;
    }
  }

  async returnUserIfValidReferralCode(referralCode: string): Promise<any> {
    try {
      const userToken = await this.userTokenRepository.findOne({
        where: {
          userReferralCode: referralCode,
          isDeleted: false,
          createdAtUserReferralCode: LessThanOrEqual(new Date()),
          expireAtUserReferralCode: MoreThan(new Date()),
        },
        relations: ['associatedUser'],
      });

      if (userToken) {
        return userToken.associatedUser;
      } else {
        return null;
      }
    } catch (error) {
      console.debug(error);
      throw error;
      // return false;
    }
  }

  // async isAccessTokenValid(referralCode: string): Promise<any> {
  //   try {
  //     const userToken = await this.userTokenRepository.findOne({
  //       where: {
  //         userReferralCode: referralCode,
  //         isDeleted: false,
  //         createdAtUserReferralCode: AfterDate(new Date()),
  //         // expireAtUserReferralCode: BeforeDate(new Date()),
  //       },
  //     });

  //     if (userToken) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     console.debug(error);
  //     throw error;
  //     // return false;
  //   }
  // }
}
