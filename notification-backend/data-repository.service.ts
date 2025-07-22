import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ChargePointViewModel, ChargerViewModel } from '@/common/types/charger-view-model.types';
import { MobilitiLocationItem } from '@/common/types/mobiliti.types';

import { ApiService } from './api.service';
import { mapMobilitiDataToChargerViewModel } from './charger.utils';
import { NotificationService } from './notification.service';
import { ConcurrentQueue } from './queue.utils';

@Injectable()
export class DataRepositoryService {
  private readonly logger = new Logger(DataRepositoryService.name);
  private requestQueue = new ConcurrentQueue(3, () => {
    this.logger.log('Queue finished');
  });

  private readonly cache: Map<string, ChargerViewModel> = new Map();

  constructor(
    private readonly dataFetcherService: ApiService,
    private readonly notificationService: NotificationService
  ) {
    this.fetchData();
  }

  async getData(): Promise<ChargerViewModel[]> {
    return Array.from(this.cache.values());
  }

  @Cron('*/3 * * * *')
  private async fetchData() {
    this.logger.log('Fetching data');
    const data = await this.dataFetcherService.getMobilitiChargePointList();
    this.deleteNonExistingChargePoints(data);
    this.addNewChargePoints(data);
  }

  private addNewChargePoints(locations: MobilitiLocationItem[]): void {
    for (const item of locations) {
      this.requestQueue.add(() => this.processItem(item));
    }
    this.logger.log(`Added ${locations.length} items to the queue`);
  }

  private async processItem(item: MobilitiLocationItem): Promise<void> {
    const locationDetails = await this.dataFetcherService.getMobilitiLocationDetails(item);
    const chargerViewModel = mapMobilitiDataToChargerViewModel(item, locationDetails);
    this.set(item.id, chargerViewModel);
  }

  private get(key: string): ChargerViewModel | undefined {
    return this.cache.get(key);
  }

  private set(key: string, value: ChargerViewModel): void {
    const existing = this.get(key);
    if (existing) {
      this.compareChargerData(existing, value);
    }
    this.cache.set(key, value);
  }

  private async compareChargerData(existing: ChargerViewModel, updated: ChargerViewModel): Promise<void> {
    const subscriptions = await this.notificationService.getSubscriptionsForStation(existing.id);
    for (const chargePoint of existing.chargePoints) {
      const updatedChargePoint = updated.chargePoints.find((cp) => cp.id === chargePoint.id);
      if (updatedChargePoint) {
        if (this.isChargePointChanged(chargePoint, updatedChargePoint)) {
          for (const subscription of subscriptions) {
            this.notificationService.sendNotification({
              token: subscription.token,
              stationId: existing.id,
              notificationData: {
                stationName: this.getStationName(existing),
                chargePointName: this.getChargePointName(chargePoint),
                status: updatedChargePoint.status,
              },
            });
          }
        }
      }
    }
  }

  private isChargePointChanged(existing: ChargePointViewModel, updated: ChargePointViewModel): boolean {
    return existing.status !== updated.status;
  }

  private getStationName(charger: ChargerViewModel): string {
    return charger.name ?? 'Ismeretlen';
  }

  private getChargePointName(chargePoint: ChargePointViewModel): string {
    return (
      chargePoint.connectors.map((connector) => `${connector.plugType} ${connector.power} kW`).join(', ') ??
      'Ismeretlen'
    );
  }

  private deleteNonExistingChargePoints(locations: MobilitiLocationItem[]): void {
    if (locations.length === 0) {
      return;
    }
    const existingKeys = Array.from(this.cache.keys());
    for (const key of existingKeys) {
      if (!locations.some((location) => location.id === key)) {
        this.delete(key);
      }
    }
  }

  private delete(key: string): void {
    this.cache.delete(key);
  }
}
