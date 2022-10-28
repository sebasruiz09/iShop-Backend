import { Module } from '@nestjs/common';
import { ErrorsManagerService } from './services/errors-manager/errors-manager.service';
@Module({
  providers: [ErrorsManagerService],
  exports: [ErrorsManagerService],
})
export class CommonModule {}
