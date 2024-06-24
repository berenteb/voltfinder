import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

type LocationContextType =
  | {
      location: [number, number] | undefined;
      setLocation: (location: [number, number]) => void;
      isFollowed: boolean;
      setIsFollowed: (isFollowed: boolean) => void;
    }
  | undefined;

const LocationContext = createContext<LocationContextType>(undefined);

export function LocationProvider({ children }: PropsWithChildren) {
  const [location, setLocation] = useState<[number, number]>();
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const handler = navigator.geolocation.watchPosition((position) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
    });
    return () => {
      navigator.geolocation.clearWatch(handler);
    };
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation, isFollowed, setIsFollowed }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
