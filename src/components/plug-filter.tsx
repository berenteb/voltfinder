import { Button } from '@/components/button';
import { PlugIcon } from '@/components/icons/plug-icon';
import { PlugTypeLabels } from '@/lib/charger.utils';
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
          <Button
            key={plugType}
            onClick={() => handleFilter(plugType)}
            className={cn('w-28 shrink-0 flex-col', {
              'border-2 border-lime-500': filter?.value.includes(plugType),
            })}
          >
            {PlugTypeLabels[plugType]}
            <PlugIcon height={50} width={50} type={plugType} />
          </Button>
        ))}
      </div>
    </div>
  );
}
