import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl';

import { Button } from '@/components/button';
import { cn } from '@/lib/utils';

export function CompassButton() {
  const { map } = useMap();

  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(0);

  const onResetRotation = () => {
    if (map) {
      map.setBearing(0);
      map.setPitch(0);
    }
  };

  useEffect(() => {
    if (map) {
      const onRotate = () => {
        setBearing(map.getBearing());
      };
      const onTilt = () => {
        setPitch(map.getPitch());
      };
      map.on('rotateend', onRotate);
      map.on('pitchend', onTilt);
      return () => {
        map.off('rotateend', onRotate);
        map.off('pitchend', onTilt);
      };
    }
  }, [map]);

  return (
    <Button onClick={onResetRotation}>
      <div
        className='transition-transform'
        style={{
          transform: `rotateX(${pitch}deg)`,
        }}
      >
        <div
          className={cn(
            'transition-transform border-2 border-black rounded-full w-8 h-8 text-xs text-center text-red-500 leading-3 font-bold flex items-center justify-center'
          )}
          style={{
            transform: `rotate(${-1 * bearing}deg)`,
          }}
        >
          ↑<br />N
        </div>
      </div>
    </Button>
  );
}
