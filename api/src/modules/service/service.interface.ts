import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICommonDetailsFileObjectDTO } from 'modules/file/file.dtos';
import { File } from 'modules/file/file.entity';
// import { GetCommonDetailsSubServiceObject } from 'modules/sub-service/sub-service.interface';

export interface ICommonDetailsServiceObject {
  id: string;
  name: string;
  label: string;
  subServices?: any;
  mainThumbnailImage?: ICommonDetailsFileObjectDTO;
}

//use for api-ok-response
export class GetCommonDetailsServiceObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  label: string;
  // @ApiPropertyOptional({ type: [GetCommonDetailsSubServiceObject] })
  // subCategories: GetCommonDetailsSubServiceObject[];

  @ApiProperty({ type: ICommonDetailsFileObjectDTO })
  mainThumbnailImage: ICommonDetailsFileObjectDTO;
}

// export class GetCommonDetailsServiceObjectWhenCalledForSubCat {
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   name: string;

//   @ApiProperty({ type: ICommonDetailsFileObjectDTO })
//   mainThumbnailImage: ICommonDetailsFileObjectDTO;
// }
