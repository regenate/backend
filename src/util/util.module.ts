import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { ResponseService } from './response.service';
import { UtilService } from './util.service';

@Module({
  providers: [UtilService, ResponseService, PaginationService],
  exports: [UtilService, ResponseService, PaginationService],
})
export class UtilModule {}
