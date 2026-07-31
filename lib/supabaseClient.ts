import { createClient } from '@supabase/supabase-js';

// Прямая, абсолютная ссылка на ваш новый сервер с протоколом
const supabaseUrl = 'https://uqznrjvoonrpwccsfzpo.supabase.co';

// Вставьте сюда ваш длинный ключ, который начинается с sb_publishable_
const supabaseKey = 'sb_publishable_oVW9ZWCXnv4YN8oqaIj1bQ_OZqf3QIA';

export const supabase = createClient(supabaseUrl, supabaseKey);