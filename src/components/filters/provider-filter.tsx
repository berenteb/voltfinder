import { sendGAEvent } from '@next/third-parties/google';
import { TbCircle, TbCircleFilled } from 'react-icons/tb';

import { ProviderFilterItem } from '@/common/types/filter.types';
import { Button } from '@/components/button';
import { cn } from '@/lib/utils';

interface ProviderFilterProps {
  providers: string[];
  filter: ProviderFilterItem | undefined;
  setFilter: (filter: ProviderFilterItem) => void;
  removeFilter: (filter: ProviderFilterItem) => void;
}

export function ProviderFilter({ filter, setFilter, removeFilter, providers }: ProviderFilterProps) {
  const handleFilter = (provider: string) => {
    if (filter?.value.includes(provider)) {
      sendGAEvent('event', 'remove_provider_filter', provider);
      if (filter.value.length === 1) {
        removeFilter(filter);
      } else {
        setFilter({ type: 'provider', value: filter.value.filter((v) => v !== provider) });
      }
    } else {
      sendGAEvent('event', 'add_provider_filter', provider);
      setFilter({ type: 'provider', value: [...(filter?.value ?? []), provider] });
    }
  };

  const onAllClick = () => {
    setFilter({ type: 'provider', value: providers });
  };

  const onNoneClick = () => {
    removeFilter({ type: 'provider', value: [] });
  };

  return (
    <div>
      <div className='flex gap-4 items-center flex-wrap'>
        <p>Szolgáltató</p>
        <div className='border-l-2 border-l-slate-300 w-0 h-4 rounded-full' />
        <div className='flex items-center gap-2'>
          <Button onClick={onAllClick} className='bg-transparent border-slate-300 shadow-none py-0'>
            <TbCircleFilled />
            Mind be
          </Button>
          <Button onClick={onNoneClick} className='bg-transparent border-slate-300 shadow-none py-0'>
            <TbCircle />
            Mind ki
          </Button>
        </div>
      </div>
      <div className='flex space-x-2 overflow-x-auto p-2 -mx-2'>
        {providers.map((provider) => (
          <Button
            key={provider}
            onClick={() => handleFilter(provider)}
            className={cn('min-w-20 h-10 shrink-0', {
              'border-2 border-lime-500': filter?.value.includes(provider),
            })}
          >
            {provider}
          </Button>
        ))}
      </div>
    </div>
  );
}
