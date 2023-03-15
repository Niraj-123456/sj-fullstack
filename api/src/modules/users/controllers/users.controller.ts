import {
  Controller,
  Get,
  Query,
  Param,
  Put,
  Body,
  Post,
  Request,
  UseGuards,
  Req,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesToBodyInterceptor } from 'common/swagger/swagger-decorators';
import { imageFileFilter } from 'common/utils/file-extension';
import { OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard } from 'modules/auth/guards/jwt-auth.guard';
import { IsClientHeaderValidGuard } from 'modules/auth/guards/client-header.guard';
import { IsSuperAdminHeaderValidGuard } from 'modules/auth/guards/client-header.guard';
import { UserService } from '../services/users.service';
import {
  ActiveUserSearchDTO,
  AssociateBusinessToAUserDTO,
  IAssociateBusinessToAUserResponse,
  IUserDPRemoveDTO,
  IUserDPUpdateDTO,
  IUserProfileUpdateDTO,
  SingleUserSearchByPhoneNumberDTO,
  UserProfileDisplayImageUpdateDTO,
  UserProfileUpdateDTO,
} from '../user.dtos';
import { JWTPermissionsGuard } from 'modules/permission/permission.guard';
import { AllPermissionsEnum } from 'common/constants/enum-constant';
import { GenericResponseDTO } from 'common/dto/response.dto';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get booking list as in search result format',
    description:
      'When the staff wants to see the booking list in a searchable format, this api will be used. Currently, it will be consumed by Dashboard frontend in staff side (web app)',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @UseGuards(new JWTPermissionsGuard([AllPermissionsEnum.ViewUser]))
  @Get('get-active-users')
  getBookingList(@Req() req, @Query() searchDetails: ActiveUserSearchDTO) {
    //: Promise<GenericResponseDTO> {
    return this.userService.getUsersForStaff(req.user, searchDetails);
  }

  @ApiOperation({
    summary: 'Check of client phoneNumber exists',
    description:
      'When the staff wants to see if the phone number exists , this api has to be consumed. Initially, this api is being consumed when a staff checks for client number while making a new booking from frontend in staff side (web app)',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @UseGuards(new JWTPermissionsGuard([AllPermissionsEnum.ViewUser]))
  @Get('get-single-user')
  checkIfNumberExists(
    @Req() req,
    @Query() searchDetails: SingleUserSearchByPhoneNumberDTO,
  ): Promise<GenericResponseDTO> {
    return this.userService.getSingleUser(req.user, searchDetails);
  }

  // //   @Get('get-user-without-phoneNumber')
  // //   register(@Body() phoneBody: any) {
  // //     return this.UserService.findOneByPhoneNumberWithoutPassword(
  // //       phoneBody.phoneNumber,
  // //     );
  // //   }

  // @ApiHeader({ name: 'sj-client-api-key' })
  // @ApiOperation({
  //   summary: 'Link a business to a user',
  //   description:
  //     'If you want to basically connect a business with a user, use this route. Usually, the user and business are not created simultaneously.Whenever both are created, then we need to associate them.',
  // })
  // @ApiResponse({
  //   type: IAssociateBusinessToAUserResponse,
  // })
  // @UseGuards(IsSuperAdminHeaderValidGuard)
  // @Put('associate-business-to-a-user')
  // associateBusinessToAUser(
  //   @Body() associationInfo: AssociateBusinessToAUserDTO,
  // ): Promise<IAssociateBusinessToAUserResponse> {
  //   return this.userService.associateBusinessToAUser(associationInfo);
  // }

  // @ApiHeader({ name: 'sj-client-api-key' })
  // @ApiOperation({
  //   summary: 'Update user profile text data',
  //   description:
  //     'If you want to update user data except photo, use this route. For photo update and delete, there is a separate api',
  // })
  // @ApiResponse({
  //   type: IUserProfileUpdateDTO,
  // })
  // @UseGuards(IsClientHeaderValidGuard)
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @Put('update-profile')
  // updateUserProfile(
  //   @Body() userInfo: UserProfileUpdateDTO,
  //   @Req() req,
  // ): Promise<IUserProfileUpdateDTO> {
  //   return this.userService.updateUserProfileExceptPhotos(req.user, userInfo);
  // }

  // @ApiHeader({ name: 'sj-client-api-key' })
  // @ApiOperation({
  //   summary: 'Update user profile photo',
  //   description:
  //     'If you want to update user display picture, please use this route.',
  // })
  // @ApiResponse({
  //   type: IUserDPUpdateDTO,
  // })
  // @UseGuards(IsClientHeaderValidGuard)
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @UseInterceptors(
  //   AnyFilesInterceptor({
  //     limits: {
  //       /** For multipart forms,size limit of file size (in bytes)*/
  //       fileSize: 4 * 1024 * 1024,
  //       /** For multipart forms,number limit of files */
  //       files: 1, //(only 1 mainDisplayImage)
  //     },
  //     fileFilter: imageFileFilter,
  //   }),
  //   FilesToBodyInterceptor,
  // )
  // @Put('upload-profile-photo')
  // updateUserProfilePhoto(
  //   @Body() body: UserProfileDisplayImageUpdateDTO,
  //   @Req() req,
  // ): Promise<IUserProfileUpdateDTO> {
  //   return this.userService.updateUserProfilePhoto(req.user, body);
  // }

  // @ApiHeader({ name: 'sj-client-api-key' })
  // @ApiOperation({
  //   summary: 'Remove user profile photo',
  //   description:
  //     'If you want to remove user display picture, please use this route.',
  // })
  // @ApiResponse({
  //   type: IUserDPRemoveDTO,
  // })
  // @UseGuards(IsClientHeaderValidGuard)
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @Delete('remove-profile-photo')
  // removeUserProfilePhoto(@Req() req): Promise<IUserDPRemoveDTO> {
  //   return this.userService.removeUserProfilePhoto(req.user);
  // }
}
