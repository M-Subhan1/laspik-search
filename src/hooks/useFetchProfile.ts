import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Profile } from '@/types';

type Params = {
  id: Profile['id'];
};

export const useFetchProfile = ({ id }: Params) => {
  const supabase = createClientComponentClient();

  return useQuery({
    queryKey: ['profiles', 'get', { id }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error(error.message);
      }

      return data as Profile;
    },
  });
};
