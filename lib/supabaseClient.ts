import { createClient } from '@supabase/supabase-js';

// Прямое подключение к Supabase (хардкод ключей) для сборки в облаке
const supabaseUrl = 'https://altxwdoizxfyjotibgfp.supabase.co'; // ТВОЙ УНИКАЛЬНЫЙ URL
const supabaseAnonKey = 'sb_publishable_8OFa9XuiKzqnP2_saaAuzA_I3Ib3oxF'; // Сюда вставь твой длинный anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);