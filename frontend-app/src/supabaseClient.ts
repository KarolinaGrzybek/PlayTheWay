import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://axiakqzgkwgwvdgoaxzc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4aWFrcXpna3dnd3ZkZ29heHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzI3MTgsImV4cCI6MjA5NDk0ODcxOH0.yPyMNiWV6HXvLqXHbMz3gNuCZQ99erWTqu2ZX7CSkf0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
