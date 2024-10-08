import { PlugType } from '@/common/types/common.types';
import { PlugFilterItem } from '@/common/types/filter.types';
import { Button } from '@/components/button';
import { PlugIcon } from '@/components/icons/plug-icon';
import { PlugTypeLabels } from '@/lib/charger.utils';
import { cn, sendEvent } from '@/lib/utils';

interface PlugFilterProps {
  filter: PlugFilterItem | undefined;
  setFilter: (filter: PlugFilterItem) => void;
  removeFilter: (filter: PlugFilterItem) => void;
}

export function PlugFilter({ filter, setFilter, removeFilter }: PlugFilterProps) {
  const handleFilter = (plug: string) => {
    if (filter?.value.includes(plug)) {
      sendEvent('remove_plug_filter', {
        plug,
      });
      if (filter.value.length === 1) {
        removeFilter(filter);
      } else {
        setFilter({ type: 'plug', value: filter.value.filter((v) => v !== plug) });
      }
    } else {
      sendEvent('add_plug_filter', {
        plug,
      });
      setFilter({ type: 'plug', value: [...(filter?.value ?? []), plug] });
    }
  };
  return (
    <div>
      <p>Csatlakozó</p>
      <div className='flex space-x-2 overflow-x-auto p-2 -mx-2'>
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
