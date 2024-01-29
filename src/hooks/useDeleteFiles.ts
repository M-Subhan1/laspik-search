import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Tables } from '@/types/supabase';

type FileId = Tables<'files'>['object_id'];

export const useDeleteFiles = () => {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['files', 'delete'],
    mutationFn: async (fieldValues: FileId | FileId[]) => {
      const { error } = await supabase
        .from('files')
        .delete()
        .in(
          'object_id',
          Array.isArray(fieldValues) ? fieldValues : [fieldValues]
        );

      if (error) {
        toast.error(error.message);
      }

      toast.success('Files(s) deleted');
      await queryClient.invalidateQueries({
        queryKey: ['files', 'get'],
      });
    },
  });
};
