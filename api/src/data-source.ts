import { MainSeeder } from './database/seeds/main.seed';

import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const migrationString = `migrations-${process.env.MODE}`;

const options: TypeOrmModuleOptions & DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],

  migrationsTableName: migrationString,

  migrations: [path.join(__dirname, `/database/${migrationString}/*{.ts,.js}`)],
  seeds: [MainSeeder],
  factories: [__dirname + '/database/**/*.factories{.ts,.js}'],
};

export const dataSource = new DataSource(options);
