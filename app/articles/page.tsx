"use client";

import React from 'react';

const OTHER_ARTICLES = [
  {
    id: "ashvini",
    tag: "Накшатры",
    title: "Накшатра Ашвини: Импульс начала и жажда скорости",
    date: "24 Июля 2026"
  },
  {
    id: "saturn-pisces",
    tag: "Транзиты",
    title: "Сатурн в Рыбах: Глубокие кармические уроки и растворение эго",
    date: "18 Июля 2026"
  }
];

const RoseLogo = () => (
  <svg
    className="w-7 h-7 md:w-9 md:h-9 text-[#059669] drop-shadow-sm flex-shrink-0"
    viewBox="0 0 512 512"
    fill="currentColor"
  >
    <path d="M260.6 57.4c-35-1.1-70.5 13-94 40.4-18.3 21.4-26.3 49.3-26.6 77.2-6.5-6.5-13.8-12-22-16.2-24.8-12.7-54-15-81.2-5.7-25 8.7-46 26.5-58.8 50-13 23.5-16.6 51.5-9.6 77.5 6.4 23.8 19.6 44.8 37.8 60 19.8 16.5 44 26.2 69.5 28.3-8.8 17.2-12.6 36.8-11.2 56.6 1.6 22.8 10.5 44.5 25.4 61.8 15.8 18.5 36.8 31.6 59.8 37.6 23.8 6.2 49.5 5 72.8-4.2 26-10.3 48.6-28.5 63.8-51.5 16-24 24.3-52 24.5-80.4 12.8 5.7 26.8 8.8 41 8.8 29.5 0 58.2-11.8 79-33 19.8-20.2 30.6-47.5 30-75.5-.6-28-12.8-55-33.8-74.2-21-19-48.8-29.5-77.4-28.8-15 .3-29.8 3.8-43.4 10.3C385.8 136 341.2 87 282 65.5c-7-2.6-14.2-4.5-21.4-8.1zm-8.8 33.6c32.4 4 62.6 20.8 83 46 19.6 24 29 54.3 25.7 84.4-1.8 15.4-6.8 30.2-14.7 43.4-14-16.5-31.4-30-51-40.2-22.6-11.6-48-18-73.8-18.4 15-28.8 43.6-49.3 75.8-54.2-25.6 2.3-50.6 13.8-68.8 32-17 16.8-26.6 39.5-27.4 63.3-.6 20.2 4.4 40.2 14.5 57.6-23.4-6-44.6-19.6-59.5-38.6-14-17.8-21.3-40-20.3-62.5 1-22 9.5-43 24.3-59.4 17.6-19.5 41.5-31.5 66.8-34.6 9-1.2 18.2-1.2 27.2.2 1.4-8.4 1.4-17 0-25.4-8-44.5-39.6-80.5-82-93.6zm132.8 74.4c21.8 1 42.6 10 58.6 25 15.8 14.8 24.8 34.6 25.2 55.6.3 19.8-6.3 39-18.7 54.2-14.2 17.2-34 27.8-56.3 30.4 12.3-15.6 21.6-34 26.6-53.8 5-20.4 4.7-42-1.3-62-11.5-2-23.4-1.5-34.6 2 2.6-20.3-1.6-41-11.8-58.4 4-1 8-1.5 12.3-1.5zm-59 66c14.2 3.6 27.3 11 37.6 21.4 10.4 10.5 17.2 24.2 19 39 1.7 13.6-.8 27.6-7.2 39.6-10 18.4-26.4 32.8-46 41.4-19 8.2-40.4 10.6-60.5 6.4 16.6-15.5 28.5-36 33.6-58.2 4.5-20 3-41-4.6-60-2.8-7-6.5-13.8-11-20 13.5-3.8 27.6-4.2 41.5-1zm-60.8 25c19 19.6 29 46.2 27.4 73.8-1 16.8-7 33-17 46.6-12.8 17.6-31.2 30-52 35.4-15 4-30.8 4.2-46 .6 18-12 32-28.5 40.2-48.4 8.2-20.2 10.4-42.5 5.8-63.5-3.4-15.4-10.4-29.6-20.4-41.5 20.8-2 41.6 4.6 58.5 17h3.5zM100.8 173.8c18-7.5 38.6-8.2 57.6-2 18.6 6 34.6 18.2 45 34.6 7.4 11.5 11.6 24.8 12.4 38.4-23.4-6.4-48-5.3-71 3.4-22 8-41.6 22-55.6 40.4-12.6 16.6-20 36.3-21.2 56.8-14.8-5.8-28.2-15-38.3-27.4-11.4-13.6-17.6-30.8-18-48.6-.2-17.5 5.2-34.6 15.6-48.6 12-16.2 29-28.6 48-34.2 8.3-2.4 17-3.4 25.5-2.8z"/>
  </svg>
);

export default function ArticlesPage() {
  const articleData = {
    title: "Накшатра Свати: Энергия Свободы, Ветра и Звезды Арктур",
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
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf4e3] text-[#2d4a35] font-['Montserrat',sans-serif] selection:bg-[#059669] selection:text-white [-webkit-tap-highlight-color:transparent]">

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700;800&family=Montserrat:wght@300;400;500;600&display=swap');

        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(208, 229, 192, 0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(5, 150, 105, 0.4); border-radius: 10px; }

        .drop-cap > p:first-of-type::first-letter {
          float: left;
          font-family: 'Cinzel', serif;
          font-size: 4.5rem;
          line-height: 0.8;
          padding-right: 0.6rem;
          padding-top: 0.1rem;
          color: #059669;
        }
      `}} />

      {/* Шапка */}
      <header className="sticky top-0 z-50 w-full bg-[#ecf4e3]/90 backdrop-blur-xl border-b border-[#d0e5c0] px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <a href="/" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#d0e5c0] flex items-center justify-center text-[#4a6b52] hover:bg-[#059669] hover:text-white hover:border-[#059669] transition-all shadow-sm">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </a>
          <span className="text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold text-[#4a6b52] hidden sm:block">Библиотека знаний</span>
        </div>
        <div className="text-sm sm:text-base md:text-lg font-['Cinzel',serif] font-bold tracking-[0.2em] text-[#112a1a] flex items-center gap-2">
          <RoseLogo />
          <span>MIRA <span className="text-[#059669]">MAY</span></span>
        </div>
      </header>

      <main className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-start pt-8 sm:pt-12 md:pt-16 px-4 md:px-8 pb-24 gap-8 lg:gap-16">

        {/* Оглавление (Слева) */}
        <aside className="hidden lg:block w-72 sticky top-28 flex-shrink-0">
          <div className="text-[10px] text-[#059669] uppercase tracking-widest font-bold mb-4">Оглавление</div>
          <nav className="flex flex-col gap-3.5 border-l border-[#d0e5c0] pl-4">
            {articleData.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-left text-xs font-semibold text-[#4a6b52] hover:text-[#059669] transition-all hover:translate-x-1 duration-300"
              >
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Контент статьи */}
        <article className="flex-1 w-full max-w-3xl mx-auto lg:mx-0">

          <header className="mb-10 sm:mb-14">
            <div className="inline-block px-3 py-1 mb-4 rounded-full border border-[#059669]/20 bg-[#059669]/10 text-[#059669] text-[9px] sm:text-xs uppercase tracking-widest font-bold">
              Астрология / Накшатры
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-['Cinzel',serif] font-bold text-[#112a1a] leading-[1.25] tracking-wide">
              {articleData.title}
            </h1>
          </header>

          <div className="space-y-12 sm:space-y-16 text-sm sm:text-base md:text-lg leading-[1.75] font-medium">
            {articleData.sections.map((section) => (
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

          {/* Блок "Продолжить чтение" */}
          <section className="mt-20 pt-12 border-t border-[#d0e5c0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
              <h3 className="text-lg sm:text-xl font-['Cinzel',serif] font-bold text-[#112a1a] tracking-wider">
                Следующие манускрипты
              </h3>
              <a href="/articles" className="text-xs font-bold tracking-widest uppercase text-[#059669] hover:text-[#112a1a] transition-colors flex items-center gap-1.5">
                Вся библиотека <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OTHER_ARTICLES.map(article => (
                <a key={article.id} href={`/articles`} className="group block bg-white border border-[#d0e5c0] rounded-2xl p-6 hover:border-[#059669] transition-all duration-300 hover:shadow-md relative overflow-hidden">
                  <div className="text-[9px] sm:text-[10px] text-[#059669] uppercase tracking-widest font-bold mb-2">{article.tag} • {article.date}</div>
                  <h4 className="text-sm sm:text-base font-['Cinzel',serif] font-bold text-[#112a1a] group-hover:text-[#059669] transition-colors leading-snug">
                    {article.title}
                  </h4>
                </a>
              ))}
            </div>
          </section>

        </article>
      </main>

    </div>
  );
}