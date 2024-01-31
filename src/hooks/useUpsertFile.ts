import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Profile } from '@/types';
import { TablesInsert, TablesUpdate } from '@/types/supabase';

type UpsertFileData = TablesInsert<'files'> | TablesUpdate<'files'>;

export const useUpsertFile = ({ profileId }: { profileId: Profile['id'] }) => {
  const supabase = createClientComponentClient();

  return useMutation({
    mutationKey: ['file', 'upsert'],
    mutationFn: async (fieldValues: Omit<UpsertFileData, 'profileId'>) => {
      const { error } =
        'id' in fieldValues
          ? await supabase
              .from('files')
              .update({
                name: fieldValues.name,
                status: fieldValues.status,
              })
              .eq('id', fieldValues.id)
          : await supabase.from('files').insert({
              name: fieldValues.name,
              profile_id: profileId,
              status: fieldValues.status,
              full_path: fieldValues.full_path,
              object_id: fieldValues.object_id,
            });

      if (error) {
        toast.error(error.message);

        return false;
      }

      return true;
    },
  });
};
