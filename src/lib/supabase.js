import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase URL and anon key from your dashboard
// For example: https://xyzproject.supabase.co and eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// In production, these should be environment variables
const supabaseUrl = 'https://ysnknztqwukxfjjauarn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzbmtuenRxd3VreGZqamF1YXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMDUzMzksImV4cCI6MjA1Njg4MTMzOX0.uTGg7vvpO27hScTs3j334uZGXLDXw_Le9snE_EPZb7M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 