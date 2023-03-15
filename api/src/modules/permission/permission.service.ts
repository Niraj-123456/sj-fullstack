import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AllPermissionsEnum,
  RoleTypeEnum,
} from 'common/constants/enum-constant';
import { RoleService } from 'modules/role/role.service';
import { UserService } from 'modules/users/services/users.service';
import { In, Repository } from 'typeorm';
import { AddPermissionToUserDTO, PermissionDTO } from './permission.dtos';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}
  //Primary crud functions
  async findById(id): Promise<Permission | undefined> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id: id, isDeleted: false },
      });
      return permission;
    } catch (error) {
      throw error;
    }
  }

  async findByPermissionNameList(nameList: string[]): Promise<Permission[]> {
    try {
      return await this.permissionRepository.find({
        where: {
          isDeleted: false,
          name: In(nameList),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<Permission | undefined> {
    try {
      const token = await this.permissionRepository.findOne({
        where: { name: name, isDeleted: false },
      });
      return token;
    } catch (error) {
      throw error;
    }
  }

  async add(permission: PermissionDTO): Promise<Permission> {
    try {
      const existingPermission = await this.findByName(permission.name);
      if (existingPermission) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'permissionName',
            },
            message: 'The permission name already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      let newPermission = new Permission();
      newPermission.name = permission.name;
      newPermission.description = permission.description;
      return await this.permissionRepository.save(newPermission);
    } catch (error) {
      throw error;
    }
  }

  async getAllPermissions(): Promise<Permission[]> {
    try {
      return await this.permissionRepository.find({
        where: {
          isDeleted: false,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async addPermissionToStaff(
    addPermissionToUserDetails: AddPermissionToUserDTO,
  ) {
    let user = await this.userService.findOneByPhoneNumber(
      addPermissionToUserDetails.phoneNumber,
    );

    if (!user) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'phoneNumber',
          },
          message: 'User with the phone number doesnot exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let permissions = await this.findByPermissionNameList(
      addPermissionToUserDetails.permissionNames,
    );

    if (
      addPermissionToUserDetails.permissionNames.length > permissions.length
    ) {
      let invalidPermissionsList = [];
      let availablePermissionList = permissions.map(
        (eachPermission) => eachPermission.name,
      );
      addPermissionToUserDetails.permissionNames.forEach((eachPermission) => {
        if (!availablePermissionList.includes(eachPermission)) {
          invalidPermissionsList.push(eachPermission);
        }
      });

      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'permissionNames',
          },
          message: `The following permissionNames are not available: ${invalidPermissionsList.toString()}`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    for (var eachNewPermission of permissions) {
      if (!user.userPermissions.includes(eachNewPermission)) {
        user.userPermissions.push(eachNewPermission);
      }
    }

    if (user.userRole.name == RoleTypeEnum.DEFAULTSTAFF) {
      user.userRole = await this.roleService.findByName(
        RoleTypeEnum.CUSTOMIZEDSTAFF,
      );
    } else if (user.userRole.name == RoleTypeEnum.DEFAULTSERVICEPROVIDER) {
      user.userRole = await this.roleService.findByName(
        RoleTypeEnum.CUSTOMIZEDSERVICEPROVIDER,
      );
    } else if (user.userRole.name == RoleTypeEnum.DEFAULTCLIENT) {
      user.userRole = await this.roleService.findByName(
        RoleTypeEnum.CUSTOMIZEDCLIENT,
      );
    }

    return await this.userService.updateWholeEntity(user);
  }
  // async update(id: number, PermissionInfo: any): Promise<Permission> {
  //   try {
  //     const token = await this.permissionRepository.findOne({
  //       where: { id },
  //     });
  //     token.set(PermissionInfo);
  //     token.save();
  //     return token;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async remove(id: number): Promise<boolean> {
  //   try {
  //     const token = await this.permissionRepository.findOne({
  //       where: { id: id },
  //     });
  //     await user.destroy();
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }
}
