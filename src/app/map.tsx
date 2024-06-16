'use client';
import { Bounds, Map, Marker, Overlay, Point } from 'pigeon-maps';
import { useMemo, useState } from 'react';

import { ChargerMarker } from '@/components/charger-marker';
import { ChargerOverlay } from '@/components/charger-overlay';
import { Toolbar } from '@/components/toolbar';
import { useChargePoints } from '@/hooks/use-charge-points';
import { useFilteredMarkers, useMarkersInBound, useProvidersOfMarkers } from '@/lib/charger.utils';
import { FilterItem } from '@/types/filter.types';

export function MapComponent() {
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [focusedId, setFocusedId] = useState<string>();

  const [bounds, setBounds] = useState<Bounds>();
  const [zoom, setZoom] = useState<number>(11);
  const chargePoints = useChargePoints();

  const markersInBound = useMarkersInBound(bounds, zoom, chargePoints.data ?? []);

  const center = useMemo<Point | undefined>(() => {
    if (focusedId) {
      const focused = chargePoints.data?.find((c) => c.id === focusedId);
      if (focused) {
        return [Number(focused.latitude), Number(focused.longitude)];
      }
    }
    return undefined;
  }, [focusedId, chargePoints.data]);

  const focusedChargePoint = chargePoints.data?.find((c) => c.id === focusedId);

  const markers = useFilteredMarkers(markersInBound ?? [], filters);

  const providers = useProvidersOfMarkers(chargePoints.data ?? []);

  return (
    <div className='relative w-full h-full'>
      <Toolbar filters={filters} setFilters={setFilters} providers={providers} />
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
        provider={osmHotProvider}
      >
        {markers?.map((chargePoint) => (
          <Marker
            key={chargePoint.id}
            width={24}
            height={24}
            anchor={[Number(chargePoint.latitude), Number(chargePoint.longitude)]}
          >
            <ChargerMarker data={chargePoint} onClick={() => setFocusedId(chargePoint.id)} />
          </Marker>
        ))}
        {focusedChargePoint && (
          <Overlay
            anchor={[Number(focusedChargePoint.latitude), Number(focusedChargePoint.longitude)]}
            offset={[120, -30]}
          >
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
