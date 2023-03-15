import { dataSource } from '../data-source';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

(async () => {
  await dataSource.initialize();

  await runSeeders(dataSource);
})();
