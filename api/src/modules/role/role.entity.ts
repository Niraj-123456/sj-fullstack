import { BaseEntity } from '../../common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { RoleTypeEnum } from '../../common/constants/enum-constant';

@Entity()
export class Role extends BaseEntity {
  @Column({
    type: 'enum',
    enum: RoleTypeEnum,
    nullable: true,
    unique: true,
  })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.userRole)
  users: User[];
}
