import { BaseEntity } from '../../common/entity/base.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { AllPermissionsEnum } from '../../common/constants/enum-constant';

@Entity()
export class Permission extends BaseEntity {
  @Column({
    type: 'enum',
    enum: AllPermissionsEnum,
    nullable: true,
  })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.userPermissions)
  users: User[];
}
