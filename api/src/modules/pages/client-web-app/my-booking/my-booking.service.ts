import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import {
  BookingFilterTypeCriteriaEnum,
  BookingSortCriteriaEnum,
  BookingStatusEnum,
  BookingStatusEnumWhileSearching,
  ClientSideBookingsDivisionEnum,
  DiscountOfferingTypeEnum,
  SearchSortValueEnum,
} from 'common/constants/enum-constant';
import { Booking } from 'modules/booking/booking.entity';
import { BookingService } from 'modules/booking/booking.service';

import { User } from 'modules/users/users.entity';
import { Between } from 'typeorm';
import { ClientMyBookingSearchDTO } from './my-booking.dtos';
import { DiscountService } from 'modules/discount/discount.service';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class MyBookingService {
  constructor(
    private readonly bookingService: BookingService,
    private readonly discountService: DiscountService,
  ) {}

  bookingAssociations = [
    'clientWhoBooked',
    'clientWhoUses',
    'staffWhoBooked',
    'serviceProvider',
  ];
  async getWebClientAppMyBookingPageData(client: User) {
    const userReferralDiscounts =
      await this.discountService.getUserReferralDisountsSortedByDate(client);

    let totalFlatDiscountWorth = 0;
    let totalPercentageDiscount = 0;

    userReferralDiscounts.forEach((eachDiscount) => {
      if (eachDiscount.offeringType == DiscountOfferingTypeEnum.Flat) {
        if (eachDiscount.discountedFlatAmount) {
          totalFlatDiscountWorth += eachDiscount.discountedFlatAmount;
        }
      }
      if (eachDiscount.offeringType == DiscountOfferingTypeEnum.Percentage) {
        if (eachDiscount.discountedPercentage) {
          totalPercentageDiscount += eachDiscount.discountedPercentage;
        }
      }
    });

    if (totalPercentageDiscount > 100) {
      totalPercentageDiscount = 100;
    } else if (totalPercentageDiscount < 0 || totalPercentageDiscount == null) {
      totalPercentageDiscount = 0;
    }
    return {
      discountFund: {
        flat: `Rs ${totalFlatDiscountWorth}`,
        percentage: `${totalPercentageDiscount}%`,
      },
      bookingStatusList: {
        upcomingBookingStatuses: [
          BookingStatusEnum.Submitted,
          BookingStatusEnum.InReview,
          BookingStatusEnum.Confirmed,
          BookingStatusEnum.InProgress,
          BookingStatusEnum.ReOpened,
        ],
        pastBookingStatuses: [
          BookingStatusEnum.Completed,
          BookingStatusEnum.Declined,
        ],
        allBookingStatuses: [
          BookingStatusEnum.Submitted,
          BookingStatusEnum.InReview,
          BookingStatusEnum.Confirmed,
          BookingStatusEnum.InProgress,
          BookingStatusEnum.ReOpened,
          BookingStatusEnum.Completed,
          BookingStatusEnum.Declined,
        ],
        allBookingStatuesWithColor: {
          Submitted: '2599F9', //blue
          InReview: 'F58634', //orange
          Confirmed: 'D1FAE5', // light green
          InProgress: 'FACC15', //yellow
          Declined: '333333', //black
          Completed: '34D399', //green
          ReOpened: '64748B', // grey
        },
      },
    };
  }
  ///////////////////////////////
  async getFilteredBookingListByStatus(
    client: User,
    searchDetails: ClientMyBookingSearchDTO,
    bookingStatusList: string[],
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

    if (
      !(
        searchDetails.status == BookingStatusEnumWhileSearching.All ||
        bookingStatusList.includes(searchDetails.status)
      )
    ) {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'status',
          },
          message: 'Send right Status',
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    let totalBookingListByStatus = await this.bookingService
      .getBookingRepository()
      .find({
        order: {
          createdDateTime:
            searchDetails.sortValue === SearchSortValueEnum.ASC
              ? 'ASC'
              : 'DESC',
        },

        relations: [...this.bookingAssociations, 'associatedServices'],
        where: [
          {
            isDeleted: false,
            status:
              searchDetails.status == BookingStatusEnumWhileSearching.All
                ? In(bookingStatusList)
                : searchDetails.status,
            clientWhoBooked: {
              id: client.id,
            },
          },
          {
            isDeleted: false,
            status:
              searchDetails.status == BookingStatusEnumWhileSearching.All
                ? In(bookingStatusList)
                : searchDetails.status,
            clientWhoUses: {
              id: client.id,
            },
          },
        ],
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
      // &startingDate=&endingDate
      links: {
        firstPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        previousPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        currentPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        nextPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
        lastPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}`,
      },
    };
  }

  async getFilteredBookingListByDate(
    client: User,
    searchDetails: ClientMyBookingSearchDTO,
    bookingStatusList: string[],
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

    // if (!bookingStatusList.includes(searchDetails.status)) {
    //   throw new HttpException(
    //     {
    //       success: false,
    //       data: {
    //         errorField: 'status',
    //       },
    //       message: 'Send right Status',
    //     },
    //     HttpStatus.PRECONDITION_FAILED,
    //   );
    // }
    let startingDate = new Date(searchDetails.startingDate);
    let endingDate = new Date(searchDetails.endingDate);
    endingDate.setDate(endingDate.getDate() + 1);

    let totalBookingListByStatus = await this.bookingService
      .getBookingRepository()
      .find({
        order: {
          createdDateTime:
            searchDetails.sortValue == SearchSortValueEnum.ASC ? 'ASC' : 'DESC',
        },
        relations: [...this.bookingAssociations, 'associatedServices'],
        where: [
          {
            isDeleted: false,
            createdDateTime: Between(startingDate, endingDate),
            status: In(bookingStatusList),
            clientWhoBooked: {
              id: client.id,
            },
          },
          {
            isDeleted: false,
            createdDateTime: Between(startingDate, endingDate),
            status: In(bookingStatusList),
            clientWhoUses: {
              id: client.id,
            },
          },
        ],
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
        //ALL `${process.env.NODE_API_HOST}/booking/get-booking-list-by-filter?filterType=${filterType}&numberOfMaxResultsInEachPage=${numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&contactNumber=${contactNumber}&status=${status}&bookingUserName=${bookingUserName}&bookingSortCriteria=${bookingSortCriteria}&sortValue=${sortValue}`

        links: {
          firstPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}`,
          previousPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}`,
          currentPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}`,
          nextPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}`,
          lastPage: `${process.env.NODE_API_HOST}/pages/client-web-app/my-booking/get-user-bookings-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&bookingsDivision=${searchDetails.bookingsDivision}&filterType=${searchDetails.filterType}&status=${searchDetails.status}&bookingSortCriteria=${searchDetails.bookingSortCriteria}&sortValue=${searchDetails.sortValue}&startingDate=${searchDetails.startingDate}&endingDate=${searchDetails.endingDate}`,
        },
      },
    };
  }

  async getFilteredBookingList(
    client: User,
    searchDetails: ClientMyBookingSearchDTO,
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

    // booking division
    let bookingStatusList: BookingStatusEnumWhileSearching[];
    if (searchDetails.bookingsDivision == ClientSideBookingsDivisionEnum.Past) {
      bookingStatusList = [
        BookingStatusEnumWhileSearching.Completed,
        BookingStatusEnumWhileSearching.Declined,
      ];
    } else {
      bookingStatusList = [
        BookingStatusEnumWhileSearching.Submitted,
        BookingStatusEnumWhileSearching.InReview,
        BookingStatusEnumWhileSearching.Confirmed,
        BookingStatusEnumWhileSearching.InProgress,
        BookingStatusEnumWhileSearching.Confirmed,
        BookingStatusEnumWhileSearching.ReOpened,
      ];
    }

    // sort criteria
    if (!searchDetails.bookingSortCriteria) {
      searchDetails.bookingSortCriteria = BookingSortCriteriaEnum.ByDate;
      if (!searchDetails.sortValue) {
        searchDetails.sortValue = SearchSortValueEnum.DESC;
      }
    }

    // determining the sorting parameters to be used in query later
    if (searchDetails.filterType == BookingFilterTypeCriteriaEnum.ByStatus) {
      return await this.getFilteredBookingListByStatus(
        client,
        searchDetails,
        bookingStatusList,
      );
    } else if (
      searchDetails.filterType == BookingFilterTypeCriteriaEnum.ByDate
    ) {
      return await this.getFilteredBookingListByDate(
        client,
        searchDetails,
        bookingStatusList,
      );
    } else {
      throw new HttpException(
        {
          success: false,
          data: {
            errorField: 'filterType',
          },
          message: 'Invalid filterType',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
