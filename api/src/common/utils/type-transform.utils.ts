// import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

function isNullOrUndefined<T>(
  obj: T | null | undefined,
): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}

// export class DecimalTransformer implements ValueTransformer {
//   /**
//    * Used to marshal Decimal when writing to the database.
//    */
//   to(decimal?: Decimal): string {
//     return decimal?.toString();
//   }
//   /**
//    * Used to unmarshal Decimal when reading from the database.
//    */
//   from(decimal?: string): Decimal | null {
//     return decimal ? new Decimal(decimal) : null;
//   }
// }

// export const DecimalToString =
//   (decimals: number = 2) =>
//   (decimal?: Decimal) =>
//     decimal?.toFixed?.(decimals) || decimal;

export class ColumnNumericTransformer implements ValueTransformer {
  to(data?: number | null): number | null {
    if (!isNullOrUndefined(data)) {
      return data;
    }
    return null;
  }

  from(data?: string | null): number | null {
    if (!isNullOrUndefined(data)) {
      const res = parseFloat(data);
      if (isNaN(res)) {
        return null;
      } else {
        return res;
      }
    }
    return null;
  }
}
