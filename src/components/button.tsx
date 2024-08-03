import { ButtonHTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'bg-white text-slate-800 rounded-md shadow-md p-2 hover:bg-slate-50 active:bg-slate-100 cursor-pointer flex gap-2 items-center justify-center active:scale-95 transition-transform border-2 border-slate-50',
          {
            'text-slate-400 bg-slate-50 active:scale-100 active:bg-slate-50 cursor-wait': props.disabled,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
