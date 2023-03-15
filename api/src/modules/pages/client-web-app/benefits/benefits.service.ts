import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In, LessThan, MoreThan, Not } from 'typeorm';
import {
  ClientDiscountSortCriteriaEnum,
  DiscountExpirationTypeEnum,
  DiscountReceivedNatureEnum,
  DiscountUserAssociationTypeEnum,
  SearchSortValueEnum,
} from 'common/constants/enum-constant';

import { User } from 'modules/users/users.entity';
import { Raw } from 'typeorm';
import { ClientDiscountSearchDTO } from './benefits.dtos';
import { DiscountService } from 'modules/discount/discount.service';
import { Discount } from 'modules/discount/discount.entity';

@Injectable()
export class BenefitService {
  constructor(private readonly discountService: DiscountService) {} // private readonly brandService: BrandService, // private readonly BenefitService: BenefitService, // private readonly saleService: SaleService, // private readonly searchService: SearchService, // private readonly storyService: StoryService, // private readonly productService: ProductService, // private readonly bannerAdService: BannerAdService, // private readonly categoryService: CategoryService, // private readonly industryService: IndustryService, // private readonly storyService: StoryService, // // @Inject(forwardRef(() => CategoryService)) // private readonly userService: UserService, // @Inject(forwardRef(() => ProductService)) // private readonly productService: ProductService, // @Inject(forwardRef(() => BusinessService)) // private readonly businessService: BusinessService, // private readonly representativeService: RepresentativeService, // @Inject(forwardRef(() => BrandService)) // private readonly brandService: BrandService, // // @Inject(forwardRef(() => UserService))

  async getFilteredBenefitListSortedByDate(
    client: User,
    searchDetails: ClientDiscountSearchDTO,
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

    // sort criteria
    if (!searchDetails.discountSortCriteria) {
      searchDetails.discountSortCriteria =
        ClientDiscountSortCriteriaEnum.ByDate;
    }

    // sort value
    if (!searchDetails.sortValue) {
      searchDetails.sortValue = SearchSortValueEnum.DESC;
    }

    let discountsThatOnlyUserCanSee = [
      DiscountReceivedNatureEnum.Referee,
      DiscountReceivedNatureEnum.Referrer,
    ];
    let totalBenefitsByDate = await this.discountService
      .getDiscountRepository()
      .find({
        order: {
          createdDateTime:
            searchDetails.sortValue == SearchSortValueEnum.ASC ? 'ASC' : 'DESC',
        },
        // relations: ['associatedSingleUser'],
        where: [
          {
            isDeleted: false,
            receivedNature: In(discountsThatOnlyUserCanSee),
            userAssociation:
              DiscountUserAssociationTypeEnum.SingleUserAssociation,
            associatedSingleUser: {
              id: client.id,
            },
          },
          // {
          //   isDeleted: false,
          //   receivedNature: In(discountsThatOnlyUserCanSee),
          //   expirationType: DiscountExpirationTypeEnum.TimePeriod,
          //   userAssociation:
          //     DiscountUserAssociationTypeEnum.SingleUserAssociation,
          //   associatedSingleUser: {
          //     id: client.id,
          //   },
          //   expiryDateTime: LessThan(new Date()),
          // },
          // {
          //   isDeleted: false,
          //   receivedNature: In(discountsThatOnlyUserCanSee),
          //   expirationType: DiscountExpirationTypeEnum.BothTimeAndCount,
          //   userAssociation:
          //     DiscountUserAssociationTypeEnum.SingleUserAssociation,
          //   associatedSingleUser: {
          //     id: client.id,
          //   },
          //   reusuableCountLeft: MoreThan(0),
          //   expiryDateTime: LessThan(new Date()),
          // },
        ],
      });

    let totalBenefitsByDateWithPartner = [];
    for (let i = 0; i < totalBenefitsByDate.length; i++) {
      let eachDiscount = totalBenefitsByDate[i];
      if (
        eachDiscount.receivedNature == DiscountReceivedNatureEnum.Referee ||
        eachDiscount.receivedNature == DiscountReceivedNatureEnum.Referrer
      ) {
        let linkedDiscount = await this.discountService
          .getDiscountRepository()
          .findOne({
            where: {
              linkerUUID: eachDiscount.linkerUUID,
              id: Not(eachDiscount.id),
            },
            relations: ['associatedSingleUser'],
          });

        eachDiscount['linkedDiscount'] = linkedDiscount;
        totalBenefitsByDateWithPartner.push(eachDiscount);
      }
    }

    // return totalBenefitsByDate;
    let firstPageNumber: number;
    let previousPageNumber: number;
    let nextPageNumber: number;
    let lastPageNumber: number;
    let currentPageNumber: number;

    const totalResultsCount = totalBenefitsByDateWithPartner.length;

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

    let benefitListForTheQueryPageNumber = totalBenefitsByDateWithPartner.slice(
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
      items: await benefitListForTheQueryPageNumber,
      meta: {
        totalItemsCount: totalResultsCount,
        currentPageItemsCount: benefitListForTheQueryPageNumber.length,
        totalPageCount: totalPageCount,
        currentPageNumber: currentPageNumber,
      },

      links: {
        links: {
          firstPage: `${process.env.NODE_API_HOST}/pages/client-web-app/benefit/get-user-discounts-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${firstPageNumber}&bookingSortCriteria=${searchDetails.discountSortCriteria}&sortValue=${searchDetails.sortValue}`,
          previousPage: `${process.env.NODE_API_HOST}/pages/client-web-app/benefit/get-user-discounts-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${previousPageNumber}&bookingSortCriteria=${searchDetails.discountSortCriteria}&sortValue=${searchDetails.sortValue}`,
          currentPage: `${process.env.NODE_API_HOST}/pages/client-web-app/benefit/get-user-discounts-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${currentPageNumber}&bookingSortCriteria=${searchDetails.discountSortCriteria}&sortValue=${searchDetails.sortValue}`,
          nextPage: `${process.env.NODE_API_HOST}/pages/client-web-app/benefit/get-user-discounts-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${nextPageNumber}&bookingSortCriteria=${searchDetails.discountSortCriteria}&sortValue=${searchDetails.sortValue}`,
          lastPage: `${process.env.NODE_API_HOST}/pages/client-web-app/benefit/get-user-discounts-by-filter?numberOfMaxResultsInEachPage=${searchDetails.numberOfMaxResultsInEachPage}&pageNumber=${lastPageNumber}&bookingSortCriteria=${searchDetails.discountSortCriteria}&sortValue=${searchDetails.sortValue}`,
        },
      },
    };
  }
}
