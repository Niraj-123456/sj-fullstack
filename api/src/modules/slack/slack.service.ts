import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
const axios = require('axios');

import { HttpService } from '@nestjs/axios';

@Injectable()
export class SlackService {
  constructor() {}

  //Refer to this documentation for more
  //  https://api.slack.com/messaging/webhooks#posting_with_webhooks
  async sendLogToSlack(endpoint, request, error: Error) {
    try {
      console.debug('Sending log to slack channel........');

      let url =
        'https://hooks.slack.com/services/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';

      var date = new Date();
      var dateString = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      });
      const res = await axios.post(
        url,
        //TODO in the client field, after JWT is implemented then username should appear
        {
          text: `
          \`\`\` 
          ${dateString}
          Error in ${endpoint}
          Client: ${
            request.user.phoneNumber
              ? JSON.stringify(request.user.phoneNumber)
              : 'Anonymous'
          }
          Environment: ${process.env.MODE}
          \`\`\` 
          \`\`\` Error: ${error.stack}\`\`\` 
          \`\`\`Request:${JSON.stringify(request.body)}\`\`\`
          `,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },
        },
      );
      // console.log('Result', JSON.stringify(result));
    } catch (error) {
      console.log('Error while registering visit', error);
      throw error;
    }
  }

  // async getAllVisits(count: number = 10): Promise<Visit[]> {
  //   try {
  //     return await this.visitRepository.find({
  //       where: {
  //         isDeleted: false,
  //       },
  //       order: {
  //         createdDateTime: 'DESC',
  //       },
  //       take: count ? count : 10, //for limit
  //       relations: ['mainAdImage'],
  //       cache: 5000,
  //     });
  //   } catch (error) {
  //     console.log('Error while fetching visits', error);
  //     throw error;
  //   }
  // }

  // async deleteById(id: string) {
  //   //delete function accepts id or group of ids
  //   try {
  //     const visit = await this.visitRepository.findOne({
  //       where: {
  //         id: id,
  //         isActive: true,
  //       },
  //     });

  //     if (!visit) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'visitId',
  //           },
  //           message: 'Banner Ad with the following id not found.',
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     return await this.visitRepository.save({
  //       ...visit, // existing fields
  //       ...{ isActive: false }, // updated fields
  //     });
  //   } catch (error) {
  //     console.log('Error while fetching banner ads', error);
  //     throw error;
  //   }
}
