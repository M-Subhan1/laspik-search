'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

import { cn } from '@/lib/utils';

import NextImage from '@/components/NextImage';

import Logo from '~/logo.png';

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
    <nav className='h-full w-full flex flex-col items-center'>
      <div className='rounded-lg self-center w-full my-6 px-4 flex items-center justify-center'>
        <NextImage width={200} height={100} src={Logo} alt='Logo' />
      </div>
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
