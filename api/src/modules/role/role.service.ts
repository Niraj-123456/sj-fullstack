import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleDTO } from './role.dtos';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  //Primary crud functions
  async findById(id): Promise<Role | undefined> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: id, isDeleted: false },
        cache: 10000,
      });
      return role;
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<Role | undefined> {
    try {
      const token = await this.roleRepository.findOne({
        where: { name: name, isDeleted: false },
        cache: 10000,
      });
      return token;
    } catch (error) {
      throw error;
    }
  }

  async add(role: RoleDTO): Promise<Role> {
    try {
      const existingRole = await this.findByName(role.name);
      if (existingRole) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'roleName',
            },
            message: 'The role name already exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      let newRole = new Role();
      newRole.name = role.name;
      newRole.description = role.description;
      return await this.roleRepository.save(newRole);
    } catch (error) {
      throw error;
    }
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      return await this.roleRepository.find({
        where: {
          isDeleted: false,
        },
        cache: 10000,
      });
    } catch (error) {
      throw error;
    }
  }

  // async update(id: number, RoleInfo: any): Promise<Role> {
  //   try {
  //     const token = await this.roleRepository.findOne({
  //       where: { id },
  //     });
  //     token.set(RoleInfo);
  //     token.save();
  //     return token;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async remove(id: number): Promise<boolean> {
  //   try {
  //     const token = await this.roleRepository.findOne({
  //       where: { id: id },
  //     });
  //     await user.destroy();
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }
}
