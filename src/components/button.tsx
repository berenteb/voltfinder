import { forwardRef, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const Button = forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'bg-white text-slate-800 rounded-md shadow-md p-2 hover:bg-slate-50 active:bg-slate-100 cursor-pointer flex space-x-2 items-center justify-center active:scale-95 transition-transform border-2 border-slate-50',
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };
