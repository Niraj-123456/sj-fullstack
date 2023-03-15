import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  // Function to pick specific key value pair from the object by providing keys
  // Usage:
  // const fullClass = new FullClass()           // contains A,B,C,D
  // const halfClass = pick(fullClass,"A","B");  // contains A,B
  pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const copy = {} as Pick<T, K>;

    keys.forEach((key) => (copy[key] = obj[key]));

    return copy;
  }

  // Function to pick specific key value pair from the object by providing interface and allowed fields
  // Usage:
  // const fullClass = new FullClass()                  // contains A,B,C,D
  // interface IHalf {A:string, B:string}
  //
  // function extract<T>(properties: Record<keyof T, true>){
  //   return function<TActual extends T>(value: TActual){
  //       let result = {} as T;
  //       for (const property of Object.keys(properties) as Array<keyof T>) {
  //           result[property] = value[property];
  //       }
  //       return result;
  //   }
  // }
  //
  // const extractIHalfObject = extract<IHalf>({
  //   //the field in T of extract<T> should match exactly
  //   A: true,
  //   B: true
  // })
  // const halfClass = extractIHalfObject(fullClass);   // contains A,B
  extract<T>(properties: Record<keyof T, true>) {
    return function <TActual extends T>(value: TActual) {
      let result = {} as T;
      for (const property of Object.keys(properties) as Array<keyof T>) {
        result[property] = value[property];
      }
      return result;
    };
  }
}
