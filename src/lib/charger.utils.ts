import { useMemo } from 'react';
import { LngLatBounds } from 'react-map-gl';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { PlugType } from '@/common/types/common.types';
import { FilterItem } from '@/common/types/filter.types';

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

export function useFilteredMarkers(markers: ChargerViewModel[], filters: FilterItem[]) {
  return useMemo(() => {
    return filters.reduce((acc, filter) => {
      return Filters[filter.type](filter, acc);
    }, markers);
  }, [markers, filters]);
}

export function useMarkersInBound(bounds: LngLatBounds | undefined | null, zoom: number, markers: ChargerViewModel[]) {
  return useMemo(() => {
    const markersInZoom = markers.filter((chargers) => {
      return chargers.chargePoints?.some(
        (cp) => (cp.maxPowerKw && cp.maxPowerKw >= 50) || chargers.isFavorite || zoom > 12
      );
    });
    if (!bounds) return markersInZoom;
    const [[west, south], [east, north]] = bounds.toArray();
    return markersInZoom.filter((chargePoint) => {
      const [lat, lng] = chargePoint.coordinates;
      return lat < north && lat > south && lng < east && lng > west;
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
