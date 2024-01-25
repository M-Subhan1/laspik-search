import { z } from 'zod';

export type FileFormValues = z.infer<typeof createFileSchema>;
export const createFileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  group: z.string(),
  status: z.enum(['pending', 'processed']),
});

export type UpdateFileFormValues = z.infer<typeof updateFileSchema>;
export const updateFileSchema = createFileSchema.partial();
