import { z } from 'zod';

export type ProfileData = z.infer<typeof profileSchema>;
export const profileSchema = z.object({
  name: z.string().min(1),
  group_id: z.string(),
});
