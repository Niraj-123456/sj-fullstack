import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';

import { UserService } from 'modules/users/services/users.service';
import { CustomerInteraction } from './customer-interaction.entity';

@Injectable()
export class CustomerInteractionService {
  constructor(
    @InjectRepository(CustomerInteraction)
    private customerInteractionRepository: Repository<CustomerInteraction>, // private readonly userService: UserService,
  ) {}
  // async addCustomerInteraction(
  //   customerInteractionInfo: CreateCustomerInteractionDTO,
  // ): Promise<CustomerInteraction> {
  //   try {
  //     console.debug('Creating new customerInteraction ........');

  //     let newCustomerInteraction = new CustomerInteraction();

  //     newCustomerInteraction.type = customerInteractionInfo.type;

  //     if (customerInteractionInfo.explanation) {
  //       newCustomerInteraction.explanation =
  //         customerInteractionInfo.explanation;
  //     }

  //     if (customerInteractionInfo.businessWhoseInteractionId) {
  //       const business = await this.businessService.findById(
  //         customerInteractionInfo.businessWhoseInteractionId,
  //       );

  //       if (!business) {
  //         throw new HttpException(
  //           {
  //             success: false,
  //             data: {
  //               errorField: 'businessTypeId',
  //             },
  //             message: 'Business with the following business id not found.',
  //           },
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       newCustomerInteraction.businessWhoseInteraction = business;
  //     }

  //     if (customerInteractionInfo.representativeWhoseInteractionId) {
  //       const representative = await this.representativeService.findById(
  //         customerInteractionInfo.representativeWhoseInteractionId,
  //       );

  //       if (!representative) {
  //         throw new HttpException(
  //           {
  //             success: false,
  //             data: {
  //               errorField: 'representativeTypeId',
  //             },
  //             message: 'Representative with the following id not found.',
  //           },
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       newCustomerInteraction.representativeWhoseInteraction = representative;
  //     }
  //     if (customerInteractionInfo.userWhoseInteractionId) {
  //       const user = await this.userService.findById(
  //         customerInteractionInfo.userWhoseInteractionId,
  //       );

  //       if (!user) {
  //         throw new HttpException(
  //           {
  //             success: false,
  //             data: {
  //               errorField: 'userId',
  //             },
  //             message: 'User with the following user id not found.',
  //           },
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }

  //       newCustomerInteraction.userWhoseInteraction = user;
  //     }

  //     return await this.customerInteractionRepository.save(
  //       newCustomerInteraction,
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findAll(): Promise<CustomerInteraction[]> {
  //   try {
  //     return await this.customerInteractionRepository.find({
  //       order: {
  //         // id: "DESC"
  //       },
  //       where: { isActive: 1 },
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findByType(type: string): Promise<CustomerInteraction[]> {
  //   try {
  //     if (!(type in CustomerInteractionTypeEnum)) {
  //       throw new HttpException(
  //         {
  //           success: false,
  //           data: {
  //             errorField: 'customerInteractionType',
  //           },
  //           message: 'Customer Interaction Type is not valid.',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const customerInteraction = await this.customerInteractionRepository.find(
  //       {
  //         where: {
  //           type: type,
  //         },
  //       },
  //     );
  //     return customerInteraction;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findById(id: string): Promise<CustomerInteraction> {
  //   try {
  //     const customerInteraction =
  //       await this.customerInteractionRepository.findOne({
  //         where: {
  //           id,
  //           isActive: 1,
  //         },
  //       });
  //     return customerInteraction;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async findByIdList(idList: string[]): Promise<CustomerInteraction[]> {
  //   try {
  //     const customerInteraction = await this.customerInteractionRepository.find(
  //       {
  //         where: {
  //           id: In(idList),
  //           isActive: 1,
  //         },
  //       },
  //     );
  //     return customerInteraction;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async update(
    customerInteractionInfo: CustomerInteraction,
  ): Promise<UpdateResult> {
    return await this.customerInteractionRepository.update(
      customerInteractionInfo.id,
      customerInteractionInfo,
    );
  }

  async saveCusomterInteraction(
    customerInteraction: CustomerInteraction,
  ): Promise<CustomerInteraction> {
    return await this.customerInteractionRepository.save(customerInteraction);
  }

  async deleteById(id) {
    //delete function accepts id or group of ids
    return await this.customerInteractionRepository.delete(id);
  }
}
