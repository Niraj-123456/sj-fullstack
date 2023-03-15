import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Role } from '../../modules/role/role.entity';
import { RoleTypeEnum } from 'common/constants/enum-constant';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // Use factory for fixed defination and random number of data
    console.log('Seeding roles......');

    // Since we have fix roles with fix number and name, we set it manually
    const roleRepository = dataSource.getRepository(Role);
    let requiredRoles = Object.values(RoleTypeEnum);

    let alreadyAvailableRoles = await roleRepository.find({
      where: {
        isDeleted: false,
        name: In(requiredRoles),
      },
    });

    let availableRolesStringList = alreadyAvailableRoles.map(
      (eachAvailableRoles) => eachAvailableRoles.name,
    );

    let remainingRolesStringList = requiredRoles.filter(
      (eachRequiredRole) =>
        !availableRolesStringList.includes(eachRequiredRole),
    );

    for (var eachRemainingRole of remainingRolesStringList) {
      await roleRepository.insert([
        {
          name: eachRemainingRole,
        },
      ]);
    }
  }
}
