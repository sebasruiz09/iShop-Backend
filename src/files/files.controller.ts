import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from '../common/helpers/fileFilter.helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // all type files send with post method
  @Post('product')
  //use interceptor to transform data
  @UseInterceptors(
    FileInterceptor(
      // prop this key value
      'file',
      {
        // call to helper to verify file validations
        fileFilter: fileFilter,
      },
    ),
  )
  // receiving file with defined data type
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // validate file type
    return file;
  }
}
