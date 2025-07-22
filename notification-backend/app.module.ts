import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiService } from './api.service';
import { AppController } from './app.controller';
import { DataRepositoryService } from './data-repository.service';
import { NotificationService } from './notification.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [NotificationService, PrismaService, ApiService, DataRepositoryService],
})
export class AppModule {}
