'use client';

import Link from 'next/link';
import { ComponentProps } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export default function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex justify-center bg-primary px-4 text-primary-foreground">
      {children}
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathName = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        'p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground',
        pathName === props.href && 'bg-background text-foreground'
      )}
    >
      {props.children}
    </Link>
  );
}
