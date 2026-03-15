import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cmoafsypyickxqvpilor.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtb2Fmc3lweWlja3hxdnBpbG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTExOTQsImV4cCI6MjA4ODk2NzE5NH0.E7SHMkRuIuqd8TAiuwWRlRERY91ec9MFS0YSDK7t8cw';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});