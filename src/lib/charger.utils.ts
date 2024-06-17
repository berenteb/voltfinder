import { Bounds } from 'pigeon-maps';
import { useMemo } from 'react';

import { ChargerViewModel } from '@/types/charger-view-model.types';
import { FilterItem } from '@/types/filter.types';
import { MobilitiData, PlugType } from '@/types/mobiliti.types';

export function mapMobilitiDataToChargerViewModel(data: MobilitiData): ChargerViewModel {
  const mapped: ChargerViewModel = {
    id: data.id ?? '',
    coordinates: [Number(data.latitude), Number(data.longitude)],
    countryCode: data.ocpi?.stationId?.countryCode ?? '',
    evses:
      data.evses?.map((evse) => ({
        currentType: evse.currentType ?? '',
        evseId: evse.evseId ?? '',
        plugType: (evse.plugType?.toLowerCase() ?? '') as PlugType,
        power: (evse.power ?? 0) / 1000,
      })) ?? [],
    fullAddress: `${data.address}, ${data.city}`,
    locationId: data.ocpi?.stationId?.locationId ?? '',
    maxPowerKw: Math.max(...(data.evses?.map((e) => e.power ?? 0) ?? []), 0) / 1000,
    name: data.name ?? '',
    operatorName: data.operator?.name ?? data.ocpi?.stationId?.partyId ?? '',
    partyId: data.ocpi?.stationId?.partyId ?? '',
    plugTypes: [],
  };

  mapped.evses = mapped.evses.filter((evse) => Boolean(evse.plugType));

  mapped.plugTypes = Array.from(new Set(mapped.evses.map((evse) => evse.plugType)));

  return mapped;
}

export const StatusMap: Record<string, string> = {
  AVAILABLE: 'Elérhető',
  CHARGING: 'Használatban',
  UNKNOWN: 'Ismeretlen',
  OUT_OF_ORDER: 'Nem üzemel',
};

export const PlugTypeLabels: Record<PlugType, string> = {
  [PlugType.Ccs]: 'CCS',
  [PlugType.CHAdeMO]: 'CHAdeMO',
  [PlugType.Type2]: 'Type 2',
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
    return markersInBounds.filter((chargePoint) => {
      return chargePoint.evses?.some((evse) => evse.power && evse.power >= 50);
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
    return markers.reduce((acc, marker) => {
      const { evses, ...restMarker } = marker;
      if (!evses) return acc;
      const evsesFiltered = evses.filter((e) => e.power && e.power >= filter.value);
      if (evsesFiltered.length) {
        acc.push({ ...restMarker, evses: evsesFiltered });
      }
      return acc;
    }, [] as ChargerViewModel[]);
  },
  provider: (filter, markers) => {
    if (filter.type !== 'provider') return markers;
    return markers.filter((marker) => {
      return filter.value.some((v) => marker.operatorName.includes(v) || marker.partyId.includes(v));
    });
  },
  plug: (filter, markers) => {
    if (filter.type !== 'plug') return markers;
    return markers.reduce((acc, marker) => {
      const { evses, ...restMarker } = marker;
      if (!evses) return acc;
      const evsesFiltered = evses.filter((e) => e.plugType && filter.value.includes(e.plugType));
      if (evsesFiltered.length) {
        acc.push({ ...restMarker, evses: evsesFiltered });
      }
      return acc;
    }, [] as ChargerViewModel[]);
  },
};
