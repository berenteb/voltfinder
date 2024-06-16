import { useState } from 'react';
import { TbAdjustmentsBolt } from 'react-icons/tb';

import { PlugFilter } from '@/components/plug-filter';
import { PowerFilter } from '@/components/power-filter';
import { ProviderFilter } from '@/components/provider-filter';
import { cn } from '@/lib/utils';
import { FilterItem, PlugFilterItem, PowerFilterItem, ProviderFilterItem } from '@/types/filter.types';

interface ToolbarProps {
  filters: FilterItem[];
  setFilters: (filters: FilterItem[]) => void;
  providers: string[];
}

export function Toolbar({ filters, setFilters, providers }: ToolbarProps) {
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
  return (
    <div className='absolute p-5 max-w-full top-0 right-0 left-0 z-10 flex justify-end'>
      <div
        className={cn('bg-slate-100 max-w-full w-fit rounded-lg p-2 space-y-5 origin-top-right transition', {
          'scale-0 opacity-0': !isOpen,
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
      </div>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className='bg-white shadow-md absolute top-5 right-5 rounded-lg p-2 flex items-center space-x-2'
      >
        {!isOpen && <b>Szűrés</b>}
        <TbAdjustmentsBolt size={30} />
      </button>
    </div>
  );
}
