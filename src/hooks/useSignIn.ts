import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation } from '@tanstack/react-query';

import { SignInFormValues } from '@/schema/auth';

export const useSignIn = () => {
  const supabase = createClientComponentClient();

  return useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: async (fieldValues: SignInFormValues) => {
      return await supabase.auth.signInWithPassword(fieldValues);
    },
  });
};
