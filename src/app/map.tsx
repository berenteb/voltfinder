'use client';
import { Bounds, Map, Marker, Overlay, Point } from 'pigeon-maps';
import { useEffect, useMemo, useState } from 'react';

import { ChargerMarker } from '@/components/charger-marker';
import { ChargerOverlay } from '@/components/charger-overlay';
import { useLocation } from '@/components/location-context';
import { Toolbar } from '@/components/toolbar';
import { UserMarker } from '@/components/user-marker';
import { useChargers } from '@/hooks/use-chargers';
import { useFilteredMarkers, useMarkersInBound, useProvidersOfMarkers } from '@/lib/charger.utils';
import {
  loadFiltersFromLocalStorage,
  removeFromLocalStorage,
  saveFiltersToLocalStorage,
} from '@/services/storage.service';
import { FilterItem } from '@/types/filter.types';

export function MapComponent() {
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [focusedId, setFocusedId] = useState<string>();
  const { location, isFollowed, setIsFollowed } = useLocation();

  const [bounds, setBounds] = useState<Bounds>();
  const [zoom, setZoom] = useState<number>(11);
  const { chargers } = useChargers();

  const markersInBound = useMarkersInBound(bounds, zoom, chargers ?? []);

  const center = useMemo<Point | undefined>(() => {
    if (isFollowed && location) {
      return location;
    }
    if (focusedId) {
      const focused = chargers.find((c) => c.id === focusedId);
      if (focused) {
        return focused.coordinates;
      }
    }
    return undefined;
  }, [focusedId, chargers, location, isFollowed]);

  const focusedChargePoint = chargers.find((c) => c.id === focusedId);

  const markers = useFilteredMarkers(markersInBound ?? [], filters);

  const providers = useProvidersOfMarkers(chargers);

  const onSetFilters = (newFilters: FilterItem[]) => {
    setFilters(newFilters);
    if (filters.length) {
      saveFiltersToLocalStorage(filters);
    } else {
      removeFromLocalStorage();
    }
  };

  useEffect(() => {
    setFilters(loadFiltersFromLocalStorage());
  }, []);

  return (
    <div className='relative w-full h-full'>
      <Toolbar filters={filters} setFilters={onSetFilters} providers={providers} />
      <Map
        onClick={() => setFocusedId(undefined)}
        onBoundsChanged={(changed) => {
          setBounds(changed.bounds);
          setZoom(changed.zoom);
          setIsFollowed(false);
        }}
        defaultCenter={[47.498333, 19.040833]}
        defaultZoom={11}
        zoomSnap={false}
        center={center}
        provider={osmHotProvider}
      >
        {markers?.map((chargePoint) => (
          <Marker key={chargePoint.id} width={24} height={24} anchor={chargePoint.coordinates}>
            <ChargerMarker data={chargePoint} onClick={() => setFocusedId(chargePoint.id)} />
          </Marker>
        ))}
        {location && (
          <Marker anchor={location}>
            <UserMarker />
          </Marker>
        )}
        {focusedChargePoint && (
          <Overlay anchor={focusedChargePoint.coordinates} offset={[120, -30]}>
            <ChargerOverlay data={focusedChargePoint} />
          </Overlay>
        )}
      </Map>
    </div>
  );
}

export const osmHotProvider = (x: number, y: number, z: number): string => {
  return `https://tile.openstreetmap.fr/hot/${z}/${x}/${y}.png
`;
};
