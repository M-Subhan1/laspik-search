'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { File, HelpCircle, HomeIcon, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/utils';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { Nav } from './nav';

interface DashboardLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function DashboardLayout({
  defaultLayout = [265, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: React.PropsWithChildren<DashboardLayoutProps>) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ResizablePanelGroup
      direction='horizontal'
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className='h-full min-h-screen items-stretch'
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={15}
        maxSize={20}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        className={cn(
          isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out'
        )}
      >
        <Nav
          isCollapsed={isCollapsed}
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
              variant:
                pathname === '/dashboard/profiles/create' ? 'default' : 'ghost',
              href: '/dashboard/profiles/create',
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
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
