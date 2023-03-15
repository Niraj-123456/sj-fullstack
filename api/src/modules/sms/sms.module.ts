import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { SparrowSMSService } from './sms.service';

@Module({
  imports: [
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
  providers: [SparrowSMSService],
  exports: [SparrowSMSService],
})
export class SMSModule {}
