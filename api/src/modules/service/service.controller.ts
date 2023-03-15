import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Delete,
  Query,
  UseInterceptors,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  FilesToBodyInterceptor,
  FileToBodyInterceptor,
  JsonToObjectsInterceptor,
  SingleFileFormDataDTO,
} from 'common/swagger/swagger-decorators';
import { imageFileFilter } from 'common/utils/file-extension';
import { IsClientHeaderValidGuard } from 'modules/auth/guards/client-header.guard';
import { IsSuperAdminHeaderValidGuard } from 'modules/auth/guards/client-header.guard';
import { CreateServiceDTO, CreateServiceSwaggerDTO } from './service.dtos';
import { Service } from './service.entity';
import {
  GetCommonDetailsServiceObject,
  ICommonDetailsServiceObject,
} from './service.interface';
import { ServiceService } from './service.service';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  ////////
  // //one time use apis only
  // @ApiExcludeEndpoint()
  @UseGuards(IsSuperAdminHeaderValidGuard)
  @Post('create-service')
  @ApiOperation({
    summary: 'Create a new service of the product',
    description:
      'If you want to create a new service, use this route. Note, image is compulsory for the service',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        /** For multipart forms,size limit of file size (in bytes)*/
        fileSize: 4 * 1024 * 1024,
        /** For multipart forms,number limit of files */
        files: 1, //(1 image for serviceImage)
      },
      fileFilter: imageFileFilter,
    }),
    FilesToBodyInterceptor,
  )
  @ApiBody({ type: CreateServiceSwaggerDTO })
  register(@Body() serviceInfo: CreateServiceDTO): Promise<Service> {
    // Parsing the string list because multipart request field is appearing in string formate

    if (!serviceInfo.serviceImage[0]) {
      throw new BadRequestException('No Image for Service sent.');
    }

    return this.serviceService.addService(serviceInfo);
  }

  // @ApiExcludeEndpoint()
  // @UseGuards(IsSuperAdminHeaderValidGuard)
  // @Delete('delete-by-id')
  // deleteById(@Query() query): any {
  //   // console.log(query.ServiceId)
  //   this.serviceService.deleteById(query.serviceId);
  // }

  // @ApiExcludeEndpoint()
  // @UseGuards(IsSuperAdminHeaderValidGuard)
  // @Delete('delete-by-name')
  // deleteByName(@Query() query): any {
  //   return this.serviceService.deleteByName(query.serviceName);
  // }

  // @ApiHeader({ name: 'sj-client-api-key' })
  // @ApiOperation({
  //   summary: 'Gets all services of product',
  //   description:
  //     'If you want to get all the services, use this route. It takes no path or query params',
  // })
  // @ApiResponse({
  //   type: GetCommonDetailsServiceObject,
  //   isArray: true,
  //   description: 'All services received',
  // })
  // @UseGuards(IsClientHeaderValidGuard)
  // @Get('get-services')
  // getAll(): Promise<ICommonDetailsServiceObject[]> {
  //   return this.serviceService.getAllServiceCommonDetails();
  // }
}
