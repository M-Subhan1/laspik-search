import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ProfileGroup } from '@/types';

export const useFetchGroups = () => {
  const supabase = createClientComponentClient();

  return useQuery({
    queryKey: ['profileGroups', 'get'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .returns<ProfileGroup[]>();

      if (error) {
        toast.error(error.message);
      }

      return data;
    },
  });
};
