import { TbHeart, TbHeartFilled } from 'react-icons/tb';

import { Button } from '@/components/button';
import { FavoriteFilterItem } from '@/types/filter.types';

interface FavoriteFilterProps {
  filter: FavoriteFilterItem | undefined;
  setFilter: (filter: FavoriteFilterItem) => void;
  removeFilter: (filter: FavoriteFilterItem) => void;
}

export function FavoriteFilter({ filter, setFilter, removeFilter }: FavoriteFilterProps) {
  const handleFilter = () => {
    if (filter) removeFilter(filter);
    else setFilter({ type: 'favorite', value: undefined });
  };
  return (
    <Button onClick={() => handleFilter()} className='absolute top-5 left-5 z-10'>
      {filter ? <TbHeartFilled size={30} className='text-red-500' /> : <TbHeart size={30} />}
    </Button>
  );
}
