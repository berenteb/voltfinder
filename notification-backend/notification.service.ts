import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { subHours } from 'date-fns';
import { credential } from 'firebase-admin';
import { App, initializeApp } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';

import { ChargerNotificationObject, SubscribeForUpdatesDto, SubscriptionListDto } from '@/common/types/types';

import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, FRONTEND_URL } from './environment.config';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly firebaseApp: App;
  private readonly subscriptionCache = new Map<string, Subscription[]>();

  constructor(private readonly prismaService: PrismaService) {
    this.firebaseApp = initializeApp({
      credential: credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
    });
    this.loadSubscriptionsFromDatabase();
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
          link: `${FRONTEND_URL}?id=${chargerNotificationObject.stationId}`,
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

  async getSubscriptionsForToken(token: string): Promise<SubscriptionListDto> {
    const subscriptions = await this.prismaService.subscription.findMany({
      where: {
        token,
      },
    });

    return subscriptions.map((subscription) => subscription.stationId);
  }

  async getSubscriptionsForStation(stationId: string): Promise<Subscription[]> {
    return this.subscriptionCache.get(stationId) ?? [];
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.prismaService.subscription.findMany();
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

    this.addSubscriptionToCache(data.stationId, data.token);
  }

  async unsubscribeFromUpdates(data: SubscribeForUpdatesDto) {
    this.validateDto(data);
    await this.prismaService.subscription.delete({
      where: {
        stationId_token: {
          stationId: data.stationId,
          token: data.token,
        },
      },
    });

    this.removeSubscriptionFromCache(data.stationId, data.token);
  }

  async removeOutdatedSubscriptions(): Promise<void> {
    const outdatedSubscriptions = await this.prismaService.subscription.findMany({
      where: {
        createdAt: {
          lt: subHours(new Date(), 1),
        },
      },
    });

    for (const subscription of outdatedSubscriptions) {
      this.removeSubscriptionFromCache(subscription.stationId, subscription.token);
    }

    await this.prismaService.subscription.deleteMany({
      where: {
        createdAt: {
          lt: subHours(new Date(), 1),
        },
      },
    });
  }

  private async loadSubscriptionsFromDatabase(): Promise<void> {
    const subscriptions = await this.prismaService.subscription.findMany();
    for (const subscription of subscriptions) {
      this.addSubscriptionToCache(subscription.stationId, subscription.token);
    }
  }

  private addSubscriptionToCache(stationId: string, token: string): void {
    const existingSubscriptions = this.subscriptionCache.get(stationId);
    if (existingSubscriptions) {
      const existingSubscription = existingSubscriptions.find((s) => s.token === token);
      if (!existingSubscription) {
        existingSubscriptions.push({ token, stationId, createdAt: new Date() });
      }
    } else {
      this.subscriptionCache.set(stationId, [{ token, stationId, createdAt: new Date() }]);
    }
  }

  private removeSubscriptionFromCache(stationId: string, token: string): void {
    const existingSubscriptions = this.subscriptionCache.get(stationId);
    if (existingSubscriptions) {
      const newSubscriptions = existingSubscriptions.filter((s) => s.token !== token);
      this.subscriptionCache.set(stationId, newSubscriptions);
    }
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
}
