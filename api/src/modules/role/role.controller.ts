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
// import { RoleDTO } from './role.dtos';
import { RoleService } from './role.service';

import { ApiTags } from '@nestjs/swagger';
import { IsSuperAdminHeaderValidGuard } from 'modules/auth/guards/client-header.guard';
import { OptionalJwtCompulsoryMobileClientApiGuard } from 'modules/auth/guards/jwt-auth.guard';
import { RoleDTO } from './role.dtos';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // @UseGuards(IsSuperAdminHeaderValidGuard)
  @Put('add')
  register(@Body() roleInfo: RoleDTO) {
    return this.roleService.add(roleInfo);
  }

  @UseGuards(OptionalJwtCompulsoryMobileClientApiGuard)
  @Get('get-all-roles')
  getRoles() {
    return this.roleService.getAllRoles();
  }
}
