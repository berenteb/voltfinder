import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { subHours } from 'date-fns';
import { credential } from 'firebase-admin';
import { App, initializeApp } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';

import { ChargerNotificationObject, SubscribeForUpdatesDto, SubscriptionListDto } from '@/common/types/types';

import { DataFetcherService } from './data-fetcher.service';
import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, FRONTEND_URL } from './environment.config';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly firebaseApp: App;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly dataFetcherService: DataFetcherService
  ) {
    this.firebaseApp = initializeApp({
      credential: credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
    });
  }

  async getNotificationObjects(): Promise<ChargerNotificationObject[]> {
    this.logger.log('Getting notification objects');
    const subscriptions = await this.getSubscriptions();
    return await this.dataFetcherService.getChargerNotificationObjects(subscriptions);
  }

  sendNotification(chargerNotificationObject: ChargerNotificationObject): void {
    this.logger.log('Sending notification');
    const message: Message = {
      notification: {
        title: chargerNotificationObject.notificationData.stationName,
        body: `${chargerNotificationObject.notificationData.chargePointName}: ${chargerNotificationObject.notificationData.status}`,
        imageUrl: `${FRONTEND_URL}/icon.png`,
      },
      webpush: {
        notification: {
          title: chargerNotificationObject.notificationData.stationName,
          body: `${chargerNotificationObject.notificationData.chargePointName}: ${chargerNotificationObject.notificationData.status}`,
          icon: `${FRONTEND_URL}/icon.png`,
        },
        fcmOptions: {
          link: FRONTEND_URL,
        },
      },
      token: chargerNotificationObject.token,
    };
    this.logger.log(
      `Sending message: ${message.webpush?.notification?.title} - ${message.webpush?.notification?.body}`
    );
    getMessaging(this.firebaseApp)
      .send(message)
      .then((response) => {
        this.logger.log('Successfully sent message:', response);
      })
      .catch((error) => {
        this.logger.log('Error sending message:', error);
      });
  }

  async subscribeToUpdates(data: SubscribeForUpdatesDto) {
    this.validateDto(data);
    this.logger.log(`Subscribing to updates for station ${data.stationId}`);
    await this.prismaService.subscription.create({
      data: {
        token: data.token,
        stationId: data.stationId,
      },
    });
  }

  async unsubscribeFromUpdates(data: SubscribeForUpdatesDto) {
    this.validateDto(data);
    const subscription = await this.prismaService.subscription.findUnique({
      where: {
        stationId_token: {
          stationId: data.stationId,
          token: data.token,
        },
      },
    });
    if (!subscription) {
      this.logger.error('Subscription not found');
      throw new BadRequestException('Subscription not found');
    }
    this.logger.log(`Manually removing subscription for station ${data.stationId}`);
    await this.removeSubscriptions([subscription]);
  }

  private validateDto(data: SubscribeForUpdatesDto): void {
    if (!data.token) {
      this.logger.error('Token was not provided');
      throw new BadRequestException('Token is required');
    }
    if (!data.stationId) {
      this.logger.error('Station ID was not provided');
      throw new BadRequestException('Station ID is required');
    }
  }

  async removeOutdatedSubscriptions(): Promise<void> {
    const outdatedSubscriptions = await this.getOutdatedSubscriptions();
    if (outdatedSubscriptions.length > 0) {
      this.logger.log(`Removing ${outdatedSubscriptions.length} outdated subscriptions`);
    }
    await this.removeSubscriptions(outdatedSubscriptions);
  }

  private async removeSubscriptions(subscriptions: Subscription[]): Promise<void> {
    for (const subscription of subscriptions) {
      await this.prismaService.subscription.delete({
        where: {
          stationId_token: {
            stationId: subscription.stationId,
            token: subscription.token,
          },
        },
      });
    }

    const remainingSubscriptions = await this.getSubscriptions();
    const usedStations = remainingSubscriptions.map((subscription) => subscription.stationId);

    await this.prismaService.chargePointStatus.deleteMany({
      where: {
        stationId: {
          notIn: usedStations,
        },
      },
    });
  }

  async getSubscriptionsForToken(token: string): Promise<SubscriptionListDto> {
    const subscriptions = await this.prismaService.subscription.findMany({
      where: {
        token,
      },
    });

    return subscriptions.map((subscription) => subscription.stationId);
  }

  private getSubscriptions(): Promise<Subscription[]> {
    return this.prismaService.subscription.findMany();
  }

  private async getOutdatedSubscriptions() {
    return this.prismaService.subscription.findMany({
      where: {
        createdAt: {
          lt: subHours(new Date(), 1),
        },
      },
    });
  }
}
