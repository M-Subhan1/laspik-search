import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SignInCard from '@/components/auth-cards/sign-in';

export default async function SignInPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className='min-h-screen w-screen flex items-center justify-center'>
      <SignInCard />
    </main>
  );
}
