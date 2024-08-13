import { Bounds } from 'pigeon-maps';
import { useMemo } from 'react';

import { ChargePointViewModel, ChargerViewModel, ConnectorViewModel } from '@/common/types/charger-view-model.types';
import { CurrentType, PlugType } from '@/common/types/common.types';
import { DcsPlugType, DcsPoolDetails } from '@/common/types/dcs-pool-details';
import { FilterItem } from '@/common/types/filter.types';
import { getFavorites } from '@/services/storage.service';

export function mapDcsDataArrayToChargerViewModelArray(data: DcsPoolDetails[]): ChargerViewModel[] {
  return data.reduce<ChargerViewModel[]>((acc, d) => {
    const charger = mapDcsDataToChargerViewModel(d);
    const similarCharger = acc.find((c) => isChargerSimilar(c, charger));
    if (similarCharger) {
      similarCharger.chargePoints = sortChargePointsByPower(
        mergeChargePoints(similarCharger.chargePoints, charger.chargePoints)
      );
    } else {
      charger.chargePoints = sortChargePointsByPower(charger.chargePoints);
      acc.push(charger);
    }
    return acc;
  }, []);
}

function isChargerSimilar(charger1: ChargerViewModel, charger2: ChargerViewModel) {
  return (
    charger1.coordinates[0] === charger2.coordinates[0] &&
    charger1.coordinates[1] === charger2.coordinates[1] &&
    charger1.name === charger2.name
  );
}

function sortChargePointsByPower(chargePoints: ChargePointViewModel[]) {
  return chargePoints.sort((a, b) =>
    a.maxPowerKw === b.maxPowerKw ? a.evseId.localeCompare(b.evseId) : b.maxPowerKw - a.maxPowerKw
  );
}

function mergeChargePoints(charger1: ChargePointViewModel[], charger2: ChargePointViewModel[]) {
  const base = [...charger1];
  charger2.forEach((cp) => {
    const similar = base.find((b) => b.id === cp.id);
    if (similar) {
      similar.connectors = [...similar.connectors, ...cp.connectors];
    } else {
      base.push(cp);
    }
  });
  return base;
}

export function mapDcsDataToChargerViewModel(data: DcsPoolDetails): ChargerViewModel {
  const favorites = getFavorites();

  const location = data.poolLocations[0];
  const name = location.poolLocationNames?.[0].name ?? '';

  const chargePoints: ChargePointViewModel[] = [];

  data.chargingStations.forEach((station) => {
    station.chargePoints.forEach((cp) => {
      const connectors: ConnectorViewModel[] = cp.connectors.map((c) => ({
        plugType: DcsPlugTypeMap[c.plugType] ?? PlugType.Type2,
        power: c.powerLevel ?? 0,
        currentType: c.phaseType ?? CurrentType.AC,
      }));

      chargePoints.push({
        id: cp.dcsCpId ?? '',
        status: 'UNKNOWN',
        maxPowerKw: Math.max(...connectors.map((c) => c.power), 0),
        plugTypes: connectors.map((c) => c.plugType),
        connectors: connectors,
        evseId: cp.incomingCpId ?? '',
      });
    });
  });

  const mapped: ChargerViewModel = {
    id: data.dcsPoolId ?? '',
    coordinates: [Number(location.coordinates.latitude), Number(location.coordinates.longitude)],
    countryCode: location.countryCode ?? '',
    chargePoints: chargePoints,
    fullAddress: `${location.street}, ${location.city}`,
    locationId: '',
    maxPowerKw: Math.max(...chargePoints.map((e) => e.maxPowerKw), 0),
    name: name,
    operatorName: data.technicalChargePointOperatorName ?? '',
    partyId: '',
    plugTypes: Array.from(new Set(chargePoints.flatMap((evse) => evse.plugTypes))),
    isFavorite: favorites.has(data.dcsPoolId ?? ''),
  };

  return mapped;
}

export const StatusMap: Record<string, string> = {
  AVAILABLE: 'Elérhető',
  CHARGING: 'Használatban',
  UNKNOWN: 'Ismeretlen',
  OFFLINE: 'Nem elérhető',
  OUT_OF_ORDER: 'Nem üzemel',
};

export const PlugTypeLabels: Record<PlugType, string> = {
  [PlugType.Ccs]: 'CCS',
  [PlugType.CHAdeMO]: 'CHAdeMO',
  [PlugType.Type2]: 'Type 2',
};

export const DcsPlugTypeMap: Record<DcsPlugType, PlugType> = {
  CHADEMO: PlugType.CHAdeMO,
  CCS: PlugType.Ccs,
  TYP2: PlugType.Type2,
};

export function useFilteredMarkers(markers: ChargerViewModel[], filters: FilterItem[]) {
  return useMemo(() => {
    return filters.reduce((acc, filter) => {
      return Filters[filter.type](filter, acc);
    }, markers);
  }, [markers, filters]);
}

export function useMarkersInBound(bounds: Bounds | undefined, zoom: number, markers: ChargerViewModel[]) {
  return useMemo(() => {
    if (!bounds) return markers;
    const markersInBounds = markers.filter((chargePoint) => {
      const [lat, lng] = chargePoint.coordinates;
      return bounds.sw[0] < lat && lat < bounds.ne[0] && bounds.sw[1] < lng && lng < bounds.ne[1];
    });
    if (zoom > 12) {
      return markersInBounds;
    }
    return markersInBounds.filter((chargers) => {
      return chargers.chargePoints?.some((cp) => (cp.maxPowerKw && cp.maxPowerKw >= 50) || chargers.isFavorite);
    });
  }, [bounds, markers, zoom]);
}

export function useProvidersOfMarkers(markers: ChargerViewModel[]) {
  return useMemo(() => {
    const providers = markers.map((m) => m.operatorName.split(' ')[0] ?? '').filter(Boolean);
    return Array.from(new Set(providers));
  }, [markers]);
}

interface FilterFunction {
  (filter: FilterItem, markers: ChargerViewModel[]): ChargerViewModel[];
}

const Filters: Record<FilterItem['type'], FilterFunction> = {
  power: (filter, markers) => {
    if (filter.type !== 'power') return markers;
    return markers.reduce<ChargerViewModel[]>((acc, marker) => {
      const { chargePoints, ...restMarker } = marker;
      if (!chargePoints) return acc;
      const evsesFiltered = chargePoints.filter((e) => e.maxPowerKw && e.maxPowerKw >= filter.value);
      if (evsesFiltered.length) {
        acc.push({ ...restMarker, chargePoints: evsesFiltered });
      }
      return acc;
    }, []);
  },
  provider: (filter, markers) => {
    if (filter.type !== 'provider') return markers;
    return markers.filter((marker) => {
      return filter.value.some((v) => marker.operatorName.includes(v) || marker.partyId.includes(v));
    });
  },
  plug: (filter, markers) => {
    if (filter.type !== 'plug') return markers;
    return markers.reduce<ChargerViewModel[]>((acc, marker) => {
      const { chargePoints, ...restMarker } = marker;
      if (!chargePoints) return acc;
      const evsesFiltered = chargePoints.filter((e) => e.plugTypes.some((p) => filter.value.includes(p)));
      if (evsesFiltered.length) {
        acc.push({ ...restMarker, chargePoints: evsesFiltered });
      }
      return acc;
    }, []);
  },
  favorite: (filter, markers) => {
    if (filter.type !== 'favorite') return markers;
    return markers.filter((marker) => marker.isFavorite);
  },
};
