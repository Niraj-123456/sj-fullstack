import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  constructor() {}

  async getStatus() {
    console.log('Health check api was hit');
    try {
      return {
        success: true,
        status: 'Active',
        api_version: process.env.NODE_API_VERSION,
        api_sub_version: process.env.NODE_API_SUB_VERSION,
        message: `The api is up and running.`,
      };
    } catch (error) {
      return {
        success: true,
        status: 'Inactive',
        api_version: process.env.NODE_API_VERSION,
        api_sub_version: process.env.NODE_API_SUB_VERSION,
        message: `There is some issue with the api. Error : ${error}`,
      };
    }
  }
}
