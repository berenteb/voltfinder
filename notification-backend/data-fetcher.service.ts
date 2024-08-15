import { Injectable, Logger } from '@nestjs/common';
import { ChargePointStatus, ChargePointStatusEnum, Subscription } from '@prisma/client';

import { getChargePointsByIds, getPoolDetails } from '@/common/services/dcs.service';
import { DcsChargePointItemDto } from '@/common/types/dcs.types';
import { ChargePoint, DcsPoolDetails } from '@/common/types/dcs-pool-details';
import { ChargerNotificationObject } from '@/common/types/types';

import { PrismaService } from './prisma.service';

@Injectable()
export class DataFetcherService {
  private readonly logger = new Logger(DataFetcherService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getChargerNotificationObjects(subscriptions: Subscription[]): Promise<ChargerNotificationObject[]> {
    const chargerNotificationObjects: ChargerNotificationObject[] = [];
    const poolDetails = await getPoolDetails(subscriptions.map((subscription) => subscription.stationId));
    for (const subscription of subscriptions) {
      const station = poolDetails.find((pool) => pool.dcsPoolId === subscription.stationId);
      const updatedStatuses = await this.getUpdatedStatusesForStation(station);
      const chargerNotificationObjectsForSubscription: ChargerNotificationObject[] = updatedStatuses.map((status) => {
        const chargePoint = this.getChargePointFromStation(station, status.id);
        return {
          token: subscription.token,
          stationId: subscription.stationId,
          notificationData: {
            stationName: this.getStationName(station),
            chargePointName: this.getChargePointName(chargePoint),
            status: this.getStatusText(status.status),
          },
        };
      });
      chargerNotificationObjects.push(...chargerNotificationObjectsForSubscription);
    }
    return chargerNotificationObjects;
  }

  private getChargePointFromStation(
    station: DcsPoolDetails | undefined,
    chargePointId: string
  ): ChargePoint | undefined {
    if (!station) {
      return undefined;
    }
    for (const stationItem of station.chargingStations) {
      for (const chargePointItem of stationItem.chargePoints) {
        if (chargePointItem.dcsCpId === chargePointId) {
          return chargePointItem;
        }
      }
    }
    return undefined;
  }

  private getStationName(station: DcsPoolDetails | undefined): string {
    return station?.poolLocations[0].poolLocationNames?.[0].name ?? 'Ismeretlen';
  }

  private getChargePointName(chargePoint: ChargePoint | undefined): string {
    return (
      chargePoint?.connectors.map((connector) => `${connector.plugType} ${connector.powerLevel}`).join(', ') ??
      'Ismeretlen'
    );
  }

  private async getUpdatedStatusesForStation(station: DcsPoolDetails | undefined): Promise<ChargePointStatus[]> {
    if (!station) {
      return [];
    }
    const chargePointIds: string[] = [];
    station.chargingStations.forEach((station) => {
      station.chargePoints.forEach((chargePoint) => {
        chargePointIds.push(chargePoint.dcsCpId);
      });
    });
    const freshChargePointDetails = await getChargePointsByIds(chargePointIds);
    const freshChargePointStatuses: ChargePointStatus[] = this.mapToChargePointStatus(
      freshChargePointDetails,
      station.dcsPoolId
    );

    return await this.getUpdatedChargePointStatuses(freshChargePointStatuses);
  }

  private mapToChargePointStatus(chargePoints: DcsChargePointItemDto[], stationId: string): ChargePointStatus[] {
    return chargePoints.map((chargePoint) => ({
      stationId,
      id: chargePoint.dcsChargePointId,
      status: this.getStatusEnum(chargePoint.OperationalStateCP),
    }));
  }

  private getStatusEnum(status: string): ChargePointStatusEnum {
    switch (status) {
      case 'AVAILABLE':
        return ChargePointStatusEnum.Available;
      case 'CHARGING':
        return ChargePointStatusEnum.Charging;
      case 'OFFLINE':
        return ChargePointStatusEnum.Offline;
      default:
        return ChargePointStatusEnum.Unknown;
    }
  }

  private getStatusText(status: ChargePointStatusEnum): string {
    switch (status) {
      case ChargePointStatusEnum.Available:
        return 'Elérhető';
      case ChargePointStatusEnum.Charging:
        return 'Használatban';
      case ChargePointStatusEnum.Offline:
        return 'Nem elérhető';
      default:
        return 'Ismeretlen';
    }
  }

  private async getUpdatedChargePointStatuses(
    freshChargePointStatuses: ChargePointStatus[]
  ): Promise<ChargePointStatus[]> {
    const updatedChargePointStatuses: ChargePointStatus[] = [];
    for (const chargePoint of freshChargePointStatuses) {
      const chargePointStatus = await this.getChargePointStatus(chargePoint.id, chargePoint.stationId);
      if (chargePointStatus) {
        if (chargePointStatus.status !== chargePoint.status) {
          const updatedChargePointStatus = await this.updateChargePointStatus(chargePoint);
          updatedChargePointStatuses.push(updatedChargePointStatus);
        }
      } else {
        await this.createChargePointStatus(chargePoint);
      }
    }
    return updatedChargePointStatuses;
  }

  private async getChargePointStatus(chargePointId: string, stationId: string): Promise<ChargePointStatus | null> {
    return this.prismaService.chargePointStatus.findUnique({
      where: {
        id: chargePointId,
        stationId,
      },
    });
  }

  private async createChargePointStatus(chargePoint: ChargePointStatus): Promise<void> {
    await this.prismaService.chargePointStatus.create({
      data: {
        id: chargePoint.id,
        status: chargePoint.status,
        stationId: chargePoint.stationId,
      },
    });
  }

  private async updateChargePointStatus(chargePoint: ChargePointStatus): Promise<ChargePointStatus> {
    return this.prismaService.chargePointStatus.update({
      where: {
        id: chargePoint.id,
        stationId: chargePoint.stationId,
      },
      data: {
        status: chargePoint.status,
      },
    });
  }
}
