'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { UploadFilesData } from '@/schema/file';

type onSubmitted = {
  id: string;
  name: string;
  status: UploadFilesData['status'];
  path: string;
};

type Props = {
  onSubmitted: (data: onSubmitted) => void;
};

type Data = {
  status: UploadFilesData['status'];
  profileId: number;
  files: File[];
};

export const useUploadFiles = ({ onSubmitted }: Props) => {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['uploadFiles'],
    mutationFn: async ({ status, files, profileId }: Data) => {
      await Promise.all(
        files.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('files')
            .upload(`${profileId}/${file.name}`, file);

          if (error) {
            toast.error(error.message);
            return;
          }

          if (data) {
            await onSubmitted({
              id: (
                data as unknown as {
                  id: string;
                }
              ).id,
              name: file.name,
              path: data.path,
              status,
            });
          }
        })
      );

      await queryClient.invalidateQueries({
        queryKey: ['files', 'get', { profileId }],
      });
    },
  });
};
