import { z } from 'zod';

export type UploadFilesData = z.infer<typeof uploadFilesSchema>;

const status = z.enum(['pending', 'processed']);
export const uploadFilesSchema = z.object({
  status,
  files: z.array(z.string()),
});

export type UpdateFileData = z.infer<typeof updateFileSchema>;
export const updateFileSchema = z
  .object({
    name: z.string(),
    status,
  })
  .partial();
