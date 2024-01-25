import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Pagination, Profile } from '@/types';

type Params = Pagination & {
  query?: string;
};

export const useFetchProfiles = ({ query, page, pageSize }: Params) => {
  const supabase = createClientComponentClient();

  return useQuery({
    queryKey: ['profiles', 'get', { query, page, pageSize }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('name', `%${query?.toLowerCase()}%`)
        .range(page * pageSize, page * pageSize + pageSize - 1);

      if (error) {
        toast.error(error.message);
      }

      return data as Profile[];
    },
  });
};
