import { Body, Controller, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { type SubscribeForUpdatesDto, SubscriptionListDto } from '@/common/types/types';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Cron('0 * * * * *')
  async handleCron() {
    const notifications = await this.appService.getNotificationObjects();
    for (const notification of notifications) {
      this.appService.sendNotification(notification);
    }
    await this.appService.removeOutdatedSubscriptions();
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
