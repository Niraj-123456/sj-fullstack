import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  default(): string {
    return 'Choose My Basket api';
  }
}
