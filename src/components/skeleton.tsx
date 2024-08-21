import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse bg-slate-300 rounded-md h-10', className)} {...props} />;
}
