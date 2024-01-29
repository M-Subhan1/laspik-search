import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { TablesInsert, TablesUpdate } from '@/types/supabase';

type UpsertProfileData = TablesInsert<'profiles'> | TablesUpdate<'profiles'>;

export const useUpsertProfile = () => {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['profile', 'upsert'],
    mutationFn: async (fieldValues: UpsertProfileData) => {
      const { error } = await supabase.rpc('upsert_profile', {
        id_input: fieldValues.id,
        name_input: fieldValues.name,
        group_input: fieldValues.group_id,
      });

      if (error) {
        toast.error(
          error.code === '23505' ? 'Profile already exists' : error.message
        );

        return false;
      }

      toast.success('Profile updated');

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['profiles', 'get'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['profileGroups', 'get'],
        }),
      ]);

      return true;
    },
  });
};
