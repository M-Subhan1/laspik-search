import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useMutation } from '@tanstack/react-query';
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { toast } from 'sonner';

import { File } from '@/types';

export const useDownloadAll = () => {
  const supabase = createClientComponentClient();

  return useMutation({
    mutationKey: ['files', 'download'],
    mutationFn: async ({
      profileId,
      fileName,
    }: {
      profileId: number;
      fileName?: string;
    }) => {
      const { error, data } = await supabase
        .from('files')
        .select('*')
        .eq('profile_id', profileId);

      if (error) {
        toast.error(error.message);
      }

      const files = data as File[];
      const tasks = files.map((file) => {
        return supabase.storage.from('files').download(file.full_path);
      });

      const toastId = toast.loading(`Downloading ${tasks.length} files.`);

      const response = await Promise.allSettled(tasks);
      const downloadedFiles = response.map((result, index) => {
        if (result.status === 'fulfilled') {
          return {
            name: files[index].name,
            blob: result.value.data,
          };
        }
      });

      // Create a new zip file
      const zipFileWriter = new BlobWriter('application/zip');
      const zipWriter = new ZipWriter(zipFileWriter, { bufferedWrite: true });

      // Add each file to the zip file
      downloadedFiles.forEach((downloadedFile) => {
        if (downloadedFile?.blob) {
          zipWriter.add(
            downloadedFile.name,
            new BlobReader(downloadedFile.blob)
          );
        }
      });

      toast.dismiss(toastId);
      toast.success(`Files downloaded successfully.`);

      // Download the zip file
      const url = URL.createObjectURL(await zipWriter.close());
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', `${fileName ?? 'downloads'}.zip`);

      document.body.appendChild(link);

      link.click();
    },
  });
};
