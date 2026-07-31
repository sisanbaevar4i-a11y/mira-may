import { NextResponse } from 'next/server';
import { AstroTime, GeoVector } from 'astronomy-engine';

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
const AYANAMSHA_J2000 = 23.8530555;
const EPS_J2000 = 23.4392794444 * (Math.PI / 180.0);

// --- НАДЕЖНЫЙ РАСЧЕТ СИДЕРИЧЕСКОЙ ДОЛГОТЫ ---
function getSiderealLongitude(bodyId: string, time: AstroTime): number {
  // Получаем базовый геоцентрический вектор
  const vec = GeoVector(bodyId, time, true);

  // Вращаем вектор на наклон эклиптики
  const x = vec.x;
  const y = vec.y * Math.cos(EPS_J2000) + vec.z * Math.sin(EPS_J2000);

  // Вычисляем долготу
  let lonJ2000 = Math.atan2(y, x) * (180.0 / Math.PI);
  if (lonJ2000 < 0) lonJ2000 += 360;

  // Вычитаем константу Лахири
  let sidereal = lonJ2000 - AYANAMSHA_J2000;
  if (sidereal < 0) sidereal += 360;

  return sidereal;
}

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

    // --- РАСЧЕТ ИСТИННЫХ УЗЛОВ РАХУ И КЕТУ ---
    const t = (timeNow.tt - 2451545.0) / 36525.0;

    const meanOmega = (125.04452 - 1934.136261 * t + 0.0020708 * t * t) % 360;
    const L = (280.4665 + 36000.7698 * t) % 360;
    const rad = Math.PI / 180.0;

    const trueAyanamsa = 23.8530555 + (1.396972222 * t);
    const nutation = -0.004778 * Math.sin(meanOmega * rad) - 0.00034 * Math.sin(2 * L * rad);
    const ofDateAyanamsa = trueAyanamsa + nutation;

    const trueRahuTrop = meanOmega - 1.4979 * Math.sin(2 * (L - meanOmega) * rad);

    let rahuVedic = (trueRahuTrop - ofDateAyanamsa) % 360;
    if (rahuVedic < 0) rahuVedic += 360;
    let ketuVedic = (rahuVedic + 180) % 360;

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
    return NextResponse.json({ error: "Ошибка вычислений эфемерид: " + (error as Error).message }, { status: 500 });
  }
}