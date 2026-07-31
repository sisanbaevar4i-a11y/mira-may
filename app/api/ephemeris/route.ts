import { NextResponse } from 'next/server';
import * as astronomy from 'astronomy-engine';

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

// --- БЛОКИРОВКА ОТРИЦАТЕЛЬНОГО ОСТАТКА ---
// Эта функция гарантирует, что градус всегда будет от 0 до 359.99
function mod360(val: number): number {
  let res = val % 360.0;
  if (res < 0) res += 360.0;
  return res;
}

// --- АБСОЛЮТНО ТОЧНАЯ ТРОПИЧЕСКАЯ ДОЛГОТА НА ТЕКУЩУЮ ДАТУ ---
function getTropicalLongitude(bodyId: string, time: astronomy.AstroTime): number {
  // Получаем видимые экваториальные координаты (ofdate = true)
  const eq = astronomy.Equator(bodyId, time, null, true, true);

  const ra = eq.ra * 15.0 * (Math.PI / 180.0); // часы в радианы
  const dec = eq.dec * (Math.PI / 180.0);      // градусы в радианы

  const t = (time.tt - 2451545.0) / 36525.0;

  // Истинный наклон эклиптики на текущую дату
  const omega = mod360(125.04452 - 1934.136261 * t);
  const L = mod360(280.4665 + 36000.7698 * t);
  const eps0 = 23.439291111 - (46.815 * t + 0.00059 * t*t - 0.001813 * t*t*t) / 3600.0;
  const deltaEps = (9.20 * Math.cos(omega * Math.PI/180) + 0.57 * Math.cos(2 * L * Math.PI/180)) / 3600.0;
  const eps = (eps0 + deltaEps) * (Math.PI / 180.0);

  // Точная конвертация RA/DEC в эклиптическую долготу
  const y = Math.sin(ra) * Math.cos(eps) + Math.tan(dec) * Math.sin(eps);
  const x = Math.cos(ra);

  let lon = Math.atan2(y, x) * (180.0 / Math.PI);
  return mod360(lon);
}

// --- ТОЧНАЯ АЙАНАМША ЛАХИРИ ---
function getTrueLahiriAyanamsa(t: number): number {
  const meanAyanamsa = 23.8530555 + (1.396972222 * t) + (0.0003086 * t * t);
  const omega = mod360(125.04452 - 1934.136261 * t);
  const L = mod360(280.4665 + 36000.7698 * t);

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
    const futureDate = new Date(date.getTime() + 3600000); // +1 час
    const timeFuture = new astronomy.AstroTime(futureDate);

    const t = (timeNow.tt - 2451545.0) / 36525.0;
    const trueAyanamsa = getTrueLahiriAyanamsa(t);

    const results = [];

    // --- ПЛАНЕТЫ ---
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

    // --- УЗЛЫ (РАХУ И КЕТУ) - ИСТИННЫЕ ---
    const meanOmega = mod360(125.04452 - 1934.136261 * t + 0.0020708 * t * t);
    const L = mod360(280.4665 + 36000.7698 * t);

    // Гравитационная поправка Истинного узла
    const trueRahuTrop = mod360(meanOmega - 1.4979 * Math.sin(2 * (L - meanOmega) * (Math.PI / 180.0)));

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