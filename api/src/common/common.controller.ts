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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsClientHeaderValidGuard } from '../modules/auth/guards/client-header.guard';
import { IsSuperAdminHeaderValidGuard } from '../modules/auth/guards/client-header.guard';
import { CommonService } from './common.service';

@ApiTags('common')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @UseGuards(IsClientHeaderValidGuard)
  @ApiOperation({
    summary: 'Get a list of provinces in our database',
    description: 'If you want to get a list of provinces only, use this route.',
  })
  @ApiHeader({ name: 'sahaj-client-api-key' })
  @Get('get-provinces')
  getProvinces(): Promise<Array<any>> {
    return this.commonService.getProvinces();
  }

  @UseGuards(IsClientHeaderValidGuard)
  @ApiOperation({
    summary: 'Get a list of province and its districts in our database',
    description:
      'If you want to get a list of all the provinces and their associated districts, use this route.',
  })
  @ApiHeader({ name: 'sahaj-client-api-key' })
  @Get('get-province-with-districts')
  getDisticts(): Promise<Array<any>> {
    return this.commonService.getProvincesWithDistricts();
  }
}
