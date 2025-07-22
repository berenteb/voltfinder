import { Injectable, Logger } from '@nestjs/common';

import { getMobilitiLocationDetails, getMobilitiLocations } from '@/common/services/mobiliti.service';
import { MobilitiLocationDetails, MobilitiLocationItem, MobilitiLocationResponse } from '@/common/types/mobiliti.types';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  async getMobilitiChargePointList(): Promise<MobilitiLocationResponse> {
    try {
      const data = await getMobilitiLocations();
      return data;
    } catch (error) {
      this.logger.error(error);
      return [];
    }
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
