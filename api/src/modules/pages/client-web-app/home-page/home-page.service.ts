import { Injectable } from '@nestjs/common';
import { homePageData } from 'common/constants/pages/client-web-app/home-page';
import { ServiceService } from 'modules/service/service.service';

import { ClientWebAppHomePageDataResponseDTO } from './home-page.dtos';

@Injectable()
export class HomePageService {
  constructor(private readonly serviceService: ServiceService) {} // private readonly brandService: BrandService, // private readonly BookingService: BookingService, // private readonly saleService: SaleService, // private readonly searchService: SearchService, // private readonly storyService: StoryService, // private readonly productService: ProductService, // private readonly bannerAdService: BannerAdService, // private readonly categoryService: CategoryService, // private readonly industryService: IndustryService, // private readonly storyService: StoryService, // // @Inject(forwardRef(() => CategoryService)) // private readonly userService: UserService, // @Inject(forwardRef(() => ProductService)) // private readonly productService: ProductService, // @Inject(forwardRef(() => BusinessService)) // private readonly businessService: BusinessService, // private readonly representativeService: RepresentativeService, // @Inject(forwardRef(() => BrandService)) // private readonly brandService: BrandService, // // @Inject(forwardRef(() => UserService))

  async getWebClientAppHomePage(): Promise<ClientWebAppHomePageDataResponseDTO> {
    const serviceList = await this.serviceService.getAllServiceCommonDetails();
    console.debug('serviceList', serviceList);
    return {
      ...homePageData,
      detailedBookingRow: {
        isShown: true,
        heading: 'Detailed Booking',
        serviceList: serviceList,
      },
    };
  }
}
