"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// --- ЛИНГВИСТИЧЕСКОЕ ЯДРО (только UI) ---
const DICTIONARY: Record<string, Record<string, any>> = {
  RU: {
    back: "На главную",
    read_more: "Следующие материалы",
    all_articles: "Все публикации",
    library_title: "Публикации",
    library_subtitle: "Исследуйте мудрость ведической астрологии, космические циклы и принципы гармонии.",
    tabs: [
      { id: "nakshatras", name: "Накшатры" },
      { id: "horoscopes", name: "Гороскопы личностей" },
      { id: "articles", name: "Статьи" }
    ],
    empty_state: "В этом разделе пока нет опубликованных материалов."
  },
  EN: {
    back: "To Main",
    read_more: "Next Materials",
    all_articles: "All Publications",
    library_title: "Publications",
    library_subtitle: "Explore the wisdom of Vedic astrology, cosmic cycles, and harmony principles.",
    tabs: [
      { id: "nakshatras", name: "Nakshatras" },
      { id: "horoscopes", name: "Famous Horoscopes" },
      { id: "articles", name: "Articles" }
    ],
    empty_state: "There are no published materials in this section yet."
  }
};

const LANGUAGES = [
  { code: 'RU', name: 'Русский' },
  { code: 'EN', name: 'English' }
];

const HeartLogo = () => (
  <svg className="w-7 h-7 sm:w-9 sm:h-9 transform hover:scale-105 transition-transform duration-500 drop-shadow-lg flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const GlobeIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Утилита для динамического перевода категорий
const getCategoryName = (cat: string, lang: string) => {
  if (lang === 'RU') {
    switch(cat) {
      case 'nakshatras': return 'Накшатры';
      case 'horoscopes': return 'Гороскопы';
      case 'articles': return 'Статьи';
      case 'ayurveda': return 'Статьи'; // Fallback для старых записей
      default: return cat;
    }
  } else {
    switch(cat) {
      case 'nakshatras': return 'Nakshatras';
      case 'horoscopes': return 'Horoscopes';
      case 'articles': return 'Articles';
      case 'ayurveda': return 'Articles'; // Fallback для старых записей
      default: return cat;
    }
  }
};

export default function ArticlesPage() {
  const [currentLang, setCurrentLang] = useState('RU');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('nakshatras');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const [dbArticles, setDbArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('mira_lang');
      if (savedLang) setCurrentLang(savedLang);
    }
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setDbArticles(data);
    } else if (error) {
      console.error("Ошибка загрузки статей:", error.message);
    }
    setIsLoading(false);
  }

  const handleLangChange = (code: string) => {
    setCurrentLang(code);
    if (typeof window !== 'undefined') localStorage.setItem('mira_lang', code);
    setIsLangOpen(false);
  };

  const t = DICTIONARY[currentLang];

  const filteredArticles = dbArticles.filter(art => art.category === activeTab || (activeTab === 'articles' && art.category === 'ayurveda'));
  const selectedDbArticle = dbArticles.find(art => art.id === selectedArticleId);

  return (
    <div className="min-h-screen bg-[#ecf4e3] text-[#2d4a35] font-['Montserrat',sans-serif] selection:bg-[#059669] selection:text-white [-webkit-tap-highlight-color:transparent] relative">

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700;800&family=Montserrat:wght@300;400;500;600&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(208, 229, 192, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(5, 150, 105, 0.4); border-radius: 10px; }
      `}} />

      {isLangOpen && <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />}

      <header className="sticky top-0 z-50 w-full bg-[#ecf4e3]/90 backdrop-blur-xl border-b border-[#d0e5c0] px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          {selectedArticleId ? (
            <button onClick={() => setSelectedArticleId(null)} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#d0e5c0] flex items-center justify-center text-[#4a6b52] hover:bg-[#059669] hover:text-white hover:border-[#059669] transition-all shadow-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
          ) : (
            <a href="/" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#d0e5c0] flex items-center justify-center text-[#4a6b52] hover:bg-[#059669] hover:text-white hover:border-[#059669] transition-all shadow-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </a>
          )}
          <span className="text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold text-[#4a6b52] hidden sm:block">
            {selectedArticleId ? t.back : t.back}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1.5 text-[#4a6b52] hover:text-[#059669] text-xs md:text-sm font-bold tracking-wider transition-colors duration-300 py-1.5 px-2.5 rounded-lg border border-[#d0e5c0] bg-white/50">
              <GlobeIcon /> {currentLang}
            </button>
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-3 w-40 bg-white border border-[#d0e5c0] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-2 animate-fade-in-up">
                {LANGUAGES.map(lang => (
                  <button key={lang.code} onClick={() => handleLangChange(lang.code)} className={`w-full text-left px-5 py-2.5 text-sm transition-all duration-200 ${currentLang === lang.code ? 'text-[#059669] bg-[#ecf4e3] font-bold' : 'text-[#2d4a35] hover:text-[#059669] hover:bg-[#ecf4e3]/50'}`}>
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="text-sm sm:text-base md:text-lg font-['Cinzel',serif] font-bold tracking-[0.2em] text-[#112a1a] flex items-center gap-2">
            <HeartLogo />
            <span>MIRA <span className="text-[#059669]">MAY</span></span>
          </div>
        </div>
      </header>

      {!selectedArticleId ? (
        <div className="flex flex-col w-full">
          {/* ТЕМНО-ЗЕЛЕНАЯ ШАПКА ДЛЯ СЛОВА "ПУБЛИКАЦИИ" */}
          <section className="w-full bg-gradient-to-br from-[#021c0e] to-[#0a2e18] border-b border-[#059669]/30 py-16 md:py-24 relative overflow-hidden flex justify-center items-center shadow-inner">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#059669] via-transparent to-transparent pointer-events-none"></div>

            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-bold text-white uppercase tracking-widest mb-4 drop-shadow-[0_0_20px_rgba(5,150,105,0.6)]">
                {t.library_title}
              </h1>
              <p className="text-sm md:text-base text-[#a7f3d0] font-medium leading-relaxed">
                {t.library_subtitle}
              </p>
            </div>
          </section>

          {/* КОНТЕЙНЕР СО СТАТЬЯМИ */}
          <main className="max-w-[1200px] w-full mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {t.tabs.map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#059669] text-white shadow-md'
                      : 'bg-white text-[#4a6b52] border border-[#d0e5c0] hover:border-[#059669]'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="text-center py-20 text-[#059669] font-bold animate-pulse tracking-widest uppercase">
                Синхронизация с базой данных...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.length === 0 ? (
                   <p className="text-center col-span-2 text-[#4a6b52] italic py-10">{t.empty_state}</p>
                ) : (
                  filteredArticles.map((art: any) => (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className="group bg-white border border-[#d0e5c0] rounded-3xl p-8 hover:border-[#059669] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between animate-fade-in-up"
                    >
                      <div>
                        <div className="flex justify-between items-center text-[10px] text-[#059669] uppercase tracking-widest font-bold mb-3">
                          <span>{getCategoryName(art.category, currentLang)}</span>
                          <span>{art.date_str}</span>
                        </div>
                        <h3 className="text-xl font-['Cinzel',serif] font-bold text-[#112a1a] group-hover:text-[#059669] transition-colors mb-3 leading-snug">
                          {art.title}
                        </h3>
                        <p className="text-xs md:text-sm text-[#4a6b52] font-medium leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-[#ecf4e3] flex items-center justify-between text-xs font-bold text-[#059669]">
                        <span>{art.read_time}</span>
                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Читать →</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      ) : (
        <main className="max-w-[900px] mx-auto flex flex-col pt-28 md:pt-36 px-4 md:px-8 pb-24">
          {selectedDbArticle && (
            <article className="w-full animate-fade-in-up">
              <header className="mb-10 sm:mb-14">
                <div className="inline-block px-3 py-1 mb-4 rounded-full border border-[#059669]/20 bg-[#059669]/10 text-[#059669] text-[9px] sm:text-xs uppercase tracking-widest font-bold">
                  {getCategoryName(selectedDbArticle.category, currentLang)}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-['Cinzel',serif] font-bold text-[#112a1a] leading-[1.25] tracking-wide mb-4">
                  {selectedDbArticle.title}
                </h1>
                <div className="text-sm font-semibold text-[#4a6b52] mb-8">{selectedDbArticle.date_str} • {selectedDbArticle.read_time}</div>

                {selectedDbArticle.image_url && (
                   <img src={selectedDbArticle.image_url} alt="Обложка" className="w-full h-auto max-h-[500px] object-cover rounded-3xl shadow-lg mb-10 border border-[#d0e5c0]" />
                )}
              </header>

              <div className="text-sm sm:text-base md:text-lg leading-[1.8] font-medium text-[#2d4a35] whitespace-pre-wrap">
                {selectedDbArticle.content}
              </div>

              <section className="mt-20 pt-12 border-t border-[#d0e5c0]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-3">
                  <button onClick={() => setSelectedArticleId(null)} className="px-8 py-4 bg-[#059669] text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-[#047857] transition-colors shadow-md">
                    ← {t.all_articles}
                  </button>
                </div>
              </section>
            </article>
          )}
        </main>
      )}
    </div>
  );
}