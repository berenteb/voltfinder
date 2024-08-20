import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { type Response } from 'express';

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

  @Get('map/:x/:y/:z')
  async getTile(@Param('x') x: number, @Param('y') y: number, @Param('z') z: number, @Res() res: Response) {
    const response = await fetch(`https://tiles.stadiamaps.com/tiles/alidade_smooth/${z}/${x}/${y}.png`, {
      referrer: 'https://voltfinder.berente.net',
    });

    if (response.ok) {
      const data = await response.arrayBuffer();
      const buffer = Buffer.from(data);
      res.set('Content-Type', 'image/png');

      return res.send(buffer);
    }

    const fallbackResponse = await fetch(`https://tile.openstreetmap.fr/hot/${z}/${x}/${y}.png`);
    const fallbackData = await fallbackResponse.arrayBuffer();
    const fallbackBuffer = Buffer.from(fallbackData);
    res.set('Content-Type', 'image/png');

    return res.send(fallbackBuffer);
  }
}
