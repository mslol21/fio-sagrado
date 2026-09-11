import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://vjuoxzkuuizbbioqyrys.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdW94emt1dWl6YmJpb3F5cnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNzI2OTQsImV4cCI6MjEwMDg0ODY5NH0.Av3XD2tb0nyTYdeAbYMMxigB2eKDIU9qvDi_2vf77gc';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
