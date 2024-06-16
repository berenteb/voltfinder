import { cn } from '@/lib/utils';
import { ProviderFilterItem } from '@/types/filter.types';

interface ProviderFilterProps {
  providers: string[];
  filter: ProviderFilterItem | undefined;
  setFilter: (filter: ProviderFilterItem) => void;
  removeFilter: (filter: ProviderFilterItem) => void;
}

export function ProviderFilter({ filter, setFilter, removeFilter, providers }: ProviderFilterProps) {
  const handleFilter = (provider: string) => {
    if (filter?.value.includes(provider)) {
      if (filter.value.length === 1) {
        removeFilter(filter);
      } else {
        setFilter({ type: 'provider', value: filter.value.filter((v) => v !== provider) });
      }
    } else {
      setFilter({ type: 'provider', value: [...(filter?.value ?? []), provider] });
    }
  };
  return (
    <div>
      <p>Szolgáltató</p>
      <div className='flex space-x-2 max-w-full overflow-x-auto p-2'>
        {providers.map((provider) => (
          <button
            key={provider}
            onClick={() => handleFilter(provider)}
            className={cn('w-20 h-10 shrink-0 shadow-md rounded-md bg-white hover:bg-slate-50 active:bg-slate-100', {
              'border-2 border-lime-500': filter?.value.includes(provider),
            })}
          >
            {provider}
          </button>
        ))}
      </div>
    </div>
  );
}
