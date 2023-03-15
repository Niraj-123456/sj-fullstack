import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource, In } from 'typeorm';
import { Service } from '../../modules/service/service.entity';
import {
  FileTypeEnum,
  ServiceEnum,
  ServiceWithNameLabelImageUrl,
} from 'common/constants/enum-constant';
import { HttpException, HttpStatus } from '@nestjs/common';
import { areArraysEqual } from 'common/utils/list.utils';
import { File } from 'modules/file/file.entity';

export default class ServiceSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // Use factory for fixed defination and random number of data
    console.log('Seeding services......');

    // Since we have fix services with fix number and name, we set it manually
    const serviceRepository = dataSource.getRepository(Service);
    const fileRepository = dataSource.getRepository(File);

    let requiredServicesList = Object.values(ServiceEnum);

    // making sure that the service data that is required for seeding is available
    let requiredServicesListFromListWithLabelAndImageUrl =
      ServiceWithNameLabelImageUrl.map(
        (eachRemainingService) => eachRemainingService.name,
      );

    if (
      !areArraysEqual(
        requiredServicesListFromListWithLabelAndImageUrl,
        requiredServicesList,
      )
    ) {
      throw new HttpException(
        'Service seeding failed due to lack of proper data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Getting already present data in database
    let alreadyAvailableServices = await serviceRepository.find({
      where: {
        isDeleted: false,
        name: In(requiredServicesList),
      },
    });

    let availableServicesStringList = alreadyAvailableServices.map(
      (eachAvailableServices) => eachAvailableServices.name,
    );

    // Only keeping the information that is required for looping and adding
    let filteredRequiredServicesWithLabelAndImageUrl =
      ServiceWithNameLabelImageUrl.filter((eachRequiredService) => {
        return !availableServicesStringList.includes(eachRequiredService.name);
      });

    for (var eachRemainingService of filteredRequiredServicesWithLabelAndImageUrl) {
      let mainThumbnailImage = new File();
      mainThumbnailImage.type = FileTypeEnum.IMAGE;
      mainThumbnailImage.s3Url = eachRemainingService.imageUrl;
      let newFile = await fileRepository.save(mainThumbnailImage);
      await serviceRepository.insert([
        {
          name: eachRemainingService.name,
          label: eachRemainingService.label,
          mainThumbnailImage: newFile,
        },
      ]);
    }
  }
}
