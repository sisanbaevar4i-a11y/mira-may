"use client";

import React, { useState, useEffect } from 'react';

// --- ЛИНГВИСТИЧЕСКОЕ ЯДРО ---
const DICTIONARY: Record<string, Record<string, any>> = {
  RU: {
    back: "Библиотека знаний",
    toc: "Оглавление",
    read_more: "Следующие материалы",
    all_articles: "Вся библиотека",
    library_title: "Библиотека знаний",
    library_subtitle: "Исследуйте мудрость ведической астрологии, космические циклы и принципы гармонии.",
    tabs: [
      { id: "nakshatras", name: "Накшатры" },
      { id: "horoscopes", name: "Гороскопы личностей" },
      { id: "ayurveda", name: "Аюрведа" }
    ],
    articles: {
      nakshatras: [
        {
          id: "swati",
          title: "Накшатра Свати: Энергия Свободы, Ветра и Звезды Арктур",
          date: "24 Июля 2026",
          readTime: "6 мин чтения",
          excerpt: "В ведической астрологии Свати — 15-я накшатра в созвездии Весов. Её символ — молодой росток, гнущийся под порывами ветра.",
          category: "Накшатры"
        },
        {
          id: "ashvini",
          title: "Накшатра Ашвини: Импульс начала и жажда скорости",
          date: "20 Июля 2026",
          readTime: "5 мин чтения",
          excerpt: "Первая накшатра зодиакального круга, несущая энергию исцеления, быстрого старта и божественных врачей.",
          category: "Накшатры"
        }
      ],
      horoscopes: [
        {
          id: "einstein",
          title: "Космический код гения: Анализ гороскопа Альберта Эйнштейна",
          date: "15 Июля 2026",
          readTime: "8 мин чтения",
          excerpt: "Как расположение планет и сильные дома гороскопа сформировали мышление великого физика.",
          category: "Гороскопы личностей"
        }
      ],
      ayurveda: [
        {
          id: "doshas",
          title: "Три доши в повседневной жизни: Баланс Ваты, Питы и Капхи",
          date: "10 Июля 2026",
          readTime: "7 мин чтения",
          excerpt: "Фундаментальные принципы аюрведической конституции тела и методы поддержания внутренней гармонии.",
          category: "Аюрведа"
        }
      ]
    },
    article: {
      title: "Накшатра Свати: Энергия Свободы, Ветра и Звезды Арктур",
      category: "Накшатры",
      sections: [
        {
          id: "intro",
          title: "Введение",
          content: (
            <div className="space-y-6 drop-cap">
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#112a1a] leading-relaxed font-['Cinzel',serif]">
                В ведической астрологии Свати — 15-я накшатра, расположенная в созвездии Весов. Её астрономическим ориентиром выступает Арктур (Альфа Волопаса) — одна из самых ярких и величественных звёзд ночного неба. В переводе с санскрита «Свати» означает «собственное я», «самостоятельная» или «меч».
              </p>
              <p className="border-l-2 border-[#059669] pl-4 sm:pl-6 ml-1 sm:ml-2 text-[#2d4a35] font-medium text-sm sm:text-base">
                Символом этой накшатры является молодой росток, гнущийся под порывами ветра, а её управляющим божеством выступает Ваю — бог ветра и жизненной силы. Это сочетание даёт людям, рождённым под влиянием Свати, невероятную подвижность, интеллект и неординарный жизненный путь.
              </p>
            </div>
          )
        },
        {
          id: "independence",
          title: "1. Самостоятельный одиночка",
          content: (
            <div className="space-y-6">
              <p className="text-[#2d4a35] text-sm sm:text-base">
                Главная движущая сила Свати — это жажда абсолютной свободы. Людям, связанным с этой накшатрой, жизненно необходимо чувствовать себя хозяевами собственного времени, решений и судьбы.
              </p>
              <ul className="space-y-4 sm:space-y-6 mt-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#d0e5c0] shadow-sm">
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Дух автономности:</strong> <span className="text-[#2d4a35]">Свати тяжело переносят жёсткий контроль, рамки и чужое давление. Они предпочитают прокладывать собственную тропу, даже если она проходит вдали от проторенных дорог.</span>
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Природа одиночки:</strong> <span className="text-[#2d4a35]">Несмотря на то, что Свати умеют быть приятными в общении, внутри них всегда остаётся обособленное пространство. Они вполне комфортно чувствуют себя наедине с собой.</span>
                </li>
              </ul>
            </div>
          )
        },
        {
          id: "adaptation",
          title: "2. Искусство адаптации",
          content: (
            <div className="space-y-6">
              <p className="text-[#2d4a35] text-sm sm:text-base">
                Росток, подчиняющийся ветру, не ломается — он гнётся, уклоняется и продолжает расти. В этом заключается уникальная суперсила Свати.
              </p>
              <ul className="space-y-4 sm:space-y-6 mt-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#d0e5c0] shadow-sm">
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Гибкость в любых ситуациях:</strong> <span className="text-[#2d4a35]">Энергия ветра наделяет Свати умением мгновенно подстраиваться под меняющиеся обстоятельства и считывать правила игры.</span>
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Дипломатичность:</strong> <span className="text-[#2d4a35]">Находясь под влиянием знака Весов, они обладают чарующей манерой общения, избегая конфликтов благодаря гибкому уму и такту.</span>
                </li>
              </ul>
            </div>
          )
        },
        {
          id: "talents",
          title: "3. Многогранный талант",
          content: (
            <div className="space-y-6">
              <p className="text-[#2d4a35] text-sm sm:text-base">
                Арктур дарует людям Свати яркую искру и выраженную индивидуальность в сферах интеллекта и эстетики:
              </p>
              <ul className="space-y-4 sm:space-y-6 mt-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#d0e5c0] shadow-sm">
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Мастерство слова:</strong> <span className="text-[#2d4a35]">Свати умеют убеждать, преподносить идеи и находить общий язык с самыми разными людьми. Отличные стратеги и ораторы.</span>
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Творческий потенциал:</strong> <span className="text-[#2d4a35]">Чувство гармонии и красоты делает их успешными в искусстве, дизайне, музыке и литературе.</span>
                </li>
              </ul>
            </div>
          )
        },
        {
          id: "knowledge",
          title: "4. Жажда знаний",
          content: (
            <div className="space-y-6">
              <p className="text-[#2d4a35] text-sm sm:text-base">
                Свати пребывает в непрерывном движении, и это касается как физического мира, так и ментального поиска.
              </p>
              <ul className="space-y-4 sm:space-y-6 mt-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#d0e5c0] shadow-sm">
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Вечный ученик:</strong> <span className="text-[#2d4a35]">Обладая пытливым умом, они искренне увлечены поиском истины, любят читать, исследовать новые концепции и совершенствовать навыки.</span>
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Широта кругозора:</strong> <span className="text-[#2d4a35]">Их привлекают самые разнообразные области, помогая сохранять независимость в любой ситуации.</span>
                </li>
              </ul>
            </div>
          )
        },
        {
          id: "essence",
          title: "Главный урок",
          content: (
            <div className="bg-[#112a1a] p-6 sm:p-10 rounded-3xl border-l-4 border-[#059669] shadow-xl mt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#059669]/10 rounded-full blur-3xl pointer-events-none"></div>
              <p className="text-lg sm:text-xl md:text-2xl font-['Cinzel',serif] text-[#059669] leading-relaxed mb-4 relative z-10">
                Истинная сила — в умении танцевать с ветром.
              </p>
              <p className="text-[#c2dec9] font-light leading-relaxed relative z-10 text-xs sm:text-sm md:text-base">
                Свати не призывает к жесткой борьбе или слепому сопротивлению. Её энергия учит нас сохранять свой внутренний стержень, мягко и гибко адаптируясь к любым переменчивым условиям.
              </p>
            </div>
          )
        }
      ]
    },
    other_articles: [
      { id: "ashvini", tag: "Накшатры", title: "Накшатра Ашвини: Импульс начала и жажда скорости", date: "24 Июля 2026" },
      { id: "saturn-pisces", tag: "Транзиты", title: "Сатурн в Рыбах: Глубокие кармические уроки и растворение эго", date: "18 Июля 2026" }
    ]
  },
  EN: {
    back: "Knowledge Library",
    toc: "Table of Contents",
    read_more: "Next Materials",
    all_articles: "Full Library",
    library_title: "Knowledge Library",
    library_subtitle: "Explore the wisdom of Vedic astrology, cosmic cycles, and harmony principles.",
    tabs: [
      { id: "nakshatras", name: "Nakshatras" },
      { id: "horoscopes", name: "Famous Horoscopes" },
      { id: "ayurveda", name: "Ayurveda" }
    ],
    articles: {
      nakshatras: [
        {
          id: "swati",
          title: "Swati Nakshatra: Energy of Freedom, Wind, and Arcturus",
          date: "July 24, 2026",
          readTime: "6 min read",
          excerpt: "In Vedic astrology, Swati is the 15th nakshatra in Libra. Symbolized by a young shoot bending in the wind.",
          category: "Nakshatras"
        },
        {
          id: "ashvini",
          title: "Ashwini Nakshatra: The Impulse of Beginning and Thirst for Speed",
          date: "July 20, 2026",
          readTime: "5 min read",
          excerpt: "The first nakshatra carrying the energy of healing, quick starts, and divine physicians.",
          category: "Nakshatras"
        }
      ],
      horoscopes: [
        {
          id: "einstein",
          title: "Cosmic Code of a Genius: Albert Einstein's Horoscope Analysis",
          date: "July 15, 2026",
          readTime: "8 min read",
          excerpt: "How planetary placements and strong astrological houses shaped the great physicist's mind.",
          category: "Famous Personalities"
        }
      ],
      ayurveda: [
        {
          id: "doshas",
          title: "Three Doshas in Daily Life: Balancing Vata, Pitta, and Kapha",
          date: "July 10, 2026",
          readTime: "7 min read",
          excerpt: "Fundamental principles of Ayurvedic body constitution and methods for maintaining inner harmony.",
          category: "Ayurveda"
        }
      ]
    },
    article: {
      title: "Swati Nakshatra: Energy of Freedom, Wind, and Arcturus",
      category: "Nakshatras",
      sections: [
        {
          id: "intro",
          title: "Introduction",
          content: (
            <div className="space-y-6 drop-cap">
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#112a1a] leading-relaxed font-['Cinzel',serif]">
                In Vedic astrology, Swati is the 15th nakshatra, located in the constellation of Libra. Its astronomical marker is Arcturus (Alpha Boötis)—one of the brightest and most magnificent stars in the night sky. Translated from Sanskrit, "Swati" means "oneself," "independent," or "sword."
              </p>
              <p className="border-l-2 border-[#059669] pl-4 sm:pl-6 ml-1 sm:ml-2 text-[#2d4a35] font-medium text-sm sm:text-base">
                The symbol of this nakshatra is a young shoot bending under gusts of wind, and its ruling deity is Vayu—the god of wind and life force. This combination gives people born under the influence of Swati incredible mobility, intellect, and an extraordinary life path.
              </p>
            </div>
          )
        },
        {
          id: "independence",
          title: "1. The Independent Lone Wolf",
          content: (
            <div className="space-y-6">
              <p className="text-[#2d4a35] text-sm sm:text-base">
                The main driving force of Swati is the thirst for absolute freedom. People connected with this nakshatra desperately need to feel like masters of their own time, decisions, and destiny.
              </p>
              <ul className="space-y-4 sm:space-y-6 mt-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#d0e5c0] shadow-sm">
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Spirit of Autonomy:</strong> <span className="text-[#2d4a35]">Swati individuals have a hard time tolerating strict control, boundaries, and external pressure. They prefer to forge their own path, even if it leads far from the beaten track.</span>
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Lone Nature:</strong> <span className="text-[#2d4a35]">Despite the fact that Swati can be pleasant in communication, there always remains an isolated space inside them. They feel quite comfortable being alone with themselves.</span>
                </li>
              </ul>
            </div>
          )
        },
        {
          id: "adaptation",
          title: "2. The Art of Adaptation",
          content: (
            <div className="space-y-6">
              <p className="text-[#2d4a35] text-sm sm:text-base">
                A shoot submitting to the wind does not break—it bends, dodges, and continues to grow. This is the unique superpower of Swati.
              </p>
              <ul className="space-y-4 sm:space-y-6 mt-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#d0e5c0] shadow-sm">
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Flexibility in Any Situation:</strong> <span className="text-[#2d4a35]">The energy of the wind endows Swati with the ability to instantly adapt to changing circumstances and read the rules of the game.</span>
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Diplomacy:</strong> <span className="text-[#2d4a35]">Being under the influence of Libra, they possess a charming manner of communication, avoiding conflicts thanks to a flexible mind and tact.</span>
                </li>
              </ul>
            </div>
          )
        },
        {
          id: "talents",
          title: "3. Multifaceted Talent",
          content: (
            <div className="space-y-6">
              <p className="text-[#2d4a35] text-sm sm:text-base">
                Arcturus bestows Swati individuals with a bright spark and pronounced individuality in the realms of intellect and aesthetics:
              </p>
              <ul className="space-y-4 sm:space-y-6 mt-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#d0e5c0] shadow-sm">
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Mastery of Words:</strong> <span className="text-[#2d4a35]">Swati know how to persuade, present ideas, and find common ground with very different people. They are excellent strategists and orators.</span>
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Creative Potential:</strong> <span className="text-[#2d4a35]">A sense of harmony and beauty makes them successful in art, design, music, and literature.</span>
                </li>
              </ul>
            </div>
          )
        },
        {
          id: "knowledge",
          title: "4. Thirst for Knowledge",
          content: (
            <div className="space-y-6">
              <p className="text-[#2d4a35] text-sm sm:text-base">
                Swati is in continuous motion, and this applies to both the physical world and mental pursuit.
              </p>
              <ul className="space-y-4 sm:space-y-6 mt-6 bg-white p-5 sm:p-8 rounded-2xl border border-[#d0e5c0] shadow-sm">
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Eternal Student:</strong> <span className="text-[#2d4a35]">Possessing an inquiring mind, they are genuinely passionate about the search for truth, love to read, explore new concepts, and improve skills.</span>
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 top-1 text-[#059669] text-xs">✦</span>
                  <strong className="text-[#112a1a] font-bold">Breadth of Horizons:</strong> <span className="text-[#2d4a35]">They are attracted to a wide variety of fields, helping to maintain independence in any situation.</span>
                </li>
              </ul>
            </div>
          )
        },
        {
          id: "essence",
          title: "The Main Lesson",
          content: (
            <div className="bg-[#112a1a] p-6 sm:p-10 rounded-3xl border-l-4 border-[#059669] shadow-xl mt-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#059669]/10 rounded-full blur-3xl pointer-events-none"></div>
              <p className="text-lg sm:text-xl md:text-2xl font-['Cinzel',serif] text-[#059669] leading-relaxed mb-4 relative z-10">
                True strength lies in the ability to dance with the wind.
              </p>
              <p className="text-[#c2dec9] font-light leading-relaxed relative z-10 text-xs sm:text-sm md:text-base">
                Swati does not call for a hard struggle or blind resistance. Its energy teaches us to maintain our inner core, softly and flexibly adapting to any changing conditions.
              </p>
            </div>
          )
        }
      ]
    },
    other_articles: [
      { id: "ashvini", tag: "Nakshatras", title: "Ashwini Nakshatra: The Impulse of Beginning and Thirst for Speed", date: "July 24, 2026" },
      { id: "saturn-pisces", tag: "Transits", title: "Saturn in Pisces: Deep Karmic Lessons and the Dissolution of Ego", date: "July 18, 2026" }
    ]
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

export default function ArticlesPage() {
  const [currentLang, setCurrentLang] = useState('RU');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('nakshatras');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null); // ИЗМЕНЕНО: по умолчанию null для отображения главного каталога

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('mira_lang');
      if (savedLang) setCurrentLang(savedLang);
    }
  }, []);

  const handleLangChange = (code: string) => {
    setCurrentLang(code);
    if (typeof window !== 'undefined') localStorage.setItem('mira_lang', code);
    setIsLangOpen(false);
  };

  const t = DICTIONARY[currentLang];
  const articleData = t.article;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf4e3] text-[#2d4a35] font-['Montserrat',sans-serif] selection:bg-[#059669] selection:text-white [-webkit-tap-highlight-color:transparent] relative">

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700;800&family=Montserrat:wght@300;400;500;600&display=swap');
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(208, 229, 192, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(5, 150, 105, 0.4); border-radius: 10px; }
        .drop-cap > p:first-of-type::first-letter {
          float: left; font-family: 'Cinzel', serif; font-size: 4.5rem; line-height: 0.8; padding-right: 0.6rem; padding-top: 0.1rem; color: #059669;
        }
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
            {selectedArticleId ? t.back : "На главную"}
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

      {/* КАТАЛОГ С РАЗДЕЛАМИ ИЛИ ПРОСМОТР СТАТЬИ */}
      {!selectedArticleId ? (
        <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-bold text-[#112a1a] uppercase tracking-wide mb-4">
              {t.library_title}
            </h1>
            <p className="text-sm md:text-base text-[#4a6b52] font-medium leading-relaxed">
              {t.library_subtitle}
            </p>
          </div>

          {/* ВКЛАДКИ РАЗДЕЛОВ */}
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

          {/* СЕТКА МАТЕРИАЛОВ ВЫБРАННОГО РАЗДЕЛА */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.articles[activeTab]?.map((art: any) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className="group bg-white border border-[#d0e5c0] rounded-3xl p-8 hover:border-[#059669] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] text-[#059669] uppercase tracking-widest font-bold mb-3">
                    <span>{art.category}</span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="text-xl font-['Cinzel',serif] font-bold text-[#112a1a] group-hover:text-[#059669] transition-colors mb-3 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#4a6b52] font-medium leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#ecf4e3] flex items-center justify-between text-xs font-bold text-[#059669]">
                  <span>{art.readTime}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Читать →</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-start pt-8 sm:pt-12 md:pt-16 px-4 md:px-8 pb-24 gap-8 lg:gap-16">
          <aside className="hidden lg:block w-72 sticky top-28 flex-shrink-0">
            <div className="text-[10px] text-[#059669] uppercase tracking-widest font-bold mb-4">{t.toc}</div>
            <nav className="flex flex-col gap-3.5 border-l border-[#d0e5c0] pl-4">
              {articleData.sections.map((section: any) => (
                <button key={section.id} onClick={() => scrollToSection(section.id)} className="text-left text-xs font-semibold text-[#4a6b52] hover:text-[#059669] transition-all hover:translate-x-1 duration-300">
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          <article className="flex-1 w-full max-w-3xl mx-auto lg:mx-0">
            <header className="mb-10 sm:mb-14">
              <div className="inline-block px-3 py-1 mb-4 rounded-full border border-[#059669]/20 bg-[#059669]/10 text-[#059669] text-[9px] sm:text-xs uppercase tracking-widest font-bold">
                {articleData.category}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-['Cinzel',serif] font-bold text-[#112a1a] leading-[1.25] tracking-wide">
                {articleData.title}
              </h1>
            </header>

            <div className="space-y-12 sm:space-y-16 text-sm sm:text-base md:text-lg leading-[1.75] font-medium">
              {articleData.sections.map((section: any) => (
                <section id={section.id} key={section.id} className="scroll-mt-28">
                  {section.id !== 'intro' && section.id !== 'essence' && (
                    <h2 className="text-xl sm:text-2xl font-['Cinzel',serif] font-bold text-[#112a1a] mb-6 pb-3 border-b border-[#d0e5c0]">
                      {section.title}
                    </h2>
                  )}
                  {section.content}
                </section>
              ))}
            </div>

            <section className="mt-20 pt-12 border-t border-[#d0e5c0]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
                <h3 className="text-lg sm:text-xl font-['Cinzel',serif] font-bold text-[#112a1a] tracking-wider">
                  {t.read_more}
                </h3>
                <button onClick={() => setSelectedArticleId(null)} className="text-xs font-bold tracking-widest uppercase text-[#059669] hover:text-[#112a1a] transition-colors flex items-center gap-1.5">
                  {t.all_articles} →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.other_articles.map((article: any) => (
                  <div key={article.id} onClick={() => { setSelectedArticleId(article.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="group block bg-white border border-[#d0e5c0] rounded-2xl p-6 hover:border-[#059669] transition-all duration-300 hover:shadow-md relative overflow-hidden cursor-pointer">
                    <div className="text-[9px] sm:text-[10px] text-[#059669] uppercase tracking-widest font-bold mb-2">{article.tag} • {article.date}</div>
                    <h4 className="text-sm sm:text-base font-['Cinzel',serif] font-bold text-[#112a1a] group-hover:text-[#059669] transition-colors leading-snug">
                      {article.title}
                    </h4>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </main>
      )}
    </div>
  );
}