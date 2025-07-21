import { Injectable, Logger } from '@nestjs/common';

import { getMobilitiLocationDetails, getMobilitiLocations } from '@/common/services/mobiliti.service';
import { MobilitiLocationDetails, MobilitiLocationItem, MobilitiLocationResponse } from '@/common/types/mobiliti.types';

import { PrismaService } from './prisma.service';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getMobilitiChargePointList(): Promise<MobilitiLocationResponse> {
    const data = await getMobilitiLocations();
    return data;
  }

  async getMobilitiLocationDetails(locationItem: MobilitiLocationItem): Promise<MobilitiLocationDetails | null> {
    const countryCode = locationItem.ocpi?.stationId.countryCode ?? 'HU';
    const provider = locationItem.ocpi?.stationId.partyId ?? '';
    const locationId = locationItem.ocpi?.stationId.locationId ?? '';
    if (!countryCode || !provider || !locationId) {
      return null;
    }
    try {
      const data = await getMobilitiLocationDetails(countryCode, provider, locationId);
      return data;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
