import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Logger,
  forwardRef,
  Inject,
} from '@nestjs/common';

// import { config } from '../../../config/config';
import {
  RegisterPhoneNumberDTO,
  SetPasswordDTO,
  LoginUserDTO,
  ResendOTPDTO,
  SubmitOTPDTO,
  UpdateRefreshTokenDTO,
  DeleteAccessTokenDTO,
  SetNewPasswordDTO,
  RegisterEmailDTO,
  SubmitForgotPasswordOTPDTO,
  RegisterStaffDTO,
} from '../dtos/signup-signin.dto';
import // IPhoneRegisterResponse,
// ILoginResponse,
// ISubmitOTPResponse,
// IUpdateAccessTokenResponse,
// IUpdateRefreshTokenResponse,
// ILogoutResponse,
'../interfaces/response.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  IAccessPayload,
  IRefreshPayload,
} from '../interfaces/payload.interface';
// import { twillioSmsService } from 'modules/sms/sms.service';
import { ICommonUserDetails } from 'modules/users/interfaces/user.interface';
import ConfigService from 'aws-sdk/clients/configservice';
import { APPVars, configService } from 'config/config.service';
import { UserToken } from 'modules/token/token.entity';
import {
  CreateUserWithEmailDTO,
  ForgotPasswordDTO,
} from 'modules/users/user.dtos';
import { UserService } from 'modules/users/services/users.service';
import { UserTokenService } from 'modules/token/token.service';
import { SparrowSMSService } from 'modules/sms/sms.service';
import { User } from 'modules/users/users.entity';
import {
  DefaultServiceProviderPermissions,
  DefaultStaffPermissions,
  DiscountExpirationTypeEnum,
  DiscountOfferingTypeEnum,
  DiscountReceivedNatureEnum,
  DiscountUserAssociationTypeEnum,
  FilteredClientSourceTypeEnum,
  RoleTypeEnum,
} from 'common/constants/enum-constant';
import {
  EmailSubscriptionRegisterResponseDTO,
  ILoginResponseDTO,
  IPhoneRegisterResponseDTO,
  ISubmitOTPResponseDTO,
  IUpdateAccessTokenResponseDTO,
} from '../interfaces/response.interface';
import { CreateDiscountDTO } from 'modules/discount/discount.dtos';
import { DiscountService } from 'modules/discount/discount.service';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { generateUUID } from 'common/utils/uuid.utils';
import { Role } from 'modules/role/role.entity';
import { RoleService } from 'modules/role/role.service';
import { userInfo } from 'os';
import { Discount } from 'modules/discount/discount.entity';
import { PermissionService } from 'modules/permission/permission.service';
import { PlayerStreamerContext } from 'twilio/lib/rest/media/v1/playerStreamer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
    // private readonly twillioSmsService: TwillioSMSService,
    private readonly sparrowSmsService: SparrowSMSService,

    private readonly discountService: DiscountService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  private readonly saltRounds = 10;
  private doesSendSms = JSON.parse(process.env.DOES_SEND_SMS);
  private readonly referralDiscountPercentage = parseInt(
    process.env.REFERRAL_DISCOUNT_PERCENTAGE,
  );
  private readonly refereeDiscountPercentage = parseInt(
    process.env.REFEREE_DISCOUNT_PERCENTAGE,
  );

  // TODO later try to use the same function for Auth service
  getClientTypeByApiKey(apiKeyFromClient: string) {
    let validAPIKeys = [
      APPVars.clientKeys.androidAppClientKey,
      APPVars.clientKeys.androidBrowserClientKey,
      APPVars.clientKeys.iosAppClientKey,
      APPVars.clientKeys.iosBrowserClientKey,
      APPVars.clientKeys.pcBrowserKey,
    ];

    let filteredSourceType: string;

    // check if the key is valid
    if (!validAPIKeys.includes(apiKeyFromClient)) {
      throw new UnauthorizedException('Expecting valid client api key');
      return null;
    } else {
      // if valid, now, check for which type of client this is
      if (apiKeyFromClient === APPVars.clientKeys.androidAppClientKey) {
        filteredSourceType = FilteredClientSourceTypeEnum.ANDROID_APP;
      } else if (
        apiKeyFromClient === APPVars.clientKeys.androidBrowserClientKey
      ) {
        filteredSourceType = FilteredClientSourceTypeEnum.ANDROID_BROWSER;
      } else if (apiKeyFromClient === APPVars.clientKeys.iosAppClientKey) {
        filteredSourceType = FilteredClientSourceTypeEnum.IOS_APP;
      } else if (apiKeyFromClient === APPVars.clientKeys.iosBrowserClientKey) {
        filteredSourceType = FilteredClientSourceTypeEnum.IOS_BROWSER;
      } else if (apiKeyFromClient === APPVars.clientKeys.pcBrowserKey) {
        filteredSourceType = FilteredClientSourceTypeEnum.PC_BROWSER;
      }

      return filteredSourceType;
    }
  }

  //#When user provides email for Subscription to newsletter
  async registerUserViaEmailForNewsLetterSubscription(
    userDetails: RegisterEmailDTO,
  ): Promise<EmailSubscriptionRegisterResponseDTO> {
    try {
      const user = await this.userService.findOneWithEmail(userDetails.email);

      let finalUser: User;
      if (!user) {
        // there is no user with the email, we first register the email
        // there is no need to send OTP like when we register a user from a phoneNumber

        console.log('Registering new user with email subscription on..... ');

        let userDetailsDTO = new CreateUserWithEmailDTO();
        userDetailsDTO.email = userDetails.email;
        userDetailsDTO.isEmailSubscribedForNewsLetter = true;

        finalUser = await this.userService.addUserWithEmailOnly(userDetailsDTO);
      } else {
        // if there is already an user with that email.
        // we simply update the Email subscription boolean
        if (user.isEmailSubscribedForNewsLetter) {
          const commonDetailedUser =
            await this.userService.getCommonUserDetails(user);

          return {
            success: true,
            data: { user: commonDetailedUser },
            message: 'The email user already subscribed to newsletter.',
          };
        } else {
          user.isEmailSubscribedForNewsLetter = true;

          finalUser = await this.userService.updateWholeEntity(user);
        }
      }
      if (!finalUser) {
        throw new HttpException(
          {
            success: false,
            data: {},
            message: 'Error while creating a new user with that email',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (finalUser) {
        console.log('Actual saved user : ', finalUser);
        const commonDetailedUser = await this.userService.getCommonUserDetails(
          finalUser,
        );
        return {
          success: true,
          data: { user: commonDetailedUser },
          message: 'The email user is now subscribed to newsletter.',
        };
      }
    } catch (error) {
      throw new error();
    }
  }

  async createACompleteNewUser(
    userDetails: RegisterPhoneNumberDTO,
    referrerUser: User,
  ): Promise<IPhoneRegisterResponseDTO> {
    console.debug('Inside new user registration:');

    const newUser = await this.userService.addUserWithMoreThanPhoneOrEmail(
      userDetails,
    );
    if (!newUser) {
      throw new HttpException(
        'Error while registering new phone number.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (newUser) {
      console.debug('User created');
      // if referrerUser exists then add referrer and referee discount to both
      if (referrerUser) {
        // add referrer discounts

        let referrerDiscount = new CreateDiscountDTO();
        referrerDiscount.discountCode = userDetails.referralCode;
        referrerDiscount.receivedNature = DiscountReceivedNatureEnum.Referrer;
        referrerDiscount.offeringType = DiscountOfferingTypeEnum.Percentage;
        referrerDiscount.discountedPercentage = this.referralDiscountPercentage;
        referrerDiscount.expirationType =
          DiscountExpirationTypeEnum.ResuableCount;
        referrerDiscount.initialReusuableCount = 1; // one time use only
        referrerDiscount.userAssociation =
          DiscountUserAssociationTypeEnum.SingleUserAssociation;
        if (userDetails.referralCode) {
          referrerDiscount.discountCode = userDetails.referralCode;
        }

        referrerDiscount.linkerUUID = generateUUID();
        await this.discountService.addDiscount(
          referrerUser,
          [],
          referrerDiscount,
        );

        console.debug('Referral Discount created');

        // add referee discounts
        let refereeDiscount = new CreateDiscountDTO();
        refereeDiscount.discountCode = userDetails.referralCode;
        refereeDiscount.receivedNature = DiscountReceivedNatureEnum.Referee;
        refereeDiscount.offeringType = DiscountOfferingTypeEnum.Percentage;
        refereeDiscount.discountedPercentage = this.refereeDiscountPercentage;
        refereeDiscount.expirationType =
          DiscountExpirationTypeEnum.ResuableCount;
        refereeDiscount.initialReusuableCount = 1; // one time use only
        refereeDiscount.userAssociation =
          DiscountUserAssociationTypeEnum.SingleUserAssociation;
        if (userDetails.referralCode) {
          refereeDiscount.discountCode = userDetails.referralCode;
        }
        refereeDiscount.linkerUUID = referrerDiscount.linkerUUID;
        await this.discountService.addDiscount(newUser, [], refereeDiscount);
        console.debug('Referee Discount created');
      }

      const commonDetailedUser = await this.userService.getCommonUserDetails(
        newUser,
      );
      // console.debug("only common details user",commonDetailedUser)

      if (this.doesSendSms) {
        // await this.twillioSmsService.sendSMS(
        //   `+977${commonDetailedUser.phoneNumber}`,
        //   `Your Sahaj OTP is ${newUser.userToken.phoneVerificationOtp} and it is valid for one hour only.`,
        // );
        await this.sparrowSmsService.sendSMS(
          process.env.SMS_SENDER,
          commonDetailedUser.phoneNumber, // It should be the identity provided to you.
          `Your Sahaj OTP is ${newUser.userToken.phoneVerificationOtp} and it is valid for one hour only.`,
        );
      }
      return {
        success: true,
        data: { user: commonDetailedUser },
        message: 'The phone number is registered in the system.',
      };
    }
  }

  async registerAlreadyExistingUser(
    userDetails: RegisterPhoneNumberDTO,
    alreadyExistingUser: User,
    referrerUser: User,
  ): Promise<IPhoneRegisterResponseDTO> {
    console.debug('Inside already existing user registration:');
    // if phone number is already verified, we cannot create new user
    if ((await alreadyExistingUser).isPhoneNumberVerified) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'phoneNumber',
          },
          message: 'Phone number is already registered and verified',
        },
        HttpStatus.CONFLICT,
      );
    }
    // that means phone number is registered but not verified.. we can update the phone userToken
    // refreshing phone otp and referral code
    const userToken = await this.userTokenService.updateOldOTPUserToken(
      alreadyExistingUser.userToken.id,
    );

    if (!userToken) {
      throw new HttpException(
        'Error while updating OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    //updating details
    if (userDetails.email) {
      alreadyExistingUser.email = userDetails.email;
    }
    if (userDetails.firstName) {
      alreadyExistingUser.firstName = userDetails.firstName;
    }
    if (userDetails.middleName) {
      alreadyExistingUser.middleName = userDetails.middleName;
    }
    if (userDetails.lastName) {
      alreadyExistingUser.lastName = userDetails.lastName;
    }
    if (userDetails.dob) {
      alreadyExistingUser.dob = userDetails.dob;
    }
    if (userDetails.gender) {
      alreadyExistingUser.gender = userDetails.gender;
    }
    if (userDetails.fullAddress) {
      alreadyExistingUser.fullAddress = userDetails.fullAddress;
    }

    if (userDetails.landlineNumber) {
      alreadyExistingUser.landlineNumber = userDetails.landlineNumber;
    }

    const updatedUser = await this.userService.update(
      alreadyExistingUser.id,
      alreadyExistingUser,
    );

    if (!updatedUser) {
      throw new HttpException(
        'Error while updating the existing phone number.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // if referrerUser exists in this request , we handle already created referrer and referee discounts
    if (referrerUser) {
      let alreadyExistingRefereeDiscount: Discount =
        alreadyExistingUser.associatedSingleDiscounts.filter((eachDiscount) => {
          eachDiscount.receivedNature == DiscountReceivedNatureEnum.Referee &&
            eachDiscount.discountCode == userDetails.referralCode;
        })[0];

      // if alreadyReferee doesnot exist then both referee and referer discounts also cannot exist so we create new discounts
      if (!alreadyExistingRefereeDiscount) {
        // add referer discount
        let referrerDiscount = new CreateDiscountDTO();
        referrerDiscount.receivedNature = DiscountReceivedNatureEnum.Referrer;
        referrerDiscount.offeringType = DiscountOfferingTypeEnum.Percentage;
        referrerDiscount.discountedPercentage = this.referralDiscountPercentage;
        referrerDiscount.expirationType =
          DiscountExpirationTypeEnum.ResuableCount;
        referrerDiscount.initialReusuableCount = 1; // one time use only
        referrerDiscount.userAssociation =
          DiscountUserAssociationTypeEnum.SingleUserAssociation;
        if (userDetails.referralCode) {
          referrerDiscount.discountCode = userDetails.referralCode;
        }
        referrerDiscount.linkerUUID = generateUUID();
        await this.discountService.addDiscount(
          referrerUser,
          [],
          referrerDiscount,
        );

        // add referee discount
        let refereeDiscount = new CreateDiscountDTO();
        refereeDiscount.discountCode = userDetails.referralCode;
        refereeDiscount.receivedNature = DiscountReceivedNatureEnum.Referee;
        refereeDiscount.offeringType = DiscountOfferingTypeEnum.Percentage;
        refereeDiscount.discountedPercentage = this.refereeDiscountPercentage;
        refereeDiscount.expirationType =
          DiscountExpirationTypeEnum.ResuableCount;
        refereeDiscount.initialReusuableCount = 1; // one time use only
        refereeDiscount.userAssociation =
          DiscountUserAssociationTypeEnum.SingleUserAssociation;
        if (userDetails.referralCode) {
          refereeDiscount.discountCode = userDetails.referralCode;
        }
        refereeDiscount.linkerUUID = referrerDiscount.linkerUUID;
        await this.discountService.addDiscount(
          updatedUser,
          [],
          refereeDiscount,
        );
      } else {
        // if the referee discount does exist, we make sure both referer and referee are also present and are disabled by the end
        let alreadyExistingRefererDiscount: Discount =
          referrerUser.associatedSingleDiscounts.filter((eachDiscount) => {
            eachDiscount.receivedNature ==
              DiscountReceivedNatureEnum.Referrer &&
              eachDiscount.linkerUUID ==
                alreadyExistingRefereeDiscount.linkerUUID;
          })[0];

        if (!alreadyExistingRefererDiscount) {
          // Add new referrer discount here
          let referrerDiscount = new CreateDiscountDTO();
          referrerDiscount.discountCode = userDetails.referralCode;
          referrerDiscount.receivedNature = DiscountReceivedNatureEnum.Referrer;
          referrerDiscount.offeringType = DiscountOfferingTypeEnum.Percentage;
          referrerDiscount.discountedPercentage =
            this.referralDiscountPercentage;
          referrerDiscount.expirationType =
            DiscountExpirationTypeEnum.ResuableCount;
          referrerDiscount.initialReusuableCount = 1; // one time use only
          referrerDiscount.userAssociation =
            DiscountUserAssociationTypeEnum.SingleUserAssociation;
          if (userDetails.referralCode) {
            referrerDiscount.discountCode = userDetails.referralCode;
          }
          referrerDiscount.linkerUUID =
            alreadyExistingRefereeDiscount.linkerUUID;
          await this.discountService.addDiscount(
            referrerUser,
            [],
            referrerDiscount,
          );
        }

        // disable both discounts
        alreadyExistingRefererDiscount.isDiscountUsable = false;
        await this.discountService.updateDiscount(
          alreadyExistingRefererDiscount,
        );

        alreadyExistingRefereeDiscount.isDiscountUsable = false;
        await this.discountService.updateDiscount(
          alreadyExistingRefereeDiscount,
        );
      }
    }

    const commonDetailedUser = await this.userService.getCommonUserDetails(
      updatedUser,
    );
    // console.debug("only common details user",commonDetailedUser)

    if (this.doesSendSms) {
      // await this.twillioSmsService.sendSMS(
      //   `+977${commonDetailedUser.phoneNumber}`,
      //   `Your New Sahaj OTP is ${userToken.phoneVerificationOtp} and it is valid for one hour only.`,
      // );

      await this.sparrowSmsService.sendSMS(
        process.env.SMS_SENDER,
        commonDetailedUser.phoneNumber, // It should be the identity provided to you.
        `Your New Sahaj OTP is ${userToken.phoneVerificationOtp} and it is valid for one hour only.`,
      );
    }

    return {
      success: true,
      data: { user: commonDetailedUser },
      message:
        'The phone number was registered in the system but not verified. New OTP has been reset.',
    };
  }
  //#region Single User Auth Services
  async register(
    userDetails: RegisterPhoneNumberDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    try {
      console.debug('1');
      const user = await this.userService.findOneByPhoneNumber(
        userDetails.phoneNumber,
      );
      console.debug('2');

      if (!userDetails.fullName) {
        userDetails.fullName =
          userDetails.firstName + ' ' + userDetails.lastName;
      }

      // Setting Roles
      console.log('Figuring out if the referral code is valid ........');
      let referrerUser: User;
      if (userDetails.referralCode) {
        // if referral code is valid , add existing discount due to referralCode to both referrar and referee
        referrerUser =
          await this.userTokenService.returnUserIfValidReferralCode(
            userDetails.referralCode,
          );

        if (!referrerUser) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'referralCode',
              },
              message: 'Invalid Referral Code',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        userDetails.isUserReferred = true;
      }

      if (user) {
        // Setting Roles
        console.log('Setting Role to the user ........');
        let userRole: Role;
        if (!userDetails.roleId) {
          userRole = await this.roleService.findByName(
            RoleTypeEnum.DEFAULTCLIENT,
          );
        } else {
          // default they will be client
          userRole = await this.roleService.findByName(
            RoleTypeEnum.DEFAULTCLIENT,
          );
        }

        if (!userRole) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'role',
              },
              message: 'Error fetching ROLE. Please contact the administrator.',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        user.userRole = userRole;

        return await this.registerAlreadyExistingUser(
          userDetails,
          user,
          referrerUser,
        );
      }
      // if not user yet with that phone number, then add the user
      else {
        return await this.createACompleteNewUser(userDetails, referrerUser);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resendOrChangeOTP(
    userDetails: ResendOTPDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    try {
      const user = await this.userService.findOneByPhoneNumber(
        userDetails.phoneNumber,
      );

      // if the number is not registered, no need to resend the otp
      if (!user) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message:
              'Sorry the phone number should be registered first  before you resend the otp to verify.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // before sending otp, the user has to be unverified
      if (user.isPhoneNumberVerified) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message: 'Sorry the phone number is already verified.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      //refreshing phone otp
      const userToken = await this.userTokenService.updateOldOTPUserToken(
        user.userToken.id,
      );

      if (!userToken) {
        throw new HttpException(
          'Error while updating OTP.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const updatedUser = await this.userService.findOneByPhoneNumber(
        user.phoneNumber,
      );

      const commonDetailedUser = await this.userService.getCommonUserDetails(
        updatedUser,
      );
      // console.debug("only common details user",commonDetailedUser)

      if (this.doesSendSms) {
        // await this.twillioSmsService.sendSMS(
        //   `+977${commonDetailedUser.phoneNumber}`,
        //   `Your New OTP is ${userToken.phoneVerificationOtp} and it is valid for one hour only.`,
        // );

        await this.sparrowSmsService.sendSMS(
          process.env.SMS_SENDER,
          commonDetailedUser.phoneNumber, // It should be the identity provided to you.
          `Your New OTP is ${userToken.phoneVerificationOtp} and it is valid for one hour only.`,
        );
      }

      return {
        success: true,
        data: { user: commonDetailedUser },
        message:
          'The phone number was registered in the system but not verified. New OTP has been reset.',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async submitOTP(otpInfo: SubmitOTPDTO): Promise<ISubmitOTPResponseDTO> {
    try {
      const user = await this.userService.findOneByPhoneNumber(
        otpInfo.phoneNumber,
      );

      // if the number is not registered, no need to resend the otp
      if (!user) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message: 'Sorry the phone number is not yet registered.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      let isValid = await this.userTokenService.isPhoneOTPValid(
        otpInfo.phoneNumber,
        otpInfo.otp,
      );

      if (!isValid) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'OTP',
            },
            message: 'Invalid OTP.',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // // For user who already had registered business
      // // 1) to be verified, business should exist and business should be verified
      // if (user.business) {
      //   if (user.business.isVerifiedByStaff) {
      //     user.userType = 'VERIFIED';
      //   }
      // } else {
      //   user.userType = 'REGISTERED';
      //   user.isPhoneNumberVerified = true;
      // }
      user.isPhoneNumberVerified = true;
      user.isPasswordChangeActionPending = true;

      const newToken =
        await this.userTokenService.updateOldPhoneVerificationOTPUserToken(
          user.userToken.id,
        );

      if (!newToken) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'Error while replacing the token',
            },
            message: 'Please contact the administrator',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.userService.getUserRepository().save(user);

      return {
        success: true,
        message: 'The OTP has been successfully submitted',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async submitOTPForForgotPassword(
    otpInfo: SubmitForgotPasswordOTPDTO,
  ): Promise<ISubmitOTPResponseDTO> {
    try {
      const user = await this.userService.findOneByPhoneNumber(
        otpInfo.phoneNumber,
      );

      // if the number is not registered, no need to resend the otp
      if (!user) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message: 'Sorry the phone number is not yet registered.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const isValidForgotPasswordOT =
        await this.userTokenService.isForgotPasswordOTPValid(
          otpInfo.phoneNumber,
          otpInfo.forgotPasswordOtp,
        );

      if (!isValidForgotPasswordOT) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'Forgot Password Otp',
            },
            message: 'Invalid OTP.',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      user.isPasswordChangeActionPending = true;
      await this.userService.getUserRepository().save(user);

      return {
        success: true,
        message: 'The OTP has been validated.',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setPassword(
    setPasswordDetails: SetPasswordDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    try {
      const user = await this.userService.findOneByPhoneNumber(
        setPasswordDetails.phoneNumber,
      );

      if (!user) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message: 'Sorry the phone number is not yet registered.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // before changing the password, isPasswordChangeActionPending should be true
      if (!user.isPasswordChangeActionPending) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'OTP submission pending',
            },
            message:
              'Please submit a valid OTP first before setting the password',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const generatedHashed = await bcrypt.hashSync(
        setPasswordDetails.password,
        this.saltRounds,
      );

      if (generatedHashed === null) {
        throw new HttpException(
          'Error while creatin password hash.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      user.hashPassword = generatedHashed;
      // user.isPhoneNumberVerified = true;
      user.isPasswordSet = true;
      user.isPasswordChangeActionPending = false;

      const updatedUser = await this.userService.update(
        setPasswordDetails.phoneNumber,
        user,
      );

      if (updatedUser) {
        // const { hashPassword, ...result } = updatedUser['dataValues'];
        const result = await this.userService.getCommonUserDetails(updatedUser);
        if (updatedUser.isUserReferred) {
          await this.discountService.makeReferralAndRefereeDiscountsValidFromRefreeUser(
            updatedUser,
          );
        }

        return {
          success: true,
          data: { user: result },
          message: 'The password was set.',
        };
      } else {
        throw new HttpException(
          'Error while setting the password',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setNewPassword(
    setPasswordDetails: SetNewPasswordDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    try {
      const user = await this.userService.findOneByPhoneNumber(
        setPasswordDetails.phoneNumber,
      );

      if (!user) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message: 'Sorry the phone number is not yet registered.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // before changing the password, isPasswordChangeActionPending should be true
      if (!user.isPasswordChangeActionPending) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'OTP submission pending',
            },
            message:
              'Please submit a valid OTP first before setting the password',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const generatedHashed = await bcrypt.hashSync(
        setPasswordDetails.newPassword,
        this.saltRounds,
      );

      if (generatedHashed === null) {
        throw new HttpException(
          'Error while creatin password hash.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      user.hashPassword = generatedHashed;
      user.isPasswordSet = true;
      user.isPasswordChangeActionPending = false;

      const updatedUser = await this.userService.update(
        setPasswordDetails.phoneNumber,
        user,
      );

      if (updatedUser) {
        // const { hashPassword, ...result } = updatedUser['dataValues'];
        const result = await this.userService.getCommonUserDetails(updatedUser);

        // console.debug('Set password ', result);
        return {
          success: true,
          data: { user: result },
          message: 'The password was reset.',
        };
      } else {
        throw new HttpException(
          'Error while setting the password',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateForgotPasswordTokenUser(
    userDetails: ForgotPasswordDTO,
  ): Promise<any> {
    try {
      const user = await this.userService.findOneByPhoneNumber(
        userDetails.phoneNumber,
      );

      // if the number is not registered, no need to resend the otp
      if (!user) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message: 'Sorry the phone number is not yet registered.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      //refreshing phone otp
      const userToken =
        await this.userTokenService.updateForgotPasswordUserToken(
          user.userToken.id,
        );

      if (!userToken) {
        throw new HttpException(
          'Error while updating OTP.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const updatedUser = await this.userService.findOneByPhoneNumber(
        user.phoneNumber,
      );

      const commonDetailedUser = await this.userService.getCommonUserDetails(
        updatedUser,
      );
      // console.debug("only common details user",commonDetailedUser)

      if (this.doesSendSms) {
        // await this.twillioSmsService.sendSMS(
        //   `+977${commonDetailedUser.phoneNumber}`,
        //   `Use the OTP ${userToken.forgotPasswordUserToken} to set a new password.`,
        // );

        await this.sparrowSmsService.sendSMS(
          process.env.SMS_SENDER,
          commonDetailedUser.phoneNumber, // It should be the identity provided to you.
          `Use the OTP ${userToken.forgotPasswordUserToken} to set a new password.`,
        );
      }

      return {
        success: true,
        data: {
          user: commonDetailedUser,
          // TO BE REMOVED
          tempFrontendOTP: userToken.forgotPasswordUserToken,
        },
        message: 'OTP has been sent to the user.',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // // // async updateExistingUser(existingUser: User, newDetails: RegisterUserDTO) {
  // // //   try {
  // // //     const verificationData = {
  // // //       emailVerificationuserToken: this.generateVerificationCode(),
  // // //       expireAtEmailVerificationuserToken: this.getExpiryDate(new Date()),
  // // //       createdAtEmailVerificationuserToken: new Date(),
  // // //     };
  // // //     await this.userTokenService.update(
  // // //       existingUser.UserTokenId,
  // // //       verificationData,
  // // //     );
  // // //     // await this.businessService.update(existingUser.businessId, {
  // // //     //   name: newDetails.team,
  // // //     // });
  // // //     const details = {
  // // //       firstName: newDetails.firstName,
  // // //       lastName: newDetails.lastName,
  // // //     };
  // // //     await this.userService.update(newDetails.email, details);
  // // //     return {
  // // //       registrationuserToken: verificationData.emailVerificationuserToken,
  // // //       ...newDetails,
  // // //     };
  // // //   } catch (error) {
  // // //     throw new Error('Cannot create new user. Please try again.');
  // // //   }
  // // // }

  public async login(loginDetails: LoginUserDTO): Promise<ILoginResponseDTO> {
    try {
      const user = await this.userService.findOneByPhoneNumberWithPassword(
        loginDetails.phoneNumber,
      );

      if (!user) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message: 'Sorry the number doesnot exist.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (
        !(await this.comparePassword(loginDetails.password, user.hashPassword))
      ) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'password',
            },
            message: 'Invalid Credentials.',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // before generating token removing the hashPassword
      let userWithoutPassword = await this.userService.getCommonUserDetails(
        user,
      );

      const authUserToken = await this.generateJWTToken(userWithoutPassword);

      let updatedUserToken = await this.userTokenService.updateAccessToken(
        user.userToken,
        authUserToken.accessUserToken,
      );

      user.userToken = updatedUserToken;

      return {
        success: true,
        data: {
          user: {
            ...(await this.userService.getCommonUserDetailsLogin(user)),
            referralToken: user.userToken.userReferralCode,
          },
          authUserToken,
        },
        message: 'Successfully Logged In',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateAccessToken(
    requesterUser: User,
  ): Promise<IUpdateAccessTokenResponseDTO> {
    if (!requesterUser) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'phoneNumber',
          },
          message: 'Sorry the number doesnot exist.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const authUserToken = await this.generateNewAccessToken(requesterUser);

    return {
      success: true,
      data: authUserToken,
      message: 'Successfully updated accessToken',
    };
  }

  // async updateRefreshToken(
  //   updateRefreshTokenInfo: UpdateRefreshTokenDTO,
  // ): Promise<IUpdateRefreshTokenResponse> {
  //   const requesterUser = await this.userService.findOneByPhoneNumber(
  //     updateRefreshTokenInfo.phoneNumber,
  //   );
  //   if (!requesterUser) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         data: {
  //           errorField: 'phoneNumber',
  //         },
  //         message: 'Sorry the number doesnot exist.',
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   if (
  //     !(
  //       requesterUser.userToken.refreshToken ===
  //       updateRefreshTokenInfo.refreshToken
  //     )
  //   ) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         data: {
  //           errorField: 'refreshToken',
  //         },
  //         message: 'Sorry the refreshToken doesnot match.',
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   const authUserToken = await this.generateNewRefreshToken(requesterUser);

  //   await this.userTokenService.updateRefreshToken(
  //     requesterUser.userToken,
  //     authUserToken.refreshUserToken,
  //   );
  //   return {
  //     success: true,
  //     data: authUserToken,
  //     message: 'Successfully updated refreshToken',
  //   };
  // }

  async logout(
    user: User,
    logout: DeleteAccessTokenDTO,
  ): Promise<GenericResponseDTO> {
    console.debug(user);
    // if (!user){
    //   throw new HttpException(
    //     {
    //       success: false,
    //       data: {
    //         errorField: 'phoneNumber',
    //       },
    //       message: 'Sorry the number doesnot exist.',
    //     },
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    const requesterUser = await this.userService.findOneByPhoneNumber(
      logout.phoneNumber,
    );
    if (!requesterUser) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'phoneNumber',
          },
          message: 'Sorry the number doesnot exist.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // check if the phone number and the accessToken user match
    if (!(requesterUser.phoneNumber === user.phoneNumber)) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'phoneNumber',
          },
          message: 'Sorry the phoneNumber doesnot match.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const authUserToken = await this.generateJWTToken(user);

    let updatedUserToken = await this.userTokenService.updateAccessToken(
      user.userToken,
      authUserToken.accessUserToken,
    );

    await this.userTokenService.deleteAccessToken(requesterUser.userToken);

    return {
      success: true,
      data: null,
      message:
        'Successfully logged out out. The access token has been deleted.',
    };
  }

  // // public async verify(
  // //   verifyDetails: VerifyRefreshTokenDTO,
  // // ): Promise<IVerifyResponse> {
  // //   const user = await this.userService.findOneByPhoneNumber(
  // //     verifyDetails.phoneNumber,
  // //   );

  // //   if (!user) {
  // //     throw new HttpException(
  // //       {
  // //         success: false,
  // //         data: {
  // //           errorField: 'phoneNumber',
  // //         },
  // //         message:
  // //           'Sorry the number present in the Refresh Token doesnot exist.',
  // //       },
  // //       HttpStatus.NOT_FOUND,
  // //     );
  // //   }

  // //   const authUserToken = await this.generateJWTToken(user);

  // //   let updatedUserToken = await this.userTokenService.updateRefreshToken(
  // //     user.userToken,
  // //     authUserToken.refreshUserToken,
  // //   );

  // //   user.userToken = updatedUserToken;

  // //   return {
  // //     success: true,
  // //     data: {
  // //       user: await this.userService.getCommonUserDetails(user),
  // //       authUserToken,
  // //     },
  // //     message: 'Successfully Logged In',
  // //   };
  // // }

  private async generateJWTToken(user: ICommonUserDetails) {
    const accessUserTokenPayload: IAccessPayload = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const refreshUserTokenPayload: IRefreshPayload = {
      id: user.id,
      phoneNumber: user.phoneNumber,
    };

    return {
      accessUserToken: await this.jwtService.signAsync(accessUserTokenPayload, {
        expiresIn:
          APPVars.expiryDuration.secretExpiration.accessToken.timeValueString,
      }),
      refreshUserToken: await this.jwtService.signAsync(
        refreshUserTokenPayload,
        {
          expiresIn:
            APPVars.expiryDuration.secretExpiration.refreshToken
              .timeValueString,
        },
      ),
      accessTokenExpiresIn:
        APPVars.expiryDuration.secretExpiration.accessToken.timeValueString,
      refreshTokenExpiresIn:
        APPVars.expiryDuration.secretExpiration.refreshToken.timeValueString,
    };
  }

  private async generateNewAccessToken(user: ICommonUserDetails) {
    const accessUserTokenPayload: IAccessPayload = {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    return {
      accessUserToken: await this.jwtService.signAsync(accessUserTokenPayload, {
        expiresIn:
          APPVars.expiryDuration.secretExpiration.accessToken.timeValueString,
      }),
      accessTokenExpiresIn:
        APPVars.expiryDuration.secretExpiration.accessToken.timeValueString,
    };
  }

  // private async generateNewRefreshToken(user: ICommonUserDetails) {
  //   const refreshUserTokenPayload: IRefreshPayload = {
  //     id: user.id,
  //     phoneNumber: user.phoneNumber,
  //   };
  //   return {
  //     refreshUserToken: await this.jwtService.signAsync(
  //       refreshUserTokenPayload,
  //       {
  //         expiresIn:
  //           APPVars.expiryDuration.secretExpiration.refreshToken
  //             .timeValueString,
  //       },
  //     ),
  //     refreshTokenExpiresIn:
  //       APPVars.expiryDuration.secretExpiration.refreshToken.timeValueString,
  //   };
  // }

  // // async hashPassword(password) {
  // //   // return await bcrypt
  // //   //   .genSalt(this.saltRounds)
  // //   //   .then(salt => {
  // //   //     console.log(`Salt: ${salt}`);
  // //   //     return bcrypt.hash(password, salt);
  // //   //   })
  // //   //   .then(hash => hash)
  // //   //   .catch(err => console.error(err.message));
  // //   return await 'password';
  // // }

  private async comparePassword(enteredPassword, dbPassword): Promise<boolean> {
    return await bcrypt.compareSync(enteredPassword, dbPassword);
  }

  // // Guards methods
  // async checkIfUserExists(phoneNumber: string): Promise<User | null> {
  //   try {
  //     const user = await this.userService.findOneByPhoneNumber(phoneNumber);
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //validation logic for guard
  async validateUserForGuard(
    phoneNumber: string,
    unhashedPassword: string,
  ): Promise<any> {
    try {
      const user = await this.userService.findOneByPhoneNumber(phoneNumber);
      if (!user) {
        return null;
      }

      if (user && bcrypt.compareSync(unhashedPassword, user.hashPassword)) {
        //  const result = user.toJSON();
        //  delete result['password'];
        const { hashPassword, ...rest } = user;
        return rest;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  ////////////////////////////////////
  async registerStaff(
    userDetails: RegisterStaffDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    try {
      // For staff the phonenumber will not be an actual number but a 6 digit number which has to be unique and will be stored as phonenumber because
      // phonenumber is the only unique identifier for users
      let newStaff = new User();

      // Setting Roles
      console.log('Setting Role to the user ........');
      let userRole: Role;

      // by default they will be staff
      userRole = await this.roleService.findByName(RoleTypeEnum.DEFAULTSTAFF);

      if (!userRole) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'role',
            },
            message: 'Error fetching ROLE. Please contact the administrator.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      newStaff.userRole = userRole;

      // Setting userToken
      newStaff.userToken = await this.userTokenService.createNewOTPUserToken();

      // Providing default Staff permission
      let defaultStaffPermission =
        await this.permissionService.findByPermissionNameList(
          Object.values(DefaultStaffPermissions),
        );
      newStaff.userPermissions = defaultStaffPermission;

      //////////////////
      if (userDetails.firstName) {
        newStaff.firstName = userDetails.firstName;
      }

      if (userDetails.lastName) {
        newStaff.lastName = userDetails.lastName;
      }

      if (userDetails.dob) {
        newStaff.dob = userDetails.dob;
      }

      if (userDetails.gender) {
        newStaff.gender = userDetails.gender;
      }

      if (userDetails.fullAddress) {
        newStaff.fullAddress = userDetails.fullAddress;
      }

      if (userDetails.email) {
        newStaff.email = userDetails.email;
      }

      let randomPhoneNumber = await this.userTokenService.generateOTP();
      newStaff.phoneNumber = randomPhoneNumber;

      while (await this.userService.findOneByPhoneNumber(randomPhoneNumber)) {
        randomPhoneNumber = await this.userTokenService.generateOTP();
        newStaff.phoneNumber = randomPhoneNumber;
      }

      let randomPassword = this.userTokenService.generateRandomPassword(8);
      newStaff.hashPassword = await bcrypt.hashSync(
        randomPassword,
        this.saltRounds,
      );

      let staffInDataBase = await this.userService
        .getUserRepository()
        .save(newStaff);

      if (!staffInDataBase) {
        throw new HttpException(
          {
            success: false,
            data: {},
            message: 'Error while creating a new staff',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        data: {
          user: { ...staffInDataBase, password: randomPassword },
        },
        message: 'Staff registration is successful.',
      };

      //////////////////
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteStaff(phoneNumber: string) {
    let staffToBeDeleted = await this.userService.findOneStaffByPhoneNumber(
      phoneNumber,
    );

    staffToBeDeleted.isDeleted = true;
    return await this.userService.updateWholeEntity(staffToBeDeleted);
  }

  //////////////////////////////////// SERVICE PROVIDER ///////////////////////////////////
  async registerServiceProvider(
    userDetails: RegisterStaffDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    try {
      // For staff the phonenumber will not be an actual number but a 6 digit number which has to be unique and will be stored as phonenumber because
      // phonenumber is the only unique identifier for users
      let newServiceProvider = new User();

      // Setting Roles
      console.log('Setting Role to the user ........');
      let userRole: Role;

      // by default they will be staff
      userRole = await this.roleService.findByName(
        RoleTypeEnum.DEFAULTSERVICEPROVIDER,
      );

      if (!userRole) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'role',
            },
            message: 'Error fetching ROLE. Please contact the administrator.',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      newServiceProvider.userRole = userRole;

      // Setting userToken
      newServiceProvider.userToken =
        await this.userTokenService.createNewOTPUserToken();

      // Providing default Staff permission
      let defaultStaffPermission =
        await this.permissionService.findByPermissionNameList(
          Object.values(DefaultServiceProviderPermissions),
        );
      newServiceProvider.userPermissions = defaultStaffPermission;

      //////////////////
      if (userDetails.firstName) {
        newServiceProvider.firstName = userDetails.firstName;
      }

      if (userDetails.lastName) {
        newServiceProvider.lastName = userDetails.lastName;
      }

      if (userDetails.dob) {
        newServiceProvider.dob = userDetails.dob;
      }

      if (userDetails.gender) {
        newServiceProvider.gender = userDetails.gender;
      }

      if (userDetails.fullAddress) {
        newServiceProvider.fullAddress = userDetails.fullAddress;
      }

      if (userDetails.email) {
        newServiceProvider.email = userDetails.email;
      }

      let randomPhoneNumber = await this.userTokenService.generateOTP();
      newServiceProvider.phoneNumber = randomPhoneNumber;

      while (await this.userService.findOneByPhoneNumber(randomPhoneNumber)) {
        randomPhoneNumber = await this.userTokenService.generateOTP();
        newServiceProvider.phoneNumber = randomPhoneNumber;
      }

      let randomPassword = this.userTokenService.generateRandomPassword(8);
      newServiceProvider.hashPassword = await bcrypt.hashSync(
        randomPassword,
        this.saltRounds,
      );

      let serviceProviderInDataBase = await this.userService
        .getUserRepository()
        .save(newServiceProvider);

      if (!serviceProviderInDataBase) {
        throw new HttpException(
          {
            success: false,
            data: {},
            message: 'Error while creating a new serviceProvider',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        data: {
          user: { ...serviceProviderInDataBase, password: randomPassword },
        },
        message: 'Service Provider registration is successful.',
      };

      //////////////////
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async deleteServiceProvider(phoneNumber: string) {
    let staffToBeDeleted = await this.userService.findOneStaffByPhoneNumber(
      phoneNumber,
    );

    staffToBeDeleted.isDeleted = true;
    return await this.userService.updateWholeEntity(staffToBeDeleted);
  }

  //////////////////////////////
  async deleteCustomer(phoneNumber: string) {
    let userToBeDeleted = await this.userService.findOneClientByPhoneNumber(
      phoneNumber,
    );

    userToBeDeleted.isDeleted = true;
    return await this.userService.updateWholeEntity(userToBeDeleted);
  }
}
