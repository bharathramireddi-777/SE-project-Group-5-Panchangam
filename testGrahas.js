const Astronomy = require('astronomy-engine');
const { getLahiriAyanamsha } = require('./engine');
const { RASIS } = require('./constants');

function getGrahaPositions(date, lat = 17.3850, lng = 78.4867) {
  const astroTime = new Astronomy.AstroTime(date);
  const jd = astroTime.ut + 2451545.0;
  const ayanamsa = getLahiriAyanamsha(jd);

  const bodies = [
    { name: "Sun", telugu: "సూర్యుడు", body: Astronomy.Body.Sun },
    { name: "Moon", telugu: "చంద్రుడు", body: Astronomy.Body.Moon },
    { name: "Mars", telugu: "కుజుడు", body: Astronomy.Body.Mars },
    { name: "Mercury", telugu: "బుధుడు", body: Astronomy.Body.Mercury },
    { name: "Jupiter", telugu: "గురుడు", body: Astronomy.Body.Jupiter },
    { name: "Venus", telugu: "శుక్రుడు", body: Astronomy.Body.Venus },
    { name: "Saturn", telugu: "శని", body: Astronomy.Body.Saturn },
  ];

  const positions = bodies.map(b => {
    const vec = Astronomy.GeoVector(b.body, astroTime, false);
    const ecl = Astronomy.Ecliptic(vec);
    let sidereal = (ecl.elon - ayanamsa) % 360;
    if (sidereal < 0) sidereal += 360;
    const rasiIdx = Math.floor(sidereal / 30);
    return {
      name: b.name,
      telugu: b.telugu,
      longitude: sidereal.toFixed(2),
      degreeInRasi: (sidereal % 30).toFixed(2),
      rasi: RASIS[rasiIdx]
    };
  });

  // Calculate Mean Rahu & Ketu
  const T = (jd - 2451545.0) / 36525.0;
  let rahuTrop = (125.04452 - 1934.136261 * T + 0.0020708 * T * T) % 360;
  if (rahuTrop < 0) rahuTrop += 360;
  let rahuSidereal = (rahuTrop - ayanamsa) % 360;
  if (rahuSidereal < 0) rahuSidereal += 360;
  let ketuSidereal = (rahuSidereal + 180) % 360;

  positions.push({
    name: "Rahu",
    telugu: "రాహువు",
    longitude: rahuSidereal.toFixed(2),
    degreeInRasi: (rahuSidereal % 30).toFixed(2),
    rasi: RASIS[Math.floor(rahuSidereal / 30)]
  });

  positions.push({
    name: "Ketu",
    telugu: "కేతువు",
    longitude: ketuSidereal.toFixed(2),
    degreeInRasi: (ketuSidereal % 30).toFixed(2),
    rasi: RASIS[Math.floor(ketuSidereal / 30)]
  });

  // Calculate Lagna (Ascendant)
  const gst = Astronomy.SiderealTime(astroTime); // in hours
  const lstDeg = ((gst * 15 + lng) % 360 + 360) % 360; // in degrees
  const eps = 23.4392911 * Math.PI / 180;
  const ramc = lstDeg * Math.PI / 180;
  const latRad = lat * Math.PI / 180;

  const y = Math.cos(ramc);
  const x = - (Math.sin(ramc) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps));
  let ascTrop = Math.atan2(y, x) * 180 / Math.PI;
  if (ascTrop < 0) ascTrop += 360;
  let ascSidereal = (ascTrop - ayanamsa) % 360;
  if (ascSidereal < 0) ascSidereal += 360;

  const lagnaRasi = RASIS[Math.floor(ascSidereal / 30)];

  return {
    grahas: positions,
    lagna: {
      name: "Lagna",
      telugu: "లగ్నం",
      longitude: ascSidereal.toFixed(2),
      degreeInRasi: (ascSidereal % 30).toFixed(2),
      rasi: lagnaRasi
    }
  };
}

console.log(JSON.stringify(getGrahaPositions(new Date()), null, 2));
