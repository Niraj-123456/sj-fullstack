import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CommonModule } from 'common/common.module';
// import { AWSModule } from 'modules/aws/aws.module';
// import { FileModule } from 'modules/file/file.module';
// import { SubServiceGroupModule } from 'modules/subService-group/subService-group.module';
// import { View } from 'modules/view/view.entity';
// import { ViewModule } from 'modules/view/view.module';
// import { SubServiceController } from './subService.controller';
import { SubService } from './subservice.entity';
// import { SubServiceService } from './subService.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubService]),
    // AWSModule,
    // forwardRef(() => FileModule),
    // forwardRef(() => CommonModule),
    // forwardRef(() => SubServiceGroupModule),
    // forwardRef(() => ViewModule),
  ],
  // controllers: [SubServiceController],
  // providers: [SubServiceService],
  // exports: [SubServiceService],
})
export class SubServiceModule {}
