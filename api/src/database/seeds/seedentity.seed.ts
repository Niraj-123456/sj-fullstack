import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { SeedEntity } from '../../modules/seedentity/seed.entity';

export default class SeedEntitySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    //Manually adding
    const repository = dataSource.getRepository(SeedEntity);
    await repository.insert([
      {
        name: 'Caleb',
      },
    ]);

    // // Using factory
    // const userFactory = await factoryManager.get(SeedEntity);
    // // save 1 factory generated entity, to the database
    // await userFactory.save();

    // // save 5 factory generated entities, to the database
    // await userFactory.saveMany(5);
  }
}
