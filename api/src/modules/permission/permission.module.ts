import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { PermissionController } from './permission.controller';
// import { Permission } from './permission.entity';
import { PermissionService } from './permission.service';
import { UserModule } from 'modules/users/users.module';
import { RoleModule } from 'modules/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    forwardRef(() => UserModule),
    forwardRef(() => RoleModule),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
