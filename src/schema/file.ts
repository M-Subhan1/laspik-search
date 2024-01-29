import { z } from 'zod';

export type UploadFilesData = z.infer<typeof uploadFilesSchema>;
export const uploadFilesSchema = z.object({
  status: z.enum(['pending', 'processed']),
  files: z.array(z.string()),
});
