import {
  forwardRef,
  Inject,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  // AWSVars,
  FileTypeEnum,
  // ItemParameterTypeEnum,
} from 'common/constants/enum-constant';
import { UtilsService } from 'common/utils/mapper.service';
import { APPVars } from 'config/config.service';
import { S3Service } from 'modules/aws/s3.service';
import {
  CreateFileDTO,
  ICommonDetailsFileObject,
} from 'modules/file/file.dtos';
import { FileService } from 'modules/file/file.service';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreateServiceDTO } from './service.dtos';
import { Service } from './service.entity';
import { ICommonDetailsServiceObject } from './service.interface';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,

    private readonly utilsService: UtilsService,
    private readonly s3Service: S3Service,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService, // private readonly itemParamterService: ItemParameterService,
  ) {}
  async addService(serviceInfo: CreateServiceDTO): Promise<Service> {
    try {
      console.debug('Checking if the service exists ........');
      const allReadyExist = await this.findByName(serviceInfo.name);
      if (allReadyExist) {
        return allReadyExist;
      } else {
        console.debug('Creating new service ........');

        let newService = new Service();
        newService.name = serviceInfo.name;

        if (serviceInfo.label) {
          newService.label = serviceInfo.label;
        }
        if (serviceInfo.description) {
          newService.description = serviceInfo.description;
        }

        // Adding File
        const uploadRes = await this.s3Service.uploadFile(
          serviceInfo.serviceImage[0],
          APPVars.AWSVars[process.env.MODE][
            'AWS_S3_BUCKET_PATH_FOR_SERVICE_IMAGE'
          ],
          true,
          FileTypeEnum.IMAGE,
        );

        let newFileInfo = new CreateFileDTO();
        newFileInfo.fileName = serviceInfo.serviceImage.originalname;
        newFileInfo.type = FileTypeEnum.IMAGE;
        newFileInfo.s3Url = uploadRes.Location;

        newFileInfo.serviceWhoseMainThumbnailImageId = newService.id;

        const eachCreatedFile = await this.fileService.addFile(newFileInfo);
        if (!eachCreatedFile) {
          throw new NotImplementedException('The file could not be created.');
        }
        newService.mainThumbnailImage = eachCreatedFile;

        console.debug(newService);
        return await this.serviceRepository.save(newService);
      }
    } catch (error) {
      throw error;
    }
  }

  async filterActiveServicesFromIdList(idList: string[]): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: {
        isActive: true,
        isDeleted: false,
        id: In(idList),
      },
    });
  }
  async getAllServiceCommonDetails(): Promise<ICommonDetailsServiceObject[]> {
    try {
      const allServices = await this.serviceRepository.find({
        order: {
          name: 'ASC',
          // id: "DESC"
        },
        where: { isDeleted: false, isActive: true },
        relations: ['mainThumbnailImage', 'subServices'],
      });

      const getServiceWithCommonDetails =
        this.utilsService.extract<ICommonDetailsServiceObject>({
          id: true,
          name: true,
          label: true,
          subServices: true,
          mainThumbnailImage: true,
        });

      const newRefinedList = allServices.map((eachObject) => {
        const getFileWithCommonDetails =
          this.utilsService.extract<ICommonDetailsFileObject>({
            id: true,

            fileName: true,

            type: true,

            s3Url: true,
          });
        let service = getServiceWithCommonDetails(eachObject);

        service.mainThumbnailImage = getFileWithCommonDetails(
          service.mainThumbnailImage,
        );
        return service;
      });

      return newRefinedList;
    } catch (error) {
      throw error;
    }
  }

  // async findAll(): Promise<Service[]> {
  //   try {
  //     const allBusinesTypes = await this.serviceRepository.find({
  //       order: {
  //         name: 'ASC',
  //         // id: "DESC"
  //       },
  //       where: { isActive: 1 },
  //     });
  //     return allBusinesTypes;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async findByName(name: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({
        where: {
          name: name,
          isActive: true,
          isDeleted: false,
        },
        relations: ['mainThumbnailImage'],
      });
      return service;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({
        where: {
          id,
          isActive: true,
          isDeleted: false,
        },
      });
      return service;
    } catch (error) {
      throw error;
    }
  }

  // async findByIdList(idList: string[]): Promise<Service[]> {
  //   try {
  //     const service = await this.serviceRepository.find({
  //       where: {
  //         id: In(idList),
  //         isActive: 1,
  //       },
  //     });
  //     return service;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async update(serviceInfo: Service): Promise<UpdateResult> {
  //   return await this.serviceRepository.update(serviceInfo.id, serviceInfo);
  // }

  // async deleteById(id) {
  //   //delete function accepts id or group of ids
  //   return await this.serviceRepository.delete(id);
  // }

  // async deleteByName(name: string) {
  //   console.log(`Deleting Service with name: ${name} `);
  //   const serviceToBeRemoved = await this.findByName(name);
  //   //remove function accept the Entity itself
  //   if (!serviceToBeRemoved) {
  //     return {
  //       message: 'The Service to be deleted does not exist .',
  //     };
  //   }
  //   // const itemParameterToBeRemoved = await this.itemParamterService.findById(
  //   //   serviceToBeRemoved.itemParameters.id,
  //   // );

  //   // if (itemParameterToBeRemoved) {
  //   //   await this.itemParamterService.delete(itemParameterToBeRemoved);
  //   // }

  //   // console.debug('Not null');
  //   return await this.serviceRepository.remove(serviceToBeRemoved);
  // }

  // async queryBuilder(alias: string) {
  //   return this.serviceRepository.createQueryBuilder(alias);
  // }

  // // async findOneWithEmail(email: string): Promise<User | undefined> {
  // //   try {
  // //     const user = await this.usersRepository.findOne({
  // //       relations: ['userToken'],
  // //       where: { email, isUserDeleted: 0 },
  // //     });
  // //     return user;
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }

  // // async findOneByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
  // //   try {
  // //     return await this.usersRepository.findOne({
  // //       relations: ['userToken'],
  // //       where: { phoneNumber, isArchived: 0 },
  // //     });
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }

  // // async findOneByPhoneNumberWithoutPassword(
  // //   phoneNumber: string,
  // // ): Promise<User | undefined> {
  // //   try {
  // //     const user = await this.usersRepository.findOne({
  // //       relations: ['userToken'], //there will be a userToken object in the response
  // //       where: { phoneNumber:phoneNumber},
  // //     });
  // //     console.debug('phoneNumber',phoneNumber)
  // //     console.debug('findOneByPhoneNumberWithoutPassword',user)
  // //     delete user.hashPassword;
  // //     return user;
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }

  // // async addUserWithPhoneOrEmail(userInfo: CreateUserDTO): Promise<User> {
  // //   try {
  // //     console.debug("Creating new User ........")
  // //     const userToken = await this.userTokenService.createNewOTPUserToken();

  // //     if (!userToken) {
  // //       throw new Error("Error while creating OTP")
  // //     }

  // //     // console.debug("userToken",userToken)

  // //     let newUser = {
  // //       phoneNumber: userInfo.phoneNumber,
  // //       email: userInfo?.email,
  // //       userToken: userToken

  // //     } as {
  // //       phoneNumber: string,
  // //       email: string | undefined,
  // //       userToken: UserToken,
  // //     };

  // //     // console.debug("newUser",newUser)
  // //     console.debug("Created User")
  // //     return await this.usersRepository.save(newUser);
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }

  // // async update(phoneNumber: string, newUserInfo: User): Promise<User> {
  // //   try {

  // //     const toBeeUpdatedUser = await this.usersRepository.findOne({
  // //       where: { phoneNumber }
  // //     });

  // //     return await this.usersRepository.save({
  // //       ...toBeeUpdatedUser, // existing fields
  // //       ...newUserInfo // updated fields
  // //     });
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }
}
