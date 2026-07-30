import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqznrjvponrpwccsfzpo.supabase.co';
const supabaseKey = 'sb_publishable_oVW9ZWCXnv4YN8oqaIj1bQ_OZqf3QIA';

export const supabase = createClient(supabaseUrl, supabaseKey);