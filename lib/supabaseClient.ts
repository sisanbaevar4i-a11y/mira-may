import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqznrjvoonrpwccsfzpo.supabase.co/rest/v1/'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxem5yanZvb25ycHdjY3NmenBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwOTAyMTAsImV4cCI6MjA5ODY2NjIxMH0.7EE_n8Rt9Csup2nk203c1_jWULEkG5hSfvaTA5dsG2U';

export const supabase = createClient(supabaseUrl, supabaseKey);