import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { File, Pagination, Profile } from '@/types';

type Params = Pagination & {
  query?: string;
  profileId: Profile['id'];
};

export const useFetchFiles = ({ query, profileId, page, pageSize }: Params) => {
  const supabase = createClientComponentClient();

  return useQuery({
    queryKey: ['files', 'get', { profileId, query, page, pageSize }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .ilike('name', `%${query?.toLowerCase()}%`)
        .range(page * pageSize, page * pageSize + pageSize - 1);

      if (error) {
        toast.error(error.message);
      }

      return data as File[];
    },
  });
};
