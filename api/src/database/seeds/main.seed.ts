import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import PermissionSeeder from './permission.seed';
import RoleSeeder from './role.seed';
import SeedEntitySeeder from './seedentity.seed';
import ServiceSeeder from './service.seed';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, SeedEntitySeeder);
    await runSeeder(dataSource, RoleSeeder);
    await runSeeder(dataSource, ServiceSeeder);
    await runSeeder(dataSource, PermissionSeeder);
  }
}
