import { APPVars, configService } from 'config/config.service';
import { addYears, subDays, subYears } from 'date-fns';
import { Between } from 'typeorm';

// TypeORM Query Operators
export const AfterDate = (date: Date) => Between(date, addYears(date, 100));
export const BeforeDate = (date: Date) => Between(subYears(date, 100), date);

export const getExpiryDateForBannerAds = (currentDate: Date): Date => {
  const expiryDate = currentDate;

  expiryDate.setDate(
    currentDate.getDate() +
      APPVars.expiryDuration.entityExpiration.bannerAds.valueInDays,
  ); //Adding 15 days

  return expiryDate;
};

export const getExpiryDateForSales = (currentDate: Date): Date => {
  const expiryDate = currentDate;

  expiryDate.setDate(
    currentDate.getDate() +
      APPVars.expiryDuration.entityExpiration.sales.valueInDays,
  ); //Adding 15 days

  return expiryDate;
};
