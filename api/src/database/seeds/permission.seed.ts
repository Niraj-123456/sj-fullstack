import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Permission } from '../../modules/permission/permission.entity';
import { AllPermissionsEnum } from 'common/constants/enum-constant';

export default class PermissionSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // Use factory for fixed defination and random number of data

    console.log('Seeding permissions......');
    // Since we have fix permissions with fix number and name, we set it manually
    const permissionRepository = dataSource.getRepository(Permission);
    let requiredPermissionsList = Object.values(AllPermissionsEnum);

    let alreadyAvailablePermissions = await permissionRepository.find({
      where: {
        isDeleted: false,
        name: In(requiredPermissionsList),
      },
    });

    let availablePermissionsStringList = alreadyAvailablePermissions.map(
      (eachAvailablePermissions) => eachAvailablePermissions.name,
    );

    let remainingPermissionsStringList = requiredPermissionsList.filter(
      (eachRequiredPermission) =>
        !availablePermissionsStringList.includes(
          eachRequiredPermission.toString(),
        ),
    );

    for (var eachRemainingPermission of remainingPermissionsStringList) {
      await permissionRepository.insert([
        {
          name: eachRemainingPermission.toString(),
        },
      ]);
    }
  }
}
