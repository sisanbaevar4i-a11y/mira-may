import { NextResponse } from 'next/server';
import * as astronomy from 'astronomy-engine';

// Жесткий запрет кэширования на серверах Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

function mod360(val: number): number {
  let res = val % 360.0;
  if (res < 0) res += 360.0;
  return res;
}

function getSiderealLongitude(bodyId: string, time: astronomy.AstroTime): number {
  const vec = astronomy.GeoVector(bodyId, time, true);
  const epsJ2000 = 23.43929111 * (Math.PI / 180.0);

  const x = vec.x;
  const y = vec.y * Math.cos(epsJ2000) + vec.z * Math.sin(epsJ2000);

  let lonJ2000 = Math.atan2(y, x) * (180.0 / Math.PI);
  return mod360(lonJ2000 - 23.8530555);
}

function formatZodiac(longitude: number) {
  const lon = mod360(longitude);
  const signIndex = Math.floor(lon / 30);
  const degree = Math.floor(lon % 30);
  const minutes = Math.floor((lon % 1) * 60);

  return {
    sign: SIGNS[signIndex],
    degreeStr: `${degree.toString().padStart(2, '0')}°${minutes.toString().padStart(2, '0')}'`
  };
}

export async function GET() {
  try {
    const date = new Date();

    // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Вычисляем Юлианские столетия нативно через JavaScript.
    // Это исключает баги библиотеки и дает идеальную точность для узлов.
    const jd = (date.getTime() / 86400000) + 2440587.5;
    const T = (jd - 2451545.0) / 36525.0;

    const timeNow = new astronomy.AstroTime(date);
    const futureDate = new Date(date.getTime() + 3600000);
    const timeFuture = new astronomy.AstroTime(futureDate);

    const results = [];

    // --- 1. ПЛАНЕТЫ ---
    for (const p of PLANETS) {
      const vedicLonNow = getSiderealLongitude(p.id, timeNow);
      const vedicLonFuture = getSiderealLongitude(p.id, timeFuture);

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

    // --- 2. ИСТИННЫЕ УЗЛЫ (РАХУ И КЕТУ) ---
    const meanOmega = mod360(125.044522 - 1934.136261 * T + 0.0020708 * T * T);
    const sunLonTrop = mod360(getSiderealLongitude("Sun", timeNow) + 23.8530555 + (1.39697 * T));

    // Гравитационная поправка Истинного Узла
    const trueRahuTrop = mod360(meanOmega - 1.4979 * Math.sin(2 * (meanOmega - sunLonTrop) * (Math.PI / 180.0)));

    // Перевод в Сидерический Зодиак
    const ayanamsaNow = 23.8530555 + (1.39697 * T);
    const rahuVedic = mod360(trueRahuTrop - ayanamsaNow);
    const ketuVedic = mod360(rahuVedic + 180.0);

    const rahuFormatted = formatZodiac(rahuVedic);
    const ketuFormatted = formatZodiac(ketuVedic);

    results.push({
      id: "rahu",
      name: "RAHU",
      nameRu: "РАХУ",
      symbol: "☊",
      sign: rahuFormatted.sign,
      degree: rahuFormatted.degreeStr,
      isRetrograde: true
    });

    results.push({
      id: "ketu",
      name: "KETU",
      nameRu: "КЕТУ",
      symbol: "☋",
      sign: ketuFormatted.sign,
      degree: ketuFormatted.degreeStr,
      isRetrograde: true
    });

    // Возвращаем данные с принудительными заголовками анти-кэша для браузера
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Критическая ошибка:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}