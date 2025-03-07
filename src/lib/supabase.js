import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to the hardcoded values for development
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ysnknztqwukxfjjauarn.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzbmtuenRxd3VreGZqamF1YXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMDUzMzksImV4cCI6MjA1Njg4MTMzOX0.uTGg7vvpO27hScTs3j334uZGXLDXw_Le9snE_EPZb7M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 