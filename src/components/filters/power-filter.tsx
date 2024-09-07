import { PowerFilterItem } from '@/common/types/filter.types';
import { Button } from '@/components/button';
import { cn, sendEvent } from '@/lib/utils';

interface PowerFilterProps {
  filter: PowerFilterItem | undefined;
  setFilter: (filter: PowerFilterItem) => void;
  removeFilter: (filter: PowerFilterItem) => void;
}

export function PowerFilter({ filter, setFilter, removeFilter }: PowerFilterProps) {
  const handleFilter = (power: number) => {
    if (filter?.value === power) {
      sendEvent('remove_power_filter', {
        power: power.toString(),
      });
      removeFilter(filter);
    } else {
      sendEvent('add_power_filter', {
        power: power.toString(),
      });
      setFilter({ type: 'power', value: power });
    }
  };
  return (
    <div>
      <p>Teljestmény ettől</p>
      <div className='flex space-x-2 overflow-x-auto p-2 -mx-2'>
        {PowerLevels.map((power) => (
          <Button
            key={power.level}
            onClick={() => handleFilter(power.level)}
            className={cn('w-20 h-10 shrink-0 border-2', {
              [power.style]: !filter?.value || filter.value === power.level,
              'opacity-50': filter?.value && filter.value !== power.level,
            })}
          >
            {power.level} kW
          </Button>
        ))}
      </div>
    </div>
  );
}

const PowerLevels: { level: number; style: string }[] = [
  { level: 22, style: 'bg-green-500 text-green-100 border-green-100 hover:bg-green-600 active:bg-green-600' },
  { level: 50, style: 'bg-yellow-500 text-yellow-100 border-yellow-100 hover:bg-yellow-600 active:bg-yellow-600' },
  { level: 100, style: 'bg-blue-500 text-blue-100 border-blue-100 hover:bg-blue-600 active:bg-blue-600' },
];
