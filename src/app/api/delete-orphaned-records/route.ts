import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

import { env } from '@/env.mjs';

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const _supabase = new SupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY
  );

  return Response.json({ success: true });
};
