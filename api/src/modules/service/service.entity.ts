import { BaseEntity } from '../../common/entity/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
// import { SubService } from '../sub-service/subservice.entity';
// import { ServiceEnum } from 'common/constants/enum-constant';
// import { Brand } from '../brand/brand.entity';
// import { Industry } from '../industry/industry.entity';
import { File } from '../file/file.entity';
import { ServiceEnum } from '../../common/constants/enum-constant';
import { SubService } from '../sub_service/subservice.entity';
import { Booking } from '../booking/booking.entity';

@Entity()
export class Service extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ServiceEnum,
    default: null,
    nullable: true,
  })
  name: string;

  @Column('varchar', { nullable: true })
  label: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Client will only choose from Service but our staff will specifies what subservices are the users actually using
  @OneToMany(() => SubService, (subservice) => subservice.associatedService, {
    onDelete: 'CASCADE',
  })
  subServices: SubService[];

  @ManyToMany(() => Booking, (booking) => booking.associatedServices)
  associatedBookings: Booking[];

  @OneToOne(
    () => File,
    (file) => file.serviceWhoseMainThumbnailImage,
    // cascade: boolean | ("insert" | "update")[]  boolean or list of cascading option . if true both inserted and updated
    //   // onDelete: "RESTRICT"|"CASCADE"|"SET NULL" - specifies how foreign key should behave when referenced object is deleted
    //   {
    //     eager: true,
    //     cascade: true,
    //     onDelete: 'CASCADE',
    //   },
  )
  @JoinColumn()
  mainThumbnailImage: File;

  @Column('varchar', { nullable: true })
  description: string;
}
