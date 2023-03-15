import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common/common.module';
import { UtilsService } from 'common/utils/mapper.service';
import { AWSModule } from 'modules/aws/aws.module';
import { S3Service } from 'modules/aws/s3.service';
import { File } from 'modules/file/file.entity';
import { FileModule } from 'modules/file/file.module';
import { FileService } from 'modules/file/file.service';
// import { Brand } from 'modules/brand/brand.entity';
// import { BrandService } from 'modules/brand/brand.service';
// import { BusinessType } from 'modules/business-type/business-type.entity';
// import { BusinessTypeService } from 'modules/business-type/services/business-type.service';
// import { Business } from 'modules/business/business.entity';
// import { BusinessModule } from 'modules/business/business.module';
// import { BusinessService } from 'modules/business/business.service';
// import { CustomerRequest } from 'modules/customer-request/customer-request.entity';
// import { CustomerRequestService } from 'modules/customer-request/customer-request.service';
// import { File } from 'modules/file/file.entity';
// import { FileModule } from 'modules/file/file.module';
// import { FileService } from 'modules/file/file.service';
// import { Industry } from 'modules/industry/industry.entity';
// import { IndustryService } from 'modules/industry/industry.service';
// import { ItemParameter } from 'modules/item-parameter/item-parameter.entity';
// import { ItemParameterService } from 'modules/item-parameter/item-parameter.service';
// import { ProductGroup } from 'modules/product-group/product-group.entity';
// import { ProductGroupService } from 'modules/product-group/product-group.service';
// import { Product } from 'modules/product/product.entity';
// import { ProductService } from 'modules/product/product.service';
// import { Representative } from 'modules/representative/representative.entity';
// import { RepresentativeService } from 'modules/representative/representative.service';
// import { Story } from 'modules/story/story.entity';
// import { StoryService } from 'modules/story/story.service';
// import { SubServiceService } from 'modules/sub-service/sub-service.service';
// import { SubService } from 'modules/sub-service/subservice.entity';
import { UserToken } from 'modules/token/token.entity';
import { UserTokenService } from 'modules/token/token.service';
import { UserService } from 'modules/users/services/users.service';
import { User } from 'modules/users/users.entity';

import { ServiceController } from './service.controller';
import { Service } from './service.entity';
import { ServiceService } from './service.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      // File,
      // User,
      // UserToken,
      // Product,
      // ProductGroup,
      // SubService,
      // Business,
      // BusinessType,
      // Representative,
      // Brand,
      // Industry,
      // CustomerRequest,
      // Story,
      // ItemParameter,
    ]),
    CommonModule,
    AWSModule,
    forwardRef(() => FileModule),
  ],
  controllers: [ServiceController],
  providers: [
    ServiceService,
    // FileService,
    // SubServiceService,
    // UtilsService,
    // S3Service,
    // FileService,
    // UserService,
    // UserTokenService,
    // ProductService,
    // ProductGroupService,
    // BusinessService,
    // BusinessTypeService,
    // RepresentativeService,
    // BrandService,
    // IndustryService,
    // CustomerRequestService,
    // StoryService,
    // ItemParameterService,
  ],
  exports: [ServiceService],
})
export class ServiceModule {}
