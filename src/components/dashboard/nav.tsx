'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

import { cn } from '@/lib/utils';

type Link = {
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: 'default' | 'ghost';
  onClick?: () => void;
  href?: string;
};

interface NavProps {
  links: Link[];
}

export function Nav({ links }: NavProps) {
  return (
    <nav className='h-full w-full flex items-center justify-center'>
      <div className='flex flex-col p-5 px-2 justify-center gap-10'>
        {links.map((link, index) => (
          <Fragment key={link.title}>
            <Link
              key={index}
              href={link?.href ?? '#'}
              onClick={link?.onClick}
              className={cn(
                'text-2xl xl:text-4xl text-center text-white hover:font-bold hover:underline underline-offset-4'
              )}
            >
              {link.title}
            </Link>
            <span className='w-6 inline-flex mx-auto border-white border-b-[3px] last-of-type:hidden' />
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
