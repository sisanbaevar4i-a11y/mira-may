import { NextResponse } from 'next/server';
import { AstroTime, GeoVector } from 'astronomy-engine';

// Кэшируем результат на сервере на 30 минут (1800 секунд), чтобы не нагружать процессор
export const revalidate = 1800;

const PLANETS = [
  { id: "Sun", name: "SUN", nameRu: "СОЛНЦЕ", symbol: "☀" },
  { id: "Moon", name: "MOON", nameRu: "ЛУНА", symbol: "☽" },
  { id: "Mercury", name: "MERCURY", nameRu: "МЕРКУРИЙ", symbol: "☿" },
  { id: "Venus", name: "VENUS", nameRu: "ВЕНЕРА", symbol: "♀" },
  { id: "Mars", name: "MARS", nameRu: "МАРС", symbol: "♂" },
  { id: "Jupiter", name: "JUPITER", nameRu: "ЮПИТЕР", symbol: "♃" },
  { id: "Saturn", name: "SATURN", nameRu: "САТУРН", symbol: "♄" }
];

const SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

// --- 1. РАСЧЕТ ТРОПИЧЕСКОЙ ДОЛГОТЫ ---
function getTropicalLongitude(bodyId: string, time: AstroTime): number {
  const vec = GeoVector(bodyId, time, true);
  const t = (time.tt - 2451545.0) / 36525.0;

  // Точный наклон эклиптики
  const eps = 23.43929111 - 0.013004167 * t - 0.0000001639 * t * t + 0.0000005036 * t * t * t;
  const rad = Math.PI / 180.0;

  const x = vec.x;
  const y = vec.y * Math.cos(eps * rad) + vec.z * Math.sin(eps * rad);

  let lon = Math.atan2(y, x) / rad;
  if (lon < 0) lon += 360;
  return lon;
}

// --- 2. АЙАНАМША ЛАХИРИ (Ведическая поправка для Джйотиш / Astro.Expert) ---
function getLahiriAyanamsa(t: number): number {
  // Базовое значение на эпоху J2000 + годовая прецессия (~50.29 секунд дуги в год)
  return 23.853 + (t * 1.3969);
}

// --- 3. ФОРМАТИРОВАНИЕ В ЗНАК И ГРАДУСЫ ---
function formatZodiac(longitude: number) {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = Math.floor(normalizedLon % 30);
  const minutes = Math.floor((normalizedLon % 1) * 60);

  return {
    sign: SIGNS[signIndex],
    degreeStr: `${degree.toString().padStart(2, '0')}°${minutes.toString().padStart(2, '0')}'`
  };
}

export async function GET() {
  try {
    const date = new Date();
    const timeNow = new AstroTime(date);
    const futureDate = new Date(date.getTime() + 3600000); // +1 час для определения ретроградности
    const timeFuture = new AstroTime(futureDate);

    // Юлианские столетия от J2000
    const t = (timeNow.tt - 2451545.0) / 36525.0;
    const ayanamsa = getLahiriAyanamsa(t);

    const results = [];

    // --- ОБРАБОТКА ОСНОВНЫХ 7 ПЛАНЕТ ---
    for (const p of PLANETS) {
      const tropNow = getTropicalLongitude(p.id, timeNow);
      const tropFuture = getTropicalLongitude(p.id, timeFuture);

      // Перевод в Сидерический (Ведический) зодиак
      const vedicLonNow = (tropNow - ayanamsa + 360) % 360;
      const vedicLonFuture = (tropFuture - ayanamsa + 360) % 360;

      let diff = vedicLonFuture - vedicLonNow;
      if (diff < -180) diff += 360;
      if (diff > 180) diff -= 360;

      const { sign, degreeStr } = formatZodiac(vedicLonNow);
      const isRetrograde = (diff < 0 && p.id !== "Sun" && p.id !== "Moon");

      results.push({
        id: p.id.toLowerCase(),
        name: p.name,
        nameRu: p.nameRu,
        symbol: p.symbol,
        sign: sign,
        degree: degreeStr,
        isRetrograde: isRetrograde
      });
    }

    // --- РАСЧЕТ РАХУ И КЕТУ (ВЕДИЧЕСКИЕ ЛУННЫЕ УЗЛЫ) ---
    // Формула средней долготы Восходящего узла (Раху)
    let rahuTropical = (125.044522 - 1934.136261 * t) % 360;
    if (rahuTropical < 0) rahuTropical += 360;

    const rahuVedic = (rahuTropical - ayanamsa + 360) % 360;
    const ketuVedic = (rahuVedic + 180) % 360;

    const rahuFormatted = formatZodiac(rahuVedic);
    const ketuFormatted = formatZodiac(ketuVedic);

    // Раху (Восходящий узел)
    results.push({
      id: "rahu",
      name: "RAHU",
      nameRu: "РАХУ",
      symbol: "☊",
      sign: rahuFormatted.sign,
      degree: rahuFormatted.degreeStr,
      isRetrograde: true // Узлы всегда ретроградны
    });

    // Кету (Нисходящий узел)
    results.push({
      id: "ketu",
      name: "KETU",
      nameRu: "КЕТУ",
      symbol: "☋",
      sign: ketuFormatted.sign,
      degree: ketuFormatted.degreeStr,
      isRetrograde: true
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Критическая ошибка математического ядра:", error);
    return NextResponse.json({ error: "Ошибка вычислений эфемерид" }, { status: 500 });
  }
}