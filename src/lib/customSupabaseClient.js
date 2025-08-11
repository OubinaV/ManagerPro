import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kymlupjftebperrykmce.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5bWx1cGpmdGVicGVycnlrbWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODAwNzAsImV4cCI6MjA3MDA1NjA3MH0.8BqUGvmd2I98SSHAGZe3EObTTJz9G6WzgHRnRHukEBU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);