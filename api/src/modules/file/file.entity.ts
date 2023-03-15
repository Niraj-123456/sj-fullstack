import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '../../common/entity/base.entity';
import { FileTypeEnum } from '../../common/constants/enum-constant';
import { User } from '../users/users.entity';
import { SubService } from '../sub_service/subservice.entity';
import { Service } from '../service/service.entity';

@Entity()
export class File extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  fileName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  fileExtension: string;

  @ApiProperty({
    enum: FileTypeEnum,
  })
  @Column({
    type: 'enum',
    enum: FileTypeEnum,
    default: FileTypeEnum.EMPTY,
    nullable: true,
  })
  type: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  s3Url: string;

  @ApiProperty({ type: () => User })
  @OneToOne(() => User, (user) => user.mainDisplayImage)
  userWhoseMainDisplayImage: User;

  // for future reference: once user changes the image, the image id is removed from user so keeping track of whom the user belong to at first
  @Column({ type: 'uuid', nullable: true })
  userIdWhoseMainDisplayImage: string;

  @ApiProperty({ type: () => Service })
  @OneToOne(() => Service, (service) => service.mainThumbnailImage)
  serviceWhoseMainThumbnailImage: Service;

  @ApiProperty({ type: () => SubService })
  @OneToOne(() => SubService, (subService) => subService.mainThumbnailImage)
  subServiceWhoseMainThumbnailImage: SubService;
}
