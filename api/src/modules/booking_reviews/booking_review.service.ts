import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BookingReviewFilterTypeCriteriaEnum,
  BookingReviewSortCriteriaEnum,
  RoleTypeEnum,
  SearchSortValueEnum,
} from 'common/constants/enum-constant';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { isDivisbleByPointFive } from 'common/utils/math.utils';
import { BookingService } from 'modules/booking/booking.service';
import { UserService } from 'modules/users/services/users.service';
import { UserWithClientTypeDTO } from 'modules/users/user.dtos';
import { User } from 'modules/users/users.entity';
import { Between, ILike, Repository } from 'typeorm';
import {
  CreateBookingReviewDTO,
  SearchBookingReviewsBasedOnFiltersDTO,
} from './booking_review.dtos';
import { BookingReview } from './booking_review.entity';

@Injectable()
export class BookingReviewService {
  constructor(
    @InjectRepository(BookingReview)
    private bookingReviewRepository: Repository<BookingReview>,
    private readonly bookingService: BookingService,
    private readonly userService: UserService, // @Inject(forwardRef(() => BusinessService)) // private readonly businessService: BusinessService, // private readonly representativeService: RepresentativeService, // private readonly userService: UserService,
  ) {}

  bookingReviewAssociations = [
    'reviewerClient',
    'reviewerRegistrationStaff',
    'reviewedBooking',
    'ratedEmployee',
  ];

  async addBookingReview(
    userWithClientTypeAppended: UserWithClientTypeDTO,
    bookingReviewInfo: CreateBookingReviewDTO,
  ): Promise<GenericResponseDTO> {
    try {
      console.debug('Creating a Booking Review ........');

      let newBookingReview = new BookingReview();

      ////////// BookingReview contains both ServiceRating and EmployeeRating /////////////////
      if (bookingReviewInfo.bookingId) {
        const booking = await this.bookingService.findById(
          bookingReviewInfo.bookingId,
        );
        if (!booking) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'bookingId',
              },
              message: 'bookingId does not exist',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        if (booking.bookingReview) {
          newBookingReview.id = booking.bookingReview.id;
        }
        newBookingReview.reviewedBooking = booking;
        newBookingReview.reviewerClient = booking.clientWhoUses;
        newBookingReview.ratedEmployee = booking.serviceProvider;
      }
      if (userWithClientTypeAppended.id) {
        if (
          userWithClientTypeAppended.userRole.name ===
            RoleTypeEnum.DEFAULTSTAFF ||
          userWithClientTypeAppended.userRole.name ===
            RoleTypeEnum.CUSTOMIZEDSTAFF
        ) {
          newBookingReview.reviewerRegistrationStaff =
            userWithClientTypeAppended;
        } else if (
          userWithClientTypeAppended.userRole.name ===
            RoleTypeEnum.DEFAULTCLIENT ||
          userWithClientTypeAppended.userRole.name ===
            RoleTypeEnum.CUSTOMIZEDCLIENT
        ) {
          newBookingReview.reviewerClient = userWithClientTypeAppended;
        }
      }

      // If ratedEmployeeId is explicitlly provided then it should override the service provider from the booking data
      if (bookingReviewInfo.ratedEmployeeId) {
        const serviceProvider =
          await this.userService.findOneServiceProviderById(
            bookingReviewInfo.customerId,
          );
        if (!serviceProvider) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'ratedEmployeeId',
              },
              message: 'Service provider with ratedEmployeeId does not exist',
            },
            HttpStatus.NOT_FOUND,
          );
        }
        newBookingReview.reviewerClient = serviceProvider;
      }

      ////////////////////////// bookingReview info //////////////////////////////
      if (bookingReviewInfo.serviceRatingExplanation) {
        newBookingReview.serviceRatingExplanation =
          bookingReviewInfo.serviceRatingExplanation;
      }

      if (bookingReviewInfo.serviceRating) {
        if (!isDivisbleByPointFive(parseInt(bookingReviewInfo.serviceRating))) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'serviceRating',
              },
              message: 'serviceRating should be divisble by 0.5.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        newBookingReview.serviceRating = bookingReviewInfo.serviceRating;
      }

      ////////////////////////// employeeRating info //////////////////////////////

      if (bookingReviewInfo.employeeRatingExplanation) {
        newBookingReview.employeeFeedbackExplanation =
          bookingReviewInfo.employeeRatingExplanation;
      }

      if (bookingReviewInfo.employeeRating) {
        if (!isDivisbleByPointFive(parseInt(bookingReviewInfo.serviceRating))) {
          throw new HttpException(
            {
              success: false,
              data: {
                errorField: 'serviceRating',
              },
              message: 'serviceRating should be divisble by 0.5.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        newBookingReview.employeeRating = bookingReviewInfo.employeeRating;
      }

      console.debug('newBookingReview', newBookingReview);
      let savedBookingReview = await this.bookingReviewRepository.save(
        newBookingReview,
      );

      return {
        success: true,
        data: { savedBookingReview },
        message: 'Review successfully submitted.',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getFilteredBookingReviewList(
    staff: User,
    searchDetails: SearchBookingReviewsBasedOnFiltersDTO,
  ) {
    try {
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
        searchDetails.bookingSortCriteria =
          BookingReviewSortCriteriaEnum.ByDate;
        if (!searchDetails.sortValue) {
          searchDetails.sortValue = SearchSortValueEnum.DESC;
        }
      }

      //  filter
      if (!searchDetails.filterType) {
        throw new HttpException(
          {
            success: false,
            data: {
              errorField: 'filterType',
            },
            message: 'filterType is missing.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // getting right  value for the search Parameters
      if (
        searchDetails.filterType == BookingReviewFilterTypeCriteriaEnum.ByDate
      ) {
        return await this.getFilteredBookingReviewListByDate(
          staff,
          searchDetails,
        );
      } else if (
        searchDetails.filterType ==
        BookingReviewFilterTypeCriteriaEnum.ByEmployeePhoneNumber
      ) {
        return await this.getFilteredBookingReviewListByEmployeeNumber(
          staff,
          searchDetails,
        );
      } else if (
        searchDetails.filterType ==
        BookingReviewFilterTypeCriteriaEnum.ByBookingId
      ) {
        return await this.getFilteredBookingReviewListByBookingId(
          staff,
          searchDetails,
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getFilteredBookingReviewListByDate(
    staff: User,
    searchDetails: SearchBookingReviewsBasedOnFiltersDTO,
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
        HttpStatus.BAD_REQUEST,
      );
    }

    let startingDate = new Date(searchDetails.startingDate);
    let endingDate = new Date(searchDetails.endingDate);
    endingDate.setDate(endingDate.getDate() + 1);

    let totalBookingListByDate = await this.bookingReviewRepository.find({
      order: {
        createdDateTime:
          searchDetails.sortValue == SearchSortValueEnum.ASC ? 'ASC' : 'DESC',
      },
      relations: this.bookingReviewAssociations,

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

    const totalResultsCount = totalBookingListByDate.length;

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

    let bookingListForTheQueryPageNumber = totalBookingListByDate.slice(
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

        firstPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-list-reviews-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        previousPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        currentPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        nextPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        lastPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
      },
    };
  }

  async getFilteredBookingReviewListByEmployeeNumber(
    staff: User,
    searchDetails: SearchBookingReviewsBasedOnFiltersDTO,
  ) {
    if (!searchDetails.ratedEmployeeNumber) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'ratedEmployeeNumber',
          },
          message: 'ratedEmployeeNumber is missing.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let totalBookingReviewByEmployeeNumber =
      await this.bookingReviewRepository.find({
        order: {
          createdDateTime:
            searchDetails.sortValue == SearchSortValueEnum.ASC ? 'ASC' : 'DESC',
        },
        relations: this.bookingReviewAssociations,

        where: {
          isDeleted: false,
          ratedEmployee: {
            phoneNumber: searchDetails.ratedEmployeeNumber,
          },
        },
      });

    let firstPageNumber: number;
    let previousPageNumber: number;
    let nextPageNumber: number;
    let lastPageNumber: number;
    let currentPageNumber: number;

    const totalResultsCount = totalBookingReviewByEmployeeNumber.length;

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

    let bookingListForTheQueryPageNumber =
      totalBookingReviewByEmployeeNumber.slice(startingIndex, endingIndex);

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

        firstPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-list-reviews-by-filter?filterType=${searchDetails.filterType}&ratedEmployeeNumber=${searchDetails.ratedEmployeeNumber}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        previousPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&ratedEmployeeNumber=${searchDetails.ratedEmployeeNumber}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        currentPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&ratedEmployeeNumber=${searchDetails.ratedEmployeeNumber}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        nextPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&ratedEmployeeNumber=${searchDetails.ratedEmployeeNumber}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        lastPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&ratedEmployeeNumber=${searchDetails.ratedEmployeeNumber}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
      },
    };
  }

  async getFilteredBookingReviewListByBookingId(
    staff: User,
    searchDetails: SearchBookingReviewsBasedOnFiltersDTO,
  ) {
    if (!searchDetails.bookingId) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'bookingId',
          },
          message: 'bookingId is missing.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let totalBookingReviewByBookingId = await this.bookingReviewRepository.find(
      {
        order: {
          createdDateTime:
            searchDetails.sortValue == SearchSortValueEnum.ASC ? 'ASC' : 'DESC',
        },
        relations: this.bookingReviewAssociations,

        where: {
          isDeleted: false,
          reviewedBooking: {
            id: ILike(`%${searchDetails.bookingId}%`),
          },
        },
      },
    );

    let firstPageNumber: number;
    let previousPageNumber: number;
    let nextPageNumber: number;
    let lastPageNumber: number;
    let currentPageNumber: number;

    const totalResultsCount = totalBookingReviewByBookingId.length;

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

    let bookingListForTheQueryPageNumber = totalBookingReviewByBookingId.slice(
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

        firstPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-list-reviews-by-filter?filterType=${searchDetails.filterType}&bookingId=${searchDetails.bookingId}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        previousPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&bookingId=${searchDetails.bookingId}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        currentPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&bookingId=${searchDetails.bookingId}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        nextPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&bookingId=${searchDetails.bookingId}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        lastPage: `${process.env.NODE_API_HOST}/booking-review/get-booking-reviews-list-by-filter?filterType=${searchDetails.filterType}&bookingId=${searchDetails.bookingId}&numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
      },
    };
  }
}
