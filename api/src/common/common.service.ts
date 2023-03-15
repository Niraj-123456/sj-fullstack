import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { AWSVars, FileTypeEnum } from 'common/constants/enum-constant';
// import { S3Service } from 'modules/aws/s3.service';
// import { CategoryService } from 'modules/category/category.service';
// import { CreateFileDTO } from 'modules/file/file.dtos';
// import { FileService } from 'modules/file/file.service';
import { Repository, UpdateResult } from 'typeorm';
import {
  districtList,
  provinceList,
  provinceListWithDistrict,
} from './constants/address-consts';

@Injectable()
export class CommonService {
  async getProvinces(): Promise<Array<any>> {
    try {
      return await provinceList;
    } catch (error) {
      throw error;
    }
  }

  async getDistricts(): Promise<Array<any>> {
    try {
      return await districtList;
    } catch (error) {
      throw error;
    }
  }

  async getProvincesWithDistricts(): Promise<Array<any>> {
    try {
      return await provinceListWithDistrict;
    } catch (error) {
      throw error;
    }
  }
}
