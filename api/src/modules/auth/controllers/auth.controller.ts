import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Req,
  Get,
  Request,
  Delete,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  RegisterPhoneNumberDTO,
  SetPasswordDTO,
  LoginUserDTO,
  ResendOTPDTO,
  SubmitOTPDTO,
  DeleteAccessTokenDTO,
  SetNewPasswordDTO,
  RegisterEmailDTO,
  SubmitForgotPasswordOTPDTO,
  RegisterStaffDTO,
  DeleteStaffDTO,
  RegisterServiceProviderDTO,
  DeleteServiceProviderDTO,
} from '../dtos/signup-signin.dto';

import {
  EmailSubscriptionRegisterResponseDTO,
  ILoginResponseDTO,
  IPhoneRegisterResponseDTO,
  ISubmitOTPResponseDTO,
} from '../interfaces/response.interface';
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  IsClientHeaderValidGuard,
  IsSuperAdminHeaderValidGuard,
} from '../guards/client-header.guard';

import {
  CompulsoryJwtAndClientApiKeyToGetTheClientGuard,
  CompulsoryJwtAndOneApiKeyToGetTheUserGuard,
} from '../guards/jwt-auth.guard';
import { ForgotPasswordDTO } from '../../users/user.dtos';
import { GenericResponseDTO } from '../../../common/dto/response.dto';
import {
  AllPermissionsEnum,
  RoleTypeEnum,
} from 'common/constants/enum-constant';
import { JWTRolesGuard } from '../../role/role.guard';
import { JWTPermissionsGuard } from '../../permission/permission.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  ///////////////////////////////////////////////////////////////////// Client /////////////////////////////////////////////////////////////////////
  // Utimate
  @ApiOperation({
    summary: 'Registers a user email who subscribes',
    description:
      'Basically, you can use this route when you want to register a user with his email letter subscription on. This api is consumped from places like CMB Single Webapp',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: RegisterEmailDTO })
  @ApiOkResponse({ type: EmailSubscriptionRegisterResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Put('subscribe-to-email-newsletter')
  registerDuringEmailSubscription(
    @Body() userInfo: RegisterEmailDTO,
  ): // : any {
  Promise<EmailSubscriptionRegisterResponseDTO> {
    return this.authService.registerUserViaEmailForNewsLetterSubscription(
      userInfo,
    );
  }

  @ApiOperation({
    summary: 'Registers a new user',
    description:
      'Basically, you can use this route when you want to register a new user. Remember phone number is compulsory and email is optional',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: RegisterPhoneNumberDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Post('register-phonenumber')
  register(
    @Body() registrationInfo: RegisterPhoneNumberDTO,

    //Adding otp so that frontend can see...later uncomment the bellow line
  ): Promise<any> {
    // ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.register(registrationInfo);
  }

  @ApiOperation({
    summary: 'Resends a new otp',
    description:
      'Basically, you can use this route when the user want us to resend the otp. Good news the response is similar to that during registration.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: ResendOTPDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Put('resend-or-change-otp')
  resendOTP(
    @Body() registrationInfo: ResendOTPDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.resendOrChangeOTP(registrationInfo);
  }

  @ApiOperation({
    summary: 'Submits the otp',
    description:
      'Basically, the api is used when the OTP is submitted to the backend.NOTE: the validity of the OTP can be checked from success boolean in the response',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: SubmitOTPDTO })
  @ApiOkResponse({ type: ISubmitOTPResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Post('submit-otp')
  submitOTP(
    @Body() submitOtpInfo: SubmitOTPDTO,
  ): Promise<ISubmitOTPResponseDTO> {
    return this.authService.submitOTP(submitOtpInfo);
  }

  // @UseGuards(UserExistsGuard)
  @ApiOperation({
    summary: 'Set the password after otp is submitted',
    description:
      'Basically, the api is used when the password of the user has to be set .This usually happens after the otp has been submitted.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: SetPasswordDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Put('set-password')
  setPassword(
    @Body() setPasswordBody: SetPasswordDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.setPassword(setPasswordBody);
  }

  @ApiOperation({
    summary: 'Logins the user',
    description:
      'This api is used when the user wants to login. You will get accessToken and refreshToken here.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: LoginUserDTO })
  @ApiOkResponse({ type: ILoginResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Post('login')
  login(@Body() loginInfo: LoginUserDTO): Promise<ILoginResponseDTO> {
    return this.authService.login(loginInfo);
  }

  @ApiOperation({
    summary:
      'Refreshes the access token when it is expired with the help of refresh token.',
    description:
      'Basically, the api is used when your accessToken, which already has a short lifespan, expires. This request doesnot have a body. The refresh token will be expected at Bearer token in header. This api is usually consumed after login is done and other protected routes are accessed.',
  })
  @ApiHeader({ name: 'Authorization', description: 'Bearer [token]' })
  @ApiHeader({ name: 'sj-client-api-key' })
  @UseGuards(CompulsoryJwtAndOneApiKeyToGetTheUserGuard)
  @Put('/update-access-token')
  updateAccessToken(@Request() req) {
    return this.authService.updateAccessToken(req.user);
  }

  // just for checking purpose
  // @UseGuards(new JWTRolesGuard([RoleTypeEnum.DEFAULTCLIENT]))
  @UseGuards(new JWTPermissionsGuard([AllPermissionsEnum.CreateBooking]))
  @Post('/protected')
  protected(@Request() req) {
    return req.user;
  }

  // same request as update Refresh token
  // From server end, accessToken will expiry in a short duration of time and refreshToken can be delete from the database
  // From client end, all the token can be deleted
  @ApiOperation({
    summary: 'Logs  out the user of the system.',
    description:
      'Basically, the api is used when your the user clicks on the logout button. From client app perspective,that side can simply delete the stored acccessToken/refreshToken and logout the user after getting success response.',
  })
  @UseGuards(CompulsoryJwtAndOneApiKeyToGetTheUserGuard) // Using normal authentication because at this point of time, both access token and refresh token have expired
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: DeleteAccessTokenDTO })
  @Delete('/logout')
  logout(
    @Req() req,
    @Body() deleteRefreshTokenInfo: DeleteAccessTokenDTO,
  ): Promise<GenericResponseDTO> {
    return this.authService.logout(req.user, deleteRefreshTokenInfo);
  }

  // //////////// Forgot password ////////////
  @ApiOperation({
    summary: 'Send otp for forgot password',
    description:
      'Basically, you can use this route when the user want us to send an otp to set his password.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: ForgotPasswordDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Put('send-otp-for-forgot-password')
  forgotPassword(@Body() registrationInfo: ForgotPasswordDTO): Promise<any> {
    return this.authService.updateForgotPasswordTokenUser(registrationInfo);
  }

  @ApiOperation({
    summary: 'Submits forgot password otp',
    description:
      'Basically, the api is used when the Forgot password OTP is submitted to the backend.NOTE: the validity of the OTP can be checked from success boolean in the response',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: SubmitOTPDTO })
  @ApiOkResponse({ type: ISubmitOTPResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Post('submit-otp-for-forgot-password')
  submitOTPForForgotPassword(
    @Body() submitOtpInfo: SubmitForgotPasswordOTPDTO,
  ): Promise<ISubmitOTPResponseDTO> {
    return this.authService.submitOTPForForgotPassword(submitOtpInfo);
  }

  @ApiOperation({
    summary: 'Set a new password after otp is submitted',
    description:
      'Basically, the api is used when the password of the user has to be reset .This usually happens after the forgot password otp has been submitted.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: SetNewPasswordDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsClientHeaderValidGuard)
  @Put('set-new-password')
  setNewPassword(
    @Body() setPasswordBody: SetNewPasswordDTO,
  ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.setNewPassword(setPasswordBody);
  }

  @ApiOperation({
    summary: 'Delete the already existing customer',
    description:
      'Basically, this route is used when the admin needs to  delete the staff.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: DeleteStaffDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsSuperAdminHeaderValidGuard)
  @Post('delete-customer')
  deleteClient(@Body() deleteInfo: DeleteStaffDTO): Promise<any> {
    // ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.deleteCustomer(deleteInfo.phoneNumber);
  }

  ///////////////////////////////////////////////////////////////////// STAFF /////////////////////////////////////////////////////////////////////
  @ApiOperation({
    summary: 'Registers a new staff',
    description:
      'Basically, this route is used when the admin needs to  register the staff. Remember for staff the phone number is not acutal number but a randomly generated number .Also password is automatically generated.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: RegisterStaffDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsSuperAdminHeaderValidGuard)
  @Post('register-staff')
  registerStaff(@Body() registrationInfo: RegisterStaffDTO): Promise<any> {
    // ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.registerStaff(registrationInfo);
  }

  @ApiOperation({
    summary: 'Delete the already existing staff',
    description:
      'Basically, this route is used when the admin needs to  delete the staff.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: DeleteStaffDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsSuperAdminHeaderValidGuard)
  @Post('delete-staff')
  deleteStaff(@Body() deleteInfo: DeleteStaffDTO): Promise<any> {
    // ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.deleteStaff(deleteInfo.phoneNumber);
  }

  //////////////////////////////////////////// SERVICE PROVIDER /////////////////////////////////////////////////////////////////////
  @ApiOperation({
    summary: 'Registers a new service provider',
    description:
      'Basically, this route is used when the admin needs to  register a new service provider. Remember for service provider, just like in staff case, the phone number is not acutal number but a randomly generated number .Also password is automatically generated.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: RegisterServiceProviderDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsSuperAdminHeaderValidGuard)
  @Post('register-service-provider')
  registerServiceProvider(
    @Body() registrationInfo: RegisterServiceProviderDTO,
  ): Promise<any> {
    // ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.registerServiceProvider(registrationInfo);
  }

  @ApiOperation({
    summary: 'Delete the already existing serviceProvider',
    description:
      'Basically, this route is used when the admin needs to  delete the serviceProvider.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: DeleteServiceProviderDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsSuperAdminHeaderValidGuard)
  @Post('delete-service-provider')
  deleteServiceProvider(
    @Body() deleteInfo: DeleteServiceProviderDTO,
  ): Promise<any> {
    // ): Promise<IPhoneRegisterResponseDTO> {
    return this.authService.deleteServiceProvider(deleteInfo.phoneNumber);
  }
}
