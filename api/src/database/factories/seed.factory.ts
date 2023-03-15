// import { BaseEntity } from '../../common/entity/base.entity';
// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { ApiProperty } from '@nestjs/swagger';
// import { FilteredClientSourceTypeEnum } from 'common/constants/enum-constant';
// import { define } from 'typeorm-seeding';
// import { SeedEntity } from './seed.entity';

// define(SeedEntity, (personname: string) => {
//   const name = personname;

//   const testSeed = new SeedEntity();
//   testSeed.name = personname;
//   return testSeed;
// });

import { setSeederFactory } from 'typeorm-extension';
import { SeedEntity } from '../../modules/seedentity/seed.entity';

export default setSeederFactory(SeedEntity, (faker) => {
  const seed = new SeedEntity();
  seed.name = faker.name.firstName('male');

  return seed;
});
