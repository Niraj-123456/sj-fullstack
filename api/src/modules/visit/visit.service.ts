import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { Repository } from 'typeorm';
import { CreateVisitRequestDTO } from './visit.dtos';
import { Visit } from './visit.entity';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>, // @Inject(forwardRef(() => ProductService)) // private readonly productService: ProductService, // @Inject(forwardRef(() => BusinessService)) // private readonly businessService: BusinessService,
  ) {}
  async addVisit(
    visitInfo: CreateVisitRequestDTO,
  ): Promise<GenericResponseDTO> {
    try {
      console.debug('Registering a new visit ........');

      let newVisit = new Visit();

      if (visitInfo.filteredSourceType) {
        newVisit.filteredSourceType = visitInfo.filteredSourceType;
      }

      if (visitInfo.ipAddress) {
        newVisit.ipAddress = visitInfo.ipAddress;
      }

      if (visitInfo.browserInfo) {
        newVisit.browserInfo = visitInfo.browserInfo;
      }

      if (visitInfo.deviceInfo) {
        newVisit.deviceInfo = visitInfo.deviceInfo;
      }

      if (visitInfo.locationInfo) {
        newVisit.locationInfo = visitInfo.locationInfo;
      }

      if (visitInfo.unfilteredSourceInfo) {
        newVisit.unfilteredSourceInfo = visitInfo.unfilteredSourceInfo;
      }

      // throw new InternalServerErrorException();

      await this.visitRepository.save(newVisit);

      return {
        success: true,
        message: visitInfo.filteredSourceType
          ? `Visit has been successfully registered as ${visitInfo.filteredSourceType}.`
          : `Visit has been successfully registered.`,
      };
    } catch (error) {
      console.log('Error while registering visit', error);
      throw error;
    }
  }

  // async getAllVisits(count: number = 10): Promise<Visit[]> {
  //   try {
  //     return await this.visitRepository.find({
  //       where: {
  //         isDeleted: false,
  //       },
  //       order: {
  //         createdDateTime: 'DESC',
  //       },
  //       take: count ? count : 10, //for limit
  //       relations: ['mainAdImage'],
  //       cache: 5000,
  //     });
  //   } catch (error) {
  //     console.log('Error while fetching visits', error);
  //     throw error;
  //   }
  // }

  // async deleteById(id: string) {
  //   //delete function accepts id or group of ids
  //   try {
  //     const visit = await this.visitRepository.findOne({
  //       where: {
  //         id: id,
  //         isActive: true,
  //       },
  //     });

  //     if (!visit) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'visitId',
  //           },
  //           message: 'Banner Ad with the following id not found.',
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     return await this.visitRepository.save({
  //       ...visit, // existing fields
  //       ...{ isActive: false }, // updated fields
  //     });
  //   } catch (error) {
  //     console.log('Error while fetching banner ads', error);
  //     throw error;
  //   }
}
