// import {
//   forwardRef,
//   HttpException,
//   HttpStatus,
//   Inject,
//   Injectable,
//   NotImplementedException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import {
//   AWSVars,
//   FileTypeEnum,
//   OwnedSubServiceListSearchTypeEnum,
//   SearchSortValueEnum,
//   ViewTypeEnum,
// } from 'common/constants/enum-constant';
// import { UtilsService } from 'common/utils/mapper.service';
// import { S3Service } from 'modules/aws/s3.service';
// import { CreateFileDTO } from 'modules/file/file.dtos';
// import { File } from 'modules/file/file.entity';
// import { FileService } from 'modules/file/file.service';
// import { SubServiceGroupService } from 'modules/subService-group/subService-group.service';
// import { UserService } from 'modules/users/services/users.service';
// import { User } from 'modules/users/users.entity';
// import { View } from 'modules/view/view.entity';
// import { ViewService } from 'modules/view/view.service';
// import { userInfo } from 'os';
// import { getConnection, getManager, Repository, UpdateResult } from 'typeorm';
// import {
//   CreateSubServiceDTO,
//   SubServiceListOwnedByTheUserDTO,
//   UpdateSubServiceVisibilityDTO,
// } from './subService.dtos';
// import { SubService } from './subService.entity';
// import { ICommonDetailsSubServiceObject } from './subService.interface';

// @Injectable()
// export class SubServiceService {
//   constructor(
//     @InjectRepository(SubService)
//     private subServiceRepository: Repository<SubService>,
//     private readonly utilsService: UtilsService,
//     private readonly subServiceGroupService: SubServiceGroupService,
//     @Inject(forwardRef(() => FileService))
//     private readonly fileService: FileService,
//     private readonly s3Service: S3Service,
//     @Inject(forwardRef(() => ViewService))
//     private readonly viewService: ViewService,
//   ) {}
//   // async addSubService(
//   //   user: User,
//   //   subServiceInfo: CreateSubServiceDTO,
//   //   files: {
//   //     mainThumbnailImage: Express.Multer.File[];
//   //     mainImage1?: Express.Multer.File[];
//   //     mainImage2?: Express.Multer.File[];
//   //     mainImage3?: Express.Multer.File[];
//   //   },
//   // ): Promise<SubService | any> {
//   //   try {
//   //     console.debug('Creating new subService ........');

//   //     const subServiceGroup = await this.subServiceGroupService.findById(
//   //       subServiceInfo.associatedSubServiceGroupId,
//   //     );

//   //     if (!subServiceGroup) {
//   //       throw new HttpException(
//   //         {
//   //           success: false,
//   //           data: {
//   //             errorField: 'associatedSubServiceGroupId',
//   //           },
//   //           message: 'SubServiceGroup with the id not found.',
//   //         },
//   //         HttpStatus.NOT_FOUND,
//   //       );
//   //     }

//   //     if (!user) {
//   //       throw new HttpException(
//   //         {
//   //           success: false,
//   //           data: {
//   //             errorField: 'user',
//   //           },
//   //           message: 'SubService owner user cannot be found.',
//   //         },
//   //         HttpStatus.BAD_REQUEST,
//   //       );
//   //     }

//   //     let newSubService = new SubService();
//   //     newSubService.owner = user;
//   //     newSubService.name = subServiceInfo.name;
//   //     newSubService.price = subServiceInfo.price;
//   //     newSubService.currency = subServiceInfo.currency;
//   //     newSubService.perUnitLabel = subServiceInfo.perUnitLabel;
//   //     newSubService.description = subServiceInfo.description;

//   //     // // field added due to subService details
//   //     // "Is Warrantly available or not?"
//   //     // "Warrantly description"
//   //     // "Is SubService/Service returnable or not?"
//   //     // "Return Case description"
//   //     // "Estimated Delivery Inside Valley"
//   //     // "Estimated Delivery Outside Valley"

//   //     // ,{"label":"Is Warranty available?","value":1},{"label":"Warrantly description","value":"some description"},{"label":"Is SubService/Service Returnable?","value":0},{"label":"Return Case description","value":"some description"},{"label":"Estimated Delivery Time Inside Valley(in days)","value":1},{"label":"Estimated Delivery Time Outside Valley(in days)","value":3}

//   //     newSubService.isWarantyValid = subServiceInfo.isWarantyValid;
//   //     newSubService.warrantyDescription = subServiceInfo.warrantyDescription;
//   //     newSubService.isReturnValid = subServiceInfo.isReturnValid;
//   //     newSubService.returnDescription = subServiceInfo.returnDescription;
//   //     newSubService.estimatedDaysForDeliveryInValley =
//   //       subServiceInfo.estimatedDaysForDeliveryInValley;
//   //     newSubService.estimatedDaysForDeliveryOutOfValley =
//   //       subServiceInfo.estimatedDaysForDeliveryOutOfValley;
//   //     ////

//   //     newSubService.associatedSubServiceGroup = subServiceGroup;

//   //     newSubService.specificParameters =
//   //       subServiceInfo.itemParameters.subServiceSpecificParams?.map(
//   //         (eachSpecificParam) => eachSpecificParam.label,
//   //       );

//   //     newSubService.combinedParameters = {
//   //       allCategoriesParams:
//   //         subServiceInfo.itemParameters.allCategoriesParams?.map(
//   //           (eachSpecificParam) => eachSpecificParam.label,
//   //         ),
//   //       categorySpecificParams:
//   //         subServiceInfo.itemParameters.categorySpecificParams?.map(
//   //           (eachSpecificParam) => eachSpecificParam.label,
//   //         ),
//   //       subCategorySpecificParams:
//   //         subServiceInfo.itemParameters.subCategorySpecificParams?.map(
//   //           (eachSpecificParam) => eachSpecificParam.label,
//   //         ),
//   //       subServiceGroupSpecificParams:
//   //         subServiceInfo.itemParameters.subServiceGroupSpecificParams?.map(
//   //           (eachSpecificParam) => eachSpecificParam.label,
//   //         ),
//   //       subServiceSpecificParams:
//   //         subServiceInfo.itemParameters.subServiceSpecificParams?.map(
//   //           (eachSpecificParam) => eachSpecificParam.label,
//   //         ),
//   //     };

//   //     // @Column({ type: 'jsonb', nullable: true })
//   //     newSubService.combinedParametersWithValue = {
//   //       allCategoriesParams: subServiceInfo.itemParameters.allCategoriesParams,
//   //       categorySpecificParams:
//   //         subServiceInfo.itemParameters.categorySpecificParams,
//   //       subCategorySpecificParams:
//   //         subServiceInfo.itemParameters.subCategorySpecificParams,
//   //       subServiceGroupSpecificParams:
//   //         subServiceInfo.itemParameters.subServiceGroupSpecificParams,
//   //       subServiceSpecificParams: subServiceInfo.itemParameters.subServiceSpecificParams,
//   //     };

//   //     const fileKeys = Object.keys(files);

//   //     let listOfMainImagesFilesPerSubService = [];

//   //     for (let i = 0; i < fileKeys.length; i++) {
//   //       // console.log('fileKeys');
//   //       const uploadRes = await this.s3Service.uploadFile(
//   //         files[fileKeys[i]][0],
//   //         AWSVars[process.env.MODE]['AWS_S3_BUCKET_PATH_FOR_PRODUCT_IMAGE'],
//   //         true,
//   //         FileTypeEnum.IMAGE,
//   //       );
//   //       let newFileInfo = new CreateFileDTO();
//   //       newFileInfo.fileName = files[fileKeys[i]][0].originalname;
//   //       newFileInfo.type = FileTypeEnum.IMAGE;
//   //       newFileInfo.s3Url = uploadRes.Location;

//   //       if (fileKeys[i] === 'mainThumbnailImage') {
//   //         newFileInfo.subServiceWhoseMainThumbnailImageId = newSubService.id;
//   //         const eachCreatedFile = await this.fileService.addFile(newFileInfo);

//   //         if (!eachCreatedFile) {
//   //           throw new NotImplementedException('The file could not be created.');
//   //         }

//   //         // console.debug('eachCreatedFile thumbnail', eachCreatedFile);

//   //         newSubService.mainThumbnailImage = eachCreatedFile;
//   //       } else {
//   //         newFileInfo.subServiceWhoseMainImagesId = newSubService.id;
//   //         const eachCreatedFile = await this.fileService.addFile(newFileInfo);

//   //         if (!eachCreatedFile) {
//   //           throw new NotImplementedException('The file could not be created.');
//   //         }

//   //         // console.debug('eachCreatedFile normal file', eachCreatedFile);

//   //         listOfMainImagesFilesPerSubService.push(eachCreatedFile);
//   //       }
//   //     }

//   //     newSubService.mainImages = listOfMainImagesFilesPerSubService;

//   //     // console.debug('Thumbnail', newSubService.mainThumbnailImage);
//   //     // console.debug('Main images', newSubService.mainImages);

//   //     let savedSubService = await this.subServiceRepository.save(newSubService);

//   //     delete savedSubService.owner;

//   //     return savedSubService;
//   //     // return {};
//   //   } catch (error) {
//   //     console.log('Error while creating a new subService', error);
//   //     throw error;
//   //     // throw new HttpException(
//   //     //   {
//   //     //     success: false,
//   //     //     data: {},
//   //     //     message: 'Error while creating a new subService',
//   //     //   },
//   //     //   HttpStatus.BAD_REQUEST,
//   //     // );
//   //   }
//   // }

//   // async getAllSubServices(): Promise<ICommonDetailsSubServiceObject[]> {
//   //   try {
//   //     const allSubServices = await this.subServiceRepository.find({
//   //       order: {
//   //         name: 'ASC',
//   //         // id: "DESC"
//   //       },
//   //       where: { isActive: 1 },
//   //       relations: ['associatedSubServiceGroup'],
//   //     });

//   //     const getSubServiceWithCommonDetails =
//   //       this.utilsService.extract<ICommonDetailsSubServiceObject>({
//   //         id: true,
//   //         name: true,
//   //         associatedSubServiceGroup: true,

//   //         // @Column('simple-array', { nullable: true })
//   //         // specificParameters: string[];

//   //         // @Column({ type: 'jsonb', nullable: true })
//   //         // combinedParameters: ISubServiceCombinedParameters;

//   //         // @Column({ type: 'jsonb', nullable: true })
//   //         // combinedParametersWithValue
//   //         // title: true,
//   //       });

//   //     const newRefinedList = allSubServices.map((eachObject) => {
//   //       return getSubServiceWithCommonDetails(eachObject);
//   //     });

//   //     return newRefinedList;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async getSubServicesFromCategoryIds(
//   //   categoryIdsList: string[],
//   // ): Promise<ICommonDetailsSubServiceObject[]> {
//   //   try {
//   //     const allSubServices = await this.subServiceRepository.find({
//   //       where: { isActive: 1 },
//   //       relations: ['associatedSubServiceGroup'],
//   //     });
//   //     console.debug('getSubServicesFromCategoryIds', allSubServices);
//   //     const getSubServiceWithCommonDetails =
//   //       this.utilsService.extract<ICommonDetailsSubServiceObject>({
//   //         id: true,
//   //         name: true,
//   //         associatedSubServiceGroup: true,

//   //         // @Column('simple-array', { nullable: true })
//   //         // specificParameters: string[];

//   //         // @Column({ type: 'jsonb', nullable: true })
//   //         // combinedParameters: ISubServiceCombinedParameters;

//   //         // @Column({ type: 'jsonb', nullable: true })
//   //         // combinedParametersWithValue
//   //         // title: true,
//   //       });

//   //     const newRefinedList = allSubServices.map((eachObject) => {
//   //       return getSubServiceWithCommonDetails(eachObject);
//   //     });

//   //     return newRefinedList;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async findAll(): Promise<SubService[]> {
//   //   try {
//   //     const allBusinesTypes = await this.subServiceRepository.find({
//   //       order: {
//   //         name: 'ASC',
//   //         // id: "DESC"
//   //       },
//   //       where: { isActive: 1 },
//   //     });
//   //     return allBusinesTypes;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async findByName(name: string): Promise<SubService> {
//   //   try {
//   //     const subService = await this.subServiceRepository.findOne({
//   //       where: {
//   //         name: name,
//   //         isActive: 1,
//   //       },
//   //     });
//   //     return subService;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async findById(id: string): Promise<SubService> {
//   //   try {
//   //     const subService = await this.subServiceRepository.findOne({
//   //       where: {
//   //         id,
//   //         isActive: 1,
//   //       },
//   //     });
//   //     return subService;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async findSubServiceWithOwnerById(id: string): Promise<SubService> {
//   //   try {
//   //     const subService = await this.subServiceRepository.findOne({
//   //       where: {
//   //         id,
//   //         isActive: 1,
//   //       },
//   //       relations: ['owner'],
//   //     });
//   //     return subService;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async getSubServiceDetailsById(
//   //   detailFetcher: User,
//   //   id: string,
//   // ): Promise<SubService> {
//   //   try {
//   //     const subService = await this.subServiceRepository.findOne({
//   //       where: {
//   //         id,
//   //         isActive: 1,
//   //       },
//   //       relations: ['mainThumbnailImage', 'mainImages', 'questionAnswers'],
//   //     });

//   //     if (!subService) {
//   //       throw new HttpException(
//   //         {
//   //           success: false,
//   //           data: {
//   //             errorField: 'subServiceId',
//   //           },
//   //           message: 'SubService with the provided subService Id not found.',
//   //         },
//   //         HttpStatus.NOT_FOUND,
//   //       );
//   //     }

//   //     return subService;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async update(subServiceInfo: SubService): Promise<UpdateResult> {
//   //   return await this.subServiceRepository.update(subServiceInfo.id, subServiceInfo);
//   // }

//   // async deleteOwnedSubServiceByUser(user: User, subServiceId) {
//   //   //delete function accepts id or group of ids

//   //   let subService = await this.findById(subServiceId);

//   //   if (!subService) {
//   //     throw new HttpException(
//   //       {
//   //         success: false,
//   //         data: {
//   //           errorField: 'subServiceId',
//   //         },
//   //         message: 'SubService with the provided subService Id not found.',
//   //       },
//   //       HttpStatus.NOT_FOUND,
//   //     );
//   //   }
//   //   subService.isActive = false;
//   //   let savedSubService = await this.subServiceRepository.save(subService);

//   //   delete savedSubService.owner;
//   //   return {
//   //     success: true,
//   //     message: 'SubService successfully deleted',
//   //   };
//   // }

//   // async deleteById(id) {
//   //   //delete function accepts id or group of ids
//   //   return await this.subServiceRepository.delete(id);
//   // }

//   // async deleteByName(name: string) {
//   //   console.log(`Deleting Business Type with name: ${name} `);
//   //   const subServiceToBeRemoved = await this.findByName(name);
//   //   //remove function accept the Entity itself
//   //   if (subServiceToBeRemoved === null) {
//   //     return {
//   //       message: 'The business type doesnot exist to be deleted.',
//   //     };
//   //   }

//   //   console.debug(subServiceToBeRemoved);
//   //   return await this.subServiceRepository.remove(subServiceToBeRemoved);
//   // }

//   // async queryBuilder(alias: string) {
//   //   return this.subServiceRepository.createQueryBuilder(alias);
//   // }

//   // async emptyQueryBuilder() {
//   //   return this.subServiceRepository.createQueryBuilder();
//   // }

//   // async getLatestSubServices(count: number = 10): Promise<SubService[]> {
//   //   try {
//   //     return await this.subServiceRepository.find({
//   //       where: {
//   //         isActive: 1,
//   //       },
//   //       order: {
//   //         createdDateTime: 'DESC',
//   //       },
//   //       take: count,
//   //       cache: 4000,
//   //     });
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async getSubServicesOfInterestForUser(
//   //   user: User,
//   //   count: number = 10,
//   // ): Promise<SubService[]> {
//   //   try {
//   //     // get the list of subServices the user has most viewed in the past

//   //     // SELECT P.*,
//   //     //   COUNT(P.ID)
//   //     // FROM
//   //     //   (SELECT *
//   //     //     FROM VIEW
//   //     //     WHERE "viewType" = 'UserToSubService'
//   //     //       AND "viewerId" = 'd3a2a9c0-d2ad-489c-b04e-b071bf922fa4' ) AS V
//   //     // INNER JOIN PRODUCT P ON P.ID = V."viewedSubServiceId"
//   //     // GROUP BY P.ID
//   //     // ORDER BY COUNT(P.ID) DESC
//   //     //
//   //     // let builder = await (await this.queryBuilder('subService')).select('*');

//   //     let viewsMadeByUserOnSubServicesBuilder = getManager()
//   //       .createQueryBuilder()
//   //       .select('*')
//   //       .from(View, 'view')
//   //       .where('view.viewType = :viewType', {
//   //         viewType: ViewTypeEnum.UserToSubService,
//   //       })
//   //       .andWhere('view.viewerId = :viewerId', {
//   //         viewerId: user.id,
//   //       });

//   //     let subServicesWithHighestViewCountsBuilder = getManager()
//   //       .createQueryBuilder()
//   //       .select('p.*')
//   //       .addSelect('count(p.id)')
//   //       .from('(' + viewsMadeByUserOnSubServicesBuilder.getQuery() + ')', 'v')
//   //       .setParameters(viewsMadeByUserOnSubServicesBuilder.getParameters())
//   //       .innerJoin('subService', 'p', 'p.id = v."viewedSubServiceId"')
//   //       .groupBy('p.id')
//   //       .orderBy('count(p.id)', 'DESC')
//   //       .limit(count)
//   //       .cache(3000);

//   //     // console.debug('subServicesWithHighestViewCountsBuilder', subServicesWithHighestViewCountsBuilder.getSql());
//   //     // console.debug(
//   //     //   'subServicesWithHighestViewCountsBuilder',
//   //     //   await subServicesWithHighestViewCountsBuilder.getRawMany(),
//   //     // );
//   //     return await subServicesWithHighestViewCountsBuilder.getRawMany();
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async getSubServicesOfInterestForUnauthenticatedUser(
//   //   count: number = 10,
//   // ): Promise<SubService[]> {
//   //   try {
//   //     // get the list of subServices the user has most viewed in the past

//   //     // SELECT P.*,
//   //     //   COUNT(P.ID)
//   //     // FROM
//   //     //   (SELECT *
//   //     //     FROM VIEW
//   //     //     WHERE "viewType" = 'UserToSubService'
//   //     //       AND "viewerId" = 'd3a2a9c0-d2ad-489c-b04e-b071bf922fa4' ) AS V
//   //     // INNER JOIN PRODUCT P ON P.ID = V."viewedSubServiceId"
//   //     // GROUP BY P.ID
//   //     // ORDER BY COUNT(P.ID) DESC
//   //     //
//   //     // let builder = await (await this.queryBuilder('subService')).select('*');

//   //     let viewsMadeByUserOnSubServicesBuilder = getManager()
//   //       .createQueryBuilder()
//   //       .select('*')
//   //       .from(View, 'view')
//   //       .where('view.viewType = :viewType', {
//   //         viewType: ViewTypeEnum.UserToSubService,
//   //       });

//   //     let subServicesWithHighestViewCountsBuilder = getManager()
//   //       .createQueryBuilder()
//   //       .select('p.*')
//   //       .addSelect('count(p.id)')
//   //       .from('(' + viewsMadeByUserOnSubServicesBuilder.getQuery() + ')', 'v')
//   //       .setParameters(viewsMadeByUserOnSubServicesBuilder.getParameters())
//   //       .innerJoin('subService', 'p', 'p.id = v."viewedSubServiceId"')
//   //       .groupBy('p.id')
//   //       .orderBy('count(p.id)', 'DESC')
//   //       .limit(count)
//   //       .cache(3000);

//   //     // console.debug('subServicesWithHighestViewCountsBuilder', subServicesWithHighestViewCountsBuilder.getSql());
//   //     // console.debug(
//   //     //   'subServicesWithHighestViewCountsBuilder',
//   //     //   await subServicesWithHighestViewCountsBuilder.getRawMany(),
//   //     // );
//   //     return await subServicesWithHighestViewCountsBuilder.getRawMany();
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async getSubServicesOwnedByTheUser(
//   //   user: User,
//   //   query: SubServiceListOwnedByTheUserDTO,
//   // ): Promise<any> {
//   //   try {
//   //     if (!query.numberOfMaxResultsInEachPage) {
//   //       query.numberOfMaxResultsInEachPage = 10;
//   //     } else {
//   //       try {
//   //         query.numberOfMaxResultsInEachPage = parseInt(
//   //           query.numberOfMaxResultsInEachPage.toString(),
//   //         );
//   //       } catch {
//   //         query.numberOfMaxResultsInEachPage = 10;
//   //       }
//   //     }

//   //     if (!query.pageNumber) {
//   //       query.pageNumber = 1;
//   //     } else {
//   //       try {
//   //         query.pageNumber = parseInt(query.pageNumber.toString());
//   //       } catch {
//   //         query.pageNumber = 1;
//   //       }
//   //     }

//   //     if (!query.searchType) {
//   //       query.searchType = OwnedSubServiceListSearchTypeEnum.ByLatest;
//   //     }

//   //     if (!query.sortType) {
//   //       query.sortType = SearchSortValueEnum.DESC;
//   //     }

//   //     if (query.isActive == false || query.isActive == true) {
//   //       //if value comes accept the way it comes
//   //     } else if (!query.isActive) {
//   //       //if no value comes, then always search for visible subServices
//   //       query.isActive = true;
//   //     }

//   //     let order = {};
//   //     if ((query.searchType = OwnedSubServiceListSearchTypeEnum.ByLatest)) {
//   //       order = {
//   //         createdDateTime: query.sortType,
//   //       };
//   //     } else if ((query.searchType = OwnedSubServiceListSearchTypeEnum.ByName)) {
//   //       order = {
//   //         name: query.sortType,
//   //       };
//   //     }

//   //     const allOwnedSubServices = await this.subServiceRepository.find({
//   //       where: {
//   //         isActive: 1, // to check if the subService is delete for not. Dont relate it with the active sent from user
//   //         isVisible: query.isActive,
//   //         owner: {
//   //           id: user.id,
//   //           isActive: 1,
//   //         },
//   //       },
//   //       relations: ['mainThumbnailImage'],
//   //       order: order,
//   //       // take: query.numberOfMaxResultsInEachPage,
//   //       // skip: (query.pageNumber - 1) * query.numberOfMaxResultsInEachPage,
//   //       cache: 3000,
//   //     });

//   //     // return allOwnedSubServices;

//   //     const totalResultsCount = allOwnedSubServices.length;
//   //     const numberOfMaxResultsInEachPage = query.numberOfMaxResultsInEachPage;

//   //     // Extracting indices for choosing
//   //     //// Initial contraint for startingIndex
//   //     let pageNumber =
//   //       query.pageNumber == 0 || query.pageNumber == 1 ? 1 : query.pageNumber;

//   //     let currentPageSubServiceLeftCount =
//   //       totalResultsCount - (pageNumber - 1) * numberOfMaxResultsInEachPage;

//   //     let subServiceCountInCurrent;
//   //     if (currentPageSubServiceLeftCount > numberOfMaxResultsInEachPage) {
//   //       subServiceCountInCurrent = numberOfMaxResultsInEachPage;
//   //     } else if (currentPageSubServiceLeftCount > 0) {
//   //       subServiceCountInCurrent = parseInt(
//   //         currentPageSubServiceLeftCount.toString(),
//   //       );
//   //     } else {
//   //       subServiceCountInCurrent = 0;
//   //     }

//   //     let subServiceStartingIndex =
//   //       (pageNumber - 1) * numberOfMaxResultsInEachPage;

//   //     if (
//   //       subServiceStartingIndex < 0 ||
//   //       subServiceStartingIndex > totalResultsCount
//   //     ) {
//   //       subServiceStartingIndex = 0;
//   //     }

//   //     let endingSubServiceIndex =
//   //       subServiceStartingIndex + subServiceCountInCurrent <= totalResultsCount
//   //         ? subServiceStartingIndex + subServiceCountInCurrent
//   //         : totalResultsCount;

//   //     const finalSubServicesItems = allOwnedSubServices.slice(
//   //       subServiceStartingIndex,
//   //       endingSubServiceIndex,
//   //     );

//   //     const totalPageCount = Math.ceil(
//   //       totalResultsCount / numberOfMaxResultsInEachPage,
//   //     );

//   //     let firstPageIndex: number;
//   //     let previousPageIndex: number;
//   //     let nextPageIndex: number;
//   //     let lastPageIndex: number;
//   //     let currentPageIndex: number;

//   //     if (totalResultsCount == 0) {
//   //       firstPageIndex = 1;
//   //       previousPageIndex = 1;
//   //       nextPageIndex = 1;
//   //       lastPageIndex = 1;
//   //       currentPageIndex = 1;
//   //     } else {
//   //       firstPageIndex = 1;
//   //       previousPageIndex = pageNumber - 1 > 1 ? pageNumber - 1 : 1;
//   //       nextPageIndex =
//   //         pageNumber + 1 < totalPageCount ? pageNumber + 1 : totalPageCount;
//   //       lastPageIndex = totalPageCount;
//   //       currentPageIndex = pageNumber;
//   //     }

//   //     return {
//   //       items: finalSubServicesItems,
//   //       meta: {
//   //         totalItemsCount: totalResultsCount,
//   //         currentPageItemsCount: subServiceCountInCurrent,
//   //         totalPageCount: totalPageCount,
//   //         currentPageNumber: currentPageIndex,
//   //       },

//   //       links: {
//   //         firstPage: `${process.env.NODE_API_HOST}/subService/get-business-subServices?numberOfMaxResultsInEachPage=${query.numberOfMaxResultsInEachPage}&pageNumber=${firstPageIndex}&isActive=${query.isActive}&searchType=$${query.searchType}&sortType=$${query.sortType}`,
//   //         previousPage: `$${process.env.NODE_API_HOST}/subService/get-business-subServices?numberOfMaxResultsInEachPage=${query.numberOfMaxResultsInEachPage}&pageNumber=${previousPageIndex}&isActive=${query.isActive}&searchType=${query.searchType}&sortType=$${query.sortType}`,
//   //         currentPage: `$${process.env.NODE_API_HOST}/subService/get-business-subServices?numberOfMaxResultsInEachPage=${query.numberOfMaxResultsInEachPage}&pageNumber=${currentPageIndex}&isActive=${query.isActive}&searchType=${query.searchType}&sortType=$${query.sortType}`,
//   //         nextPage: `$${process.env.NODE_API_HOST}/subService/get-business-subServices?numberOfMaxResultsInEachPage=${query.numberOfMaxResultsInEachPage}&pageNumber=${nextPageIndex}&isActive=${query.isActive}&searchType=${query.searchType}&sortType=$${query.sortType}`,
//   //         lastPage: `$${process.env.NODE_API_HOST}/subService/get-business-subServices?numberOfMaxResultsInEachPage=${query.numberOfMaxResultsInEachPage}&pageNumber=${lastPageIndex}&isActive=${query.isActive}&searchType=${query.searchType}&sortType=${query.sortType}`,
//   //       },
//   //     };
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async updateSubServiceVisibility(
//   //   user: User,
//   //   updateInfo: UpdateSubServiceVisibilityDTO,
//   // ): Promise<SubService> {
//   //   try {
//   //     const subService = await this.subServiceRepository.findOne({
//   //       where: {
//   //         isActive: 1,
//   //         id: updateInfo.subServiceId,
//   //       },
//   //       relations: ['owner'],
//   //     });

//   //     if (!subService) {
//   //       throw new HttpException(
//   //         {
//   //           success: false,
//   //           data: {
//   //             errorField: 'subServiceId',
//   //           },
//   //           message: 'SubService with the provided subService Id not found.',
//   //         },
//   //         HttpStatus.BAD_REQUEST,
//   //       );
//   //     }

//   //     if (!subService.owner.isActive) {
//   //       throw new HttpException(
//   //         {
//   //           success: false,
//   //           data: {
//   //             errorField: 'userId',
//   //           },
//   //           message: 'User for the subService is not active.',
//   //         },
//   //         HttpStatus.UNAUTHORIZED,
//   //       );
//   //     }

//   //     if (subService.owner.id !== user.id) {
//   //       throw new HttpException(
//   //         {
//   //           success: false,
//   //           data: {
//   //             errorField: 'userId',
//   //           },
//   //           message: 'Not permission allowed for the user.',
//   //         },
//   //         HttpStatus.UNAUTHORIZED,
//   //       );
//   //     }

//   //     subService.isVisible = updateInfo.newVisibility;

//   //     let newSavedSubService = await this.subServiceRepository.save(subService);
//   //     delete newSavedSubService.owner;
//   //     return newSavedSubService;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

//   // async getSubServiceRepository(): Promise<any> {
//   //   try {
//   //     return await this.subServiceRepository;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }
// }
