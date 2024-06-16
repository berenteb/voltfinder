import { Bounds } from 'pigeon-maps';
import { useMemo } from 'react';

import { FilterItem } from '@/types/filter.types';
import { MobilitiData } from '@/types/mobiliti.types';

export const StatusMap: Record<string, string> = {
  AVAILABLE: 'Elérhető',
  CHARGING: 'Használatban',
  UNKNOWN: 'Ismeretlen',
  OUT_OF_ORDER: 'Nem üzemel',
};

export function useFilteredMarkers(markers: MobilitiData[], filters: FilterItem[]) {
  return useMemo(() => {
    return filters.reduce((acc, filter) => {
      return Filters[filter.type](filter, acc);
    }, markers);
  }, [markers, filters]);
}

export function useMarkersInBound(bounds: Bounds | undefined, zoom: number, markers: MobilitiData[]) {
  return useMemo(() => {
    if (!bounds) return markers;
    const markersInBounds = markers.filter((chargePoint) => {
      const lat = Number(chargePoint.latitude);
      const lng = Number(chargePoint.longitude);
      return bounds.sw[0] < lat && lat < bounds.ne[0] && bounds.sw[1] < lng && lng < bounds.ne[1];
    });
    if (zoom > 12) {
      return markersInBounds;
    }
    return markersInBounds.filter((chargePoint) => {
      return chargePoint.evses?.some((evse) => evse.power && evse.power / 1000 >= 50);
    });
  }, [bounds, markers]);
}

export function useProvidersOfMarkers(markers: MobilitiData[]) {
  return useMemo(() => {
    const providers = markers.map((m) => m.operator?.name?.split(' ')[0] ?? '').filter(Boolean);
    return Array.from(new Set(providers));
  }, [markers]);
}

interface FilterFunction {
  (filter: FilterItem, markers: MobilitiData[]): MobilitiData[];
}

const Filters: Record<FilterItem['type'], FilterFunction> = {
  power: (filter, markers) => {
    if (filter.type !== 'power') return markers;
    return markers.reduce((acc, marker) => {
      const { evses, ...restMarker } = marker;
      if (!evses) return acc;
      const evsesFiltered = evses.filter((e) => e.power && e.power / 1000 >= filter.value);
      if (evsesFiltered.length) {
        acc.push({ ...restMarker, evses: evsesFiltered });
      }
      return acc;
    }, [] as MobilitiData[]);
  },
  provider: (filter, markers) => {
    if (filter.type !== 'provider') return markers;
    return markers.filter((marker) => {
      return filter.value.some(
        (v) => marker.operator?.name?.includes(v) || marker.ocpi?.stationId?.partyId?.includes(v)
      );
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
    }, [] as MobilitiData[]);
  },
};
