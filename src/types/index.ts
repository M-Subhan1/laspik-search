import { Tables, TablesInsert, TablesUpdate } from '@/types/supabase';

export type UpsertProfile = TablesInsert<'profiles'> | TablesUpdate<'profiles'>;
export type Profile = Tables<'profiles'>;

export type Pagination = {
  page: number;
  pageSize: number;
};
