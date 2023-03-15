import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceService } from 'modules/service/service.service';
import { SubService } from 'modules/sub_service/subservice.entity';
// import { BrandService } from 'modules/brand/brand.service';
// import { BusinessService } from 'modules/business/business.service';
// import { serviceService } from 'modules/service/service.service';
// import { IndustryService } from 'modules/industry/industry.service';
// import { subServiceService } from 'modules/subService/subService.service';
// import { RepresentativeService } from 'modules/representative/representative.service';
// import { StoryService } from 'modules/story/story.service';
import { UserService } from 'modules/users/services/users.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateFileDTO } from './file.dtos';
import { File } from './file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ServiceService))
    private readonly serviceService: ServiceService, // private readonly storyService: StoryService, // @Inject(forwardRef(() => subServiceService)) // private readonly subServiceService: subServiceService, // @Inject(forwardRef(() => BusinessService)) // private readonly businessService: BusinessService, // @Inject(forwardRef(() => RepresentativeService)) // private readonly representativeService: RepresentativeService, // @Inject(forwardRef(() => BrandService)) // private readonly brandService: BrandService, // @Inject(forwardRef(() => serviceService)) // private readonly serviceService: serviceService, // private readonly industryService: IndustryService,
  ) {}

  // getFileRepository() {
  //   return this.fileRepository;
  // }
  async addFile(fileInfo: CreateFileDTO): Promise<File> {
    try {
      console.debug('Creating new file ........');

      let newFile = new File();
      newFile.fileName = fileInfo.fileName;
      newFile.type = fileInfo.type;
      newFile.s3Url = fileInfo.s3Url;

      // if (fileInfo.userId) {
      //   const user = await this.userService.findById(fileInfo.userId);

      //   if (!user) {
      //     throw new HttpException(
      //       {
      //         success: false,
      //         data: {
      //           errorField: 'userId',
      //         },
      //         message: 'User with the id not found.',
      //       },
      //       HttpStatus.NOT_FOUND,
      //     );
      //   }
      //   newFile.userWhoseMainDisplayImage = user;
      //   newFile.userIdWhoseMainDisplayImage = fileInfo.userId;
      // }

      // if (fileInfo.subServiceWhoseMainThumbnailImageId) {
      //   const subServiceWhoseMainThumbnailImage =
      //     await this.subServiceService.findById(
      //       fileInfo.subServiceWhoseMainThumbnailImageId,
      //     );

      //   if (!subServiceWhoseMainThumbnailImage) {
      //     throw new HttpException(
      //       {
      //         success: false,
      //         data: {
      //           errorField: 'subServiceWhoseMainThumbnailImageId',
      //         },
      //         message:
      //           'subService id whose MainThumbnailImage is the file not found.',
      //       },
      //       HttpStatus.NOT_FOUND,
      //     );
      //   }
      //   newFile.subServiceWhoseMainThumbnailImage =
      //     subServiceWhoseMainThumbnailImage;
      // }

      if (fileInfo.serviceWhoseMainThumbnailImageId) {
        const service = await this.serviceService.findById(
          fileInfo.serviceWhoseMainThumbnailImageId,
        );

        if (!service) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'serviceId',
              },
              message: 'service with the id not found.',
            },
            HttpStatus.NOT_FOUND,
          );
        }
        newFile.serviceWhoseMainThumbnailImage = service;
      }

      return await this.fileRepository.save(newFile);
    } catch (error) {
      throw error;
    }
  }

  // // async getAllFiles(): Promise<ICommonDetailsFileObject[]> {
  // //   try {
  // //     const allFiles = await this.fileRepository.find({
  // //       order: {
  // //         name: 'ASC',
  // //         // id: "DESC"
  // //       },
  // //       where: { isDeleted: false },
  // //       relations: ['associatedSubservice', 'subServices'],
  // //     });

  // //     const getFileWithCommonDetails =
  // //       this.utilsService.extract<ICommonDetailsFileObject>({
  // //         id: true,
  // //         name: true,
  // //         associatedSubservice: true,
  // //         subServices: true,
  // //       });

  // //     const newRefinedList = allFiles.map((eachObject) => {
  // //       return getFileWithCommonDetails(eachObject);
  // //     });

  // //     return newRefinedList;
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }

  // // async findAll(): Promise<File[]> {
  // //   try {
  // //     const allBusinesTypes = await this.fileRepository.find({
  // //       order: {
  // //         name: 'ASC',
  // //         // id: "DESC"
  // //       },
  // //       where: { isDeleted: false },
  // //     });
  // //     return allBusinesTypes;
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }

  // // async findByName(name: string): Promise<File> {
  // //   try {
  // //     const file = await this.fileRepository.findOne({
  // //       where: {
  // //         name: name,
  // //         isDeleted: false,
  // //       },
  // //     });
  // //     return file;
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }

  // async findById(id: string): Promise<File> {
  //   try {
  //     const file = await this.fileRepository.findOne({
  //       where: {
  //         id,
  //         isDeleted: false,
  //       },
  //     });
  //     return file;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async update(fileInfo: File): Promise<UpdateResult> {
  //   return await this.fileRepository.update(fileInfo.id, fileInfo);
  // }

  // async deleteById(id) {
  //   //delete function accepts id or group of ids
  //   let file = await this.findById(id);

  //   if (!file) {
  //     throw new HttpException(
  //       {
  //         success: false,
  //         data: {
  //           errorField: 'fileId',
  //         },
  //         message: 'No file with the id not found.',
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   file.isActive = false;

  //   return await this.fileRepository.save(file);
  // }

  // // async deleteByName(name: string) {
  // //   console.log(`Deleting Business Type with name: ${name} `);
  // //   const fileToBeRemoved = await this.findByName(name);
  // //   //remove function accept the Entity itself
  // //   if (fileToBeRemoved === null) {
  // //     return {
  // //       message: 'The business type doesnot exist to be deleted.',
  // //     };
  // //   }

  // //   console.debug(fileToBeRemoved);
  // //   return await this.fileRepository.remove(fileToBeRemoved);
  // // }

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
