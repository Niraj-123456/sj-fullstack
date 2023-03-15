import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
