import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20': variant === 'default',
            'border border-white/20 hover:bg-white/10': variant === 'outline',
            'hover:bg-white/10 hover:text-white': variant === 'ghost',
            'glass-panel hover:bg-white/10': variant === 'glass',
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-lg px-3': size === 'sm',
            'h-12 rounded-xl px-8 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
