"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

// --- ЛИНГВИСТИЧЕСКОЕ ЯДРО ---
const DICTIONARY: Record<string, Record<string, string>> = {
  RU: {
    nav_forecasts: "Прогнозы",
    nav_nakshatra: "Календарь накшатр",
    nav_retrograde: "Ретроградные планеты",
    nav_learn: "Публикации",
    hero_badge: "Космические ориентиры судьбы",
    hero_title_1: "Твой личный",
    hero_title_vector: "вектор",
    hero_title_2: "сквозь звезды",
    ephemeris_title: "Текущие транзиты",
    ephemeris_status: "LIVE",
    why_title: "Почему это работает",
    why_1_title: "Ясность ума",
    why_1_desc: "Снижение тревожности за счет понимания текущих планетарных циклов и их влияния.",
    why_2_title: "Точность действий",
    why_2_desc: "Синхронизация личных запусков и проектов с благоприятными астро-периодами.",
    why_3_title: "Отношения",
    why_3_desc: "Глубокое понимание динамики межличностных связей через призму совместимости.",
    why_4_title: "Высокая энергия",
    why_4_desc: "Сохранение внутреннего баланса и фокуса, избегая сопротивления глобальным энергиям.",
    grid_subtitle: "Инструменты",
    grid_title: "Астрологическая навигация",
    grid_1_title: "Ежедневный прогноз",
    grid_1_desc: "Короткие транзиты для ежедневного планирования и фокуса.",
    btn_1: "Открыть прогноз",
    grid_2_title: "Ежемесячный прогноз",
    grid_2_desc: "Глобальные тенденции и энергии на предстоящие 30 дней.",
    btn_2: "Открыть прогноз",
    grid_3_title: "Ежегодный прогноз",
    grid_3_desc: "Фундаментальные циклы, определяющие векторы развития года.",
    btn_3: "Открыть прогноз",
    footer_desc: "Интеллектуальная система анализа планетных энергий и транзитов. Мы переводим язык звезд на понятные ориентиры для твоей личной эффективности и осознанности.",
    footer_nav_title: "Модули",
    footer_access_title: "Доступ",
    footer_login: "Вход в терминал",
    footer_rights: "Все права защищены.",
    footer_slogan: "Создано в гармонии со вселенной",
    modal_telemetry: "Звездная телеметрия",
    modal_fallback: "Прогноз для данного периода еще не загружен в ядро. Ожидайте синхронизации.",
    planetarium_badge: "Собственная визуализация",
    planetarium_title: "Интерактивная сфера",
    planetarium_desc: "Введите город и точную дату рождения, чтобы ядро рассчитало карту звездного неба в тот момент.",
    calendar_title: "Календарь накшатр",
    calendar_time: "МСК (UTC+3)"
  },
  EN: {
    nav_forecasts: "Forecasts",
    nav_nakshatra: "Nakshatra Calendar",
    nav_retrograde: "Retrograde Planets",
    nav_learn: "Publications",
    hero_badge: "Cosmic destiny guides",
    hero_title_1: "Your personal",
    hero_title_vector: "vector",
    hero_title_2: "through the stars",
    ephemeris_title: "Current Transits",
    ephemeris_status: "LIVE",
    why_title: "Why it works",
    why_1_title: "Mental Clarity",
    why_1_desc: "Reducing anxiety by understanding current planetary cycles and their influence.",
    why_2_title: "Precision of Action",
    why_2_desc: "Synchronizing personal launches and projects with favorable astro-periods.",
    why_3_title: "Relationships",
    why_3_desc: "Deep understanding of interpersonal dynamics through the prism of compatibility.",
    why_4_title: "High Energy",
    why_4_desc: "Maintaining internal balance and focus, avoiding resistance to global energies.",
    grid_subtitle: "Instruments",
    grid_title: "Astrological Navigation",
    grid_1_title: "Daily Forecast",
    grid_1_desc: "Short transits for daily planning and focus.",
    btn_1: "Open Forecast",
    grid_2_title: "Monthly Forecast",
    grid_2_desc: "Global trends and energies for the upcoming 30 days.",
    btn_2: "Open Forecast",
    grid_3_title: "Yearly Forecast",
    grid_3_desc: "Fundamental cycles defining the development vectors of the year.",
    btn_3: "Open Forecast",
    footer_desc: "Intelligent system for analyzing planetary energies and transits. We translate the language of the stars into clear guidelines for your personal efficiency and awareness.",
    footer_nav_title: "Modules",
    footer_access_title: "Access",
    footer_login: "Terminal Login",
    footer_rights: "All rights reserved.",
    footer_slogan: "Created in harmony with the universe",
    modal_telemetry: "Stellar Telemetry",
    modal_fallback: "Forecast for this period has not been loaded into the core yet. Awaiting synchronization.",
    planetarium_badge: "Proprietary Visualization",
    planetarium_title: "Interactive Sphere",
    planetarium_desc: "Enter a city and exact birth date to let the core calculate the starfield map at that moment.",
    calendar_title: "Nakshatra Calendar",
    calendar_time: "MSK (UTC+3)"
  }
};

const LANGUAGES = [
  { code: 'RU', name: 'Русский' },
  { code: 'EN', name: 'English' }
];

const HeartLogo = ({ className = "w-10 h-10 md:w-12 md:h-12 transform hover:scale-105 transition-transform duration-500 drop-shadow-lg flex-shrink-0" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" strokeLinejoin="round">
      <polygon points="50,38 35,28 25,45 50,70 75,45 65,28" fill="#059669" />
      <polygon points="50,25 38,12 35,28 50,38" fill="#047857" />
      <polygon points="38,12 25,10 35,28" fill="#064e3b" />
      <polygon points="25,10 12,18 25,45 35,28" fill="#065f46" />
      <polygon points="12,18 5,35 25,45" fill="#022c22" />
      <polygon points="5,35 15,60 50,70 25,45" fill="#0f766e" />
      <polygon points="15,60 50,95 50,70" fill="#022c22" />
      <polygon points="50,25 62,12 65,28 50,38" fill="#047857" />
      <polygon points="62,12 75,10 65,28" fill="#10b981" />
      <polygon points="75,10 88,18 75,45 65,28" fill="#6ee7b7" />
      <polygon points="88,18 95,35 75,45" fill="#a7f3d0" />
      <polygon points="95,35 85,60 50,70 75,45" fill="#34d399" />
      <polygon points="85,60 50,95 50,70" fill="#059669" />
    </g>
  </svg>
);

const StarField = ({ seedKey }: { seedKey: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number, y: number, radius: number, vx: number, vy: number, alpha: number }[] = [];
    const numStars = window.innerWidth < 768 ? 60 : 150;
    let mouseX = -1000;
    let mouseY = -1000;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random()
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.x += star.vx;
        star.y += star.vy;

        star.alpha += (Math.random() - 0.5) * 0.02;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;

        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let offsetX = 0;
        let offsetY = 0;
        if (distance < 150) {
          offsetX = -dx * 0.05;
          offsetY = -dy * 0.05;
        }

        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${star.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distance = Math.sqrt(dx*dx + dy*dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 - distance/260})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [seedKey]);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 cursor-crosshair z-10" style={{ background: 'transparent' }} />;
};

const FlameIcon = () => (
  <svg className="w-6 h-6 text-[#059669] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const Icons = {
  Globe: () => (
    <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Telegram: () => (
    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  ),
  Instagram: () => (
    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
};

const DynamicNakshatraCalendar = ({ currentLang, t }: { currentLang: string, t: any }) => {
  const [date, setDate] = useState(new Date());
  const [dbData, setDbData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const year = date.getFullYear();
  const month = date.getMonth();

  const monthsRU = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'];
  const monthsEN = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const monthName = currentLang === 'RU' ? monthsRU[month] : monthsEN[month];
  const daysOfWeek = currentLang === 'RU' ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    async function fetchMonth() {
      setIsLoading(true);
      const y = year;
      const m = String(month + 1).padStart(2, '0');

      const lastDay = new Date(y, month + 1, 0).getDate();
      const startDate = `${y}-${m}-01`;
      const endDate = `${y}-${m}-${lastDay}`;

      const { data, error } = await supabase
        .from('nakshatras')
        .select('*')
        .gte('calendar_date', startDate)
        .lte('calendar_date', endDate);

      if (error) {
        console.error("Системный сбой при запросе матриц накшатр:", error);
      }

      const map: Record<string, any> = {};
      if (data) {
        data.forEach(item => {
          const dKey = item.calendar_date.split('T')[0];
          map[dKey] = item;
        });
      }
      setDbData(map);
      setIsLoading(false);
    }
    fetchMonth();
  }, [year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayOfWeek = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const cells = [];
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = 0; i < adjustedFirstDay; i++) {
    cells.push({ isEmpty: true, day: prevMonthDays - adjustedFirstDay + i + 1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = String(d).padStart(2, '0');
    const mStr = String(month + 1).padStart(2, '0');
    cells.push({ isEmpty: false, day: d, dateKey: `${year}-${mStr}-${dStr}` });
  }
  let nextMonthDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ isEmpty: true, day: nextMonthDay++ });
  }

  return (
    <div className="w-full bg-white border border-[#d0e5c0] rounded-xl overflow-hidden mt-4 shadow-sm relative z-10 flex flex-col">
      <div className="bg-[#ecf4e3] border-b border-[#d0e5c0] py-4 px-4 md:px-5 flex flex-col md:flex-row gap-4 justify-between items-center relative shrink-0">

        <div className="hidden md:flex items-center gap-2 text-sm md:text-lg font-['Cinzel',serif] font-bold tracking-[0.2em] text-[#112a1a] select-none">
          <HeartLogo className="w-7 h-7 md:w-9 md:h-9 transform hover:scale-105 transition-transform duration-500 drop-shadow-sm flex-shrink-0" />
          <span className="whitespace-nowrap">MIRA <span className="text-[#059669]">MAY</span></span>
        </div>

        <div className="flex items-center justify-between md:justify-center gap-4 bg-white px-2 py-1.5 rounded-xl border border-[#d0e5c0] shadow-sm w-full md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2">
           <button onClick={() => setDate(new Date(year, month - 1, 1))} className="text-[#059669] hover:text-[#112a1a] p-2 px-4 font-bold transition-colors text-lg active:scale-95">&larr;</button>
           <div className="flex flex-col items-center min-w-[120px]">
             <h4 className="text-sm md:text-lg font-bold font-['Cinzel',serif] text-[#112a1a] tracking-widest uppercase select-none">
               {monthName} {year}
             </h4>
             {isLoading && <span className="text-[9px] text-[#059669] animate-pulse uppercase font-bold tracking-widest absolute -bottom-4">Синхронизация...</span>}
           </div>
           <button onClick={() => setDate(new Date(year, month + 1, 1))} className="text-[#059669] hover:text-[#112a1a] p-2 px-4 font-bold transition-colors text-lg active:scale-95">&rarr;</button>
        </div>

        <div className="text-[10px] md:text-sm text-[#059669] uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-[#d0e5c0] font-bold md:ml-auto">
          {t.calendar_time}
        </div>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar pb-2">
        <div className="min-w-[768px] w-full flex flex-col">
          <div className="grid grid-cols-7 bg-[#e4eed8]">
            {daysOfWeek.map((d, i) => (
              <div key={d} className={`py-3 text-center text-xs md:text-sm font-bold uppercase tracking-wider border-b border-[#d0e5c0] ${i > 4 ? 'text-[#059669]' : 'text-[#4a6b52]'}`}>
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-[#ecf4e3]/50">
            {cells.map((cell, index) => {
              const isRu = currentLang === 'RU';
              let slot1 = '';
              let slot2 = '';

              if (!cell.isEmpty && cell.dateKey && dbData[cell.dateKey]) {
                const row = dbData[cell.dateKey];
                const times = (isRu ? row.nak_time_ru : row.nak_time_en)?.split('|') || [];
                const texts = (isRu ? row.data_ru : row.data_en)?.split('|') || [];

                const formatSlot = (text: string, time: string) => text ? `${text} \n${time ? `(с ${time})` : ''}`.trim() : '';
                const formatSlotEN = (text: string, time: string) => text ? `${text} \n${time ? `(at ${time})` : ''}`.trim() : '';

                slot1 = isRu ? formatSlot(texts[0], times[0]) : formatSlotEN(texts[0], times[0]);
                slot2 = isRu ? formatSlot(texts[1], times[1]) : formatSlotEN(texts[1], times[1]);
              }

              return (
                <div key={index} className={`min-h-[120px] md:min-h-[140px] p-2 md:p-3 border-b border-r border-[#d0e5c0] flex flex-col transition-colors ${!cell.isEmpty ? 'bg-white hover:bg-[#ecf4e3]' : 'bg-[#ecf4e3]/30 opacity-60'} ${(index + 1) % 7 === 0 ? 'border-r-0' : ''}`}>
                  <div className={`text-right text-sm md:text-base font-bold mb-2 ${!cell.isEmpty ? ((index % 7 > 4) ? 'text-[#059669]' : 'text-[#112a1a]') : 'text-[#4a6b52]'}`}>
                    {cell.day}
                  </div>

                  {!cell.isEmpty && (slot1 || slot2) && (
                    <div className="mt-auto flex flex-col gap-2">
                      {slot1 && (
                        <div className="text-[10px] md:text-xs leading-tight text-[#112a1a] font-semibold whitespace-pre-wrap break-words bg-[#e4eed8] p-2 rounded border border-[#d0e5c0]">
                          {slot1}
                        </div>
                      )}
                      {slot2 && (
                        <div className="text-[10px] md:text-xs leading-tight text-[#112a1a] font-semibold whitespace-pre-wrap break-words bg-[#e4eed8] p-2 rounded border border-[#059669]/30">
                          {slot2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [ephemerisData, setEphemerisData] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<any | null>(null);
  const [currentLang, setCurrentLang] = useState('RU');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isEphLoading, setIsEphLoading] = useState(true);

  // Параметры интерактивного неба с поддержкой точной даты
  const [cityInput, setCityInput] = useState("Tallinn, Estonia");
  const [dayInput, setDayInput] = useState("15");
  const [monthInput, setMonthInput] = useState("08");
  const [yearInput, setYearInput] = useState("2005");
  const [coordsOutput, setCoordsOutput] = useState("59°26'11\"N 24°45'19\"E");
  const [skySeed, setSkySeed] = useState("default-seed");

  const handleUpdateSky = (e: React.FormEvent) => {
    e.preventDefault();
    const randomLat = (Math.random() * 120 - 60).toFixed(2);
    const randomLon = (Math.random() * 360 - 180).toFixed(2);
    setCoordsOutput(`${Math.abs(Number(randomLat))}° ${randomLat >= 0 ? 'N' : 'S'}, ${Math.abs(Number(randomLon))}° ${randomLon >= 0 ? 'E' : 'W'}`);
    setSkySeed(cityInput + dayInput + monthInput + yearInput + Date.now());
  };

  const t = DICTIONARY[currentLang];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('mira_lang');
      if (savedLang) {
        setCurrentLang(savedLang);
      }
    }
  }, []);

  const handleLangChange = (code: string) => {
    setCurrentLang(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mira_lang', code);
    }
    setIsLangOpen(false);
  };

  useEffect(() => {
    async function fetchForecasts() {
      try {
        const { data, error } = await supabase.from('forecasts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) setForecasts(data);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      }
    }

    async function fetchEphemeris() {
      try {
        const res = await fetch('/api/ephemeris', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setEphemerisData(data);
        }
      } catch (err) {
        console.error('Ошибка телеметрии:', err);
      } finally {
        setIsEphLoading(false);
      }
    }

    fetchForecasts();
    fetchEphemeris();

    const intervalId = setInterval(() => {
      fetchEphemeris();
    }, 3 * 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOpenForecast = (periodType: string) => {
    const match = forecasts.find(f => f.type === periodType);

    if (match) {
      setActiveModal({
        period_type: periodType,
        title: match.title,
        date_str: match.date_str,
        content: match.content
      });
    } else {
      setActiveModal({ period_type: periodType, content: t.modal_fallback });
    }
  };

  const handleOpenRetrogrades = () => {
    const isRU = currentLang === 'RU';
    const tableContent = (
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-[#ecf4e3] border border-[#d0e5c0] rounded-xl py-3 px-4 md:px-5 flex justify-between items-center shadow-sm shrink-0">
          <div className="flex items-center gap-2 text-sm md:text-lg font-['Cinzel',serif] font-bold tracking-[0.2em] text-[#112a1a] select-none">
            <HeartLogo className="w-7 h-7 md:w-9 md:h-9 transform hover:scale-105 transition-transform duration-500 drop-shadow-sm flex-shrink-0" />
            <span className="whitespace-nowrap">MIRA <span className="text-[#059669]">MAY</span></span>
          </div>
          <div className="text-[10px] md:text-sm text-[#059669] uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-[#d0e5c0] font-bold">
            {isRU ? "БАЗА ТРАНЗИТОВ" : "TRANSITS BASE"}
          </div>
        </div>

        <div className="overflow-x-auto w-full relative z-10 custom-scrollbar pb-2">
          <table className="w-full text-left border-collapse min-w-[500px] bg-white rounded-xl shadow-sm">
            <thead>
              <tr className="border-b border-[#d0e5c0] text-[#059669] text-xs uppercase tracking-wider bg-[#ecf4e3]">
                <th className="py-4 px-4 font-bold">{isRU ? "Период (с - до)" : "Period"}</th>
                <th className="py-4 px-4 font-bold">{isRU ? "Планета" : "Planet"}</th>
                <th className="py-4 px-4 font-bold">{isRU ? "Транзит" : "Transit"}</th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base text-[#2d4a35] font-medium">
              <tr className="border-b border-[#d0e5c0] hover:bg-[#ecf4e3]/50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">11.11.2025 — 11.03.2026</td>
                <td className="py-4 px-4 text-[#112a1a] font-bold flex items-center gap-2">
                  <span className="text-[#059669] text-lg">♃</span> {isRU ? "Юпитер" : "Jupiter"}
                </td>
                <td className="py-4 px-4">{isRU ? "до 05.12.2025 — в Раке, после — в Близнецах" : "until 05.12.2025 in Cancer, then in Gemini"}</td>
              </tr>
              <tr className="border-b border-[#d0e5c0] hover:bg-[#ecf4e3]/50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">26.02.2026 — 20.03.2026</td>
                <td className="py-4 px-4 text-[#112a1a] font-bold flex items-center gap-2">
                  <span className="text-[#059669] text-lg">☿</span> {isRU ? "Меркурий" : "Mercury"}
                </td>
                <td className="py-4 px-4">{isRU ? "все это время он будет находиться в Водолее" : "in Aquarius the entire time"}</td>
              </tr>
              <tr className="border-b border-[#d0e5c0] hover:bg-[#ecf4e3]/50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">29.06.2026 — 23.07.2026</td>
                <td className="py-4 px-4 text-[#112a1a] font-bold flex items-center gap-2">
                  <span className="text-[#059669] text-lg">☿</span> {isRU ? "Меркурий" : "Mercury"}
                </td>
                <td className="py-4 px-4">{isRU ? "до 07.07.2026 — в Раке, после — в Близнецах" : "until 07.07.2026 in Cancer, then in Gemini"}</td>
              </tr>
              <tr className="border-b border-[#d0e5c0] hover:bg-[#ecf4e3]/50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">26.07.2026 — 10.12.2026</td>
                <td className="py-4 px-4 text-[#112a1a] font-bold flex items-center gap-2">
                  <span className="text-[#059669] text-lg">♄</span> {isRU ? "Сатурн" : "Saturn"}
                </td>
                <td className="py-4 px-4">{isRU ? "все это время он будет находиться в Рыбах" : "in Pisces the entire time"}</td>
              </tr>
              <tr className="border-b border-[#d0e5c0] hover:bg-[#ecf4e3]/50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">03.10.2026 — 14.11.2026</td>
                <td className="py-4 px-4 text-[#112a1a] font-bold flex items-center gap-2">
                  <span className="text-[#059669] text-lg">♀</span> {isRU ? "Венера" : "Venus"}
                </td>
                <td className="py-4 px-4">{isRU ? "до 05.11.2026 — в Весах, после — в Деве" : "until 05.11.2026 in Libra, then in Virgo"}</td>
              </tr>
              <tr className="border-b border-[#d0e5c0] hover:bg-[#ecf4e3]/50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">24.10.2026 — 13.11.2026</td>
                <td className="py-4 px-4 text-[#112a1a] font-bold flex items-center gap-2">
                  <span className="text-[#059669] text-lg">☿</span> {isRU ? "Меркурий" : "Mercury"}
                </td>
                <td className="py-4 px-4">{isRU ? "все это время он будет находиться в Весах" : "in Libra the entire time"}</td>
              </tr>
              <tr className="border-transparent hover:bg-[#ecf4e3]/50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">13.12.2026 — 13.04.2027</td>
                <td className="py-4 px-4 text-[#112a1a] font-bold flex items-center gap-2">
                  <span className="text-[#059669] text-lg">♃</span> {isRU ? "Юпитер" : "Jupiter"}
                </td>
                <td className="py-4 px-4">{isRU ? "до 24.01.2027 — во Льве, после — в Раке" : "until 24.01.2027 in Leo, then in Cancer"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
    setActiveModal({ period_type: 'retrograde', content: tableContent });
  };

  const handleOpenNakshatra = () => {
    setActiveModal({
      period_type: 'nakshatra',
      content: <DynamicNakshatraCalendar currentLang={currentLang} t={t} />
    });
  };

  const scrollToGrid = () => {
    document.getElementById('navigation-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#ecf4e3] text-[#2d4a35] font-['Montserrat',sans-serif] relative overflow-x-hidden selection:bg-[#059669] selection:text-white [-webkit-tap-highlight-color:transparent]">

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700;800&family=Montserrat:wght@300;400;500;600&display=swap');

        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(208, 229, 192, 0.3); border-radius: 4px; margin: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(5, 150, 105, 0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(5, 150, 105, 0.8); }

        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker 40s linear infinite;
          will-change: transform;
        }
        .animate-ticker:hover { animation-play-state: paused; }
      `}} />

      {isLangOpen && <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />}

      <div className="w-full bg-[#ecf4e3]/90 backdrop-blur-xl border-b border-[#d0e5c0] relative z-50 shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center py-3 px-4 md:px-8">

          <div className="text-lg md:text-2xl font-['Cinzel',serif] font-bold tracking-[0.2em] md:tracking-[0.3em] text-[#112a1a] flex items-center gap-3">
            <HeartLogo />
            <span><span className="text-[#059669]">MIRA</span> MAY</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 text-[#4a6b52] hover:text-[#059669] text-xs md:text-sm font-bold tracking-wider transition-colors duration-300 py-1.5 px-2.5 rounded-lg border border-[#d0e5c0] bg-white/50"
            >
              <Icons.Globe /> {currentLang}
            </button>

            {isLangOpen && (
              <div className="absolute top-full right-0 mt-3 w-40 bg-white border border-[#d0e5c0] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-2 animate-fade-in-up">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`w-full text-left px-5 py-2.5 text-sm transition-all duration-200 ${
                      currentLang === lang.code
                        ? 'text-[#059669] bg-[#ecf4e3] font-bold'
                        : 'text-[#2d4a35] hover:text-[#059669] hover:bg-[#ecf4e3]/50'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full py-16 md:py-32 flex flex-col items-center justify-center overflow-hidden text-center px-4 bg-[#0a1f14]">

        <img
          src="/images/hero-bg2.jpg"
          alt="Aurora Header"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#ecf4e3] to-transparent" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[80%] bg-[#ecf4e3]/80 blur-[100px] rounded-[100%] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-block px-4 py-1.5 mb-5 md:mb-6 rounded-full border border-[#059669]/40 bg-[#ecf4e3]/90 text-[#059669] text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold shadow-sm backdrop-blur-md">
            {t.hero_badge}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Cinzel',serif] font-extrabold text-[#112a1a] leading-[1.15] tracking-wide uppercase px-2 drop-shadow-[0_0_15px_rgba(236,244,227,0.8)]">
            {t.hero_title_1} <br className="hidden md:block"/>
            <span className="text-[#059669] drop-shadow-none">{t.hero_title_vector}</span> {t.hero_title_2}
          </h1>
        </div>
      </div>

      <div className="w-full bg-[#e4eed8] border-y border-[#d0e5c0] py-3 overflow-hidden relative flex items-center shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-[#e4eed8] via-[#e4eed8] to-transparent w-28 md:w-40 flex items-center px-4 md:px-8 border-r border-[#d0e5c0]/50">
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-[#059669] font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              {t.ephemeris_status}
            </span>
            <span className="text-[10px] md:text-xs text-[#4a6b52] uppercase tracking-wider hidden sm:block mt-0.5 font-bold">{t.ephemeris_title}</span>
          </div>
        </div>

        <div className="overflow-hidden w-full pl-28 md:pl-40">
          {isEphLoading ? (
            <div className="text-[#059669]/50 text-xs uppercase tracking-widest pl-4 font-bold animate-pulse py-2">
              СИНХРОНИЗАЦИЯ...
            </div>
          ) : (
            <div className="animate-ticker flex gap-8 md:gap-12 items-center cursor-default">
              {[...ephemerisData, ...ephemerisData, ...ephemerisData].map((planet, index) => (
                <div key={index} className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-lg md:text-xl text-[#059669] font-bold">{planet.symbol}</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs text-[#4a6b52] uppercase tracking-wider font-bold">
                      {currentLang === 'RU' ? planet.nameRu : planet.name}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-[#112a1a] flex items-center gap-1">
                      <span className="text-[#059669]">{planet.sign}</span> {planet.degree}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-[#e4eed8] to-transparent w-12 md:w-24"></div>
      </div>

      <nav className="w-full bg-[#ecf4e3] border-b border-[#d0e5c0] sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap justify-center items-center gap-x-6 gap-y-3 md:gap-16 px-4 py-4 md:py-5 text-[10px] md:text-xs uppercase tracking-[0.15em] text-[#4a6b52] font-bold">
          <button onClick={scrollToGrid} className="hover:text-[#059669] transition-colors duration-300 text-center">{t.nav_forecasts}</button>
          <button onClick={handleOpenNakshatra} className="hover:text-[#059669] transition-colors duration-300 text-center">{t.nav_nakshatra}</button>
          <button onClick={handleOpenRetrogrades} className="hover:text-[#059669] transition-colors duration-300 text-center">{t.nav_retrograde}</button>
          <a href="/articles" className="hover:text-[#059669] transition-colors duration-300 text-center">{t.nav_learn}</a>
        </div>
      </nav>

      <section className="py-20 md:py-32 px-4 relative z-10 overflow-hidden bg-[#ecf4e3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-['Cinzel',serif] font-bold text-[#112a1a] tracking-wide uppercase">{t.why_title}</h2>
            <div className="w-12 h-[2px] bg-[#059669]/50 mx-auto mt-6"></div>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8">
            <div className="flex flex-col gap-10 md:gap-16 w-full lg:w-1/3 order-2 lg:order-1 px-4">
              <div className="flex flex-col items-center lg:items-end text-center lg:text-right group">
                <FlameIcon />
                <h4 className="text-[#112a1a] font-['Cinzel',serif] font-bold mt-4 mb-2 text-xl md:text-2xl tracking-wide">{t.why_1_title}</h4>
                <p className="text-[#2d4a35] text-sm md:text-base font-medium leading-relaxed">{t.why_1_desc}</p>
              </div>
              <div className="flex flex-col items-center lg:items-end text-center lg:text-right group">
                <FlameIcon />
                <h4 className="text-[#112a1a] font-['Cinzel',serif] font-bold mt-4 mb-2 text-xl md:text-2xl tracking-wide">{t.why_2_title}</h4>
                <p className="text-[#2d4a35] text-sm md:text-base font-medium leading-relaxed">{t.why_2_desc}</p>
              </div>
            </div>

            <div className="w-64 h-64 md:w-[450px] md:h-[450px] rounded-full p-2 border border-[#059669]/30 relative order-1 lg:order-2 flex-shrink-0 shadow-lg bg-white">
              <div className="absolute inset-0 rounded-full border border-[#059669]/20 animate-[spin_10s_linear_infinite]" style={{ margin: '-10px' }}></div>
              <img
                src="/imsges/gulmira2.jpg"
                alt="Arina Nature"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(236,244,227,0.8)] pointer-events-none"></div>
            </div>

            <div className="flex flex-col gap-10 md:gap-16 w-full lg:w-1/3 order-3 px-4">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left group">
                <FlameIcon />
                <h4 className="text-[#112a1a] font-['Cinzel',serif] font-bold mt-4 mb-2 text-xl md:text-2xl tracking-wide">{t.why_3_title}</h4>
                <p className="text-[#2d4a35] text-sm md:text-base font-medium leading-relaxed">{t.why_3_desc}</p>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left group">
                <FlameIcon />
                <h4 className="text-[#112a1a] font-['Cinzel',serif] font-bold mt-4 mb-2 text-xl md:text-2xl tracking-wide">{t.why_4_title}</h4>
                <p className="text-[#2d4a35] text-sm md:text-base font-medium leading-relaxed">{t.why_4_desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ИНТЕРАКТИВНАЯ СФЕРА С ПОЛЕМ ГОРОДА И ДАТЫ --- */}
      <section className="py-20 md:py-24 px-4 relative z-10 overflow-hidden bg-[#e4eed8] border-y border-[#d0e5c0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <div className="text-[#059669] text-[10px] md:text-xs uppercase tracking-[0.25em] mb-3 font-bold">{t.planetarium_badge}</div>
            <h2 className="text-2xl md:text-4xl font-['Cinzel',serif] font-bold text-[#112a1a] tracking-wide uppercase">{t.planetarium_title}</h2>
            <div className="w-12 h-[2px] bg-[#059669]/50 mx-auto mt-6"></div>
            <p className="text-[#2d4a35] mt-6 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
              {t.planetarium_desc}
            </p>

            {/* ПАНЕЛЬ ВВОДА ГОРОДА И ДАТЫ (ДЕНЬ, МЕСЯЦ, ГОД) */}
            <form onSubmit={handleUpdateSky} className="mt-6 flex flex-col md:flex-row justify-center items-center gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Город..."
                className="bg-white border border-[#d0e5c0] rounded-xl px-4 py-2.5 text-sm text-[#112a1a] focus:outline-none focus:border-[#059669] shadow-sm w-full md:flex-1 font-medium"
              />
              <div className="flex gap-2 w-full md:w-auto justify-center">
                <input
                  type="text"
                  value={dayInput}
                  onChange={(e) => setDayInput(e.target.value)}
                  placeholder="ДД"
                  maxLength={2}
                  className="bg-white border border-[#d0e5c0] rounded-xl px-2 py-2.5 text-sm text-[#112a1a] focus:outline-none focus:border-[#059669] shadow-sm w-14 font-medium text-center"
                />
                <input
                  type="text"
                  value={monthInput}
                  onChange={(e) => setMonthInput(e.target.value)}
                  placeholder="ММ"
                  maxLength={2}
                  className="bg-white border border-[#d0e5c0] rounded-xl px-2 py-2.5 text-sm text-[#112a1a] focus:outline-none focus:border-[#059669] shadow-sm w-14 font-medium text-center"
                />
                <input
                  type="text"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  placeholder="ГГГГ"
                  maxLength={4}
                  className="bg-white border border-[#d0e5c0] rounded-xl px-2 py-2.5 text-sm text-[#112a1a] focus:outline-none focus:border-[#059669] shadow-sm w-20 font-medium text-center"
                />
              </div>
              <button
                type="submit"
                className="bg-[#059669] text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-[#047857] transition-all shadow-sm active:scale-95 w-full md:w-auto"
              >
                Синхронизировать
              </button>
            </form>
          </div>

          <div className="relative w-full aspect-[4/3] md:aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-[#059669]/30 shadow-[0_0_30px_rgba(5,150,105,0.15)] group bg-gradient-to-br from-[#021c0e] to-[#0a2e18]">

            <StarField seedKey={skySeed} />

            <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 z-20 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_#10b981]"></div>
              <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-[#a7f3d0] font-bold">CORE ACTIVE</div>
            </div>

            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col items-end gap-1 text-[8px] md:text-[10px] text-[#6ee7b7] tracking-widest font-mono pointer-events-none font-bold">
              <span className="text-[#a7f3d0]">LOC: {cityInput.toUpperCase()} ({dayInput}.{monthInput}.{yearInput})</span>
              <span>COORD: {coordsOutput}</span>
            </div>

            <div className="absolute top-4 right-4 md:top-6 md:right-6 text-[8px] md:text-[10px] text-[#10b981] tracking-widest font-mono pointer-events-none font-bold">
              MIRA MAY ENGINE
            </div>
          </div>
        </div>
      </section>
      {/* ---------------------------------------------------------------------- */}

      <section id="navigation-grid" className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto relative z-10 bg-[#ecf4e3]">
        <div className="text-center mb-16 md:mb-24">
            <div className="text-[#059669] text-[10px] md:text-xs uppercase tracking-[0.25em] mb-3 font-bold">{t.grid_subtitle}</div>
            <h2 className="text-3xl md:text-5xl font-['Cinzel',serif] font-bold text-[#112a1a] tracking-wide uppercase">{t.grid_title}</h2>
            <div className="w-12 h-[2px] bg-[#059669]/50 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">

          <div className="group bg-white p-8 md:p-10 rounded-[2rem] border border-[#d0e5c0] transition-all duration-500 hover:border-[#059669] hover:shadow-[0_15px_30px_rgba(5,150,105,0.1)] flex flex-col relative overflow-hidden">
            <div className="mb-6 md:mb-8 text-[#059669] text-4xl font-light">☽</div>
            <h3 className="text-2xl font-['Cinzel',serif] font-bold mb-4 text-[#112a1a] tracking-wide">{t.grid_1_title}</h3>
            <p className="text-[#4a6b52] mb-8 leading-relaxed text-sm md:text-base font-medium flex-grow">{t.grid_1_desc}</p>
            <button
              onClick={() => handleOpenForecast('daily')}
              className="w-full bg-[#ecf4e3] text-[#059669] border border-[#d0e5c0] py-3.5 rounded-xl group-hover:bg-[#059669] group-hover:text-white group-hover:border-[#059669] transition-all duration-300 text-xs uppercase tracking-wider font-bold"
            >
              {t.btn_1}
            </button>
          </div>

          <div className="group bg-white p-8 md:p-10 rounded-[2rem] border border-[#d0e5c0] transition-all duration-500 hover:border-[#059669] hover:shadow-[0_15px_30px_rgba(5,150,105,0.1)] flex flex-col relative overflow-hidden">
            <div className="mb-6 md:mb-8 text-[#059669] text-4xl font-light">☀</div>
            <h3 className="text-2xl font-['Cinzel',serif] font-bold mb-4 text-[#112a1a] tracking-wide">{t.grid_2_title}</h3>
            <p className="text-[#4a6b52] mb-8 leading-relaxed text-sm md:text-base font-medium flex-grow">{t.grid_2_desc}</p>
            <button
              onClick={() => handleOpenForecast('monthly')}
              className="w-full bg-[#ecf4e3] text-[#059669] border border-[#d0e5c0] py-3.5 rounded-xl group-hover:bg-[#059669] group-hover:text-white group-hover:border-[#059669] transition-all duration-300 text-xs uppercase tracking-wider font-bold"
            >
              {t.btn_2}
            </button>
          </div>

          <div className="group bg-white p-8 md:p-10 rounded-[2rem] border border-[#d0e5c0] transition-all duration-500 hover:border-[#059669] hover:shadow-[0_15px_30px_rgba(5,150,105,0.1)] flex flex-col relative overflow-hidden">
            <div className="mb-6 md:mb-8 text-[#059669] text-4xl font-light">♃</div>
            <h3 className="text-2xl font-['Cinzel',serif] font-bold mb-4 text-[#112a1a] tracking-wide">{t.grid_3_title}</h3>
            <p className="text-[#4a6b52] mb-8 leading-relaxed text-sm md:text-base font-medium flex-grow">{t.grid_3_desc}</p>
            <button
              onClick={() => handleOpenForecast('yearly')}
              className="w-full bg-[#ecf4e3] text-[#059669] border border-[#d0e5c0] py-3.5 rounded-xl group-hover:bg-[#059669] group-hover:text-white group-hover:border-[#059669] transition-all duration-300 text-xs uppercase tracking-wider font-bold"
            >
              {t.btn_3}
            </button>
          </div>

        </div>
      </section>

      <footer id="contacts" className="bg-[#e4eed8] border-t border-[#d0e5c0] pt-16 md:pt-24 pb-12 px-6 relative z-10 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#059669]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16 md:mb-20">
            <div className="md:col-span-2 space-y-6">
              <div className="text-xl md:text-2xl font-['Cinzel',serif] font-bold tracking-[0.2em] text-[#112a1a] flex items-center gap-3">
                <HeartLogo />
                <span><span className="text-[#059669]">MIRA</span> MAY</span>
              </div>
              <p className="text-[#4a6b52] text-sm leading-relaxed max-w-sm font-medium">
                {t.footer_desc}
              </p>
              <div className="flex gap-4 pt-2">
                <a href="https://t.me/твой_канал" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white border border-[#d0e5c0] flex items-center justify-center text-[#059669] hover:text-white hover:bg-[#059669] hover:border-[#059669] hover:shadow-md active:scale-95 transition-all duration-300">
                  <Icons.Telegram />
                </a>
                <a href="https://instagram.com/твой_профиль" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white border border-[#d0e5c0] flex items-center justify-center text-[#059669] hover:text-white hover:bg-[#059669] hover:border-[#059669] hover:shadow-md active:scale-95 transition-all duration-300">
                  <Icons.Instagram />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#112a1a] font-bold mb-6">{t.footer_nav_title}</h4>
              <ul className="space-y-4 text-sm font-bold text-[#4a6b52]">
                <li><button onClick={scrollToGrid} className="hover:text-[#059669] transition-colors duration-300">{t.nav_forecasts}</button></li>
                <li><button onClick={handleOpenNakshatra} className="hover:text-[#059669] transition-colors duration-300">{t.nav_nakshatra}</button></li>
                <li><button onClick={handleOpenRetrogrades} className="hover:text-[#059669] transition-colors duration-300">{t.nav_retrograde}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-[#112a1a] font-bold mb-6">{t.footer_access_title}</h4>
              <ul className="space-y-4 text-sm font-bold text-[#4a6b52]">
                <li>
                  <a href="/admin" className="hover:text-[#059669] transition-colors duration-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
                    {t.footer_login}
                  </a>
                </li>
                <li className="text-xs text-[#4a6b52]/70 font-medium">System v6.9.1 (Dynamic Dual Core)</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#d0e5c0] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#4a6b52] gap-4 font-bold">
            <div>&copy; {new Date().getFullYear()} MIRA MAY. {t.footer_rights}</div>
            <div className="tracking-[0.1em] uppercase text-[10px] text-center md:text-right">{t.footer_slogan}</div>
          </div>
        </div>
      </footer>

      {/* --- ГЛОБАЛЬНЫЙ КОНТЕЙНЕР МОДАЛЬНОГО ОКНА --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#112a1a]/40 backdrop-blur-md transition-all duration-300">

          <div className="bg-white border border-[#d0e5c0] rounded-2xl md:rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col relative z-10 shadow-2xl animate-fade-in-up overflow-hidden">

            <div className="px-6 py-5 md:px-10 md:py-8 border-b border-[#d0e5c0] flex justify-between items-start bg-white z-20 shrink-0">
              <div className="pr-4">
                {activeModal.date_str && (
                   <div className="text-[#059669] text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 font-bold">{activeModal.date_str}</div>
                )}
                {!activeModal.date_str && (
                   <div className="text-[#059669] text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 font-bold">{t.modal_telemetry}</div>
                )}

                <h3 className="text-2xl md:text-4xl font-['Cinzel',serif] font-bold text-[#112a1a] tracking-wide">
                  {activeModal.title ? activeModal.title : (
                    activeModal.period_type === 'daily' ? t.grid_1_title :
                    activeModal.period_type === 'monthly' ? t.grid_2_title :
                    activeModal.period_type === 'yearly' ? t.grid_3_title :
                    activeModal.period_type === 'retrograde' ? t.nav_retrograde :
                    activeModal.period_type === 'nakshatra' ? t.calendar_title : 'Прогноз'
                  )}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 shrink-0 rounded-full bg-[#ecf4e3] border border-[#d0e5c0] flex items-center justify-center text-[#4a6b52] hover:bg-[#059669] hover:text-white hover:border-[#059669] active:scale-90 transition-all text-xl font-bold shadow-sm"
              >
                &times;
              </button>
            </div>

            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
              <div className="text-[#2d4a35] text-sm md:text-lg leading-relaxed md:leading-loose whitespace-pre-wrap font-medium">
                {activeModal.content}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}