'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Bounds, Map, Marker, Point } from 'pigeon-maps';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { FilterItem } from '@/common/types/filter.types';
import { ChargerMarker } from '@/components/charger-marker';
import { ChargerOverlay } from '@/components/charger-overlay';
import { useLocation } from '@/components/location-context';
import { PwaPrompt } from '@/components/pwa-prompt';
import { Toolbar } from '@/components/toolbar';
import { UserMarker } from '@/components/user-marker';
import { BACKEND_URL } from '@/config/frontend-env.config';
import { useChargers } from '@/hooks/use-chargers';
import { useFilteredMarkers, useMarkersInBound, useProvidersOfMarkers } from '@/lib/charger.utils';
import {
  loadFiltersFromLocalStorage,
  removeFromLocalStorage,
  saveFiltersToLocalStorage,
} from '@/services/storage.service';

export function MapComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const ref = useRef<Map>(null);
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [focusedId, setFocusedId] = useState<string | undefined | null>(searchParams.get('id'));
  const { location } = useLocation();

  const [bounds, setBounds] = useState<Bounds>();
  const [zoom, setZoom] = useState<number>(11);
  const { chargers } = useChargers();

  const markersInBound = useMarkersInBound(bounds, zoom, chargers ?? []);

  const center = useMemo<Point | undefined>(() => {
    if (focusedId) {
      const focused = chargers.find((c) => c.id === focusedId);
      if (focused) {
        return focused.coordinates;
      }
    }
    return undefined;
  }, [focusedId, chargers]);

  const focusedChargePoint = chargers.find((c) => c.id === focusedId);

  const markers = useFilteredMarkers(markersInBound ?? [], filters);

  const providers = useProvidersOfMarkers(chargers);

  const onSetFilters = (newFilters: FilterItem[]) => {
    setFilters(newFilters);
    if (newFilters.length) {
      saveFiltersToLocalStorage(newFilters);
    } else {
      removeFromLocalStorage();
    }
  };

  const resetSearch = () => {
    router.replace(pathName);
  };

  useEffect(() => {
    setFilters(loadFiltersFromLocalStorage());
  }, []);

  useLayoutEffect(() => {
    resetSearch();
  }, []);

  const onCenterCharger = () => {
    if (ref.current && focusedChargePoint?.coordinates) {
      ref.current.setCenterZoomTarget(focusedChargePoint.coordinates, zoom < 15 ? 15 : zoom);
    }
  };

  const onCenterUser = location
    ? () => {
        if (ref.current && location) {
          ref.current.setCenterZoomTarget(location, zoom);
        }
      }
    : undefined;

  return (
    <div className='relative w-full h-full'>
      <Toolbar onLocationClick={onCenterUser} filters={filters} setFilters={onSetFilters} providers={providers} />
      {focusedChargePoint && <ChargerOverlay onCenterClick={onCenterCharger} data={focusedChargePoint} />}
      <Map
        onClick={() => setFocusedId(undefined)}
        onBoundsChanged={(changed) => {
          setBounds(changed.bounds);
          setZoom(changed.zoom);
        }}
        defaultCenter={[47.498333, 19.040833]}
        defaultZoom={11}
        zoomSnap={false}
        center={center}
        provider={provider}
        ref={ref}
      >
        {markers?.map((chargePoint) => (
          <Marker key={chargePoint.id} width={24} height={24} anchor={chargePoint.coordinates}>
            <ChargerMarker
              data={chargePoint}
              onClick={() => setFocusedId(chargePoint.id)}
              focused={focusedId === chargePoint.id}
            />
          </Marker>
        ))}
        {location && (
          <Marker anchor={location}>
            <UserMarker />
          </Marker>
        )}
      </Map>
      <PwaPrompt />
    </div>
  );
}

export const provider = (x: number, y: number, z: number): string => {
  return `${BACKEND_URL}/map/${x}/${y}/${z}`;
};
