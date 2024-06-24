import { TbCar } from 'react-icons/tb';

export function UserMarker() {
  return (
    <div className='translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center text-blue-500 text-sm font-bold bg-blue-200 border-2 border-white shadow-md'>
      <TbCar size={20} />
    </div>
  );
}
