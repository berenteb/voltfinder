import { Body, Controller, Get, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { type SubscribeForUpdatesDto, SubscriptionListDto } from '@/common/types/types';

import { NotificationService } from './notification.service';
import { DataRepositoryService } from './data-repository.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: NotificationService,
    private readonly dataRepositoryService: DataRepositoryService
  ) {}

  @Cron('0 * * * * *')
  async handleCron() {
    await this.appService.removeOutdatedSubscriptions();
  }

  @Get('data')
  async getData(): Promise<ChargerViewModel[]> {
    return this.dataRepositoryService.getData();
  }

  @Post('subscriptions')
  getRegistrationsForToken(@Body('token') token: string): Promise<SubscriptionListDto> {
    return this.appService.getSubscriptionsForToken(token);
  }

  @Post('subscribe')
  async registerForUpdates(@Body() body: SubscribeForUpdatesDto): Promise<void> {
    await this.appService.subscribeToUpdates(body);
  }

  @Post('unsubscribe')
  async unregisterForUpdates(@Body() body: SubscribeForUpdatesDto): Promise<void> {
    await this.appService.unsubscribeFromUpdates(body);
  }
}
