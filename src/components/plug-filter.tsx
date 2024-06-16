import { PlugIcon } from '@/components/icons/plug-icon';
import { cn } from '@/lib/utils';
import { PlugFilterItem } from '@/types/filter.types';
import { PlugType } from '@/types/mobiliti.types';

interface PlugFilterProps {
  filter: PlugFilterItem | undefined;
  setFilter: (filter: PlugFilterItem) => void;
  removeFilter: (filter: PlugFilterItem) => void;
}

export function PlugFilter({ filter, setFilter, removeFilter }: PlugFilterProps) {
  const handleFilter = (provider: string) => {
    if (filter?.value.includes(provider)) {
      if (filter.value.length === 1) {
        removeFilter(filter);
      } else {
        setFilter({ type: 'plug', value: filter.value.filter((v) => v !== provider) });
      }
    } else {
      setFilter({ type: 'plug', value: [...(filter?.value ?? []), provider] });
    }
  };
  return (
    <div>
      <p>Csatlakozó</p>
      <div className='flex space-x-2 max-w-full overflow-x-auto p-2'>
        {Object.values(PlugType).map((plugType) => (
          <button
            key={plugType}
            onClick={() => handleFilter(plugType)}
            className={cn(
              'w-28 shrink-0 shadow-md rounded-md bg-white hover:bg-slate-50 active:bg-slate-100 items-center flex flex-col p-2',
              {
                'border-2 border-lime-500': filter?.value.includes(plugType),
              }
            )}
          >
            {plugType}
            <PlugIcon height={50} width={50} type={plugType} />
          </button>
        ))}
      </div>
    </div>
  );
}
