'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { File, HelpCircle, HomeIcon, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Nav } from './nav';

export function DashboardLayout({ children }: React.PropsWithChildren) {
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className='h-full min-h-screen flex'>
      <div
        className='w-[300px]'
        style={{
          backgroundImage: "url('/images/dashboard-bg.jpeg')",
          backgroundPosition: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      >
        <Nav
          links={[
            {
              title: 'Home',
              icon: HomeIcon,
              variant: pathname === '/dashboard' ? 'default' : 'ghost',
              href: '/dashboard',
            },
            {
              title: 'Create',
              icon: File,
              variant: 'ghost',
              href: '/dashboard?create=true',
            },
            {
              title: 'Help',
              icon: HelpCircle,
              variant: pathname === '/dashboard/help' ? 'default' : 'ghost',
              href: '/dashboard/help',
            },
            {
              title: 'Logout',
              icon: LogOut,
              variant: 'ghost',
              onClick: async () => {
                await supabase.auth.signOut();
                router.push('/auth/sign-in');
              },
            },
          ]}
        />
      </div>
      <ScrollArea className='h-screen w-full'>{children}</ScrollArea>
    </div>
  );
}
