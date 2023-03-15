import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DiscountOfferingTypeEnum,
  DiscountExpirationTypeEnum,
  DiscountReceivedNatureEnum,
  DiscountUserAssociationTypeEnum,
} from 'common/constants/enum-constant';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { AfterDate } from 'common/utils/time.utils';
import { ServiceService } from 'modules/service/service.service';
import { UserService } from 'modules/users/services/users.service';
import { CreateUserDTO, UserWithClientTypeDTO } from 'modules/users/user.dtos';
import { User } from 'modules/users/users.entity';
import { In, MoreThan, Repository, UpdateResult, LessThan } from 'typeorm';
import { CreateDiscountDTO } from './discount.dtos';
import { Discount } from './discount.entity';

// import { CreateDiscountDTO } from './discount.dtos';
// import { Discount } from './discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    // @Inject(forwardRef(() => BusinessService)) // private readonly businessService: BusinessService, // private readonly representativeService: RepresentativeService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly serviceService: ServiceService,
  ) {}

  getDiscountRepository() {
    return this.discountRepository;
  }
  async addDiscount(
    singleUser: User,
    multipleUsers: User[],
    discountInfo: CreateDiscountDTO,
  ): Promise<GenericResponseDTO> {
    try {
      console.debug('Creating new Discount ........');

      let newDiscount = new Discount();

      if (discountInfo.receivedNature) {
        newDiscount.receivedNature = discountInfo.receivedNature;

        if (discountInfo.discountCode) {
          newDiscount.discountCode = discountInfo.discountCode;
        }
      }

      if (discountInfo.offeringType) {
        newDiscount.offeringType = discountInfo.offeringType;
        // depending on the offering type, we set the discount
        if (
          newDiscount.offeringType == DiscountOfferingTypeEnum.Flat &&
          discountInfo.discountedFlatAmount
        ) {
          newDiscount.discountedFlatAmount = discountInfo.discountedFlatAmount;
        } else if (
          newDiscount.offeringType == DiscountOfferingTypeEnum.Percentage &&
          discountInfo.discountedPercentage
        ) {
          newDiscount.discountedPercentage = discountInfo.discountedPercentage;
        }
      }

      if (discountInfo.expirationType) {
        newDiscount.expirationType = discountInfo.expirationType;
        // depending on the expiration type, we set the expiryForTheDiscount
        if (
          newDiscount.expirationType == DiscountExpirationTypeEnum.TimePeriod &&
          discountInfo.expiryDateTime
        ) {
          // newDiscount.endingDateTime = discountInfo.endingDateTime;
          newDiscount.expiryDateTime = discountInfo.expiryDateTime;
        } else if (
          newDiscount.expirationType ==
            DiscountExpirationTypeEnum.ResuableCount &&
          discountInfo.initialReusuableCount
        ) {
          newDiscount.initialReusuableCount =
            discountInfo.initialReusuableCount;
          newDiscount.reusuableCountLeft = discountInfo.initialReusuableCount;
        } else if (
          newDiscount.expirationType ==
          DiscountExpirationTypeEnum.BothTimeAndCount
        ) {
          // newDiscount.endingDateTime = discountInfo.endingDateTime;
          newDiscount.expiryDateTime = discountInfo.expiryDateTime;
          newDiscount.initialReusuableCount =
            discountInfo.initialReusuableCount;
          newDiscount.reusuableCountLeft = discountInfo.initialReusuableCount;
        }
      }

      if (discountInfo.userAssociation) {
        newDiscount.userAssociation = discountInfo.userAssociation;

        if (
          discountInfo.userAssociation ==
            DiscountUserAssociationTypeEnum.SingleUserAssociation &&
          singleUser
        ) {
          newDiscount.associatedSingleUser = singleUser;
        } else if (
          discountInfo.userAssociation ==
            DiscountUserAssociationTypeEnum.MultipleUsersAssociation &&
          multipleUsers
        ) {
          newDiscount.associatedMultipleUsers = multipleUsers;
        }
      }

      if (discountInfo.linkerUUID) {
        newDiscount.linkerUUID = discountInfo.linkerUUID;
      }

      await this.discountRepository.save(newDiscount);

      return {
        success: true,
        message:
          'Request successfully submitted. Our representative will get back to you.',
      };
    } catch (error) {
      throw error;
    }
  }

  async useDiscountInBooking(
    singleUser: User,
    multipleUsers: User[],
    discountInfo: CreateDiscountDTO,
  ): Promise<GenericResponseDTO> {
    try {
      console.debug('Creating new Discount ........');

      let newDiscount = new Discount();

      if (discountInfo.receivedNature) {
        newDiscount.receivedNature = discountInfo.receivedNature;

        if (
          discountInfo.receivedNature == DiscountReceivedNatureEnum.Coupon &&
          discountInfo.discountCode
        ) {
          newDiscount.discountCode = discountInfo.discountCode;
        }
      }

      if (discountInfo.offeringType) {
        newDiscount.offeringType = discountInfo.offeringType;
        // depending on the offering type, we set the discount
        if (
          newDiscount.offeringType == DiscountOfferingTypeEnum.Flat &&
          discountInfo.discountedFlatAmount
        ) {
          newDiscount.discountedFlatAmount = discountInfo.discountedFlatAmount;
        } else if (
          newDiscount.offeringType == DiscountOfferingTypeEnum.Percentage &&
          discountInfo.discountedPercentage
        ) {
          newDiscount.discountedPercentage = discountInfo.discountedPercentage;
        }
      }

      if (discountInfo.expirationType) {
        newDiscount.expirationType = discountInfo.expirationType;
        // depending on the expiration type, we set the expiryForTheDiscount
        if (
          newDiscount.expirationType == DiscountExpirationTypeEnum.TimePeriod &&
          discountInfo.expiryDateTime
        ) {
          // newDiscount.endingDateTime = discountInfo.endingDateTime;
          newDiscount.expiryDateTime = discountInfo.expiryDateTime;
        } else if (
          newDiscount.expirationType ==
            DiscountExpirationTypeEnum.ResuableCount &&
          discountInfo.initialReusuableCount
        ) {
          newDiscount.initialReusuableCount =
            discountInfo.initialReusuableCount;
          newDiscount.reusuableCountLeft = discountInfo.initialReusuableCount;
        } else if (
          newDiscount.expirationType ==
          DiscountExpirationTypeEnum.BothTimeAndCount
        ) {
          // newDiscount.endingDateTime = discountInfo.endingDateTime;
          newDiscount.expiryDateTime = discountInfo.expiryDateTime;
          newDiscount.initialReusuableCount =
            discountInfo.initialReusuableCount;
          newDiscount.reusuableCountLeft = discountInfo.initialReusuableCount;
        }
      }

      if (discountInfo.userAssociation) {
        newDiscount.userAssociation = discountInfo.userAssociation;

        if (
          discountInfo.userAssociation ==
            DiscountUserAssociationTypeEnum.SingleUserAssociation &&
          singleUser
        ) {
          newDiscount.associatedSingleUser = singleUser;
        } else if (
          discountInfo.userAssociation ==
            DiscountUserAssociationTypeEnum.MultipleUsersAssociation &&
          multipleUsers
        ) {
          newDiscount.associatedMultipleUsers = multipleUsers;
        }
      }

      if (discountInfo.linkerUUID) {
        newDiscount.linkerUUID = discountInfo.linkerUUID;
      }

      await this.discountRepository.save(newDiscount);

      return {
        success: true,
        message:
          'Request successfully submitted. Our representative will get back to you.',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Discount[]> {
    try {
      return await this.discountRepository.find({
        order: {
          // id: "DESC"
        },
        where: { isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<Discount> {
    try {
      const Discount = await this.discountRepository.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });
      return Discount;
    } catch (error) {
      throw error;
    }
  }

  async findUsableUserDiscountById(
    discountId: number,
    userId: string,
  ): Promise<Discount> {
    try {
      const Discount = await this.discountRepository.findOne({
        where: [
          {
            id: discountId,
            isDeleted: false,
            isDiscountUsable: true,
            associatedSingleUser: {
              id: userId,
            },
            expirationType: DiscountExpirationTypeEnum.ResuableCount,
            reusuableCountLeft: MoreThan(0),
          },
          {
            id: discountId,
            isDeleted: false,
            isDiscountUsable: true,
            associatedSingleUser: {
              id: userId,
            },
            expirationType: DiscountExpirationTypeEnum.TimePeriod,
            expiryDateTime: LessThan(new Date()),
          },
          {
            id: discountId,
            isDeleted: false,
            isDiscountUsable: true,
            associatedSingleUser: {
              id: userId,
            },
            expirationType: DiscountExpirationTypeEnum.BothTimeAndCount,
            reusuableCountLeft: MoreThan(0),
            expiryDateTime: LessThan(new Date()),
          },
        ],
      });
      return Discount;
    } catch (error) {
      throw error;
    }
  }

  async getUserReferralDisountsSortedByDate(client: User) {
    let referralDiscountsNature = [
      DiscountReceivedNatureEnum.Referee,
      DiscountReceivedNatureEnum.Referrer,
    ];

    return await this.discountRepository.find({
      order: {
        createdDateTime: 'DESC',
      },
      where: [
        {
          isDeleted: false,
          receivedNature: In(referralDiscountsNature),
          expirationType: DiscountExpirationTypeEnum.ResuableCount,
          userAssociation:
            DiscountUserAssociationTypeEnum.SingleUserAssociation,
          associatedSingleUser: {
            id: client.id,
          },
          reusuableCountLeft: MoreThan(0),
        },
        {
          isDeleted: false,
          receivedNature: In(referralDiscountsNature),
          expirationType: DiscountExpirationTypeEnum.TimePeriod,
          userAssociation:
            DiscountUserAssociationTypeEnum.SingleUserAssociation,
          associatedSingleUser: {
            id: client.id,
          },
          expiryDateTime: LessThan(new Date()),
        },
        {
          isDeleted: false,
          receivedNature: In(referralDiscountsNature),
          expirationType: DiscountExpirationTypeEnum.BothTimeAndCount,
          userAssociation:
            DiscountUserAssociationTypeEnum.SingleUserAssociation,
          associatedSingleUser: {
            id: client.id,
          },
          reusuableCountLeft: MoreThan(0),
          expiryDateTime: LessThan(new Date()),
        },
      ],
    });
  }

  // async findByType(type: string): Promise<Discount[]> {
  //   try {
  //     if (!(type in DiscountTypeEnum)) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'DiscountType',
  //           },
  //           message: 'Customer Request Type is not valid.',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const Discount = await this.discountRepository.find({
  //       where: {
  //         type: type,
  //       },
  //     });
  //     return Discount;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findByIdList(idList: string[]): Promise<Discount[]> {
  //   try {
  //     const Discount = await this.discountRepository.find({
  //       where: {
  //         id: In(idList),
  //         isDeleted: false,
  //       },
  //     });
  //     return Discount;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updateDiscount(discountInfo: Discount): Promise<UpdateResult> {
    return await this.discountRepository.update(discountInfo.id, discountInfo);
  }
  async makeReferralAndRefereeDiscountsValidFromRefreeUser(
    referee: User,
  ): Promise<any> {
    try {
      // Since one user can be referee for just once
      let refreeDiscount = await this.discountRepository.findOne({
        where: {
          isDeleted: false,
          isDiscountUsable: false,
          receivedNature: DiscountReceivedNatureEnum.Referee,
          reusuableCountLeft: MoreThan(0),
          userAssociation:
            DiscountUserAssociationTypeEnum.SingleUserAssociation,
          associatedSingleUser: {
            id: referee.id,
          },
        },
      });

      let referrerDiscount = await this.discountRepository.findOne({
        where: {
          isDeleted: false,
          isDiscountUsable: false,
          receivedNature: DiscountReceivedNatureEnum.Referrer,
          reusuableCountLeft: MoreThan(0),
          userAssociation:
            DiscountUserAssociationTypeEnum.SingleUserAssociation,
          linkerUUID: refreeDiscount.linkerUUID,
        },
      });

      await this.updateDiscount({
        ...referrerDiscount,
        isDiscountUsable: true,
      });
      await this.updateDiscount({
        ...refreeDiscount,
        isDiscountUsable: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // async deleteById(id) {
  //   //delete function accepts id or group of ids
  //   return await this.discountRepository.delete(id);
  // }
}
