import { Link as RouterLink, type LinkProps } from 'react-router';

import { cn } from '@/lib/utils';

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn('text-foreground hover:text-foreground/90', className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
