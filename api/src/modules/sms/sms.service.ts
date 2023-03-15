import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { stringify } from 'querystring';

// @Injectable()
// export class TwillioSMSService {
//   public constructor(@InjectTwilio() private readonly client: TwilioClient) {}

//   async sendSMS(
//     receiverPhoneNumber: string,
//     messageBody: string, // should be less than 160characters
//   ): Promise<any> {
//     try {
//       console.log(`Sending message to ${receiverPhoneNumber}.......`);
//       // const client = require('twilio')(this.accountSid, this.authToken)

//       const message = await this.client.messages.create({
//         to: receiverPhoneNumber,
//         from: process.env.TWILIO_SENDER_phoneNumber,
//         body: messageBody,
//       });

//       console.log(`Sent message to ${receiverPhoneNumber}.......`);
//       // console.debug("Response via sen message",message)
//       // console.log(message.sid)
//     } catch (error) {
//       throw new HttpException(
//         {
//           success: false,
//           data: error,
//           message: 'Error while sending sms. Please contact to Administrator.',
//         },
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
// }

@Injectable()
export class SparrowSMSService {
  public constructor() {}

  async sendSMS(
    from: string, // It should be the identity provided to you.
    to: string, // Comma Separated 10-digit mobile numbers.
    messageBody: string, //SMS Message to be sent.
  ): Promise<any> {
    try {
      let token = process.env.SPARROW_SMS_TOKEN;

      console.log(`Sending message to ${to}.......`);
      let axios = require('axios');
      let parameters = '?';
      parameters += 'from=' + from;
      parameters += '&to=' + to;
      parameters += '&text=' + messageBody;
      parameters += '&token=' + token;

      let parameterizedUrl = 'http://api.sparrowsms.com/v2/sms' + parameters;
      let response = await axios.get(parameterizedUrl);

      if (response.data) {
        if (
          response.data.response_code >= 200 &&
          response.data.response_code < 210
        ) {
          console.log(`Sent message to ${to}.......`);
          console.log(`Response : `, response);
        } else {
          console.log(`Response : `, response);
          throw new HttpException(
            {
              success: false,
              // data: error,
              message: `Getting a different response while sending sms. Please contact to Administrator.`,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (error) {
      console.log(`Error while sending sms ${to}.......`);
      console.log('error', error);
      throw new HttpException(
        {
          success: false,
          data: error,
          message: 'Error while sending sms. Please contact to Administrator.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
