import { useState } from 'react';
import { TbAdjustmentsBolt, TbLocation, TbTrashX, TbZoomIn, TbZoomOut } from 'react-icons/tb';

import {
  FavoriteFilterItem,
  FilterItem,
  PlugFilterItem,
  PowerFilterItem,
  ProviderFilterItem,
} from '@/common/types/filter.types';
import { Button } from '@/components/button';
import { CompassButton } from '@/components/compass-button';
import { FavoriteFilter } from '@/components/filters/favorite-filter';
import { PlugFilter } from '@/components/filters/plug-filter';
import { PowerFilter } from '@/components/filters/power-filter';
import { ProviderFilter } from '@/components/filters/provider-filter';
import { LoadingIndicator } from '@/components/loading-indicator';
import { cn, sendEvent } from '@/lib/utils';

interface ToolbarProps {
  filters: FilterItem[];
  setFilters: (filters: FilterItem[]) => void;
  providers: string[];
  onLocationClick?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function Toolbar({ filters, setFilters, providers, onLocationClick, onZoomIn, onZoomOut }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filter: FilterItem) => {
    if (filters.find((f) => f.type === filter.type)) {
      setFilters([...filters.filter((f) => f.type !== filter.type), filter]);
    } else {
      setFilters([...filters, filter]);
    }
  };

  const handleRemoveFilter = (filter: FilterItem) => {
    setFilters(filters.filter((f) => f.type !== filter.type));
  };

  const handleAllFiltersRemove = () => {
    sendEvent('remove_all_filters');
    setFilters([]);
  };

  const handleToolbarToggle = () => {
    sendEvent('toggle_toolbar');
    setIsOpen((o) => !o);
  };

  const handleLocationClick = () => {
    sendEvent('location_click');
    onLocationClick?.();
  };

  const filterCount = filters.length;

  return (
    <>
      <div className='absolute p-5 max-w-full w-[600px] top-0 right-0 z-20 flex flex-col justify-end'>
        <div
          className={cn('bg-slate-100 max-w-full w-fit rounded-xl p-2 space-y-5 shadow-md', {
            hidden: !isOpen,
          })}
        >
          <PowerFilter
            filter={filters.find((f) => f.type === 'power') as PowerFilterItem | undefined}
            setFilter={handleFilterChange}
            removeFilter={handleRemoveFilter}
          />
          <ProviderFilter
            providers={providers}
            filter={filters.find((f) => f.type === 'provider') as ProviderFilterItem | undefined}
            setFilter={handleFilterChange}
            removeFilter={handleRemoveFilter}
          />
          <PlugFilter
            filter={filters.find((f) => f.type === 'plug') as PlugFilterItem | undefined}
            setFilter={handleFilterChange}
            removeFilter={handleRemoveFilter}
          />
          <Button onClick={handleAllFiltersRemove} className='px-4'>
            <TbTrashX /> Összes szűrő törlése
          </Button>
        </div>
        <Button onClick={handleToolbarToggle} className='absolute top-5 right-5'>
          {!isOpen && <b>Szűrés</b>}
          <TbAdjustmentsBolt size={30} />
          {filterCount > 0 && <FilterCountBadge count={filterCount} />}
        </Button>
      </div>
      <LoadingIndicator />
      <div className='absolute top-5 left-5 z-10 space-y-10'>
        <div className='space-y-2'>
          <FavoriteFilter
            filter={filters.find((f) => f.type === 'favorite') as FavoriteFilterItem | undefined}
            setFilter={handleFilterChange}
            removeFilter={handleRemoveFilter}
          />
          {onLocationClick && (
            <Button onClick={handleLocationClick}>
              <TbLocation size={30} />
            </Button>
          )}
        </div>
        <div className='space-y-2'>
          <Button onClick={onZoomIn}>
            <TbZoomIn size={30} />
          </Button>
          <Button onClick={onZoomOut}>
            <TbZoomOut size={30} />
          </Button>
          <CompassButton />
        </div>
      </div>
    </>
  );
}

function FilterCountBadge({ count }: { count: number }) {
  return (
    <div className='absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center'>
      <b>{count}</b>
    </div>
  );
}
