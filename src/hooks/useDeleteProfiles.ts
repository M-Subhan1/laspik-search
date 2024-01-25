import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Tables } from '@/types/supabase';

type ProfileId = Tables<'profiles'>['id'];

export const useDeleteProfiles = () => {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['profile', 'delete'],
    mutationFn: async (fieldValues: ProfileId | ProfileId[]) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .in('id', Array.isArray(fieldValues) ? fieldValues : [fieldValues]);

      if (error) {
        toast.error(error.message);
      }

      toast.success('Profile(s) deleted');
      await queryClient.invalidateQueries({
        queryKey: ['profiles', 'get'],
      });
    },
  });
};
