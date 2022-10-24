import { Injectable, BadRequestException } from '@nestjs/common';
import { IError } from 'src/common/interfaces/error.interface';

@Injectable()
export class ErrorsManagerService {
  async handlingError(error: IError) {
    const { code } = error;
    console.log(code);
    if (code === '23505') this.duplicateKey(error);
    if (code === '22P02') this.invalidUUID();
  }

  private invalidUUID() {
    throw new BadRequestException({ message: 'invalid uuid' });
  }

  private duplicateKey(error: IError) {
    const errorCode = error.driverError.code;
    const result = error.driverError.detail
      .match(/\(([\w]+)\)/)[0]
      .replace(/\(([\w]+)\)/, '$1');
    throw new BadRequestException(`Error ${errorCode} ${result} already exist`);
  }
}
