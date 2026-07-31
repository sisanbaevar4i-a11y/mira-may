import { NextResponse } from 'next/server';
import * as astronomy from 'astronomy-engine';

// === ЖЕСТКОЕ ОТКЛЮЧЕНИЕ КЭША VERCEL ===
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

// --- БЛОКИРОВКА ОТРИЦАТЕЛЬНЫХ ЗНАЧЕНИЙ ---
function mod360(val: number): number {
  let res = val % 360.0;
  if (res < 0) res += 360.0;
  return res;
}

// --- БЕЗОПАСНЫЙ И ТОЧНЫЙ РАСЧЕТ ДОЛГОТЫ ЧЕРЕЗ МАТРИЦЫ ---
function getTropicalLongitude(bodyId: string, time: astronomy.AstroTime): number {
  // 1. Получаем надежный геоцентрический вектор J2000 (никогда не вызывает 500 ошибку)
  const vecEQJ = astronomy.GeoVector(bodyId, time, true);

  // 2. Генерируем матрицу вращения от Экватора J2000 к Истинной Эклиптике текущей даты
  const rot = astronomy.Rotation_EQJ_ECT(time);

  // 3. Поворачиваем вектор
  const vecECT = astronomy.RotateVector(rot, vecEQJ);

  // 4. Вычисляем идеальную эклиптическую долготу
  const lon = Math.atan2(vecECT.y, vecECT.x) * (180.0 / Math.PI);
  return mod360(lon);
}

// --- ТОЧНАЯ АЙАНАМША ЛАХИРИ ---
function getTrueLahiriAyanamsa(t: number): number {
  const meanAyanamsa = 23.8530555 + (1.396972222 * t) + (0.0003086 * t * t);
  const omega = mod360(125.04452 - 1934.136261 * t);
  const L = mod360(280.4665 + 36000.7698 * t);

  // Нутация оси
  const nutation = -0.004778 * Math.sin(omega * Math.PI/180) - 0.00034 * Math.sin(2 * L * Math.PI/180);
  return meanAyanamsa + nutation;
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
    const timeNow = new astronomy.AstroTime(date);
    const futureDate = new Date(date.getTime() + 3600000); // Вектор будущего на 1 час
    const timeFuture = new astronomy.AstroTime(futureDate);

    const t = (timeNow.tt - 2451545.0) / 36525.0; // Столетия от J2000
    const trueAyanamsa = getTrueLahiriAyanamsa(t);

    const results = [];

    // --- ОБРАБОТКА ПЛАНЕТ ---
    for (const p of PLANETS) {
      const tropNow = getTropicalLongitude(p.id, timeNow);
      const tropFuture = getTropicalLongitude(p.id, timeFuture);

      const vedicLonNow = mod360(tropNow - trueAyanamsa);
      const vedicLonFuture = mod360(tropFuture - trueAyanamsa);

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

    // --- УЗЛЫ (ИСТИННЫЕ РАХУ И КЕТУ) ---
    const meanOmega = mod360(125.04452 - 1934.136261 * t + 0.0020708 * t * t);
    const L = mod360(280.4665 + 36000.7698 * t);

    // Точная гравитационная поправка для Истинного Узла (как в Astro.Expert)
    const trueRahuTrop = mod360(meanOmega - 1.4979 * Math.sin(2 * (meanOmega - L) * (Math.PI / 180.0)));

    const rahuVedic = mod360(trueRahuTrop - trueAyanamsa);
    const ketuVedic = mod360(rahuVedic + 180);

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