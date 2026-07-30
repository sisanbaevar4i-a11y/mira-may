import { NextResponse } from 'next/server';
import { AstroTime, GeoVector } from 'astronomy-engine';

const PLANETS = [
  { id: "Sun", name: "Sun", nameRu: "Солнце", symbol: "☉" },
  { id: "Moon", name: "Moon", nameRu: "Луна", symbol: "☽" },
  { id: "Mercury", name: "Mercury", nameRu: "Меркурий", symbol: "☿" },
  { id: "Venus", name: "Venus", nameRu: "Венера", symbol: "♀" },
  { id: "Mars", name: "Mars", nameRu: "Марс", symbol: "♂" },
  { id: "Jupiter", name: "Jupiter", nameRu: "Юпитер", symbol: "♃" },
  { id: "Saturn", name: "Saturn", nameRu: "Сатурн", symbol: "♄" }
];

const SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

// Функция трансформации экваториальных координат в тропическую эклиптику
function getEclipticLongitude(bodyId: string, date: Date): number {
  const time = new AstroTime(date);
  const vec = GeoVector(bodyId, time, true);

  // Расчет Юлианских столетий от эпохи J2000
  const t = (time.tt - 2451545.0) / 36525.0;
  // Вычисление точного наклона эклиптики на текущую дату
  const eps = 23.43929111 - 0.013004167 * t - 0.0000001639 * t * t + 0.0000005036 * t * t * t;
  const rad = Math.PI / 180.0;

  const x = vec.x;
  const y = vec.y * Math.cos(eps * rad) + vec.z * Math.sin(eps * rad);

  let lon = Math.atan2(y, x) / rad;
  if (lon < 0) lon += 360;
  return lon;
}

function formatZodiac(longitude: number) {
  const signIndex = Math.floor(longitude / 30);
  const degree = Math.floor(longitude % 30);
  const minutes = Math.floor((longitude % 1) * 60);
  return {
    sign: SIGNS[signIndex],
    degreeStr: `${degree.toString().padStart(2, '0')}°${minutes.toString().padStart(2, '0')}'`
  };
}

export async function GET() {
  try {
    const date = new Date();
    // Создаем слепок времени на 1 час вперед для вычисления скорости
    const futureDate = new Date(date.getTime() + 3600000);
    const results = [];

    for (const p of PLANETS) {
      const lon1 = getEclipticLongitude(p.id, date);
      const lon2 = getEclipticLongitude(p.id, futureDate);

      let diff = lon2 - lon1;
      // Корректировка перехода через 0 градусов Овна
      if (diff < -180) diff += 360;
      if (diff > 180) diff -= 360;

      const { sign, degreeStr } = formatZodiac(lon1);

      // Логика ретроградности (Солнце и Луна всегда директны)
      const isRetrograde = (diff < 0 && p.id !== "Sun" && p.id !== "Moon") ? " ℞" : "";

      results.push({
        name: p.name,
        nameRu: p.nameRu,
        symbol: p.symbol,
        sign: sign,
        degree: degreeStr + isRetrograde
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Критическая ошибка математического ядра:", error);
    return NextResponse.json({ error: "Ошибка вычислений эфемерид" }, { status: 500 });
  }
}