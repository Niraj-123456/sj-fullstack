import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceModule } from 'modules/service/service.module';
// import { BrandModule } from 'modules/brand/brand.module';
// import { BusinessModule } from 'modules/business/business.module';
// import { CategoryModule } from 'modules/category/category.module';
// import { IndustryModule } from 'modules/industry/industry.module';
// import { ProductModule } from 'modules/product/product.module';
// import { RepresentativeModule } from 'modules/representative/representative.module';
// import { StoryModule } from 'modules/story/story.module';
import { UserModule } from 'modules/users/users.module';
import { File } from './file.entity';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      File,
      // User,
      // UserToken,
      // Product,
      // ProductGroup,
      // SubCategory,
      // Business,
      // BusinessType,
      // Category,
      // Representative,
      // Brand,
      // Industry,
      // Booking,
      // Story,
      // ItemParameter,
    ]),
    // forwardRef(() => BusinessModule),
    // forwardRef(() => ProductModule),
    forwardRef(() => UserModule),
    // forwardRef(() => RepresentativeModule),
    // forwardRef(() => BrandModule),
    // forwardRef(() => CategoryModule),
    // forwardRef(() => IndustryModule),
    // forwardRef(() => StoryModule),

    forwardRef(() => ServiceModule),
  ],
  providers: [
    FileService,
    // UserService,
    // UserTokenService,
    // UtilsService,
    // ProductService,
    // ProductGroupService,
    // BusinessService,
    // BusinessTypeService,
    // RepresentativeService,
    // S3Service,
    // SubCategoryService,
    // FileService,
    // BrandService,
    // IndustryService,
    // BookingService,
    // StoryService,
    // ItemParameterService,
  ],
  exports: [FileService],
})
export class FileModule {}
