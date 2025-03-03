import { Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { PaginationController } from './pagination.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  
  providers: [PaginationService],
  exports: [PaginationService]
})
export class PaginationModule {}
