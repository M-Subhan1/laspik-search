import { z } from 'zod';

export type UpsertFileData = z.infer<typeof upsertFileSchema>;
export const upsertFileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  profileId: z.number().int(),
  status: z.enum(['pending', 'processed']),
});
