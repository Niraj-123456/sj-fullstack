import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ILike, In } from 'typeorm';
import { User } from '../users.entity';
import { UserTokenService } from '../../token/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActiveUserSearchDTO,
  CreateUserDTO,
  CreateUserWithEmailDTO,
  SingleUserSearchByPhoneNumberDTO,
  UserWithClientTypeDTO,
} from '../user.dtos';
import { UserToken } from 'modules/token/token.entity';
import {
  ICommonUserDetails,
  ICommonUserDetailsLogin,
} from '../interfaces/user.interface';
import { UtilsService } from 'common/utils/mapper.service';
import { DiscountService } from 'modules/discount/discount.service';
import { RoleService } from 'modules/role/role.service';
import {
  RoleTypeEnum,
  SearchableRolesEnum,
  UserSearchCriteriaEnum,
} from 'common/constants/enum-constant';
import { Role } from 'modules/role/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(forwardRef(() => UserTokenService))
    private readonly userTokenService: UserTokenService,
    private readonly utilsService: UtilsService,
    private readonly roleService: RoleService,
  ) {}

  getUserRepository() {
    return this.usersRepository;
  }

  // it should be updated with the user entity is updated .i.e those nested relations which need joins
  private allAssociationRelations = [
    'mainDisplayImage',
    'userToken',
    'userRole',
    'userPermissions',
    // 'bookingsToBeUsedForSelf',
    'bookingsToBeUsedForSelf',
    'bookingsMadeAsAClientForOtherCustomer',
    'bookingsMadeAsAStaffForOtherCustomer',
    'servedBookings',
    // 'bookingsToBeUsedForSelf',
    // 'bookingsMadeAsAStaffForOtherCustomer',
    // 'employeeRatingsAsClient',
    'associatedSingleDiscounts',
    'associatedMultipleDiscounts',
    'customerInteractions',
    // 'discounts',
  ];

  private discountAssociationRelations = [
    'mainDisplayImage',
    'userToken',
    'userRole',
    'bookingsToBeUsedForSelf',
    'bookingsMadeAsAStaffForOtherCustomer',
    'associatedSingleDiscounts',
    'associatedMultipleDiscounts',
    'customerInteractions',
    // 'discounts',
  ];
  private allNonAssociativeColumns = [
    'firstName',
    'middleName',
    'lastName',
    'fullAddress',
    'gender',
    'dob',
    'phoneNumber',
    'isPhoneNumberVerified',
    'landlineNumber',
    'email',
    'isEmailVerified',
    'isEmailSubscribedForNewsLetter',
    'isActive',
    'hashPassword',
    'isPasswordSet',
    'isPasswordChangeActionPending',
    'invitedAt',
    'joinedAt',
    'userType',
    'isUserReferred',
  ];

  async findOneWithEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({
        relations: this.allAssociationRelations,
        where: { email, isDeleted: false },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneWithEmailSubscribedToNewsLetter(
    email: string,
  ): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({
        relations: this.allAssociationRelations,
        where: {
          email,
          isDeleted: false,
          isEmailSubscribedForNewsLetter: true,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id, isDeleted: false },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneClientById(id: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id,
          isDeleted: false,
          userRole: {
            name: In([
              RoleTypeEnum.DEFAULTCLIENT,
              RoleTypeEnum.CUSTOMIZEDCLIENT,
            ]),
          },
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findOneServiceProviderById(id: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({
        where: {
          id,
          isDeleted: false,
          userRole: {
            name: In([
              RoleTypeEnum.DEFAULTSERVICEPROVIDER,
              RoleTypeEnum.CUSTOMIZEDSERVICEPROVIDER,
            ]),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({
        relations: this.allAssociationRelations,
        where: { phoneNumber, isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneClientByPhoneNumber(
    phoneNumber: string,
  ): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({
        relations: this.allAssociationRelations,
        where: {
          phoneNumber,
          isDeleted: false,
          userRole: {
            name: In([
              RoleTypeEnum.CUSTOMIZEDCLIENT,
              RoleTypeEnum.DEFAULTCLIENT,
            ]),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneStaffByPhoneNumber(
    phoneNumber: string,
  ): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({
        relations: this.allAssociationRelations,
        where: {
          phoneNumber,
          isDeleted: false,
          userRole: {
            name: In([RoleTypeEnum.CUSTOMIZEDSTAFF, RoleTypeEnum.DEFAULTSTAFF]),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneServiceProviderByPhoneNumber(
    phoneNumber: string,
  ): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({
        relations: this.allAssociationRelations,
        where: {
          phoneNumber,
          isDeleted: false,
          userRole: {
            name: In([
              RoleTypeEnum.DEFAULTSERVICEPROVIDER,
              RoleTypeEnum.CUSTOMIZEDSERVICEPROVIDER,
            ]),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneByPhoneNumberWithPassword(
    phoneNumber: string,
  ): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({
        select: [
          'id',
          'firstName',
          'lastName',
          'phoneNumber',
          'isPhoneNumberVerified',
          'email',
          'isEmailVerified',
          'isEmailSubscribedForNewsLetter',
          'hashPassword',
          'isPasswordSet',
          'userType',
          'gender',
          'dob',
        ],
        relations: this.allAssociationRelations,
        where: { phoneNumber, isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async getUsersForStaff(
    userWithFilteredSourceTypeAppended: UserWithClientTypeDTO,
    searchDetails: ActiveUserSearchDTO,
  ) {
    // numberOfMaxResultsInEachPage : Converting string number type to number type
    if (searchDetails.numberOfMaxResultsInEachPage) {
      searchDetails.numberOfMaxResultsInEachPage = parseInt(
        searchDetails.numberOfMaxResultsInEachPage.toString(),
      );
    } else if (
      !searchDetails.numberOfMaxResultsInEachPage ||
      searchDetails.numberOfMaxResultsInEachPage <= 0
    ) {
      searchDetails.numberOfMaxResultsInEachPage = 5;
    }

    // pageNumber
    if (!searchDetails.pageNumber || searchDetails.pageNumber <= 0) {
      searchDetails.pageNumber = 1;
    }

    //  filter

    let searchableRoleList: RoleTypeEnum[];
    let compulsoryCondtion: object;
    let whereCondtion: object;

    // Assigning right roles based on search Details
    if (searchDetails.role === SearchableRolesEnum.STAFF) {
      searchableRoleList = [
        RoleTypeEnum.DEFAULTSTAFF,
        RoleTypeEnum.CUSTOMIZEDSTAFF,
      ];
    } else if (searchDetails.role === SearchableRolesEnum.CLIENT) {
      searchableRoleList = [
        RoleTypeEnum.DEFAULTCLIENT,
        RoleTypeEnum.CUSTOMIZEDCLIENT,
      ];
    } else if (searchDetails.role === SearchableRolesEnum.SERVICEPROVIDER) {
      searchableRoleList = [
        RoleTypeEnum.DEFAULTSERVICEPROVIDER,
        RoleTypeEnum.CUSTOMIZEDSERVICEPROVIDER,
      ];
    } else {
      searchableRoleList = [
        RoleTypeEnum.DEFAULTCLIENT,
        RoleTypeEnum.CUSTOMIZEDCLIENT,
        RoleTypeEnum.DEFAULTSTAFF,
        RoleTypeEnum.CUSTOMIZEDSTAFF,
        RoleTypeEnum.DEFAULTSERVICEPROVIDER,
        RoleTypeEnum.CUSTOMIZEDSERVICEPROVIDER,
      ];
    }

    compulsoryCondtion = {
      isDeleted: false,
      userRole: {
        name: In(searchableRoleList),
      },
    };

    if (searchDetails.searchCriteria == UserSearchCriteriaEnum.ByPhoneNumber) {
      if (!searchDetails.phoneNumber) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'phoneNumber',
            },
            message: `phoneNumber missing while using ${UserSearchCriteriaEnum.ByPhoneNumber} criteria for search`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      whereCondtion = {
        ...compulsoryCondtion,
        phoneNumber: ILike(`%${searchDetails.phoneNumber}%`),
      };
    } else if (searchDetails.searchCriteria == UserSearchCriteriaEnum.ByName) {
      if (!searchDetails.name) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'name',
            },
            message: `name missing while using ${UserSearchCriteriaEnum.ByName} criteria for search`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      whereCondtion = [
        {
          ...compulsoryCondtion,
          fullName: ILike(`%${searchDetails.name}%`),
        },
        {
          ...compulsoryCondtion,
          firstName: ILike(`%${searchDetails.name}%`),
        },
        {
          ...compulsoryCondtion,
          middleName: ILike(`%${searchDetails.name}%`),
        },
        {
          ...compulsoryCondtion,
          lastName: ILike(`%${searchDetails.name}%`),
        },
      ];
    } else {
      whereCondtion = compulsoryCondtion;
    }

    let totalUserList = await this.usersRepository.find({
      relations: ['userRole'],
      where: whereCondtion,
    });

    let firstPageNumber: number;
    let previousPageNumber: number;
    let nextPageNumber: number;
    let lastPageNumber: number;
    let currentPageNumber: number;

    const totalResultsCount = totalUserList.length;

    let startingIndex =
      searchDetails.pageNumber == 0 || searchDetails.pageNumber == 1
        ? 0
        : searchDetails.pageNumber - 1;

    startingIndex = startingIndex * searchDetails.numberOfMaxResultsInEachPage;

    startingIndex =
      startingIndex < totalResultsCount ? startingIndex : totalResultsCount;

    let endingIndex =
      startingIndex + searchDetails.numberOfMaxResultsInEachPage <=
      totalResultsCount
        ? startingIndex + totalResultsCount
        : totalResultsCount;

    if (startingIndex > totalResultsCount) {
      startingIndex = totalResultsCount;
      endingIndex = totalResultsCount;
    }

    let bookingListForTheQueryPageNumber = totalUserList.slice(
      startingIndex,
      endingIndex,
    );

    const totalPageCount = Math.ceil(
      totalResultsCount / searchDetails.numberOfMaxResultsInEachPage,
    );
    if (totalResultsCount == 0) {
      firstPageNumber = 1;
      previousPageNumber = 1;
      nextPageNumber = 1;
      lastPageNumber = 1;
      currentPageNumber = 1;
    } else {
      firstPageNumber = 1;
      previousPageNumber =
        searchDetails.pageNumber - 1 > 1 ? searchDetails.pageNumber - 1 : 1;
      nextPageNumber =
        searchDetails.pageNumber + 1 < totalPageCount
          ? searchDetails.pageNumber + 1
          : totalPageCount;
      lastPageNumber = totalPageCount;
      currentPageNumber =
        searchDetails.pageNumber > totalPageCount
          ? totalPageCount
          : searchDetails.pageNumber;
    }
    return {
      items: await bookingListForTheQueryPageNumber,
      meta: {
        totalItemsCount: totalResultsCount,
        currentPageItemsCount: bookingListForTheQueryPageNumber.length,
        totalPageCount: totalPageCount,
        currentPageNumber: currentPageNumber,
      },

      links: {
        firstPage: `${process.env.NODE_API_HOST}/user/get-active-users?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&role=${searchDetails.role}`,
        previousPage: `${process.env.NODE_API_HOST}/user/get-active-users?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&role=${searchDetails.role}`,
        currentPage: `${process.env.NODE_API_HOST}/user/get-active-users?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&role=${searchDetails.role}`,
        nextPage: `${process.env.NODE_API_HOST}/user/get-active-users?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&role=${searchDetails.role}`,
        lastPage: `${process.env.NODE_API_HOST}/user/get-active-users?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&role=${searchDetails.role}`,
      },
    };
  }

  // usually while getting a single user only phone number is appropriate because name can be common between users and if name parameter is used, we have to return a list of users instead of a single user
  async getSingleUser(
    userWithFilteredSourceTypeAppended: UserWithClientTypeDTO,
    searchDetails: SingleUserSearchByPhoneNumberDTO,
  ) {
    if (!searchDetails.phoneNumber) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'phoneNumber',
          },
          message: `searchParameter is missing.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let client = await this.findOneClientByPhoneNumber(
      searchDetails.phoneNumber,
    );

    if (!client) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'phoneNumber',
          },
          message: 'User with the phone number does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    let { hashPassword, ...clientWithoutPassword } = { ...client };
    return {
      success: true,
      data: {
        user: clientWithoutPassword,
      },
      message: 'User fetched successfully',
    };
  }
  // async findByPhoneNumberWithManyEntities(
  //   phoneNumber: string,
  // ): Promise<User | undefined> {
  //   try {
  //     return await this.usersRepository.findOne({
  //       relations: [
  //         'userToken',
  //         'userRole',
  //         'business',
  //         'products',
  //         'sales',
  //         'mainDisplayImage',
  //         'businessReviewRates',
  //       ],

  //       where: { phoneNumber, isActive: 0 },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findById(id: string): Promise<User> {
  //   try {
  //     const user = await this.usersRepository.findOne({
  //       where: {
  //         id,
  //         isDeleted: false,
  //       },
  //     });
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findByIdWithDisplayImage(id: string): Promise<User> {
  //   try {
  //     const user = await this.usersRepository.findOne({
  //       where: {
  //         id,
  //         isDeleted: false,
  //       },
  //       relations: ['mainDisplayImage'],
  //     });
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findByIdWithBusiness(id: string): Promise<User> {
  //   try {
  //     const user = await this.usersRepository.findOne({
  //       where: {
  //         id,
  //         isDeleted: false,
  //       },
  //       relations: ['business', 'business.mainLogoImage'],
  //     });
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findByIds(ids: string[]): Promise<User[]> {
  //   try {
  //     const users = await this.usersRepository.find({
  //       where: {
  //         id: In(ids),
  //         isDeleted: false,
  //       },
  //     });
  //     return users;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findByIdWithStories(id: string): Promise<User | any> {
  //   try {
  //     const user = await this.usersRepository.findOne({
  //       where: {
  //         id,
  //         isDeleted: false,
  //       },
  //       relations: ['stories'],
  //     });

  //     const { hashPassword, ...rest } = { ...user };
  //     return rest;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findOneByPhoneNumberWithoutPassword(
  //   phoneNumber: string,
  // ): Promise<User | undefined> {
  //   try {
  //     const user = await this.usersRepository.findOne({
  //       relations: ['userToken'], //there will be a userToken object in the response
  //       where: { phoneNumber: phoneNumber },
  //     });
  //     console.debug('phoneNumber', phoneNumber);
  //     console.debug('findOneByPhoneNumberWithoutPassword', user);
  //     delete user.hashPassword;
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // // async findOneWithActiveProducts(userId: string): Promise<User | undefined> {
  // //   try {
  // //     const user = await this.usersRepository.findOne({
  // //       relations: ['products'], //there will be a userToken object in the response
  // //       where: {
  // //         id: userId,
  // //         isDeleted: false,
  // //         products: {
  // //           isDeleted: false,
  // //         },
  // //       },
  // //     });
  // //     delete user.hashPassword;
  // //     return user;
  // //   } catch (error) {
  // //     throw error;
  // //   }
  // // }

  async addUserWithMoreThanPhoneOrEmail(
    userInfo: CreateUserDTO,
  ): Promise<User> {
    try {
      console.log('Creating new User ........');

      console.log('Setting Role to the user ........');
      let userRole: Role;
      if (!userInfo.roleId) {
        userRole = await this.roleService.findByName(
          RoleTypeEnum.DEFAULTCLIENT,
        );
      } else {
        userRole = await this.roleService.findById(RoleTypeEnum.DEFAULTCLIENT);
      }

      if (!userRole) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'role',
            },
            message: 'Error fetching ROLE. Please contact the administrator.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        throw new Error('');
      }

      const userToken = await this.userTokenService.createNewOTPUserToken();

      if (!userToken) {
        throw new Error('Error while creating OTP');
      }

      let newUser = { ...userInfo, userToken, userRole };

      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async addUserWithPhoneOrEmail(userInfo: CreateUserDTO): Promise<User> {
    try {
      console.log('Creating new User ........');

      // Setting Roles
      console.log('Setting Role to the user ........');
      let userRole: Role;
      if (!userInfo.roleId) {
        userRole = await this.roleService.findByName(
          RoleTypeEnum.DEFAULTCLIENT,
        );
      } else {
        // default they will be client
        userRole = await this.roleService.findById(RoleTypeEnum.DEFAULTCLIENT);
      }

      if (!userRole) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'role',
            },
            message: 'Error fetching ROLE. Please contact the administrator.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const userToken = await this.userTokenService.createNewOTPUserToken();

      if (!userToken) {
        throw new Error('Error while creating OTP');
      }

      let newUser = {
        phoneNumber: userInfo.phoneNumber,
        fullName: userInfo.fullName,

        email: userInfo?.email,
        userToken: userToken,
        userRole: userRole,
      } as {
        phoneNumber: string;
        fullName: string | undefined;
        email: string | undefined;
        userToken: UserToken;
        userRole: Role;
      };

      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async addUserWithEmailOnly(userInfo: CreateUserWithEmailDTO): Promise<User> {
    try {
      console.debug('Creating new User with Email........');
      // Setting Roles
      console.log('Setting Role to the user ........');
      // default they will be client
      let userRole: Role = await this.roleService.findByName(
        RoleTypeEnum.DEFAULTCLIENT,
      );

      if (!userRole) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'role',
            },
            message: 'Error fetching ROLE. Please contact the administrator.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const userToken = await this.userTokenService.createNewOTPUserToken();

      if (!userToken) {
        throw new Error('Error while creating OTP');
      }

      let newUser = {
        phoneNumber: userInfo?.phoneNumber,
        email: userInfo.email,
        userToken: userToken,
        isEmailSubscribedForNewsLetter: userInfo.isEmailSubscribedForNewsLetter,
        userRole: userRole,
      } as {
        phoneNumber: string;
        email: string | undefined;
        userToken: UserToken;
        userRole: Role;
      };

      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async updateWholeEntity(newUserInfo: User): Promise<User> {
    try {
      const toBeUpdatedUser = await this.usersRepository.findOne({
        where: { email: newUserInfo.email },
        relations: this.allAssociationRelations,
      });
      // delete newUserInfo.email;
      // console.debug('toBeUpdatedUser', toBeUpdatedUser);
      // console.debug('newUserInfo', newUserInfo);

      return await this.usersRepository.save({
        ...toBeUpdatedUser, // existing fields
        ...newUserInfo, // updated fields
      });
    } catch (error) {
      throw error;
    }
  }

  async update(phoneNumber: string, newUserInfo: User): Promise<User> {
    try {
      const toBeeUpdatedUser = await this.usersRepository.findOne({
        where: { phoneNumber },
        relations: ['userToken', 'userRole'],
      });

      return await this.usersRepository.save({
        ...toBeeUpdatedUser, // existing fields
        ...newUserInfo, // updated fields
      });
    } catch (error) {
      throw error;
    }
  }

  // //   async remove(email: string): Promise<void> {
  // //     const user = await this.usersRepository.findOne({
  // //       where: { email, isUserDeleted: 0 },
  // //     });
  // //     await user.destroy();
  // //   }

  // async associateBusinessToAUser(
  //   associationInfo: AssociateBusinessToAUserDTO,
  // ): Promise<IAssociateBusinessToAUserResponse> {
  //   try {
  //     let user = await this.usersRepository.findOne({
  //       where: {
  //         id: associationInfo.userId,
  //         isDeleted: false,
  //       },
  //     });

  //     if (!user) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'userId',
  //           },
  //           message: 'Sorry the userId not found.',
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     let business = await this.businessService.findById(
  //       associationInfo.businessId,
  //     );

  //     if (!business) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'businessId',
  //           },
  //           message: 'Sorry the businessId not found.',
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     user.business = business;

  //     await this.usersRepository.save(user);

  //     console.log(
  //       `Business with id :${business.id} linked to user with id:${user.id}`,
  //     );
  //     return {
  //       success: true,
  //       message: 'The business has been successfully associated to the user.',
  //     };
  //   } catch (error) {
  //     console.log('Error while associating business to a user', error);
  //     throw new HttpException(
  //       {
  //         success: false,
  //         data: {},
  //         message: 'Error while associating business to a user',
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async updateUserProfileExceptPhotos(
  //   user: User,
  //   userInfo: UserProfileUpdateDTO,
  // ): Promise<IUserProfileUpdateDTO> {
  //   try {
  //     if (!user) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'userId due to token',
  //           },
  //           message: 'Sorry the userId extracted from Token not found.',
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     if (userInfo.userType) {
  //       user.userType = userInfo.userType;
  //     }

  //     if (userInfo.firstName) {
  //       user.firstName = userInfo.firstName;
  //     }

  //     if (userInfo.lastName) {
  //       user.lastName = userInfo.lastName;
  //     }
  //     if (userInfo.email) {
  //       user.email = userInfo.email;
  //     }
  //     if (userInfo.gender) {
  //       user.gender = userInfo.gender;
  //     }

  //     if (userInfo.dob) {
  //       user.dob = userInfo.dob;
  //     }

  //     if (userInfo.associatedRoleName) {
  //       const roleFromDb = await this.roleService.findByName(
  //         userInfo.associatedRoleName,
  //       );

  //       if (!roleFromDb) {
  //         throw new HttpException(
  //           {
  //             success: false,
  //             data: {
  //               errorField: 'associatedRoleName',
  //             },
  //             message: 'Role with that not found',
  //           },
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }
  //       user.userRole = roleFromDb;
  //     }

  //     await this.usersRepository.save(user);

  //     return {
  //       success: true,
  //       message: 'User profile successfully updated.',
  //     };
  //   } catch (error) {
  //     console.log('Error while updating user profile', error);
  //     throw error;
  //   }
  // }

  // async updateUserProfilePhoto(
  //   user: User,
  //   body: UserProfileDisplayImageUpdateDTO,
  // ): Promise<IUserProfileUpdateDTO> {
  //   try {
  //     if (!user) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'userId due to token',
  //           },
  //           message: 'Sorry the userId extracted from Token not found.',
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     if (body.mainDisplayImage[0]) {
  //       //store the main logo

  //       const uploadRes = await this.s3Service.uploadFile(
  //         body.mainDisplayImage[0],
  //         AWSVars[process.env.MODE]['AWS_S3_BUCKET_PATH_FOR_USER_IMAGE'],
  //         true,
  //         FileTypeEnum.IMAGE,
  //       );

  //       let newFileInfo = new CreateFileDTO();

  //       //TODO store the added name
  //       newFileInfo.fileName = body.mainDisplayImage[0].originalname;
  //       newFileInfo.type = FileTypeEnum.IMAGE;
  //       newFileInfo.s3Url = uploadRes.Location;
  //       newFileInfo.userId = user.id;

  //       const newFile = await this.fileService.addFile(newFileInfo);
  //       if (!newFile) {
  //         throw new NotImplementedException(
  //           'Error while updating the display picture.',
  //         );
  //       }
  //       user.mainDisplayImage = newFile;
  //     }

  //     await this.usersRepository.save(user);

  //     return {
  //       success: true,
  //       message: 'User profile successfully updated.',
  //     };
  //   } catch (error) {
  //     console.log('Error while updating the display picture.', error);
  //     throw error;
  //   }
  // }

  // async removeUserProfilePhoto(user: User): Promise<IUserProfileUpdateDTO> {
  //   try {
  //     let userWithImage = await this.findByIdWithDisplayImage(user.id);

  //     if (
  //       !userWithImage.mainDisplayImage ||
  //       !userWithImage.mainDisplayImage.isActive
  //     ) {
  //       return {
  //         success: false,
  //         message: 'No image to remove',
  //       };
  //     }

  //     await this.fileService.deleteById(userWithImage.mainDisplayImage.id);

  //     userWithImage.mainDisplayImage = null;

  //     await this.usersRepository.save(userWithImage);

  //     return {
  //       success: true,
  //       message: 'User profile successfully removed.',
  //     };
  //   } catch (error) {
  //     console.log('Error while removing the display picture.', error);
  //     throw error;
  //   }
  // }

  // we will include token in logins only,  here we will exclude it
  async getCommonUserDetails(fullUser: User): Promise<ICommonUserDetails> {
    const extractICommonUserDetails =
      this.utilsService.extract<ICommonUserDetails>({
        id: true,
        firstName: true,
        middleName: true,
        fullName: true,
        lastName: true,
        phoneNumber: true,
        isPhoneNumberVerified: true,
        landlineNumber: true,
        fullAddress: true,
        email: true,
        isEmailVerified: true,
        isEmailSubscribedForNewsLetter: true,
        isPasswordSet: true,
        mainDisplayImage: true,
        // userToken: true,
        userRole: true,
        // userPermissions: true,
        // business: true,
        userType: true,
        gender: true,
        dob: true,
      });

    const userLevelFiltered = extractICommonUserDetails(fullUser);

    return userLevelFiltered;
  }

  // we will include token in logins only
  async getCommonUserDetailsLogin(
    fullUser: User,
  ): Promise<ICommonUserDetailsLogin> {
    const extractICommonUserDetailsLogin =
      this.utilsService.extract<ICommonUserDetailsLogin>({
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        isPhoneNumberVerified: true,
        email: true,
        isEmailVerified: true,
        isEmailSubscribedForNewsLetter: true,
        isPasswordSet: true,
        mainDisplayImage: true,
        // userToken: true,
        userRole: true,
        userPermissions: true,

        // business: true,
        userType: true,
        dob: true,
        gender: true,
      });

    const userLevelFiltered = extractICommonUserDetailsLogin(fullUser);

    // userLevelFiltered.userToken =
    //   await this.userTokenService.getCommonTokenDetails(
    //     userLevelFiltered.userToken,
    //   );
    // const userLevelFiltered.userToken =await this.userTokenService.getCommonTokenDetails( userLevelFiltered.userToken)

    return userLevelFiltered;
  }

  // async getUsersWithStories(): Promise<any> {
  //   try {
  //     let allUsers = (await this.usersRepository.find({
  //       where: {
  //         isDeleted: false,
  //       },
  //       relations: [
  //         'stories',
  //         'stories.usersWhichHaveViewedTheStory',
  //         'stories.mainMediaFile',
  //       ],

  //       //either true or timeInMillisecond
  //       // cache: 5000, // a cache of 5 secs
  //     })) as User[];

  //     return allUsers;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getUsersUptoProducts(userId: string): Promise<any> {
  //   try {
  //     let allUsersInfoUptoProduct = await this.usersRepository.find({
  //       where: {
  //         isDeleted: false,
  //         id: userId,
  //       },
  //       relations: [
  //         'business',
  //         'business.categories',
  //         'business.categories.subCategories',
  //         'business.categories.subCategories.productGroups',
  //         'business.categories.subCategories.productGroups.products',
  //       ],

  //       //either true or timeInMillisecond
  //       // cache: 3000, // a cache of 3 secs
  //     });

  //     return allUsersInfoUptoProduct;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getUsersWithUnExpiredStories(): Promise<User[]> {
  //   try {
  //     let allUsers = (await this.usersRepository.find({
  //       where: {
  //         isDeleted: false,
  //       },
  //       relations: [
  //         'stories',
  //         // 'stories.userWhichUploadedTheStory',
  //         'stories.usersWhichHaveViewedTheStory',
  //         'stories.mainMediaFile',
  //       ],

  //       //either true or timeInMillisecond
  //       // cache: 5000, // a cache of 5 secs
  //     })) as User[];

  //     let allUsersWithUnExpiredStories = [];
  //     allUsers.forEach((user) => {
  //       let { hashPassword, ...userWithoutPasswordAndUnexpiredStory } = {
  //         ...user,
  //       };

  //       let storiesWithoutUserPassword;
  //       user.stories.forEach((story) => {
  //         story.usersWhichHaveViewedTheStory?.forEach((viewer) => {
  //           delete viewer?.hashPassword;
  //           return viewer;
  //         });

  //         return story;
  //       });

  //       allUsersWithUnExpiredStories.push({
  //         ...userWithoutPasswordAndUnexpiredStory,
  //         stories: user.stories.filter(
  //           (story) => story.expireAt >= new Date() && story.isActive == true,
  //         ),
  //       });
  //     });

  //     return allUsersWithUnExpiredStories;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
