import Link from 'next/link';
import { TbBoltOff } from 'react-icons/tb';

export default function NotFound() {
  return (
    <main className='flex items-center justify-center gap-5 bg-slate-900 text-white h-full flex-col'>
      <TbBoltOff size={100} />
      <h1 className='text-5xl'>Ez az oldal nem található</h1>
      <Link
        className='bg-white text-slate-800 rounded-md shadow-md p-2 hover:bg-slate-50 active:bg-slate-100 cursor-pointer flex gap-2 items-center justify-center active:scale-95 transition-transform border-2 border-slate-50'
        href='/'
      >
        Vissza a főoldalra
      </Link>
    </main>
  );
}
