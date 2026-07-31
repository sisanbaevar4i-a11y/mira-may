import { NextResponse } from 'next/server';
import { AstroTime, GeoVector } from 'astronomy-engine';

// Кэшируем результат на сервере на 30 минут (1800 секунд)
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

// --- ФУНДАМЕНТАЛЬНЫЕ КОНСТАНТЫ ЭПОХИ J2000 ---
// Айанамша Лахири на 1 января 2000 года (23° 51' 11")
const AYANAMSHA_J2000 = 23.8530555;
// Точный наклон эклиптики на эпоху J2000
const EPS_J2000 = 23.4392794444 * (Math.PI / 180.0);

// --- ИДЕАЛЬНЫЙ РАСЧЕТ СИДЕРИЧЕСКОЙ ДОЛГОТЫ ---
function getSiderealLongitude(bodyId: string, time: AstroTime): number {
  // 1. Получаем геоцентрический вектор на J2000 (с учетом аберрации света)
  const vec = GeoVector(bodyId, time, true);

  const x = vec.x;
  // 2. Вращаем экваториальную плоскость до эклиптики J2000
  const y = vec.y * Math.cos(EPS_J2000) + vec.z * Math.sin(EPS_J2000);

  let lonJ2000 = Math.atan2(y, x) * (180.0 / Math.PI);
  if (lonJ2000 < 0) lonJ2000 += 360;

  // 3. Вычитаем константу Лахири. Это жестко привязывает зодиак к звездам.
  let sidereal = lonJ2000 - AYANAMSHA_J2000;
  if (sidereal < 0) sidereal += 360;

  return sidereal;
}

// --- ФОРМАТИРОВАНИЕ В ЗНАК И ГРАДУСЫ ---
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

    // Вектор будущего для вычисления ретроградности
    const futureDate = new Date(date.getTime() + 3600000);
    const timeFuture = new AstroTime(futureDate);

    const results = [];

    // --- ОБРАБОТКА ОСНОВНЫХ 7 ПЛАНЕТ ---
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

    // --- РАСЧЕТ РАХУ И КЕТУ (Истинные средние узлы) ---
    const t = (timeNow.tt - 2451545.0) / 36525.0; // Юлианские столетия от J2000

    // Точная формула средней долготы узла
    let omega = 125.044522 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000;
    omega = (omega % 360 + 360) % 360;

    const rahuVedic = (omega - AYANAMSHA_J2000 + 360) % 360;
    const ketuVedic = (rahuVedic + 180) % 360;

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

    return NextResponse.json(results);
  } catch (error) {
    console.error("Критическая ошибка математического ядра:", error);
    return NextResponse.json({ error: "Ошибка вычислений эфемерид" }, { status: 500 });
  }
}