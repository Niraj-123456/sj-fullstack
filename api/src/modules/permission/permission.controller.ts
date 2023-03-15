import {
  Controller,
  Get,
  Query,
  Param,
  Put,
  Body,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
// import { PermissionDTO } from './permission.dtos';
// import { PermissionService } from './permission.service';

import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IsSuperAdminHeaderValidGuard } from 'modules/auth/guards/client-header.guard';
import { OptionalJwtCompulsoryMobileClientApiGuard } from 'modules/auth/guards/jwt-auth.guard';
import { IPhoneRegisterResponseDTO } from 'modules/auth/interfaces/response.interface';
import { AddPermissionToUserDTO } from './permission.dtos';
import { PermissionService } from './permission.service';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @ApiOperation({
    summary: 'Add Permission to Staff',
    description:
      'Basically, this route is used when the admin needs to add more permission to the staff.',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: AddPermissionToUserDTO })
  @ApiOkResponse({ type: IPhoneRegisterResponseDTO })
  @UseGuards(IsSuperAdminHeaderValidGuard)
  @Post('admin-add-permissions-to-users')
  addPermissionToStaff(
    @Body() addPermissionToUserDetails: AddPermissionToUserDTO,
  ): Promise<any> {
    // ): Promise<IPhoneRegisterResponseDTO> {
    return this.permissionService.addPermissionToStaff(
      addPermissionToUserDetails,
    );
  }
}
