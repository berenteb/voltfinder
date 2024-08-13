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
    if (filter) removeFilter(filter);
    else setFilter({ type: 'favorite', value: undefined });
  };
  return (
    <Button onClick={() => handleFilter()}>
      {filter ? <TbHeartFilled size={30} className='text-red-500' /> : <TbHeart size={30} />}
    </Button>
  );
}
