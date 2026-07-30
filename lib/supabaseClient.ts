import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uqznrjvponrpwccsfzpo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_oVW9ZWCXnv4YN8oqaIj1bQ_OZqf3QIA';

export const supabase = createClient(supabaseUrl, supabaseKey);