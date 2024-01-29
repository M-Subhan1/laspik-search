'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation } from '@tanstack/react-query';
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
  files: File[];
};

export const useUploadFiles = ({ onSubmitted }: Props) => {
  const supabase = createClientComponentClient();

  return useMutation({
    mutationKey: ['uploadFiles'],
    mutationFn: async ({ status, files }: Data) => {
      await Promise.all(
        files.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('files')
            .upload(file.name, file);

          if (error) {
            toast.error(error.message);
            return;
          }

          if (data) {
            onSubmitted({
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
    },
  });
};
