import { PropsWithChildren } from 'react';

interface TooltipProps extends PropsWithChildren {
  text: string;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className='relative group'>
      {children}
      <div className='hidden group-hover:block absolute bottom-full max-w-96 z-10 -translate-x-7 -translate-y-0.5 mx-auto p-2 bg-slate-900 text-white text-xs rounded-md'>
        {text}
      </div>
    </div>
  );
}
