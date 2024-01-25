import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Profile } from '@/types';
import { TablesInsert, TablesUpdate } from '@/types/supabase';

type UpsertFileData = TablesInsert<'files'> | TablesUpdate<'files'>;

export const useUpsertFiles = ({ profileId }: { profileId: Profile['id'] }) => {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['file', 'upsert'],
    mutationFn: async (fieldValues: UpsertFileData) => {
      const { error } = await supabase
        .from('files')
        .upsert(fieldValues)
        .eq('id', fieldValues.id)
        .select('*');

      if (error) {
        toast.error(error.message);

        return false;
      }

      toast.success(fieldValues.id ? 'File created' : 'File details updated');
      await queryClient.invalidateQueries({
        queryKey: ['files', 'get', { profileId }],
      });

      return true;
    },
  });
};
