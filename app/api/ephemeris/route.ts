import { NextResponse } from 'next/server';
import { AstroTime, EclipticLongitude } from 'astronomy-engine';

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

// --- ТОЧНАЯ АЙАНАМША ЛАХИРИ (Chitrapaksha) ---
function getTrueLahiriAyanamsa(t: number): number {
  // t - Юлианские столетия от J2000
  const meanAyanamsa = 23.8530555 + (1.396972222 * t) + (0.0003086 * t * t);

  // Астрономическая нутация (колебание оси), которую учитывает Astro.Expert
  const omega = (125.04452 - 1934.136261 * t) % 360;
  const L = (280.4665 + 36000.7698 * t) % 360;
  const rad = Math.PI / 180.0;

  const nutation = -0.004778 * Math.sin(omega * rad) - 0.00034 * Math.sin(2 * L * rad);

  return meanAyanamsa + nutation;
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

    // Столетия от J2000
    const t = (timeNow.tt - 2451545.0) / 36525.0;
    const trueAyanamsa = getTrueLahiriAyanamsa(t);

    const results = [];

    // --- ОБРАБОТКА ОСНОВНЫХ 7 ПЛАНЕТ ---
    for (const p of PLANETS) {
      // EclipticLongitude выдает безупречную Тропическую долготу текущей даты
      const tropNow = EclipticLongitude(p.id, timeNow);
      const tropFuture = EclipticLongitude(p.id, timeFuture);

      // Перевод в Сидерический зодиак (строго как в Astro.Expert)
      const vedicLonNow = (tropNow - trueAyanamsa + 360) % 360;
      const vedicLonFuture = (tropFuture - trueAyanamsa + 360) % 360;

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

    // --- РАСЧЕТ ИСТИННЫХ УЗЛОВ РАХУ И КЕТУ (True Node) ---
    const meanOmega = (125.04452 - 1934.136261 * t + 0.0020708 * t * t) % 360;
    const L = (280.4665 + 36000.7698 * t) % 360; // Солнце
    const rad = Math.PI / 180.0;

    // Гравитационная поправка Истинного узла (решает проблему расхождения на ~1.5 градуса)
    const trueRahuTrop = meanOmega - 1.4979 * Math.sin(2 * (L - meanOmega) * rad);

    const rahuVedic = (trueRahuTrop - trueAyanamsa + 360) % 360;
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