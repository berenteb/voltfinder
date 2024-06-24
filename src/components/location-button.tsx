import { TbLocation } from 'react-icons/tb';

import { Button } from '@/components/button';
import { useLocation } from '@/components/location-context';

export function LocationButton() {
  const { setIsFollowed } = useLocation();

  const handleLocationClick = () => {
    setIsFollowed(true);
  };

  return (
    <Button onClick={handleLocationClick}>
      <TbLocation size={30} />
    </Button>
  );
}
