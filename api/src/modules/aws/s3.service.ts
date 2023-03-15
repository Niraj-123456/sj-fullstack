import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  AllowedMimes,
  AllowedTypes,
  FileTypeEnum,
} from 'common/constants/enum-constant';
import { getUniqueFileName } from 'common/utils/file-extension';
import { APPVars } from 'config/config.service';

@Injectable()
export class S3Service {
  AWSVarsMode = APPVars.AWSVars[process.env.MODE];
  AWS_S3_BUCKET = this.AWSVarsMode['AWS_S3_BUCKET'];

  s3 = new AWS.S3({
    accessKeyId: this.AWSVarsMode['AWS_ACCESS_KEY'],
    secretAccessKey: this.AWSVarsMode['AWS_SECRET_KEY'],
  });

  async uploadFile(
    file,
    fullPathAWS = this.AWSVarsMode['AWS_S3_BUCKET_PATH_FOR_PRODUCT_IMAGE'],
    isPublicReadEnabled = false,
    fileType = FileTypeEnum.IMAGE,
  ) {
    const { originalname } = file;
    const uniqueName = getUniqueFileName(originalname);
    const keyWithPrefix = fullPathAWS + '/' + uniqueName;

    // console.debug('AllowedMimes', AllowedMimes);
    // console.debug('fileType', fileType);

    // console.debug('file.mimetype', file.mimetype);
    // console.debug('AllowedMimes[fileType]', AllowedMimes[fileType]);
    if (!AllowedMimes[fileType].includes(file.mimetype)) {
      throw new BadRequestException(
        'Make sure the filetype and mimes are compatible.',
      );
    }
    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      keyWithPrefix,
      file.mimetype,
      isPublicReadEnabled,
    );
  }

  async s3_upload(file, bucket, name, mimetype, isPublicReadEnabled) {
    const params = isPublicReadEnabled
      ? {
          Bucket: bucket,
          Key: String(name),
          Body: file,
          ACL: 'public-read',
          ContentType: mimetype,
          ContentDisposition: 'inline',
          CreateBucketConfiguration: {
            LocationConstraint: this.AWSVarsMode['AWS_REGION'],
          },
        }
      : {
          Bucket: bucket,
          Key: String(name),
          Body: file,
          // ACL: 'public-read',
          ContentType: mimetype,
          ContentDisposition: 'inline',
          CreateBucketConfiguration: {
            LocationConstraint: this.AWSVarsMode['AWS_REGION'],
          },
        };

    // console.log(params);

    try {
      return await this.s3.upload(params).promise();
    } catch (e) {
      console.log(e);
    }
  }
}
