import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SlackModule } from 'modules/slack/slack.module';
import { SlackService } from 'modules/slack/slack.service';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
// import { InternalServerErrorFilter } from './filter/exception.filter';

import { UtilsService } from './utils/mapper.service';

@Module({
  imports: [HttpModule, SlackModule],
  controllers: [CommonController],
  providers: [UtilsService, CommonService],
  exports: [UtilsService, CommonService],
})
export class CommonModule {}
