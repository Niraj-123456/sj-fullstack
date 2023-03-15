import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { Observable } from 'rxjs';
import validator from 'validator';

export const ApiFile =
  (options?: ApiPropertyOptions): PropertyDecorator =>
  (target: Object, propertyKey: string | symbol) => {
    if (options?.isArray) {
      ApiProperty({
        type: 'array',
        items: {
          type: 'file',
          properties: {
            [propertyKey]: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })(target, propertyKey);
    } else {
      ApiProperty({
        type: 'file',
        properties: {
          [propertyKey]: {
            type: 'string',
            format: 'binary',
          },
        },
      })(target, propertyKey);
    }
  };

@Injectable()
export class FilesToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    if (req.body && Array.isArray(req.files) && req.files.length) {
      req.files.forEach((file: Express.Multer.File) => {
        const { fieldname } = file;
        if (!req.body[fieldname]) {
          req.body[fieldname] = [file];
        } else {
          req.body[fieldname].push(file);
        }
      });
    }

    return next.handle();
  }
}

@Injectable()
export class FileToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    if (req.body && req.file?.fieldname) {
      const { fieldname } = req.file;
      if (!req.body[fieldname]) {
        req.body[fieldname] = req.file;
      }
    }

    return next.handle();
  }
}

////////////////////////// DTOs /////////////////////////////////////

export class SingleFileFormDataDTO {
  @ApiProperty()
  id: string;

  @ApiFile()
  serviceImage: Express.Multer.File;

  @ApiProperty()
  description: string;
}

export class MultipleFilesFormDataDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiFile({ isArray: true })
  images: Express.Multer.File[];
}

//////////////////////////////// Custom Decorators //////////////////////
export function IsUuidArray(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    let fakeElements = [];
    registerDecorator({
      name: 'IsUuidArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        defaultMessage(): string {
          return `[${fakeElements}] is not uuid`;
        },
        validate(value: string[], args: ValidationArguments) {
          fakeElements = [];
          let isOnlyUuid = true;
          value.forEach((element) => {
            const result = validator.isUUID(element);
            if (!result) {
              isOnlyUuid = result;
              fakeElements.push(element);
            }
          });
          return isOnlyUuid;
        },
      },
    });
  };
}

// For array of objects
export function IsNonPrimitiveArray(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsNonPrimitiveArray',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // console.debug('value', value);
          // console.debug('Array.isArray(value)', Array.isArray(value));

          // console.debug('JSON.parse(value)', JSON.parse(value));
          // console.debug(
          //   'Array.isArray(JSON.parse(value))',
          //   Array.isArray(JSON.parse(value)),
          // );
          value = JSON.parse(value);

          // value.forEach((element) => {
          //   console.debug(element);
          // });
          return (
            Array.isArray(value) &&
            value.reduce((a, b) => {
              // console.debug('a', a);
              // console.debug('b', b);
              // console.debug('typeof b', typeof b);
              // console.debug('!Array.isArray(b)', !Array.isArray(b));

              return a && typeof b === 'object' && !Array.isArray(b);
            }, true)
          );
        },
      },
    });
  };
}

@Injectable()
export class StringArrayToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    if (req.body && Array.isArray(req.files) && req.files.length) {
      // req.body.forEach((stringArray: Express.Multer.File) => {
      //   const { fieldname } = file;
      //   if (!req.body[fieldname]) {
      //     req.body[fieldname] = [file];
      //   } else {
      //     req.body[fieldname].push(file);
      //   }
      // }
      // );
      console.debug('String Array interceptor');

      console.debug(req.body);
    }

    return next.handle();
  }
}

export function JsonToObjectsInterceptor(
  fields: string[],
): Type<NestInterceptor> {
  class JsonToObjectsInterceptorClass implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();

      if (request.body) {
        fields.forEach((field) => {
          if (request.body[field]) {
            try {
              request.body[field] = JSON.parse(request.body[field]);
            } catch (e) {
              throw new HttpException(
                {
                  success: false,
                  data: {
                    errorField: field,
                  },
                  message: `Error while parsing ${field}`,
                },
                HttpStatus.EXPECTATION_FAILED,
              );
            }
          }
        });
      }
      return next.handle();
    }
  }
  const Interceptor = mixin(JsonToObjectsInterceptorClass);
  return Interceptor as Type<NestInterceptor>;
}

// export function JsonToObjectsInterceptor(
//   fields: string[],
// ): Type<NestInterceptor> {
//   class JsonToObjectsInterceptorClass implements NestInterceptor {
//     intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//       const request = context.switchToHttp().getRequest();

//       // console.debug('body', request);
//       if (request.body) {
//         // let index = 0;
//         fields.forEach((field) => {
//           // console.debug('index', index);
//           // console.debug('inisde body', request.body[field]);

//           if (request.body[field]) {
//             let temp = request.body[field];

//             // // preserve newlines, etc - use valid JSON
//             // temp = temp
//             //   .replace(/\\n/g, '\\n')
//             //   .replace(/\\'/g, "\\'")
//             //   .replace(/\\"/g, '\\"')
//             //   .replace(/\\&/g, '\\&')
//             //   .replace(/\\r/g, '\\r')
//             //   .replace(/\\t/g, '\\t')
//             //   .replace(/\\b/g, '\\b')
//             //   .replace(/\\f/g, '\\f');
//             // // remove non-printable and other non-valid JSON chars
//             // temp = temp.replace(/[\u0000-\u0019]+/g, '');
//             // var o = JSON.parse(temp);

//             // console.debug('parsed body', o);
//             // console.debug('length', o.length);
//             // console.debug('type of ', typeof request.body[field]);
//             // console.debug('is array', Array.isArray(o));
//             // console.debug('is array', Array.isArray(1));

//             // let list = Array<String>();
//             // list.push('s');
//             // console.debug('type of ', Array.isArray(list));

//             // console.debug(
//             //   'type of ',
//             //   typeof JSON.parse(JSON.stringify(request.body[field])),
//             // );

//             // let stringify;
//             request.body[field] = JSON.parse(
//               JSON.stringify(request.body[field]),
//             );
//           }
//           // index = index + 1;
//         });
//       }
//       return next.handle();
//     }
//   }
//   const Interceptor = mixin(JsonToObjectsInterceptorClass);
//   return Interceptor as Type<NestInterceptor>;
// }
