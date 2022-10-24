import { Injectable, BadRequestException } from '@nestjs/common';
import { IError } from 'src/common/interfaces/error.interface';

@Injectable()
export class ErrorsManagerService {
  async handlingError(error: IError) {
    const errorCode = error.driverError.code;
    const result = error.driverError.detail
      .match(/\(([\w]+)\)/)[0]
      .replace(/\(([\w]+)\)/, '$1');

    throw new BadRequestException(`Error ${errorCode} ${result} already exist`);
  }
}
