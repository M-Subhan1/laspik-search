import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { DashboardLayout } from '@/components/dashboard/layout';

export default async function DashboardHome({ children }: PropsWithChildren) {
  const cookieStore = cookies();
  const layout = cookies().get('react-resizable-panels:layout');
  const collapsed = cookies().get('react-resizable-panels:collapsed');

  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  if (!session) {
    redirect('/auth/sign-in');
  }

  return (
    <DashboardLayout
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
      defaultLayout={defaultLayout}
    >
      {children}
    </DashboardLayout>
  );
}
