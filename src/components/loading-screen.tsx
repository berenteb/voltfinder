import { TbMapPinBolt } from 'react-icons/tb';

export function LoadingScreen() {
  return (
    <div className='flex items-center justify-center gap-5 bg-blue-500 text-white h-full flex-col'>
      <TbMapPinBolt size={100} />
      <h1 className='text-5xl'>Voltfinder</h1>
      <p className='text-white/50'>by Bálint Berente</p>
    </div>
  );
}
