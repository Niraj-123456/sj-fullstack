import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilteredSourceTypeWithAnonymityEnum,
  BookingStatusEnum,
  BookingSourceFormEnum,
  BookingFilterTypeCriteriaEnum,
  BookingSortCriteriaEnum,
  SearchSortValueEnum,
  CustomerInteractionTypeEnum,
  RoleTypeEnum,
  DiscountExpirationTypeEnum,
  BookingTypeByInitiatorEnum,
} from 'common/constants/enum-constant';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { AfterDate } from 'common/utils/time.utils';
import { endOfDay, isThursday, startOfDay } from 'date-fns';
import { CustomerInteraction } from 'modules/customer-interaction/customer-interaction.entity';
import { CustomerInteractionService } from 'modules/customer-interaction/customer-interaction.service';
import { Discount } from 'modules/discount/discount.entity';
import { DiscountService } from 'modules/discount/discount.service';
import { ServiceService } from 'modules/service/service.service';
import { UserService } from 'modules/users/services/users.service';
import { CreateUserDTO, UserWithClientTypeDTO } from 'modules/users/user.dtos';
import { User } from 'modules/users/users.entity';
import {
  Between,
  ILike,
  In,
  MoreThanOrEqual,
  Raw,
  Repository,
  UpdateResult,
} from 'typeorm';
import {
  BookingSearchBasedOnFiltersDTO,
  CreateBookingDTO,
  UpdateBookingDTO,
} from './booking.dtos';
import { Booking } from './booking.entity';

// import { CreateBookingDTO } from './booking.dtos';
// import { Booking } from './booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    // @Inject(forwardRef(() => BusinessService)) // private readonly businessService: BusinessService, // private readonly representativeService: RepresentativeService,
    private readonly userService: UserService,
    private readonly serviceService: ServiceService,
    private readonly customerInteractionService: CustomerInteractionService,
    private readonly discountService: DiscountService,
  ) {}

  bookingAssociations = [
    'clientWhoBooked',
    'clientWhoUses',
    'staffWhoBooked',
    'serviceProvider',
    'associatedServices',
    'bookingReview',
    'discounts',
  ];

  private async generateABookingId() {
    // the format will be YEAR-MONTH-DATE-ORDERNUMBERTHATDAY
    var today = new Date();
    var date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();

    let latestBooking = await this.findLatestBooking();
    var latestIndex = 1;
    if (latestBooking) {
      console.log(latestBooking.id.split('-')[3]);
      latestIndex = parseInt(latestBooking.id.split('-')[3]) + 1;
    }
    console.debug('date', date + '-' + latestIndex.toString());
    return date + '-' + latestIndex.toString();
  }

  async addBooking(
    userWithFilteredSourceTypeAppended: UserWithClientTypeDTO,
    bookingInfo: CreateBookingDTO,
  ): Promise<GenericResponseDTO> {
    try {
      console.debug('Creating new Booking ........');

      let newBooking = new Booking();

      newBooking.id = await this.generateABookingId();

      console.debug(newBooking.id);

      // we cannot check nullness of userWithFilteredSourceTypeAppended as it will always be filled with filteredSourceType,filteredSourceTypeWithAnonymity
      // so we need to check if the user.id or user.phone number is present or not
      if (userWithFilteredSourceTypeAppended.id) {
        if (
          userWithFilteredSourceTypeAppended.userRole.name ==
            RoleTypeEnum.DEFAULTCLIENT ||
          userWithFilteredSourceTypeAppended.userRole.name ==
            RoleTypeEnum.CUSTOMIZEDCLIENT
        ) {
          newBooking.staffWhoBooked = null;
          newBooking.bookingSourceForm =
            BookingSourceFormEnum.WebAppLoggedInUserForm;
          // that means logged in user
          // if the user is client and booking for self, then use client phone number and name
          if (bookingInfo.isForSelf) {
            newBooking.bookingTypeByInitiator =
              BookingTypeByInitiatorEnum.BookedByCustomerForSelf;
            newBooking.clientWhoBooked = userWithFilteredSourceTypeAppended;
            newBooking.staffWhoBooked = null;
            newBooking.clientWhoUses = userWithFilteredSourceTypeAppended;
          } else {
            newBooking.bookingTypeByInitiator =
              BookingTypeByInitiatorEnum.BookedByCustomerForOthers;

            newBooking.clientWhoBooked = userWithFilteredSourceTypeAppended;
            newBooking.staffWhoBooked = null;
            // We should make sure the service user should be in database before being assigned to a new booking
            if (bookingInfo.contactNumber) {
              let actualServiceUser =
                await this.userService.findOneClientByPhoneNumber(
                  bookingInfo.contactNumber,
                );
              if (!actualServiceUser) {
                //internally register the user
                let userInfo = new CreateUserDTO();
                userInfo.phoneNumber = bookingInfo.contactNumber;
                userInfo.fullName = bookingInfo.fullName;
                actualServiceUser =
                  await this.userService.addUserWithPhoneOrEmail(userInfo);
              }
              newBooking.clientWhoUses = userWithFilteredSourceTypeAppended;
            }
          }
        } else if (
          userWithFilteredSourceTypeAppended.userRole.name ==
            RoleTypeEnum.DEFAULTSTAFF ||
          userWithFilteredSourceTypeAppended.userRole.name ==
            RoleTypeEnum.CUSTOMIZEDSTAFF
        ) {
          newBooking.bookingTypeByInitiator =
            BookingTypeByInitiatorEnum.BookedByStaffForCustomer;
          newBooking.staffWhoBooked = userWithFilteredSourceTypeAppended;
          newBooking.clientWhoBooked = null;
          newBooking.bookingSourceForm =
            BookingSourceFormEnum.WebAppLoggedInStaffForm;
          // Staff should make sure only the number from which the call is being accepted should be used
          if (bookingInfo.contactNumber) {
            let actualServiceUser =
              await this.userService.findOneClientByPhoneNumber(
                bookingInfo.contactNumber,
              );
            if (!actualServiceUser) {
              //internally register the user
              let userInfo = new CreateUserDTO();
              userInfo.phoneNumber = bookingInfo.contactNumber;
              userInfo.fullName = bookingInfo.fullName;
              actualServiceUser =
                await this.userService.addUserWithPhoneOrEmail(userInfo);
            }
            newBooking.clientWhoUses = actualServiceUser;
          }
        }
      }

      // console.debug('newBooking.clientWhoUses 1', newBooking.clientWhoUses);

      if (!userWithFilteredSourceTypeAppended.id) {
        newBooking.bookingTypeByInitiator =
          BookingTypeByInitiatorEnum.BookedByAnonymous;
        newBooking.staffWhoBooked = null;
        newBooking.clientWhoBooked = null;

        if (!bookingInfo.contactNumber) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'contactNumber',
              },
              message: 'Contact number necessary for unauthenticated users.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        let actualServiceUser =
          await this.userService.findOneClientByPhoneNumber(
            bookingInfo.contactNumber,
          );
        if (!actualServiceUser) {
          //internally register the user
          let userInfo = new CreateUserDTO();
          userInfo.phoneNumber = bookingInfo.contactNumber;
          userInfo.fullName = bookingInfo.fullName;
          actualServiceUser = await this.userService.addUserWithPhoneOrEmail(
            userInfo,
          );
        }
        newBooking.clientWhoUses = actualServiceUser;
      }

      if (bookingInfo.servicesIds) {
        let activeServices =
          await this.serviceService.filterActiveServicesFromIdList(
            bookingInfo.servicesIds,
          );

        let activeServiceIdsList = activeServices.map((each) => each.id);

        // check which ids in bookingInfo.servicesIds are not present in database service list activeServiceIdsList
        let rejectIds = bookingInfo.servicesIds.filter(
          (x) => !activeServiceIdsList.includes(x),
        );

        if (activeServices.length < bookingInfo.servicesIds.length) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: `${rejectIds.toString()} servicesIds`,
              },
              message: 'Not all services  are valid',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        newBooking.associatedServices = activeServices;
        // activeServiceIdsList;
        // rejectIds;
      }

      if (bookingInfo.unfilteredSourceInfo) {
        newBooking.unfilteredSourceInfo = bookingInfo.unfilteredSourceInfo;
      }
      if (userWithFilteredSourceTypeAppended.filteredSourceType) {
        newBooking.filteredSourceType =
          userWithFilteredSourceTypeAppended.filteredSourceType;
      }
      if (userWithFilteredSourceTypeAppended.filteredSourceTypeWithAnonymity) {
        newBooking.filteredSourceTypeWithAnonymity =
          userWithFilteredSourceTypeAppended.filteredSourceTypeWithAnonymity;
      }

      if (bookingInfo.explanation) {
        newBooking.explanation = bookingInfo.explanation;
      }

      if (bookingInfo.newRequestedServices) {
        let newCustomerRequest = new CustomerInteraction();
        newCustomerRequest.type =
          CustomerInteractionTypeEnum.RequestNewServiceWhileBooking;
        if (userWithFilteredSourceTypeAppended.id) {
          newCustomerRequest.userWhoInteracted =
            userWithFilteredSourceTypeAppended;

          newCustomerRequest.explanation = `RequestedServices: ${bookingInfo.newRequestedServices.toString()} by  ${
            userWithFilteredSourceTypeAppended.firstName
          } ${userWithFilteredSourceTypeAppended.lastName} on Booking with id ${
            newBooking.id
          }`;
        } else {
          newCustomerRequest.userWhoInteracted = newBooking.clientWhoUses;

          let userName = newBooking.clientWhoUses.fullAddress
            ? newBooking.clientWhoUses.fullAddress
            : bookingInfo.fullName;
          newCustomerRequest.explanation = `RequestedServices: ${bookingInfo.newRequestedServices.toString()} by  ${userName} on Booking with id ${
            newBooking.id
          }`;
        }

        newCustomerRequest.requestedServices = bookingInfo.newRequestedServices;

        // console.debug('newCustomerRequest', newCustomerRequest);
        const registeredCustomerInteraction =
          await this.customerInteractionService.saveCusomterInteraction(
            newCustomerRequest,
          );

        // console.debug(
        //   'registeredCustomerInteraction',
        //   registeredCustomerInteraction,
        // );

        newBooking.customerInteraction = registeredCustomerInteraction;
        newBooking.bookingSourceForm = bookingInfo.bookingSourceForm;
      }

      let discount: Discount;
      if (bookingInfo.discountId) {
        if (!userWithFilteredSourceTypeAppended.id) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'discountID',
              },
              message: 'Discount is only applicable for authenticated user',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        console.debug(bookingInfo.discountId, newBooking.clientWhoUses.id);
        // discount case is only applicable when a logged in user makes his own booking
        if (
          userWithFilteredSourceTypeAppended.userRole.name ===
            RoleTypeEnum.DEFAULTCLIENT ||
          userWithFilteredSourceTypeAppended.userRole.name ===
            RoleTypeEnum.CUSTOMIZEDCLIENT
        ) {
          discount = await this.discountService.findUsableUserDiscountById(
            bookingInfo.discountId,
            userWithFilteredSourceTypeAppended.id,
          );
        }

        if (
          userWithFilteredSourceTypeAppended.userRole.name ===
            RoleTypeEnum.DEFAULTSTAFF ||
          userWithFilteredSourceTypeAppended.userRole.name ===
            RoleTypeEnum.CUSTOMIZEDSTAFF
        ) {
          discount = await this.discountService.findUsableUserDiscountById(
            bookingInfo.discountId,
            newBooking.clientWhoUses.id,
          );
        }
        if (!discount) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'discountId',
              },
              message: 'Invalid discountId',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        let discounts: Discount[] = [];
        discounts.push(discount);
        newBooking.discounts = discounts;

        // Setting discount variables
        if (
          discount.expirationType == DiscountExpirationTypeEnum.ResuableCount
        ) {
          discount.reusuableCountLeft = discount.reusuableCountLeft - 1;
          if (discount.reusuableCountLeft == 0) {
            discount.isDiscountUsable = false;
          }
        } else if (
          discount.expirationType == DiscountExpirationTypeEnum.TimePeriod
        ) {
          if (discount.expiryDateTime > new Date()) {
            discount.isDiscountUsable = false;
          }
        } else if (
          discount.expirationType == DiscountExpirationTypeEnum.BothTimeAndCount
        ) {
          if (
            discount.expiryDateTime > new Date() ||
            discount.reusuableCountLeft == 0
          ) {
            discount.isDiscountUsable = false;
          }
        }

        await this.discountService.updateDiscount(discount);
      }

      console.debug('newBooking', newBooking);

      const bookingInDatabase = await this.bookingRepository.save(newBooking);

      if (!bookingInDatabase) {
        throw new HttpException(
          {
            success: false,
            message:
              'Error while saving the booking. Please contact administrator',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      const bookingWithAllRelations = await this.findById(bookingInDatabase.id);

      return {
        success: true,
        data: {
          bookingDetails: bookingWithAllRelations,
        },
        message:
          'Request successfully submitted. Our representative will get back to you.',
      };
    } catch (error) {
      throw error;
    }
  }

  async updateBooking(
    userWithFilteredSourceTypeAppended: UserWithClientTypeDTO,
    bookingInfo: UpdateBookingDTO,
  ): Promise<GenericResponseDTO> {
    try {
      console.debug('Updating Booking ........');

      let existingBooking = await this.findById(bookingInfo.bookingId);

      if (!existingBooking) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: `bookingId`,
            },
            message: `Booking with the id ${bookingInfo.bookingId} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (bookingInfo.status) {
        existingBooking.status = bookingInfo.status;
      }

      if (bookingInfo.explanation) {
        existingBooking.explanation = bookingInfo.explanation;
      }

      // if (bookingInfo.clientWhoUsesId) {
      //   let actualServiceUser =
      //     await this.userService.findOneClientById(
      //       bookingInfo.clientWhoUsesId,
      //     );
      //   if (!actualServiceUser) {
      //     //internally register the user
      //     let userInfo = new CreateUserDTO();
      //     userInfo.phoneNumber = bookingInfo.clientWhoUsesId;
      //     userInfo.fullName = bookingInfo.fullName;
      //     actualServiceUser = await this.userService.addUserWithPhoneOrEmail(
      //       userInfo,
      //     );
      //   }

      //   existingBooking.clientWhoUses = actualServiceUser;
      // }

      if (bookingInfo.servicesIds) {
        let activeServices =
          await this.serviceService.filterActiveServicesFromIdList(
            bookingInfo.servicesIds,
          );

        let activeServiceIdsList = activeServices.map((each) => each.id);

        // check which ids in bookingInfo.servicesIds are not present in database service list activeServiceIdsList
        let rejectIds = bookingInfo.servicesIds.filter(
          (x) => !activeServiceIdsList.includes(x),
        );

        if (activeServices.length < bookingInfo.servicesIds.length) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: `${rejectIds.toString()} servicesIds`,
              },
              message: 'Not all services  are valid',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        existingBooking.associatedServices = activeServices;
      }

      if (bookingInfo.serviceProviderId) {
        let serviceProvider = await this.userService.findOneServiceProviderById(
          bookingInfo.serviceProviderId,
        );

        if (!serviceProvider) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: `serviceProviderId`,
              },
              message:
                'The following service provider with the id doesnot exist.',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        existingBooking.serviceProvider = serviceProvider;
      }

      let discount: Discount;
      if (bookingInfo.discountId) {
        // discount case is only applicable when a logged in user makes his own booking
        if (
          userWithFilteredSourceTypeAppended.userRole.name ===
            RoleTypeEnum.DEFAULTCLIENT ||
          userWithFilteredSourceTypeAppended.userRole.name ===
            RoleTypeEnum.CUSTOMIZEDCLIENT
        ) {
          discount = await this.discountService.findUsableUserDiscountById(
            bookingInfo.discountId,
            userWithFilteredSourceTypeAppended.id,
          );
        }

        if (
          userWithFilteredSourceTypeAppended.userRole.name ===
            RoleTypeEnum.DEFAULTSTAFF ||
          userWithFilteredSourceTypeAppended.userRole.name ===
            RoleTypeEnum.CUSTOMIZEDSTAFF
        ) {
          discount = await this.discountService.findUsableUserDiscountById(
            bookingInfo.discountId,
            existingBooking.clientWhoUses.id,
          );
        }

        if (!discount) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'discountId',
              },
              message: 'Invalid discountId',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        let discounts: Discount[] = [];
        discounts.push(discount);
        existingBooking.discounts = discounts;

        // Setting discount variables
        if (
          discount.expirationType == DiscountExpirationTypeEnum.ResuableCount
        ) {
          discount.reusuableCountLeft = discount.reusuableCountLeft - 1;
          if (discount.reusuableCountLeft == 0) {
            discount.isDiscountUsable = false;
          }
        } else if (
          discount.expirationType == DiscountExpirationTypeEnum.TimePeriod
        ) {
          if (discount.expiryDateTime > new Date()) {
            discount.isDiscountUsable = false;
          }
        } else if (
          discount.expirationType == DiscountExpirationTypeEnum.BothTimeAndCount
        ) {
          if (
            discount.expiryDateTime > new Date() ||
            discount.reusuableCountLeft == 0
          ) {
            discount.isDiscountUsable = false;
          }
        }

        await this.discountService.updateDiscount(discount);
      }

      if (bookingInfo.contactNumber) {
        let actualServiceUser =
          await this.userService.findOneClientByPhoneNumber(
            bookingInfo.contactNumber,
          );
        if (!actualServiceUser) {
          //internally register the user
          let userInfo = new CreateUserDTO();
          userInfo.phoneNumber = bookingInfo.contactNumber;
          userInfo.fullName = bookingInfo.fullName;
          actualServiceUser = await this.userService.addUserWithPhoneOrEmail(
            userInfo,
          );
        }

        existingBooking.clientWhoUses = actualServiceUser;
      }

      const bookingInDatabase = await this.bookingRepository.save(
        existingBooking,
      );

      if (!bookingInDatabase) {
        throw new HttpException(
          {
            success: false,
            message:
              'Error while updating the booking. Please contact administrator',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const bookingWithAllRelations = await this.findById(bookingInDatabase.id);

      return {
        success: true,
        data: {
          bookingDetails: bookingWithAllRelations,
        },
        message: 'Booking successfully Updated.',
      };
    } catch (error) {
      throw error;
    }
  }

  async getFilteredBookingListByStatus(
    staff: User,
    searchDetails: BookingSearchBasedOnFiltersDTO,
  ) {
    if (!searchDetails.status) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'status',
          },
          message: 'Empty Status Query',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    let totalBookingListByStatus = await this.bookingRepository.find({
      order: {
        createdDateTime:
          searchDetails.sortValue === SearchSortValueEnum.ASC ? 'ASC' : 'DESC',
      },
      relations: this.bookingAssociations,
      where: { isDeleted: false, status: searchDetails.status },
    });

    let firstPageNumber: number;
    let previousPageNumber: number;
    let nextPageNumber: number;
    let lastPageNumber: number;
    let currentPageNumber: number;

    const totalResultsCount = totalBookingListByStatus.length;

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

    let bookingListForTheQueryPageNumber = totalBookingListByStatus.slice(
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
        //ALL `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${filterType}&numberOfMaxResultsInEachPage=${numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&contactNumber=${contactNumber}&status=${status}&bookingUserName=${bookingUserName}&bookingSortCriteria=${bookingSortCriteria}&sortValue=${sortValue}&startingDate=${startingDate}&endingDate=${endingDate}`

        firstPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        previousPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        currentPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        nextPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        lastPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
      },
    };
  }

  async getFilteredBookingListByDate(
    staff: User,
    searchDetails: BookingSearchBasedOnFiltersDTO,
  ) {
    if (!searchDetails.endingDate || !searchDetails.startingDate) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'endingDate or startingDate',
          },
          message: 'Date range missing',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    let startingDate = new Date(searchDetails.startingDate);
    let endingDate = new Date(searchDetails.endingDate);
    endingDate.setDate(endingDate.getDate() + 1);

    let totalBookingListByStatus = await this.bookingRepository.find({
      order: {
        createdDateTime:
          searchDetails.sortValue == SearchSortValueEnum.ASC ? 'ASC' : 'DESC',
      },
      relations: this.bookingAssociations,

      where: {
        isDeleted: false,
        createdDateTime: Between(startingDate, endingDate),
      },
    });

    let firstPageNumber: number;
    let previousPageNumber: number;
    let nextPageNumber: number;
    let lastPageNumber: number;
    let currentPageNumber: number;

    const totalResultsCount = totalBookingListByStatus.length;

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

    let bookingListForTheQueryPageNumber = totalBookingListByStatus.slice(
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
        //ALL `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${filterType}&numberOfMaxResultsInEachPage=${numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&contactNumber=${contactNumber}&status=${status}&bookingUserName=${bookingUserName}&bookingSortCriteria=${bookingSortCriteria}&sortValue=${sortValue}&startingDate=${startingDate}&endingDate=${endingDate}`

        firstPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        previousPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        currentPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        nextPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        lastPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
      },
    };
  }

  async getFilteredBookingListByName(
    staff: User,
    searchDetails: BookingSearchBasedOnFiltersDTO,
  ) {
    if (!searchDetails.bookingUserName) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'bookingUserName',
          },
          message: 'bookingUserName missing',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    console.log(searchDetails.bookingUserName);

    let totalBookingListByName = await this.bookingRepository.find({
      order: {
        createdDateTime:
          searchDetails.sortValue == SearchSortValueEnum.ASC ? 'ASC' : 'DESC',
      },
      relations: this.bookingAssociations,

      where: {
        isDeleted: Raw(`false 
        AND (
          
             "Booking__Booking_clientWhoBooked"."firstName" ILIKE '%${searchDetails.bookingUserName}%' 
             OR 
             "Booking__Booking_clientWhoBooked"."middleName" ILIKE '%${searchDetails.bookingUserName}%' 
             OR 
             "Booking__Booking_clientWhoBooked"."lastName" ILIKE '%${searchDetails.bookingUserName}%'
             OR 
             "Booking__Booking_clientWhoBooked"."fullName" ILIKE '%${searchDetails.bookingUserName}%'
             
             OR
             "Booking__Booking_clientWhoUses"."firstName" ILIKE '%${searchDetails.bookingUserName}%' 
             OR 
             "Booking__Booking_clientWhoUses"."middleName" ILIKE '%${searchDetails.bookingUserName}%' 
             OR 
             "Booking__Booking_clientWhoUses"."lastName" ILIKE '%${searchDetails.bookingUserName}%'
             OR 
             "Booking__Booking_clientWhoUses"."fullName" ILIKE '%${searchDetails.bookingUserName}%'
          
        )
        `),
      },
    });

    console.log(totalBookingListByName);

    let firstPageNumber: number;
    let previousPageNumber: number;
    let nextPageNumber: number;
    let lastPageNumber: number;
    let currentPageNumber: number;

    const totalResultsCount = totalBookingListByName.length;

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

    let bookingListForTheQueryPageNumber = totalBookingListByName.slice(
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
        //ALL `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${filterType}&numberOfMaxResultsInEachPage=${numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&contactNumber=${contactNumber}&status=${status}&bookingUserName=${bookingUserName}&bookingSortCriteria=${bookingSortCriteria}&sortValue=${sortValue}&startingDate=${startingDate}&endingDate=${endingDate}`

        firstPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        previousPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        currentPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        nextPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        lastPage: `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${searchDetails.filterType}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
      },
    };
  }

  async getFilteredBookingList(
    staff: User,
    searchDetails: BookingSearchBasedOnFiltersDTO,
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

    // criteria
    if (!searchDetails.bookingSortCriteria) {
      searchDetails.bookingSortCriteria = BookingSortCriteriaEnum.ByDate;
      if (!searchDetails.sortValue) {
        searchDetails.sortValue = SearchSortValueEnum.DESC;
      }
    }

    //  filter
    if (!searchDetails.filterType) {
      searchDetails.filterType = BookingFilterTypeCriteriaEnum.ByStatus;
    }

    // getting right  value for the search Parameters
    if (searchDetails.filterType == BookingFilterTypeCriteriaEnum.ByStatus) {
      return await this.getFilteredBookingListByStatus(staff, searchDetails);
    } else if (
      searchDetails.filterType == BookingFilterTypeCriteriaEnum.ByDate
    ) {
      return await this.getFilteredBookingListByDate(staff, searchDetails);
    } else if (
      searchDetails.filterType == BookingFilterTypeCriteriaEnum.ByName
    ) {
      return await this.getFilteredBookingListByName(staff, searchDetails);
    }
  }

  async findAll(): Promise<Booking[]> {
    try {
      return await this.bookingRepository.find({
        order: {
          // id: "DESC"
        },
        where: { isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async findLatestBooking(): Promise<Booking> {
    try {
      return await this.bookingRepository.findOne({
        order: {
          createdDateTime: 'DESC',
        },
        where: { isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async findTodaysLatestBooking(): Promise<Booking> {
    try {
      return await this.bookingRepository.findOne({
        order: {
          createdDateTime: 'DESC',
        },
        where: { isDeleted: false, createdDateTime: AfterDate(new Date()) },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllTodaysBooking(): Promise<Booking[]> {
    try {
      let today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);

      let tomorrow = new Date();
      tomorrow.setDate(today.getDate());
      tomorrow.setHours(0);
      tomorrow.setMinutes(0);
      tomorrow.setSeconds(0);

      return await this.bookingRepository.find({
        order: {
          id: 'DESC',
        },
        where: {
          isDeleted: false,
          createdDateTime: Between(today, tomorrow),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserBookingByStatus(user: User, statusList: BookingStatusEnum[]) {
    try {
      return await this.bookingRepository.find({
        order: {
          id: 'DESC',
        },
        relations: this.bookingAssociations,
        where: [
          {
            isDeleted: false,
            status: In(statusList),
            clientWhoUses: {
              id: user.id,
            },
          },
          {
            isDeleted: false,
            status: In(statusList),
            clientWhoBooked: {
              id: user.id,
            },
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  getBookingRepository() {
    return this.bookingRepository;
  }

  // async findByType(type: string): Promise<Booking[]> {
  //   try {
  //     if (!(type in BookingSourceFormEnum)) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'BookingType',
  //           },
  //           message: 'Customer Request Type is not valid.',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const Booking = await this.bookingRepository.find({
  //       where: {
  //         type: type,
  //       },
  //     });
  //     return Booking;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async findById(id: string): Promise<Booking> {
    try {
      const Booking = await this.bookingRepository.findOne({
        where: {
          id,
          isDeleted: false,
        },
        relations: this.bookingAssociations,
      });
      return Booking;
    } catch (error) {
      throw error;
    }
  }

  // async findByIdList(idList: string[]): Promise<Booking[]> {
  //   try {
  //     const Booking = await this.bookingRepository.find({
  //       where: {
  //         id: In(idList),
  //         isDeleted: false,
  //       },
  //     });
  //     return Booking;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async update(BookingInfo: Booking): Promise<UpdateResult> {
  //   return await this.bookingRepository.update(
  //     bookingInfo.id,
  //     BookingInfo,
  //   );
  // }

  // async deleteById(id) {
  //   //delete function accepts id or group of ids
  //   return await this.bookingRepository.delete(id);
  // }
}
