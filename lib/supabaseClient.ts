import { createClient } from '@supabase/supabase-js';

// Прямая, абсолютная ссылка на ваш новый сервер с протоколом
const supabaseUrl = 'https://uqznrjvoonrpwccsfzpo.supabase.co';

// Вставьте сюда ваш длинный ключ, который начинается с sb_publishable_
const supabaseKey = 'СЮДА_ВСТАВИТЬ_КЛЮЧ';

export const supabase = createClient(supabaseUrl, supabaseKey);