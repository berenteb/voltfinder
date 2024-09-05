'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LngLatBounds, Map, Marker, useMap } from 'react-map-gl';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { FilterItem } from '@/common/types/filter.types';
import { ChargerMarker } from '@/components/charger-marker';
import { ChargerOverlay } from '@/components/charger-overlay';
import { useLocation } from '@/components/location-context';
import { PwaPrompt } from '@/components/pwa-prompt';
import { Toolbar } from '@/components/toolbar';
import { UserMarker } from '@/components/user-marker';
import { MAPBOX_API_KEY } from '@/config/frontend-env.config';
import { useChargers } from '@/hooks/use-chargers';
import { useFilteredMarkers, useMarkersInBound, useProvidersOfMarkers } from '@/lib/charger.utils';
import {
  loadFiltersFromLocalStorage,
  removeFromLocalStorage,
  saveFiltersToLocalStorage,
} from '@/services/storage.service';

export function MapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const { map } = useMap();
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [focusedId, setFocusedId] = useState<string | undefined | null>(searchParams.get('id'));
  const { location } = useLocation();

  const { chargers } = useChargers();

  const [zoom, setZoom] = useState(7);
  const [bounds, setBounds] = useState<LngLatBounds | null>(null);

  const markersInBound = useMarkersInBound(bounds, zoom, chargers ?? []);

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

  const onCenterLocation = () => {
    if (map && location) {
      map.flyTo({
        center: {
          lat: location[0],
          lon: location[1],
        },
        zoom: Math.max(zoom, 12),
      });
    }
  };

  const onCenterCharger = (charger: ChargerViewModel) => {
    if (map) {
      map.flyTo({
        center: {
          lat: charger.coordinates[0],
          lon: charger.coordinates[1],
        },
        zoom: Math.max(zoom, 12),
      });
    }
  };

  useEffect(() => {
    setFilters(loadFiltersFromLocalStorage());
    resetSearch();
  }, []);

  useEffect(() => {
    if (map) {
      const onZoom = () => {
        setZoom(map.getZoom());
      };
      const onMove = () => {
        setBounds(map.getBounds());
      };
      map.on('zoomend', onZoom);
      map.on('moveend', onMove);
      return () => {
        map.off('zoomend', onZoom);
        map.off('moveend', onMove);
      };
    }
  }, [map]);

  return (
    <div className='relative w-full h-full'>
      <Toolbar onLocationClick={onCenterLocation} filters={filters} setFilters={onSetFilters} providers={providers} />
      {focusedChargePoint && <ChargerOverlay onCenterClick={onCenterCharger} data={focusedChargePoint} />}
      <Map
        id='map'
        mapboxAccessToken={MAPBOX_API_KEY}
        onClick={() => setFocusedId(undefined)}
        mapStyle='mapbox://styles/mapbox/light-v11'
        initialViewState={{
          latitude: 47.498333,
          longitude: 19.040833,
          zoom: 7,
        }}
      >
        {markers?.map((chargePoint) => (
          <Marker
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setFocusedId(chargePoint.id);
              onCenterCharger(chargePoint);
            }}
            key={chargePoint.id}
            anchor='bottom'
            className='cursor-pointer'
            latitude={chargePoint.coordinates[0]}
            longitude={chargePoint.coordinates[1]}
          >
            <ChargerMarker data={chargePoint} focused={focusedId === chargePoint.id} />
          </Marker>
        ))}
        {location && (
          <Marker anchor='center' latitude={location[0]} longitude={location[1]}>
            <UserMarker />
          </Marker>
        )}
      </Map>
      <PwaPrompt />
    </div>
  );
}
