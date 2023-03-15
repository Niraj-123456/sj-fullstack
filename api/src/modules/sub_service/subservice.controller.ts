import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Req,
  Put,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { IsClientHeaderValidGuard } from 'modules/auth/guards/client-header.guard';
import { IsSuperAdminHeaderValidGuard } from 'modules/auth/guards/client-header.guard';
import {
  CreateSubServiceDTO,
  CreateSubServiceSwaggerDTO,
  DeleteSubServiceDTO,
  GetSubServiceDetailsDTO,
  SubServiceListOwnedByTheUserDTO,
  UpdateSubServiceVisibilityDTO,
} from './subservice.dtos';
import { SubService } from './subservice.entity';
// import { ICommonDetailsSubServiceObject } from './subService.interface';

// import { SubServiceService } from './subService.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard } from 'modules/auth/guards/jwt-auth.guard';
import { JsonToObjectsInterceptor } from 'common/swagger/swagger-decorators';

@ApiTags('subService')
@Controller('subService')
export class SubServiceController {
  // constructor(private readonly subServiceService: SubServiceService) {}
  // // Since this route is used only by a logged in user before subService registration
  // // we will need JWT authentication here
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @ApiOperation({
  //   summary: 'Create a new subService for the logged in user',
  //   description:
  //     'If you want to register a new subService in the name of the loggeed in user, use this route. Note, many fields including mainThumbnailImage are compulsory for subService registration \n max limit file size is 4Mb \n max file count = 4 (1 mainThumbnailImages, upto 3 other mainImages) \n Supported files extensions jpg,jpeg,png ',
  // })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ type: CreateSubServiceSwaggerDTO })
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'mainThumbnailImage', maxCount: 1 },
  //     { name: 'mainImage1', maxCount: 1 },
  //     { name: 'mainImage2', maxCount: 1 },
  //     { name: 'mainImage3', maxCount: 1 },
  //   ]),
  //   JsonToObjectsInterceptor(['itemParameters']),
  // )
  // @Post('create-subService')
  // register(
  //   @UploadedFiles()
  //   files: {
  //     mainThumbnailImage: Express.Multer.File[];
  //     mainImage1?: Express.Multer.File[];
  //     mainImage2?: Express.Multer.File[];
  //     mainImage3?: Express.Multer.File[];
  //   },
  //   @Req() req,
  //   @Body() subServiceInfo: CreateSubServiceDTO,
  // ): Promise<SubService> | any {
  //   // console.debug(subServiceInfo);
  //   // console.debug(files);
  //   // console.debug('Inside controller');
  //   if (
  //     !files['mainThumbnailImage']
  //     // ||
  //     // !files['mainImage1'] ||
  //     // !files['mainImage2'] ||
  //     // !files['mainImage3']
  //   ) {
  //     throw new BadRequestException('Image(s) might be missing');
  //   }
  //   // return req.user;
  //   // return subServiceInfo.itemParameters;
  //   return this.subServiceService.addSubService(req.user, subServiceInfo, files);
  // }
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @ApiOperation({
  //   summary: 'Delete the subService uploaded by the user',
  // })
  // @Delete('delete-by-id')
  // async deleteById(@Req() req, @Query() query: DeleteSubServiceDTO): Promise<any> {
  //   // console.log(query.subServiceId)
  //   return await this.subServiceService.deleteOwnedSubServiceByUser(
  //     req.user,
  //     query.subServiceId,
  //   );
  // }
  // @UseGuards(IsSuperAdminHeaderValidGuard)
  // @Delete('delete-by-name')
  // deleteByName(@Query() query): any {
  //   return this.subServiceService.deleteByName(query.subServiceName);
  // }
  // @UseGuards(IsClientHeaderValidGuard)
  // @Get('get-subService-groups')
  // getAll(): Promise<ICommonDetailsSubServiceObject[]> {
  //   return this.subServiceService.getAllSubServices();
  // }
  // @ApiOperation({
  //   summary: 'Gets the user owned subServices',
  //   description:
  //     'If a verified user wants to see the list of subServices that s/he owns ,please you this route.',
  // })
  // @ApiResponse({
  //   type: SubService,
  //   isArray: true,
  //   description: 'All subServices received for the user',
  // })
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @Get('get-business-subServices')
  // getAllSubServicesForAUser(
  //   @Req() req,
  //   @Query() query: SubServiceListOwnedByTheUserDTO,
  // ): Promise<SubService[]> {
  //   return this.subServiceService.getSubServicesOwnedByTheUser(req.user, query);
  // }
  // @ApiOperation({
  //   summary: 'Toggle between the subService visibility',
  //   description:
  //     'If a subService owner wants to update the visibility of the subService, use this route.',
  // })
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @Put('change-subService-visibility')
  // changeVisibilityOfSubService(
  //   @Req() req,
  //   @Body() body: UpdateSubServiceVisibilityDTO,
  // ): Promise<SubService> {
  //   return this.subServiceService.updateSubServiceVisibility(req.user, body);
  // }
  // @ApiOperation({
  //   summary: 'Gets subService details from a general user perpective',
  //   description: 'This data is used in subService details page.',
  // })
  // @ApiResponse({
  //   type: SubService,
  //   description: 'All details of a subService received for a general user',
  // })
  // @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  // @Get('get-subService-details')
  // getSubServiceDetails(
  //   @Req() req,
  //   @Query() query: GetSubServiceDetailsDTO,
  // ): Promise<SubService> {
  //   return this.subServiceService.getSubServiceDetailsById(req.user, query.subServiceId);
  // }
}
