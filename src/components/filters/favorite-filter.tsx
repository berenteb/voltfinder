import { sendGAEvent } from '@next/third-parties/google';
import { TbHeart, TbHeartFilled } from 'react-icons/tb';

import { FavoriteFilterItem } from '@/common/types/filter.types';
import { Button } from '@/components/button';

interface FavoriteFilterProps {
  filter: FavoriteFilterItem | undefined;
  setFilter: (filter: FavoriteFilterItem) => void;
  removeFilter: (filter: FavoriteFilterItem) => void;
}

export function FavoriteFilter({ filter, setFilter, removeFilter }: FavoriteFilterProps) {
  const handleFilter = () => {
    if (filter) {
      sendGAEvent('event', 'remove_favorite_filter');
      removeFilter(filter);
    } else {
      sendGAEvent('event', 'add_favorite_filter');
      setFilter({ type: 'favorite', value: undefined });
    }
  };
  return (
    <Button onClick={() => handleFilter()}>
      {filter ? <TbHeartFilled size={30} className='text-red-500' /> : <TbHeart size={30} />}
    </Button>
  );
}
