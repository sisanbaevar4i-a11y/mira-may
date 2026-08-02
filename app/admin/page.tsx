"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// --- ЭТАЛОННАЯ БАЗА НАКШАТР ---
const NAKSHATRAS_RU = [
  "", "Ашвини", "Бхарани", "Криттика", "Рохини", "Мригашира", "Ардра",
  "Пунарвасу", "Пушья", "Ашлеша", "Магха", "Пурва Пхалгуни", "Уттара Пхалгуни",
  "Хаста", "Читра", "Свати", "Вишакха", "Анурадха", "Джиештха", "Мула",
  "Пурва Ашадха", "Уттара Ашадха", "Шравана", "Дхаништха", "Шатабхиша",
  "Пурва Бхадрапада", "Уттара Бхадрапада", "Ревати"
];

const NAKSHATRAS_EN = [
  "", "Ashvini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
  "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

type NakshatraDay = {
  id?: string;
  time_ru_1: string; text_ru_1: string;
  time_ru_2: string; text_ru_2: string;
  time_en_1: string; text_en_1: string;
  time_en_2: string; text_en_2: string;
};

// Вспомогательная функция для перевода системных категорий в админке
const getCategoryLabel = (cat: string) => {
  const map: Record<string, string> = {
    nakshatras: 'Накшатры',
    horoscopes: 'Гороскопы',
    ayurveda: 'Аюрведа',
    forecasts: 'СТАРЫЙ ПРОГНОЗ (УДАЛИТЕ)'
  };
  return map[cat] || cat;
};

export default function AdminDashboard() {
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [retrogrades, setRetrogrades] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [forecastsList, setForecastsList] = useState<any[]>([]);

  const [nakshatrasMap, setNakshatrasMap] = useState<Record<string, NakshatraDay>>({});

  // Состояние формы публикаций (Добавлен ID для редактирования)
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('nakshatras');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newReadTime, setNewReadTime] = useState('5 мин чтения');
  const [newContent, setNewContent] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Состояние формы прогнозов (Добавлен ID для редактирования)
  const [editingForecastId, setEditingForecastId] = useState<string | null>(null);
  const [newForecastTitle, setNewForecastTitle] = useState('');
  const [newForecastType, setNewForecastType] = useState('daily');
  const [newForecastContent, setNewForecastContent] = useState('');
  const [isPublishingForecast, setIsPublishingForecast] = useState(false);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('interface');

  const monthsRU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const dayNamesRU = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const yearsRange = Array.from({length: 11}, (_, i) => today.getFullYear() - 5 + i);

  useEffect(() => {
    fetchData();
  }, [currentYear, currentMonth]);

  async function fetchData() {
    setIsLoading(true);

    const y = currentYear;
    const m = String(currentMonth + 1).padStart(2, '0');
    const lastDay = new Date(y, currentMonth + 1, 0).getDate();
    const startDate = `${y}-${m}-01`;
    const endDate = `${y}-${m}-${lastDay}`;

    const [resContent, resRetro, resNak, resArticles, resForecasts] = await Promise.all([
      supabase.from('site_content').select('*').order('section', { ascending: true }),
      supabase.from('retrogrades').select('*').order('sort_order', { ascending: true }),
      supabase.from('nakshatras')
        .select('*')
        .gte('calendar_date', startDate)
        .lte('calendar_date', endDate),
      supabase.from('articles').select('*').order('created_at', { ascending: false }),
      supabase.from('forecasts').select('*').order('created_at', { ascending: false })
    ]);

    if (resContent.data) setContentItems(resContent.data);
    if (resRetro.data) setRetrogrades(resRetro.data);
    if (resArticles.data) setArticlesList(resArticles.data);
    if (resForecasts.data) setForecastsList(resForecasts.data);

    const nakMap: Record<string, NakshatraDay> = {};
    if (resNak.data) {
      resNak.data.forEach((item: any) => {
        const dateKey = item.calendar_date.split('T')[0];
        const t_ru = (item.nak_time_ru || '').split('|');
        const txt_ru = (item.data_ru || '').split('|');
        const t_en = (item.nak_time_en || '').split('|');
        const txt_en = (item.data_en || '').split('|');

        nakMap[dateKey] = {
          id: item.id,
          time_ru_1: t_ru[0] || '', text_ru_1: txt_ru[0] || '',
          time_ru_2: t_ru[1] || '', text_ru_2: txt_ru[1] || '',
          time_en_1: t_en[0] || '', text_en_1: txt_en[0] || '',
          time_en_2: t_en[1] || '', text_en_2: txt_en[1] || ''
        };
      });
    }
    setNakshatrasMap(nakMap);
    setIsLoading(false);
  }

  const handleContentChange = (id: string, field: string, value: string) => {
    setContentItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRetroChange = (id: string, field: string, value: string | number) => {
    setRetrogrades(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleNakshatraGridChange = (dateStr: string, field: keyof NakshatraDay, value: string) => {
    setNakshatrasMap(prev => {
      const prevData = prev[dateStr] || {
        time_ru_1: '', text_ru_1: '', time_ru_2: '', text_ru_2: '',
        time_en_1: '', text_en_1: '', time_en_2: '', text_en_2: ''
      };
      const updates: any = { [field]: value };

      if (field === 'text_ru_1') {
        const idx = NAKSHATRAS_RU.indexOf(value);
        if (idx !== -1) updates.text_en_1 = NAKSHATRAS_EN[idx];
      } else if (field === 'text_en_1') {
        const idx = NAKSHATRAS_EN.indexOf(value);
        if (idx !== -1) updates.text_ru_1 = NAKSHATRAS_RU[idx];
      }
      else if (field === 'text_ru_2') {
        const idx = NAKSHATRAS_RU.indexOf(value);
        if (idx !== -1) updates.text_en_2 = NAKSHATRAS_EN[idx];
      } else if (field === 'text_en_2') {
        const idx = NAKSHATRAS_EN.indexOf(value);
        if (idx !== -1) updates.text_ru_2 = NAKSHATRAS_RU[idx];
      }

      if (field === 'time_ru_1') updates.time_en_1 = value;
      else if (field === 'time_en_1') updates.time_ru_1 = value;
      else if (field === 'time_ru_2') updates.time_en_2 = value;
      else if (field === 'time_en_2') updates.time_ru_2 = value;

      return { ...prev, [dateStr]: { ...prevData, ...updates } };
    });
  };

  const addRetrograde = () => {
    const newItem = {
      id: 'new-' + Date.now(), period_ru: '', period_en: '', planet_icon: '☿',
      planet_name_ru: '', planet_name_en: '', transit_ru: '', transit_en: '', sort_order: retrogrades.length
    };
    setRetrogrades([...retrogrades, newItem]);
  };

  const deleteRetrograde = async (id: string) => {
    if (confirm('Сэр, подтверждаете удаление этой записи из базы?')) {
      if (!id.toString().startsWith('new-')) {
        await supabase.from('retrogrades').delete().eq('id', id);
      }
      setRetrogrades(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- ЛОГИКА УПРАВЛЕНИЯ СТАТЬЯМИ ---
  const resetArticleForm = () => {
    setEditingArticleId(null);
    setNewTitle('');
    setNewCategory('nakshatras');
    setNewExcerpt('');
    setNewReadTime('5 мин чтения');
    setNewContent('');
    setNewImageFile(null);
  };

  const startEditArticle = (art: any) => {
    setEditingArticleId(art.id);
    setNewTitle(art.title || '');
    setNewCategory(art.category || 'nakshatras');
    setNewExcerpt(art.excerpt || '');
    setNewReadTime(art.read_time || '5 мин чтения');
    setNewContent(art.content || '');
    setNewImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Укажите заголовок публикации, сэр.');
      return;
    }

    setIsPublishing(true);
    let imageUrl = '';

    try {
      if (newImageFile) {
        const fileName = `${Date.now()}-${newImageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('articles').upload(fileName, newImageFile);
        if (uploadError) {
          console.error('Ошибка загрузки изображения:', uploadError);
          alert(`Ошибка загрузки картинки: ${uploadError.message}`);
          setIsPublishing(false);
          return;
        } else {
          const { data: publicURLData } = supabase.storage.from('articles').getPublicUrl(fileName);
          imageUrl = publicURLData.publicUrl;
        }
      }

      const payload: any = {
        title: newTitle,
        category: newCategory,
        excerpt: newExcerpt,
        content: newContent,
        read_time: newReadTime,
      };

      // Обновляем картинку только если загрузили новую
      if (imageUrl) {
        payload.image_url = imageUrl;
      }

      if (editingArticleId) {
        // Режим обновления
        const { error: updateError } = await supabase.from('articles').update(payload).eq('id', editingArticleId);
        if (updateError) throw updateError;
        alert('Публикация успешно обновлена, сэр.');
      } else {
        // Режим создания
        const dateStrFormatted = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        payload.date_str = dateStrFormatted;
        const { error: insertError } = await supabase.from('articles').insert([payload]);
        if (insertError) throw insertError;
        alert('Публикация успешно опубликована, сэр.');
      }

      resetArticleForm();
      fetchData();
    } catch (err: any) {
      console.error('Критический сбой:', err);
      alert(`Сбой базы данных: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Подтверждаете удаление публикации?')) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        setArticlesList(prev => prev.filter(a => a.id !== id));
      }
    }
  };


  // --- ЛОГИКА УПРАВЛЕНИЯ ПРОГНОЗАМИ ---
  const resetForecastForm = () => {
    setEditingForecastId(null);
    setNewForecastTitle('');
    setNewForecastType('daily');
    setNewForecastContent('');
  };

  const startEditForecast = (forecast: any) => {
    setEditingForecastId(forecast.id);
    setNewForecastTitle(forecast.title || '');
    setNewForecastType(forecast.type || 'daily');
    setNewForecastContent(forecast.content || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublishForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForecastTitle.trim()) {
      alert('Укажите заголовок прогноза, сэр.');
      return;
    }

    setIsPublishingForecast(true);

    try {
      const payload: any = {
        title: newForecastTitle,
        type: newForecastType,
        content: newForecastContent,
      };

      if (editingForecastId) {
        // Режим обновления
        const { error: updateError } = await supabase.from('forecasts').update(payload).eq('id', editingForecastId);
        if (updateError) throw updateError;
        alert('Прогноз успешно обновлен, сэр.');
      } else {
        // Режим создания
        const dateStrFormatted = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        payload.date_str = dateStrFormatted;
        const { error: insertError } = await supabase.from('forecasts').insert([payload]);
        if (insertError) throw insertError;
        alert('Прогноз успешно опубликован в системе, сэр.');
      }

      resetForecastForm();
      fetchData();
    } catch (err: any) {
      console.error('Критический сбой при публикации прогноза:', err);
      alert(`Сбой БД: ${err.message}`);
    } finally {
      setIsPublishingForecast(false);
    }
  };

  const handleDeleteForecast = async (id: string) => {
    if (confirm('Удалить этот прогноз из базы данных?')) {
      const { error } = await supabase.from('forecasts').delete().eq('id', id);
      if (!error) {
        setForecastsList(prev => prev.filter(f => f.id !== id));
      }
    }
  };


  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('Синхронизация с ядром...');
    let hasError = false;

    try {
      if (activeTab === 'interface') {
        for (const item of contentItems) {
          const { error } = await supabase.from('site_content').update({ value_ru: item.value_ru, value_en: item.value_en }).eq('id', item.id);
          if (error) hasError = true;
        }
      }
      else if (activeTab === 'retrograde') {
        for (const item of retrogrades) {
          if (item.id.toString().startsWith('new-')) {
            const { id, ...insertData } = item;
            const { error } = await supabase.from('retrogrades').insert([insertData]);
            if (error) hasError = true;
          } else {
            const { error } = await supabase.from('retrogrades').update({
              period_ru: item.period_ru, period_en: item.period_en, planet_icon: item.planet_icon,
              planet_name_ru: item.planet_name_ru, planet_name_en: item.planet_name_en,
              transit_ru: item.transit_ru, transit_en: item.transit_en, sort_order: item.sort_order
            }).eq('id', item.id);
            if (error) hasError = true;
          }
        }
      }
      else if (activeTab === 'nakshatra') {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const monthFormatted = (currentMonth + 1).toString().padStart(2, '0');

        for (let day = 1; day <= daysInMonth; day++) {
          const dayFormatted = day.toString().padStart(2, '0');
          const dateStr = `${currentYear}-${monthFormatted}-${dayFormatted}`;
          const cellData = nakshatrasMap[dateStr];

          if (!cellData || (!cellData.text_ru_1 && !cellData.text_ru_2 && !cellData.time_ru_1 && !cellData.time_ru_2 && !cellData.text_en_1 && !cellData.text_en_2)) {
            if (cellData && cellData.id) {
              const { error } = await supabase.from('nakshatras').delete().eq('id', cellData.id);
              if (error) hasError = true;
            }
            continue;
          }

          const dbData = {
            calendar_date: dateStr,
            nak_time_ru: `${cellData.time_ru_1 || ''}|${cellData.time_ru_2 || ''}`,
            data_ru: `${cellData.text_ru_1 || ''}|${cellData.text_ru_2 || ''}`,
            nak_time_en: `${cellData.time_en_1 || ''}|${cellData.time_en_2 || ''}`,
            data_en: `${cellData.text_en_1 || ''}|${cellData.text_en_2 || ''}`
          };

          if (cellData.id) {
            const { error } = await supabase.from('nakshatras').update(dbData).eq('id', cellData.id);
            if (error) hasError = true;
          } else {
            const { error } = await supabase.from('nakshatras').insert([dbData]);
            if (error) hasError = true;
          }
        }
      }
    } catch (err) {
      console.error(err);
      hasError = true;
    }

    setIsSaving(false);
    if (hasError) {
      setSaveStatus('Ошибка синхронизации. Проверьте консоль.');
    } else {
      setSaveStatus('Изменения успешно применены в базе данных.');
      fetchData();
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const groupedContent = contentItems.reduce((acc, item) => {
    (acc[item.section] = acc[item.section] || []).push(item);
    return acc;
  }, {});

  const getDaysArray = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({length: daysInMonth}, (_, i) => {
      const dayNum = i + 1;
      const dateObj = new Date(currentYear, currentMonth, dayNum);
      return {
        dayNum,
        dayOfWeek: dateObj.getDay()
      };
    });
  };

  const daysArray = getDaysArray();
  const currentMonthFormatted = (currentMonth + 1).toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#030407] text-gray-200 font-['Montserrat',sans-serif] selection:bg-indigo-500 selection:text-white pb-20">

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Montserrat:wght@300;400;500;600&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(10, 12, 16, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.8); }
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(0.7) sepia(100%) hue-rotate(200deg) saturate(3);
          cursor: pointer;
        }
      `}} />

      <div className="max-w-[1600px] mx-auto p-4 pt-12 md:p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#080a0f]/85 backdrop-blur-xl border border-gray-800/80 p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-['Cinzel',serif] text-xl font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)]">⚙</div>
            <div>
              <div className="text-indigo-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Admin Terminal v7.1 (CMS CRUD Edit Support)
              </div>
              <h1 className="text-2xl md:text-3xl font-['Cinzel',serif] font-bold text-white tracking-wide">Панель управления контентом</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => window.open('/', '_blank')} className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-[#0c0e14] border border-gray-700/80 hover:border-indigo-500/50 hover:text-white transition-all text-xs font-semibold tracking-wider uppercase text-gray-400">Сайт ↗</button>
            {activeTab !== 'articles' && activeTab !== 'forecasts' && (
              <button onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-white text-xs font-semibold tracking-wider uppercase disabled:opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            )}
          </div>
        </header>

        {saveStatus && (
          <div className={`p-4 rounded-2xl mb-8 border font-medium text-sm animate-fade-in flex items-center gap-3 ${saveStatus.includes('Ошибка') ? 'bg-red-500/10 border-red-500/40 text-red-300' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'}`}>
            <span className="text-lg">{saveStatus.includes('Ошибка') ? '⚠' : '✦'}</span>
            {saveStatus}
          </div>
        )}

        <div className="flex gap-3 mb-8 border-b border-gray-800/60 pb-4 overflow-x-auto custom-scrollbar">
          {['interface', 'retrograde', 'nakshatra', 'articles', 'forecasts'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-6 rounded-xl whitespace-nowrap font-medium text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] font-bold' : 'bg-[#080a0f] text-gray-400 hover:text-white border border-gray-800/80'}`}>
              {tab === 'interface' ? 'Тексты интерфейса' : tab === 'retrograde' ? 'Ретроградные планеты' : tab === 'nakshatra' ? 'Календарь накшатр (Время+)' : tab === 'articles' ? '📖 Управление публикациями' : '🔮 Прогнозы'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-32 text-indigo-400 animate-pulse tracking-[0.3em] uppercase text-sm font-light">Синхронизация матриц ядра...</div>
        ) : (
          <div className="animate-fade-in">

            {/* ВКЛАДКА 1: ИНТЕРФЕЙС */}
            {activeTab === 'interface' && (
              <div className="space-y-8">
                {Object.entries(groupedContent).map(([section, items]: [string, any]) => (
                  <div key={section} className="bg-[#080a0f]/90 backdrop-blur-md border border-gray-800/80 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-indigo-950/40 to-transparent px-8 py-5 border-b border-gray-800/60 flex items-center justify-between">
                      <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] font-['Cinzel',serif]">{section}</h2>
                      <span className="text-[10px] text-indigo-400 font-mono">Модулей: {items.length}</span>
                    </div>
                    <div className="divide-y divide-gray-800/40">
                      {items.map((item: any) => (
                        <div key={item.id} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 hover:bg-white/[0.01] transition-colors">
                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 flex justify-between font-semibold">
                              <span>Русский (RU)</span>
                              <span className="text-indigo-400/70 font-mono text-[9px] bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/50">{item.key_name}</span>
                            </label>
                            <textarea value={item.value_ru} onChange={(e) => handleContentChange(item.id, 'value_ru', e.target.value)} className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all min-h-[90px] shadow-inner font-light" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">English (EN)</label>
                            <textarea value={item.value_en} onChange={(e) => handleContentChange(item.id, 'value_en', e.target.value)} className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all min-h-[90px] shadow-inner font-light" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ВКЛАДКА 2: РЕТРОГРАДЫ */}
            {activeTab === 'retrograde' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6 bg-[#080a0f] border border-gray-800/80 p-6 rounded-2xl">
                  <div>
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest font-['Cinzel',serif]">Управление орбитами</h2>
                    <p className="text-xs text-gray-400 mt-1 font-light">Настройка транзитов и периодов ретроградности</p>
                  </div>
                  <button onClick={addRetrograde} className="px-5 py-3 bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-xs uppercase tracking-wider font-semibold shadow-[0_0_15px_rgba(99,102,241,0.2)]"> + Добавить транзит </button>
                </div>
                {retrogrades.length === 0 && <div className="text-center py-16 text-gray-500 italic">База ретроградов пуста.</div>}
                <div className="grid grid-cols-1 gap-6">
                  {retrogrades.map((item, index) => (
                    <div key={item.id} className="bg-[#080a0f]/90 backdrop-blur-md border border-gray-800/80 rounded-2xl p-6 md:p-8 relative group hover:border-gray-700 transition-all shadow-xl">
                      <div className="absolute top-6 right-6 flex items-center gap-6">
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <span>Порядок:</span>
                          <input type="number" value={item.sort_order} onChange={e => handleRetroChange(item.id, 'sort_order', parseInt(e.target.value))} className="w-12 bg-[#030407] border border-gray-700 rounded-lg text-white text-center py-1 focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <button onClick={() => deleteRetrograde(item.id)} className="text-red-400/80 hover:text-red-400 text-xs uppercase tracking-wider font-semibold bg-red-950/30 border border-red-900/50 px-3 py-1.5 rounded-lg transition-colors"> Удалить </button>
                      </div>
                      <div className="flex items-center gap-3 mb-6 pr-48">
                        <span className="text-3xl text-indigo-400 w-10 text-center">{item.planet_icon || '✧'}</span>
                        <h3 className="text-base text-white font-semibold font-['Cinzel',serif]">Транзит #{index + 1}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Символ (Emoji)</label>
                          <input value={item.planet_icon} onChange={e => handleRetroChange(item.id, 'planet_icon', e.target.value)} className="w-full bg-[#030407] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Планета (RU)</label>
                          <input value={item.planet_name_ru} onChange={e => handleRetroChange(item.id, 'planet_name_ru', e.target.value)} placeholder="Юпитер" className="w-full bg-[#030407] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Planet (EN)</label>
                          <input value={item.planet_name_en} onChange={e => handleRetroChange(item.id, 'planet_name_en', e.target.value)} placeholder="Jupiter" className="w-full bg-[#030407] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Период дат (RU)</label>
                          <input value={item.period_ru} onChange={e => handleRetroChange(item.id, 'period_ru', e.target.value)} placeholder="11.11.2025 — 11.03.2026" className="w-full bg-[#030407] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Period dates (EN)</label>
                          <input value={item.period_en} onChange={e => handleRetroChange(item.id, 'period_en', e.target.value)} placeholder="11.11.2025 — 11.03.2026" className="w-full bg-[#030407] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Транзит согласно Джйотиш (RU)</label>
                          <textarea value={item.transit_ru} onChange={e => handleRetroChange(item.id, 'transit_ru', e.target.value)} className="w-full bg-[#030407] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 focus:outline-none min-h-[70px]" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-semibold">Transit according to Jyotish (EN)</label>
                          <textarea value={item.transit_en} onChange={e => handleRetroChange(item.id, 'transit_en', e.target.value)} className="w-full bg-[#030407] border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 focus:outline-none min-h-[70px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ВКЛАДКА 3: АДАПТИВНАЯ СЕТКА НАКШАТР */}
            {activeTab === 'nakshatra' && (
              <div className="bg-[#080a0f]/90 backdrop-blur-md border border-gray-800/80 rounded-3xl p-4 md:p-8 shadow-2xl">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-800/60 pb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Cinzel',serif]">База: Календарь накшатр</h2>
                    <p className="text-xs text-gray-400 mt-1 font-light">Выберите период и заполните слоты времени и смены накшатр (UTC+3).</p>
                  </div>

                  <div className="flex items-center gap-3 bg-[#030407] border border-gray-800 rounded-xl p-2 shadow-inner w-full md:w-auto justify-between md:justify-start">
                    <button onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)} className="p-2 text-indigo-400 hover:text-white">&larr;</button>

                    <div className="flex items-center gap-2">
                      <select value={currentMonth} onChange={e => setCurrentMonth(parseInt(e.target.value))} className="bg-transparent text-sm text-white font-medium appearance-none focus:outline-none custom-scrollbar">
                        {monthsRU.map((m, i) => <option key={m} value={i}>{m}</option>)}
                      </select>
                      <select value={currentYear} onChange={e => setCurrentYear(parseInt(e.target.value))} className="bg-transparent text-sm text-indigo-300 font-medium appearance-none focus:outline-none custom-scrollbar">
                        {yearsRange.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <button onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)} className="p-2 text-indigo-400 hover:text-white">&rarr;</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {daysArray.map((cell) => {
                    const dayStr = cell.dayNum.toString().padStart(2, '0');
                    const dateKey = `${currentYear}-${currentMonthFormatted}-${dayStr}`;

                    const currentData = nakshatrasMap[dateKey] || {
                      time_ru_1: '', text_ru_1: '', time_ru_2: '', text_ru_2: '',
                      time_en_1: '', text_en_1: '', time_en_2: '', text_en_2: ''
                    };
                    const isWeekend = (cell.dayOfWeek === 0 || cell.dayOfWeek === 6);

                    return (
                      <div key={dateKey} className={`bg-[#030407] border rounded-2xl p-4 md:p-5 flex flex-col transition-all hover:border-indigo-500/50 shadow-lg ${isWeekend ? 'border-pink-900/40' : 'border-gray-800/80'}`}>

                        <div className={`flex justify-between items-center mb-5 pb-3 border-b ${isWeekend ? 'border-pink-900/30' : 'border-gray-800/40'}`}>
                          <span className={`text-lg font-bold ${isWeekend ? 'text-pink-400' : 'text-gray-200'}`}>
                            {cell.dayNum} {monthsRU[currentMonth]}
                          </span>
                          <span className={`text-xs font-bold uppercase tracking-widest ${isWeekend ? 'text-pink-500/70' : 'text-gray-500'}`}>
                            {dayNamesRU[cell.dayOfWeek]}
                          </span>
                        </div>

                        <div className="space-y-6">

                          {/* RU БЛОК */}
                          <div>
                            <label className="block text-[10px] text-indigo-400 uppercase tracking-widest mb-3 font-semibold">RU (накшатры)</label>
                            <div className="flex flex-col gap-3">

                              {/* СЛОТ 1 RU */}
                              <div className="flex flex-col xl:flex-row gap-2">
                                <div className="relative w-full xl:w-28 shrink-0 group">
                                  <input
                                    type="time"
                                    value={currentData.time_ru_1}
                                    onChange={(e) => handleNakshatraGridChange(dateKey, 'time_ru_1', e.target.value)}
                                    className="w-full bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-indigo-200 focus:border-indigo-500 focus:outline-none cursor-pointer text-center shadow-inner appearance-none"
                                  />
                                  {currentData.time_ru_1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleNakshatraGridChange(dateKey, 'time_ru_1', '')}
                                      className="absolute -top-2 -right-2 xl:-left-2 xl:right-auto w-6 h-6 bg-[#080a0f] text-red-400 rounded-full border border-red-500/40 flex items-center justify-center text-xs opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
                                      title="Очистить время"
                                    >✕</button>
                                  )}
                                </div>
                                <select
                                  value={currentData.text_ru_1}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'text_ru_1', e.target.value)}
                                  className="flex-1 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none font-light cursor-pointer shadow-inner w-full"
                                >
                                  {NAKSHATRAS_RU.map(nak => <option key={nak} value={nak}>{nak || '— Слот 1 —'}</option>)}
                                </select>
                              </div>

                              {/* СЛОТ 2 RU */}
                              <div className="flex flex-col xl:flex-row gap-2">
                                <div className="relative w-full xl:w-28 shrink-0 group">
                                  <input
                                    type="time"
                                    value={currentData.time_ru_2}
                                    onChange={(e) => handleNakshatraGridChange(dateKey, 'time_ru_2', e.target.value)}
                                    className="w-full bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-indigo-200 focus:border-indigo-500 focus:outline-none cursor-pointer text-center shadow-inner appearance-none"
                                  />
                                  {currentData.time_ru_2 && (
                                    <button
                                      type="button"
                                      onClick={() => handleNakshatraGridChange(dateKey, 'time_ru_2', '')}
                                      className="absolute -top-2 -right-2 xl:-left-2 xl:right-auto w-6 h-6 bg-[#080a0f] text-red-400 rounded-full border border-red-500/40 flex items-center justify-center text-xs opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
                                      title="Очистить время"
                                    >✕</button>
                                  )}
                                </div>
                                <select
                                  value={currentData.text_ru_2}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'text_ru_2', e.target.value)}
                                  className="flex-1 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none font-light cursor-pointer shadow-inner w-full"
                                >
                                  {NAKSHATRAS_RU.map(nak => <option key={nak} value={nak}>{nak || '— Слот 2 —'}</option>)}
                                </select>
                              </div>

                            </div>
                          </div>

                          {/* EN БЛОК */}
                          <div>
                            <label className="block text-[10px] text-purple-400 uppercase tracking-widest mb-3 font-semibold">EN (Nakshatras)</label>
                            <div className="flex flex-col gap-3">

                              {/* СЛОТ 1 EN */}
                              <div className="flex flex-col xl:flex-row gap-2">
                                <div className="relative w-full xl:w-28 shrink-0 group">
                                  <input
                                    type="time"
                                    value={currentData.time_en_1}
                                    onChange={(e) => handleNakshatraGridChange(dateKey, 'time_en_1', e.target.value)}
                                    className="w-full bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-purple-200 focus:border-indigo-500 focus:outline-none cursor-pointer text-center shadow-inner appearance-none"
                                  />
                                  {currentData.time_en_1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleNakshatraGridChange(dateKey, 'time_en_1', '')}
                                      className="absolute -top-2 -right-2 xl:-left-2 xl:right-auto w-6 h-6 bg-[#080a0f] text-red-400 rounded-full border border-red-500/40 flex items-center justify-center text-xs opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
                                      title="Очистить время"
                                    >✕</button>
                                  )}
                                </div>
                                <select
                                  value={currentData.text_en_1}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'text_en_1', e.target.value)}
                                  className="flex-1 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none font-light cursor-pointer shadow-inner w-full"
                                >
                                  {NAKSHATRAS_EN.map(nak => <option key={nak} value={nak}>{nak || '— Slot 1 —'}</option>)}
                                </select>
                              </div>

                              {/* СЛОТ 2 EN */}
                              <div className="flex flex-col xl:flex-row gap-2">
                                <div className="relative w-full xl:w-28 shrink-0 group">
                                  <input
                                    type="time"
                                    value={currentData.time_en_2}
                                    onChange={(e) => handleNakshatraGridChange(dateKey, 'time_en_2', e.target.value)}
                                    className="w-full bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-purple-200 focus:border-indigo-500 focus:outline-none cursor-pointer text-center shadow-inner appearance-none"
                                  />
                                  {currentData.time_en_2 && (
                                    <button
                                      type="button"
                                      onClick={() => handleNakshatraGridChange(dateKey, 'time_en_2', '')}
                                      className="absolute -top-2 -right-2 xl:-left-2 xl:right-auto w-6 h-6 bg-[#080a0f] text-red-400 rounded-full border border-red-500/40 flex items-center justify-center text-xs opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
                                      title="Очистить время"
                                    >✕</button>
                                  )}
                                </div>
                                <select
                                  value={currentData.text_en_2}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'text_en_2', e.target.value)}
                                  className="flex-1 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none font-light cursor-pointer shadow-inner w-full"
                                >
                                  {NAKSHATRAS_EN.map(nak => <option key={nak} value={nak}>{nak || '— Slot 2 —'}</option>)}
                                </select>
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ВКЛАДКА 4: УПРАВЛЕНИЕ СТАТЬЯМИ (CMS) */}
            {activeTab === 'articles' && (
              <div className="space-y-10">
                <div className="bg-[#080a0f]/90 border border-gray-800/80 rounded-3xl p-6 md:p-10 shadow-2xl">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Cinzel',serif] mb-6">
                    {editingArticleId ? 'Редактировать публикацию' : 'Опубликовать новую публикацию'}
                  </h2>

                  <form onSubmit={handlePublishArticle} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Заголовок публикации</label>
                        <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Например: Накшатра Свати..." className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Категория</label>
                        <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none">
                          <option value="nakshatras">Накшатры</option>
                          <option value="horoscopes">Гороскопы известных личностей</option>
                          <option value="ayurveda">Аюрведа</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Время чтения</label>
                        <input type="text" value={newReadTime} onChange={e => setNewReadTime(e.target.value)} placeholder="6 мин чтения" className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Обложка (Фото / Изображение)</label>
                        <input type="file" accept="image/*" onChange={e => e.target.files && setNewImageFile(e.target.files[0])} className="w-full bg-[#030407] border border-gray-800 rounded-xl p-3 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer" />
                        {editingArticleId && <div className="text-[9px] text-indigo-400 mt-1 pl-1">Оставьте пустым, чтобы сохранить текущую обложку.</div>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Краткое описание (превью)</label>
                      <textarea value={newExcerpt} onChange={e => setNewExcerpt(e.target.value)} placeholder="Пару предложений о чем публикация..." className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none min-h-[80px]" />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Содержимое публикации (Текст)</label>
                      <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Полный текст публикации..." className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none min-h-[160px]" />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button type="submit" disabled={isPublishing} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs uppercase tracking-wider font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50">
                        {isPublishing ? 'Синхронизация...' : (editingArticleId ? 'Сохранить изменения' : 'Опубликовать публикацию')}
                      </button>
                      {editingArticleId && (
                        <button type="button" onClick={resetArticleForm} className="px-8 py-4 bg-[#0c0e14] border border-gray-700 text-gray-400 text-xs uppercase tracking-wider font-bold rounded-xl hover:text-white hover:border-gray-500 transition-all">
                          Отменить
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* СПИСОК ОПУБЛИКОВАННЫХ СТАТЕЙ */}
                <div className="bg-[#080a0f]/90 border border-gray-800/80 rounded-3xl p-6 md:p-10 shadow-2xl">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Cinzel',serif] mb-6">Опубликованные материалы ({articlesList.length})</h2>
                  {articlesList.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Пока нет ни одной публикации в базе данных.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {articlesList.map(art => (
                        <div key={art.id} className={`bg-[#030407] border rounded-2xl p-5 flex flex-col justify-between transition-colors ${editingArticleId === art.id ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-gray-800'}`}>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-900/50">{getCategoryLabel(art.category)}</span>
                            <h3 className="text-base font-bold text-white mt-3 mb-2 font-['Cinzel',serif]">{art.title}</h3>
                            <p className="text-xs text-gray-400 line-clamp-2">{art.excerpt}</p>
                          </div>
                          <div className="mt-6 pt-4 border-t border-gray-800/80 flex justify-between items-center">
                            <span className="text-[10px] text-gray-500">{art.date_str}</span>
                            <div className="flex gap-2">
                               <button onClick={() => startEditArticle(art)} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-950/30 border border-indigo-900/50 px-3 py-1.5 rounded-lg transition-colors">Изменить</button>
                               <button onClick={() => handleDeleteArticle(art.id)} className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-950/30 border border-red-900/50 px-3 py-1.5 rounded-lg transition-colors">Удалить</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ВКЛАДКА 5: УПРАВЛЕНИЕ ПРОГНОЗАМИ */}
            {activeTab === 'forecasts' && (
              <div className="space-y-10">
                <div className="bg-[#080a0f]/90 border border-gray-800/80 rounded-3xl p-6 md:p-10 shadow-2xl">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Cinzel',serif] mb-6">
                    {editingForecastId ? 'Редактировать прогноз' : 'Опубликовать новый прогноз'}
                  </h2>

                  <form onSubmit={handlePublishForecast} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Название прогноза</label>
                        <input type="text" value={newForecastTitle} onChange={e => setNewForecastTitle(e.target.value)} required placeholder="Например: Астрологическая погода на август..." className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Временной горизонт (Тип)</label>
                        <select value={newForecastType} onChange={e => setNewForecastType(e.target.value)} className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none">
                          <option value="daily">Ежедневный прогноз</option>
                          <option value="monthly">Ежемесячный прогноз</option>
                          <option value="yearly">Ежегодный прогноз</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">Текст прогноза</label>
                      <textarea value={newForecastContent} onChange={e => setNewForecastContent(e.target.value)} required placeholder="Детальный анализ транзитов и аспектов..." className="w-full bg-[#030407] border border-gray-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 focus:outline-none min-h-[200px]" />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button type="submit" disabled={isPublishingForecast} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs uppercase tracking-wider font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50">
                        {isPublishingForecast ? 'Синхронизация...' : (editingForecastId ? 'Сохранить изменения' : 'Опубликовать прогноз')}
                      </button>
                      {editingForecastId && (
                        <button type="button" onClick={resetForecastForm} className="px-8 py-4 bg-[#0c0e14] border border-gray-700 text-gray-400 text-xs uppercase tracking-wider font-bold rounded-xl hover:text-white hover:border-gray-500 transition-all">
                          Отменить
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* СПИСОК ОПУБЛИКОВАННЫХ ПРОГНОЗОВ */}
                <div className="bg-[#080a0f]/90 border border-gray-800/80 rounded-3xl p-6 md:p-10 shadow-2xl">
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest font-['Cinzel',serif] mb-6">База прогнозов ({forecastsList.length})</h2>
                  {forecastsList.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">База прогнозов в настоящий момент пуста.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {forecastsList.map(forecast => (
                        <div key={forecast.id} className={`bg-[#030407] border rounded-2xl p-5 flex flex-col justify-between transition-colors ${editingForecastId === forecast.id ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-gray-800'}`}>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-900/50">
                              {forecast.type === 'daily' ? 'Ежедневный' : forecast.type === 'monthly' ? 'Ежемесячный' : 'Ежегодный'}
                            </span>
                            <h3 className="text-base font-bold text-white mt-3 mb-2 font-['Cinzel',serif]">{forecast.title}</h3>
                            <p className="text-xs text-gray-400 line-clamp-3">{forecast.content}</p>
                          </div>
                          <div className="mt-6 pt-4 border-t border-gray-800/80 flex justify-between items-center">
                            <span className="text-[10px] text-gray-500">{forecast.date_str}</span>
                            <div className="flex gap-2">
                               <button onClick={() => startEditForecast(forecast)} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-950/30 border border-indigo-900/50 px-3 py-1.5 rounded-lg transition-colors">Изменить</button>
                               <button onClick={() => handleDeleteForecast(forecast.id)} className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-950/30 border border-red-900/50 px-3 py-1.5 rounded-lg transition-colors">Удалить</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}