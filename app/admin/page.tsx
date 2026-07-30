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

export default function AdminDashboard() {
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [retrogrades, setRetrogrades] = useState<any[]>([]);

  // Двухслотовый словарь накшатр
  const [nakshatrasMap, setNakshatrasMap] = useState<Record<string, NakshatraDay>>({});

  // Состояние для выбора даты
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

    const [resContent, resRetro, resNak] = await Promise.all([
      supabase.from('site_content').select('*').order('section', { ascending: true }),
      supabase.from('retrogrades').select('*').order('sort_order', { ascending: true }),
      supabase.from('nakshatras').select('*')
    ]);

    if (resContent.data) setContentItems(resContent.data);
    if (resRetro.data) setRetrogrades(resRetro.data);

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

          if (!cellData || (!cellData.text_ru_1 && !cellData.text_ru_2 && !cellData.time_ru_1 && !cellData.time_ru_2 && !cellData.text_en_1 && !cellData.text_en_2)) continue;

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

  // --- ГЕНЕРАЦИЯ ДНЕЙ ДЛЯ НОВОГО АДАПТИВНОГО ИНТЕРФЕЙСА ---
  const getDaysArray = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return Array.from({length: daysInMonth}, (_, i) => {
      const dayNum = i + 1;
      const dateObj = new Date(currentYear, currentMonth, dayNum);
      return {
        dayNum,
        dayOfWeek: dateObj.getDay() // 0 = Вс, 1 = Пн, ...
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

      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#080a0f]/85 backdrop-blur-xl border border-gray-800/80 p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-['Cinzel',serif] text-xl font-bold shadow-[0_0_15px_rgba(99,102,241,0.2)]">⚙</div>
            <div>
              <div className="text-indigo-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Admin Terminal v6.0 (Responsive Cards)
              </div>
              <h1 className="text-2xl md:text-3xl font-['Cinzel',serif] font-bold text-white tracking-wide">Панель управления контентом</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => window.open('/', '_blank')} className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-[#0c0e14] border border-gray-700/80 hover:border-indigo-500/50 hover:text-white transition-all text-xs font-semibold tracking-wider uppercase text-gray-400">Сайт ↗</button>
            <button onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-white text-xs font-semibold tracking-wider uppercase disabled:opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </header>

        {saveStatus && (
          <div className={`p-4 rounded-2xl mb-8 border font-medium text-sm animate-fade-in flex items-center gap-3 ${saveStatus.includes('Ошибка') ? 'bg-red-500/10 border-red-500/40 text-red-300' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'}`}>
            <span className="text-lg">{saveStatus.includes('Ошибка') ? '⚠' : '✦'}</span>
            {saveStatus}
          </div>
        )}

        <div className="flex gap-3 mb-8 border-b border-gray-800/60 pb-4 overflow-x-auto custom-scrollbar">
          {['interface', 'retrograde', 'nakshatra'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-6 rounded-xl whitespace-nowrap font-medium text-xs tracking-widest uppercase transition-all duration-300 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] font-bold' : 'bg-[#080a0f] text-gray-400 hover:text-white border border-gray-800/80'}`}>
              {tab === 'interface' ? 'Тексты интерфейса' : tab === 'retrograde' ? 'Ретроградные планеты' : 'Календарь накшатр (Время+)'}
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

                {/* НОВАЯ АДАПТИВНАЯ КАРТОЧНАЯ СЕТКА (1 колонка на моб, до 4 на ПК) */}
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
                              {/* СЛОТ 1 */}
                              <div className="flex gap-2">
                                <input
                                  type="time"
                                  value={currentData.time_ru_1}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'time_ru_1', e.target.value)}
                                  className="w-24 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-indigo-200 focus:border-indigo-500 focus:outline-none cursor-pointer text-center shadow-inner"
                                />
                                <select
                                  value={currentData.text_ru_1}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'text_ru_1', e.target.value)}
                                  className="flex-1 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none font-light cursor-pointer shadow-inner w-full"
                                >
                                  {NAKSHATRAS_RU.map(nak => <option key={nak} value={nak}>{nak || '— Слот 1 —'}</option>)}
                                </select>
                              </div>
                              {/* СЛОТ 2 */}
                              <div className="flex gap-2">
                                <input
                                  type="time"
                                  value={currentData.time_ru_2}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'time_ru_2', e.target.value)}
                                  className="w-24 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-indigo-200 focus:border-indigo-500 focus:outline-none cursor-pointer text-center shadow-inner"
                                />
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
                              {/* СЛОТ 1 */}
                              <div className="flex gap-2">
                                <input
                                  type="time"
                                  value={currentData.time_en_1}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'time_en_1', e.target.value)}
                                  className="w-24 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-purple-200 focus:border-indigo-500 focus:outline-none cursor-pointer text-center shadow-inner"
                                />
                                <select
                                  value={currentData.text_en_1}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'text_en_1', e.target.value)}
                                  className="flex-1 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none font-light cursor-pointer shadow-inner w-full"
                                >
                                  {NAKSHATRAS_EN.map(nak => <option key={nak} value={nak}>{nak || '— Slot 1 —'}</option>)}
                                </select>
                              </div>
                              {/* СЛОТ 2 */}
                              <div className="flex gap-2">
                                <input
                                  type="time"
                                  value={currentData.time_en_2}
                                  onChange={(e) => handleNakshatraGridChange(dateKey, 'time_en_2', e.target.value)}
                                  className="w-24 bg-[#080a0f] border border-gray-800/80 rounded-lg p-2.5 text-sm text-purple-200 focus:border-indigo-500 focus:outline-none cursor-pointer text-center shadow-inner"
                                />
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

          </div>
        )}
      </div>
    </div>
  );
}