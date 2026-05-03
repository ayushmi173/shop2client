import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow-sm',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow-sm',
        outline: 
          'text-foreground border-border',
        success:
          'border-transparent bg-green-100 text-green-800',
        warning:
          'border-transparent bg-yellow-100 text-yellow-800',
        info:
          'border-transparent bg-blue-100 text-blue-800',
        purple:
          'border-transparent bg-purple-100 text-purple-800',
        gradient:
          'border-transparent bg-gradient-to-r from-indigo-400 to-purple-400 text-white',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

function Badge({ className, variant, size, dot, dotColor = 'bg-current', ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dotColor)} />
      )}
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants };
