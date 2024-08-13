import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataFetcherService } from './data-fetcher.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PrismaService, DataFetcherService],
})
export class AppModule {}
