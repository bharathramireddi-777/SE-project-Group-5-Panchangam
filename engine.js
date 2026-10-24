const Astronomy = require('astronomy-engine');
const {
  SAMVATSARAMS,
  TITHIS,
  NAKSHATRAMS,
  YOGAS,
  KARANAS,
  VAARAMS,
  RASIS,
  MASAMS,
  RUTHUVULU,
  POPULAR_CITIES
} = require('./constants');

/**
 * Calculates Lahiri (Chitra Paksha) Ayanamsha for a given Julian Date
 */
function getLahiriAyanamsha(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.85709 + 1.396042 * T + 0.000308 * T * T;
}

function normalizeAngle(degrees) {
  let angle = degrees % 360;
  if (angle < 0) angle += 360;
  return angle;
}

function formatTime(date, timeZone = "Asia/Kolkata") {
  if (!date || isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

function formatDate(date, timeZone = "Asia/Kolkata") {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

/**
 * Binary search for boundary crossing
 */
function findBoundaryTime(startDate, targetAngleDeg, angleFunc, searchHours = 36, direction = 1) {
  let low = startDate.getTime();
  let high = low + direction * searchHours * 3600 * 1000;
  if (direction < 0) {
    const tmp = low;
    low = high;
    high = tmp;
  }
  const initialAngle = angleFunc(new Date(low));
  
  for (let i = 0; i < 28; i++) {
    const mid = (low + high) / 2;
    const currentAngle = angleFunc(new Date(mid));
    let diff = normalizeAngle(currentAngle - initialAngle);
    let targetDiff = normalizeAngle(targetAngleDeg - initialAngle);
    if (diff < targetDiff) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return new Date((low + high) / 2);
}

/**
 * Major Telugu Festivals Database
 */
const TELUGU_FESTIVALS = [
  { id: "bhogi", name: "భోగి (Bhogi)", english: "Bhogi", month: 1, day: 13, monthName: "పుష్య", monthNameEn: "Pushya", type: "సంక్రాంతి ప్రారంభం", typeEn: "Harvest Festival Eve", significance: "పాత వస్తువులను అగ్నిలో వేసి సరికొత్త జీవితానికి స్వాగతం పలికే పండుగ.", significanceEn: "The sacred bonfire festival discarding the old and welcoming new beginnings." },
  { id: "sankranti", name: "మకర సంక్రాంతి (Makara Sankranti)", english: "Makara Sankranti", month: 1, day: 14, monthName: "పుష్య", monthNameEn: "Pushya", type: "ఉత్తరాయణ పుణ్యకాలం", typeEn: "Solar Transit & Harvest", significance: "సూర్యుడు మకర రాశిలోకి ప్రవేశించే మహత్తర ఖగోళ సంక్రమణం.", significanceEn: "Major solar festival marking the Sun's auspicious entry into Capricorn (Makara)." },
  { id: "kanuma", name: "కనుమ (Kanuma)", english: "Kanuma", month: 1, day: 15, monthName: "పుష్య", monthNameEn: "Pushya", type: "పశువుల పండుగ", typeEn: "Cattle & Farmer's Day", significance: "వ్యవసాయంలో తోడ్పడే గోవులు, ఎడ్లను పూజించే సాంప్రదాయం.", significanceEn: "Day dedicated to honoring cows and bulls for their vital contribution to farming." },
  { id: "shivaratri", name: "మహా శివరాత్రి (Maha Shivaratri)", english: "Maha Shivaratri", month: 2, day: 26, monthName: "మాఘ", monthNameEn: "Magha", type: "శివారాధన / జాగరణ", typeEn: "Night of Lord Shiva", significance: "పరమశివుని లింగోద్భవ సమయం, మోక్షదాయక రాత్రి.", significanceEn: "The great night of Lord Shiva observed with fasting, meditation and all-night vigil." },
  { id: "holi", name: "హోలీ (Holi / Kamadahana)", english: "Holi", month: 3, day: 24, monthName: "ఫాల్గుణ", monthNameEn: "Phalguna", type: "వసంతోత్సవం / రంగులు", typeEn: "Festival of Spring & Colors", significance: "కామదహనం మరియు ప్రకృతి వసంత శోభకు ప్రతీక.", significanceEn: "Celebration of the victory of devotion, burning of negativity and arrival of spring." },
  { id: "ugadi", name: "ఉగాది (Telugu New Year - Ugadi)", english: "Ugadi", month: 3, day: 29, monthName: "చైత్ర", monthNameEn: "Chaitra", type: "తెలుగు సంవత్సరాది", typeEn: "Telugu Vedic New Year", significance: "చైత్ర శుద్ధ పాడ్యమి నాటి నూతన తెలుగు సంవత్సర ఆరంభం, షడ్రుచుల ఉగాది పచ్చడి.", significanceEn: "Auspicious beginning of the Telugu lunar new year, marked by tasting the Six-Flavor Pachadi." },
  { id: "sri_rama_navami", name: "శ్రీరామ నవమి (Sri Rama Navami)", english: "Sri Rama Navami", month: 4, day: 6, monthName: "చైత్ర", monthNameEn: "Chaitra", type: "సీతారామ కళ్యాణం", typeEn: "Divine Appearance Day of Sri Rama", significance: "మర్యాదా పురుషోత్తముడు శ్రీరామచంద్రుని జన్మదినం మరియు కళ్యాణ మహోత్సవం.", significanceEn: "Appearance day and celestial wedding festival of Lord Sri Rama." },
  { id: "hanuman_jayanti", name: "హనుమాన్ జయంతి (Hanuman Jayanti)", english: "Hanuman Jayanti", month: 5, day: 11, monthName: "వైశాఖ", monthNameEn: "Vaishakha", type: "హనుమద్ వ్రతం", typeEn: "Hanuman Appearance Observance", significance: "వైశాఖ బహుళ దశమి నాడు జరుపుకునే హనుమద్ వ్రతం.", significanceEn: "Celebrated on Vaishakha Krishna Dashami with special Hanuman worship and recitation." },
  { id: "tholi_ekadashi", name: "తొలి ఏకాదశి (Tholi Ekadashi)", english: "Tholi Ekadashi", month: 7, day: 16, monthName: "ఆషాఢ", monthNameEn: "Ashadha", type: "శయన ఏకాదశి", typeEn: "First Ekadashi / Chaturmasya", significance: "శ్రీ మహావిష్ణువు క్షీరసాగరంలో శయనించే పవిత్ర ఏకాదశి, చాతుర్మాస్య వ్రత ప్రారంభం.", significanceEn: "Marks the beginning of Chaturmasya when Lord Vishnu enters cosmic yogic slumber." },
  { id: "varalakshmi", name: "వరలక్ష్మీ వ్రతం (Varalakshmi Vratam)", english: "Varalakshmi Vratam", month: 8, day: 21, monthName: "శ్రావణ", monthNameEn: "Shravana", type: "సౌభాగ్య వ్రతం", typeEn: "Goddess Lakshmi Worship", significance: "శ్రావణ శుక్రవారం నాడు సకల సౌభాగ్యాల కోసం లక్ష్మీదేవికి చేసే పూజ.", significanceEn: "Sacred Friday observance in Shravana seeking the boons of Goddess Lakshmi." },
  { id: "janmashtami", name: "శ్రీ కృష్ణాష్టమి (Janmashtami)", english: "Sri Krishna Janmashtami", month: 8, day: 25, monthName: "శ్రావణ", monthNameEn: "Shravana", type: "గోకులాష్టమి", typeEn: "Birth of Lord Sri Krishna", significance: "శ్రావణ బహుళ అష్టమి రోహిణీ నక్షత్రంలో శ్రీకృష్ణుని ఆవిర్భావం.", significanceEn: "Appearance day of Lord Sri Krishna born under the asterism of Rohini." },
  { id: "vinayaka_chavithi", name: "వినాయక చవితి (Vinayaka Chavithi)", english: "Vinayaka Chavithi", month: 9, day: 14, monthName: "భాద్రపద", monthNameEn: "Bhadrapada", type: "గణపతి నవరాత్రులు", typeEn: "Lord Ganesha Festival", significance: "విఘ్ననాశకుడు శ్రీ గణేశుని జన్మోత్సవం, మట్టి వినాయక పూజ.", significanceEn: "Grand celebration worshiping the remover of all obstacles, Lord Ganesha." },
  { id: "dasara", name: "విజయదశమి / దసరా (Dasara)", english: "Vijayadashami (Dasara)", month: 10, day: 20, monthName: "ఆశ్వయుజ", monthNameEn: "Ashwayuja", type: "శరన్నవరాత్రులు", typeEn: "Triumph of Goddess Durga", significance: "మహిషాసుర మర్దినిగా అమ్మవారి విజయం, ఆయుధ పూజ, శమీ పూజ.", significanceEn: "Celebration of divine triumph over evil, Ayudha Puja and Shami Puja." },
  { id: "diwali", name: "దీపావళి (Deepavali / Diwali)", english: "Diwali", month: 11, day: 8, monthName: "ఆశ్వయుజ/కార్తీక", monthNameEn: "Karthika", type: "దీపాల పండుగ", typeEn: "Festival of Lights", significance: "నరకాసుర వధ అనంతరం లక్ష్మీ కుబేర పూజ, చీకటిపై వెలుగుల విజయం.", significanceEn: "Festival of lights symbolizing the victory of illumination over darkness and Lakshmi worship." },
  { id: "karthika_pournami", name: "కార్తీక పౌర్ణమి (Karthika Pournami)", english: "Karthika Pournami", month: 11, day: 23, monthName: "కార్తీక", monthNameEn: "Karthika", type: "దీపోత్సవం / జ్వాలాతోరణం", typeEn: "Karthika Full Moon", significance: "శివాలయాలలో దీపారాధన, కార్తీక సోమవారాలు, సత్యనారాయణ వ్రతం.", significanceEn: "Sacred full moon celebrated with holy lamp illuminations in temples across Andhra & Telangana." },
  { id: "vaikuntha_ekadashi", name: "వైకుంఠ ఏకాదశి (Vaikuntha Ekadashi)", english: "Vaikuntha Ekadashi", month: 12, day: 20, monthName: "మార్గశిర", monthNameEn: "Margashira", type: "ముక్కోటి ఏకాదశి", typeEn: "Vaikuntha Door Opening Day", significance: "వైకుంఠ ద్వారాలు తెరుచుకునే పవిత్ర దినం, విష్ణు దర్శన పుణ్యఫలం.", significanceEn: "The celestial gates of Vaikuntha open; millions seek divine blessings of Lord Vishnu." }
];

/**
 * Choghadiya (చోఘడియా) order for Weekdays (Day & Night)
 * 7 Types: Amrit (Good), Shubh (Good), Labh (Good), Char (Good), Rog (Bad), Kaal (Bad), Udveg (Bad)
 */
const CHOGHADIYA_TYPES = {
  Amrit: { nameTe: "అమృత్", status: "good", desc: "అమృత ఘడియలు - అత్యంత శుభప్రదం", descEn: "Nectar time - Highly auspicious for all undertakings" },
  Shubh: { nameTe: "శుభ్", status: "good", desc: "సకల శుభకార్యాలకు శ్రేష్ఠమైనది", descEn: "Auspicious window - Ideal for sacred & constructive tasks" },
  Labh: { nameTe: "లాభ్", status: "good", desc: "ధనలాభం, వ్యాపార ప్రారంభాలకు అనుకూలం", descEn: "Gainful period - Best for commerce, trade & financial starts" },
  Char: { nameTe: "చల్ (చర)", status: "good", desc: "ప్రయాణాలు, వాహన కొనుగోలుకు అనుకూలం", descEn: "Movable slot - Suitable for travels and vehicle purchases" },
  Rog: { nameTe: "రోగ్", status: "bad", desc: "అనారోగ్య భయం, వివాదాలకు కారణం (వర్జ్యం)", descEn: "Affliction slot - Avoid conflicts, surgery or new ventures" },
  Kaal: { nameTe: "కాల్", status: "bad", desc: "కాల భయం, నష్టదాయక సమయం (వర్జ్యం)", descEn: "Loss & obstacle window - Strictly inauspicious (Avoid)" },
  Udveg: { nameTe: "ఉద్వేగ్", status: "bad", desc: "మానసిక ఆందోళన, శ్రమ (వర్జ్యం)", descEn: "Agitation & anxiety window - Unfavorable period (Avoid)" }
};

// Day order starting from 1st slot for each weekday (Sun = 0, Mon = 1, etc.)
const DAY_CHOGHADIYA_ORDER = [
  ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],       // Sun
  ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"],       // Mon
  ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],         // Tue
  ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"],         // Wed
  ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"],       // Thu
  ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"],         // Fri
  ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"]          // Sat
];

const NIGHT_CHOGHADIYA_ORDER = [
  ["Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh"],       // Sun night
  ["Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char"],         // Mon night
  ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal"],         // Tue night
  ["Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg"],       // Wed night
  ["Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"],       // Thu night
  ["Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog"],         // Fri night
  ["Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh"]          // Sat night
];

/**
 * Gauri Panchangam (గౌరీ పంచాంగం) Telugu traditional order
 */
const GAURI_ORDER = [
  ["ఉద్యోగం", "శుభం", "లాభం", "ధనం", "విషం", "చోరం", "రోగం", "అమృతం"],       // Sun
  ["అమృతం", "రోగం", "ఉద్యోగం", "శుభం", "లాభం", "ధనం", "విషం", "చోరం"],       // Mon
  ["చోరం", "అమృతం", "రోగం", "ఉద్యోగం", "శుభం", "లాభం", "ధనం", "విషం"],       // Tue
  ["విషం", "చోరం", "అమృతం", "రోగం", "ఉద్యోగం", "శుభం", "లాభం", "ధనం"],       // Wed
  ["ధనం", "విషం", "చోరం", "అమృతం", "రోగం", "ఉద్యోగం", "శుభం", "లాభం"],       // Thu
  ["లాభం", "ధనం", "విషం", "చోరం", "అమృతం", "రోగం", "ఉద్యోగం", "శుభం"],       // Fri
  ["శుభం", "లాభం", "ధనం", "విషం", "చోరం", "అమృతం", "రోగం", "ఉద్యోగం"]        // Sat
];

/**
 * Core Panchangam Calculator Engine with full 5-limb telemetry & micro-timings
 */
function calculatePanchangam(date = new Date(), lat = 17.3850, lng = 78.4867, elevation = 500, timeZone = "Asia/Kolkata") {
  const observer = new Astronomy.Observer(lat, lng, elevation);
  
  const midnightToday = new Date(date);
  midnightToday.setHours(0, 0, 0, 0);

  const sunriseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, midnightToday, 1);
  const sunsetEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, midnightToday, 1);
  
  const sunrise = sunriseEvent ? sunriseEvent.date : new Date(midnightToday.getTime() + 6 * 3600 * 1000);
  const sunset = sunsetEvent ? sunsetEvent.date : new Date(midnightToday.getTime() + 18 * 3600 * 1000);

  // Search Next Sunrise for Night Choghadiya
  const nextMidnight = new Date(midnightToday.getTime() + 24 * 3600 * 1000);
  const nextSunriseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, nextMidnight, 1);
  const nextSunrise = nextSunriseEvent ? nextSunriseEvent.date : new Date(nextMidnight.getTime() + 6 * 3600 * 1000);

  const moonriseEvent = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, +1, midnightToday, 1);
  const moonsetEvent = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, midnightToday, 1);
  const moonrise = moonriseEvent ? moonriseEvent.date : null;
  const moonset = moonsetEvent ? moonsetEvent.date : null;

  const evalTime = date;
  const astroTime = new Astronomy.AstroTime(evalTime);
  const jd = astroTime.ut + 2451545.0;
  const ayanamsha = getLahiriAyanamsha(jd);

  const sunEcliptic = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, astroTime, false));
  const moonEcliptic = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, false));
  
  const sunTropicalLon = sunEcliptic.elon;
  const moonTropicalLon = moonEcliptic.elon;

  const sunSiderealLon = normalizeAngle(sunTropicalLon - ayanamsha);
  const moonSiderealLon = normalizeAngle(moonTropicalLon - ayanamsha);

  // 1. TITHI (LUNAR DAY)
  const tithiDiff = normalizeAngle(moonTropicalLon - sunTropicalLon);
  const tithiIndex = Math.floor(tithiDiff / 12); // 0 to 29
  const tithiObj = TITHIS[tithiIndex];
  const nextTithiAngle = (tithiIndex + 1) * 12;
  const prevTithiAngle = tithiIndex * 12;
  
  // Tithi Completion Percentage
  const tithiDegInCurrent = tithiDiff % 12;
  const tithiCompletedPct = Number(((tithiDegInCurrent / 12) * 100).toFixed(1));

  // Tithi End Time
  const tithiEndTime = findBoundaryTime(evalTime, nextTithiAngle, (d) => {
    const t = new Astronomy.AstroTime(d);
    const m = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, t, false)).elon;
    const s = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, t, false)).elon;
    return normalizeAngle(m - s);
  }, 36, 1);

  // 2. NAKSHATRAM (LUNAR MANSION)
  const nakshatraSpan = 360 / 27; // 13.33333°
  const nakshatraIndex = Math.floor(moonSiderealLon / nakshatraSpan);
  const nakshatraObj = NAKSHATRAMS[nakshatraIndex];
  const pada = Math.floor((moonSiderealLon % nakshatraSpan) / (nakshatraSpan / 4)) + 1;
  const nextNakshatraAngle = (nakshatraIndex + 1) * nakshatraSpan;

  const nakshatraEndTime = findBoundaryTime(evalTime, nextNakshatraAngle, (d) => {
    const t = new Astronomy.AstroTime(d);
    const m = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, t, false)).elon;
    const curAyan = getLahiriAyanamsha(t.ut + 2451545.0);
    return normalizeAngle(m - curAyan);
  }, 36, 1);

  const nakshatraMsRemaining = nakshatraEndTime.getTime() - evalTime.getTime();
  const nakshatraHoursRemaining = (nakshatraMsRemaining / (1000 * 3600)).toFixed(1);

  // 3. YOGAM
  const yogaSum = normalizeAngle(sunSiderealLon + moonSiderealLon);
  const yogaIndex = Math.floor(yogaSum / nakshatraSpan);
  const yogaObj = YOGAS[yogaIndex];
  const nextYogaAngle = (yogaIndex + 1) * nakshatraSpan;
  const yogaEndTime = findBoundaryTime(evalTime, nextYogaAngle, (d) => {
    const t = new Astronomy.AstroTime(d);
    const m = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon, t, false)).elon;
    const s = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, t, false)).elon;
    const curAyan = getLahiriAyanamsha(t.ut + 2451545.0);
    return normalizeAngle(normalizeAngle(m - curAyan) + normalizeAngle(s - curAyan));
  }, 36, 1);

  // 4. KARANAM (HALF TITHI)
  const karanaIndex = Math.floor(tithiDiff / 6);
  function getKarana(idx) {
    if (idx === 0) return KARANAS[10]; // Kimstughna
    if (idx >= 57) return KARANAS[idx - 50]; // Shakuni, Chatushpada, Naga
    return KARANAS[(idx - 1) % 7];
  }
  const currentKarana = getKarana(karanaIndex);
  const upcomingKarana = getKarana((karanaIndex + 1) % 60);

  // 5. VAARAM
  const effectiveDay = date < sunrise ? (date.getDay() + 6) % 7 : date.getDay();
  const vaaramObj = VAARAMS[effectiveDay];

  // 6. RASI (CHANDRA & SURYA) & CHANDRASHTAMA
  const chandraRasiIdx = Math.floor(moonSiderealLon / 30);
  const chandraRasi = RASIS[chandraRasiIdx];
  const suryaRasiIdx = Math.floor(sunSiderealLon / 30);
  const suryaRasi = RASIS[suryaRasiIdx];

  // Chandrashtama is when Moon is in the 8th house from Janma Rasi.
  // In reverse: Which Janma Rasi has Moon currently in its 8th house?
  // House 8 from R_janma = R_moon => R_janma = (R_moon - 7 + 12) % 12
  const chandrashtamaJanmaIdx = (chandraRasiIdx - 7 + 12) % 12;
  const chandrashtamaRasi = RASIS[chandrashtamaJanmaIdx];

  // 7. CALENDAR METADATA
  const year = date.getFullYear();
  const samvatIndex = (year - 1987 + 60) % 60;
  const samvatsaramObj = SAMVATSARAMS[samvatIndex] || SAMVATSARAMS[37];
  const isUttarayanam = (sunSiderealLon >= 270 || sunSiderealLon < 90);
  const ayanam = isUttarayanam
    ? { telugu: "ఉత్తరాయణం", english: "Uttarayanam" }
    : { telugu: "దక్షిణాయనం", english: "Dakshinayanam" };

  const masamIndex = suryaRasiIdx;
  const masamObj = MASAMS[masamIndex] || MASAMS[0];
  const ruthuIndex = Math.floor(masamIndex / 2);
  const ruthuvuObj = RUTHUVULU[ruthuIndex] || RUTHUVULU[0];

  // 8. TIMINGS & MUHURTHAMS
  const dayDurationMs = sunset.getTime() - sunrise.getTime();
  const nightDurationMs = nextSunrise.getTime() - sunset.getTime();
  const daySlotMs = dayDurationMs / 8;
  const nightSlotMs = nightDurationMs / 8;
  const muhurthaMs = dayDurationMs / 15;

  // Rahu Kalam
  const rahuSlots = [7, 1, 6, 4, 5, 3, 2];
  const rahuSlot = rahuSlots[effectiveDay];
  const rahuKalamStart = new Date(sunrise.getTime() + rahuSlot * daySlotMs);
  const rahuKalamEnd = new Date(rahuKalamStart.getTime() + daySlotMs);

  // Live Rahu Kalam Countdown status
  let rahuCountdown = {
    status: "upcoming", // 'upcoming' | 'active' | 'completed'
    message: "",
    targetMs: 0
  };
  const nowMs = evalTime.getTime();
  if (nowMs < rahuKalamStart.getTime()) {
    rahuCountdown.status = "upcoming";
    rahuCountdown.targetMs = rahuKalamStart.getTime() - nowMs;
    const hrs = Math.floor(rahuCountdown.targetMs / 3600000);
    const mins = Math.floor((rahuCountdown.targetMs % 3600000) / 60000);
    rahuCountdown.message = `రాహుకాలం ప్రారంభానికి ఇంకా ${hrs} గం. ${mins} ని. మిగిలివుంది`;
  } else if (nowMs >= rahuKalamStart.getTime() && nowMs <= rahuKalamEnd.getTime()) {
    rahuCountdown.status = "active";
    rahuCountdown.targetMs = rahuKalamEnd.getTime() - nowMs;
    const mins = Math.floor(rahuCountdown.targetMs / 60000);
    rahuCountdown.message = `ప్రస్తుతం రాహుకాలం నడుస్తున్నది (ముగింపు: ఇంకా ${mins} నిమిషాలు)`;
  } else {
    rahuCountdown.status = "completed";
    rahuCountdown.message = "నేటి రాహుకాలం ముగిసినది";
  }

  // Yamagandam & Gulika
  const yamaSlots = [4, 3, 2, 1, 0, 6, 5];
  const yamaSlot = yamaSlots[effectiveDay];
  const yamagandamStart = new Date(sunrise.getTime() + yamaSlot * daySlotMs);
  const yamagandamEnd = new Date(yamagandamStart.getTime() + daySlotMs);

  const gulikaSlots = [6, 5, 4, 3, 2, 1, 0];
  const gulikaSlot = gulikaSlots[effectiveDay];
  const gulikaStart = new Date(sunrise.getTime() + gulikaSlot * daySlotMs);
  const gulikaEnd = new Date(gulikaStart.getTime() + daySlotMs);

  // Abhijit Muhurtham
  const midday = sunrise.getTime() + dayDurationMs / 2;
  const abhijitStart = new Date(midday - 24 * 60 * 1000);
  const abhijitEnd = new Date(midday + 24 * 60 * 1000);

  // Brahma Muhurtham
  const brahmaStart = new Date(sunrise.getTime() - 96 * 60 * 1000);
  const brahmaEnd = new Date(sunrise.getTime() - 48 * 60 * 1000);

  // Durmuhurtham
  const durmuhurthaSlotsMap = [
    [13], [8, 11], [3, 10], [7], [11, 12], [3, 8], [1, 2]
  ];
  const durSlots = durmuhurthaSlotsMap[effectiveDay] || [13];
  const durmuhurthamList = durSlots.map(slot => ({
    start: formatTime(new Date(sunrise.getTime() + slot * muhurthaMs), timeZone),
    end: formatTime(new Date(sunrise.getTime() + (slot + 1) * muhurthaMs), timeZone)
  }));

  // Varjyam & Amrutha Kalam
  const varjyamOffsetMs = (nakshatraObj.varjyamStartGhatika || 30) * 24 * 60 * 1000;
  const varjyamStart = new Date(sunrise.getTime() + (varjyamOffsetMs % (24 * 3600 * 1000)));
  const varjyamEnd = new Date(varjyamStart.getTime() + 96 * 60 * 1000);
  const amruthaStart = new Date(varjyamStart.getTime() + 14 * 24 * 60 * 1000);
  const amruthaEnd = new Date(amruthaStart.getTime() + 96 * 60 * 1000);

  // 9. CHOGHADIYA (DAY & NIGHT)
  const dayChoghadiyaNames = DAY_CHOGHADIYA_ORDER[effectiveDay];
  const nightChoghadiyaNames = NIGHT_CHOGHADIYA_ORDER[effectiveDay];
  const gauriNames = GAURI_ORDER[effectiveDay];

  const dayChoghadiya = dayChoghadiyaNames.map((name, i) => {
    const slotStart = new Date(sunrise.getTime() + i * daySlotMs);
    const slotEnd = new Date(slotStart.getTime() + daySlotMs);
    const meta = CHOGHADIYA_TYPES[name] || {};
    return {
      slot: i + 1,
      name,
      nameTe: meta.nameTe,
      status: meta.status,
      desc: meta.desc,
      descEn: meta.descEn,
      gauriTe: gauriNames[i],
      start: formatTime(slotStart, timeZone),
      end: formatTime(slotEnd, timeZone)
    };
  });

  const nightChoghadiya = nightChoghadiyaNames.map((name, i) => {
    const slotStart = new Date(sunset.getTime() + i * nightSlotMs);
    const slotEnd = new Date(slotStart.getTime() + nightSlotMs);
    const meta = CHOGHADIYA_TYPES[name] || {};
    return {
      slot: i + 1,
      name,
      nameTe: meta.nameTe,
      status: meta.status,
      desc: meta.desc,
      descEn: meta.descEn,
      start: formatTime(slotStart, timeZone),
      end: formatTime(slotEnd, timeZone)
    };
  });

  // 10. FESTIVAL BANNER (Today's festival or next major festival alert)
  const todayMonth = evalTime.getMonth() + 1;
  const todayDay = evalTime.getDate();
  const currentFestival = TELUGU_FESTIVALS.find(f => f.month === todayMonth && Math.abs(f.day - todayDay) <= 1) || null;
  const nextFestival = TELUGU_FESTIVALS.find(f => (f.month > todayMonth) || (f.month === todayMonth && f.day >= todayDay)) || TELUGU_FESTIVALS[0];

  // All Raashis & Nakshatras enriched
  const allRaashis = RASIS.map(r => ({
    ...r,
    isCurrentMoonSign: r.id === chandraRasi.id,
    isCurrentSunSign: r.id === suryaRasi.id,
    isChandrashtama: r.id === chandrashtamaRasi.id
  }));

  const allNakshatras = NAKSHATRAMS.map(n => ({
    ...n,
    isCurrentNakshatra: n.id === nakshatraObj.id,
    currentPada: n.id === nakshatraObj.id ? pada : null
  }));

  return {
    metadata: {
      calculatedAt: evalTime.toISOString(),
      formattedDate: formatDate(evalTime, timeZone),
      isoDate: evalTime.toISOString().split('T')[0],
      location: { lat, lng, elevation, timeZone },
      ayanamshaDegrees: ayanamsha.toFixed(4)
    },
    astronomy: {
      sunrise: formatTime(sunrise, timeZone),
      sunset: formatTime(sunset, timeZone),
      moonrise: moonrise ? formatTime(moonrise, timeZone) : "No Moonrise",
      moonset: moonset ? formatTime(moonset, timeZone) : "No Moonset",
      sunSiderealLon: sunSiderealLon.toFixed(2),
      moonSiderealLon: moonSiderealLon.toFixed(2)
    },
    calendar: {
      samvatsaram: samvatsaramObj,
      ayanam,
      ruthuvu: ruthuvuObj,
      masam: masamObj,
      paksham: {
        telugu: tithiObj.paksha,
        english: tithiObj.pakshaEn
      }
    },
    panchaAngas: {
      tithi: {
        ...tithiObj,
        completedPct: tithiCompletedPct,
        endsAt: formatTime(tithiEndTime, timeZone)
      },
      vaaram: vaaramObj,
      nakshatram: {
        ...nakshatraObj,
        pada,
        hoursRemaining: nakshatraHoursRemaining,
        endsAt: formatTime(nakshatraEndTime, timeZone)
      },
      yogam: {
        ...yogaObj,
        endsAt: formatTime(yogaEndTime, timeZone)
      },
      karanam: {
        ...currentKarana,
        current: currentKarana,
        upcoming: upcomingKarana
      }
    },
    astrology: {
      chandraRasi: {
        ...chandraRasi,
        degreeInRasi: (moonSiderealLon % 30).toFixed(2)
      },
      suryaRasi: {
        ...suryaRasi,
        degreeInRasi: (sunSiderealLon % 30).toFixed(2)
      },
      chandrashtamaRasi: chandrashtamaRasi
    },
    inauspiciousTimings: {
      rahuKalam: {
        start: formatTime(rahuKalamStart, timeZone),
        end: formatTime(rahuKalamEnd, timeZone),
        countdown: rahuCountdown
      },
      yamagandam: {
        start: formatTime(yamagandamStart, timeZone),
        end: formatTime(yamagandamEnd, timeZone)
      },
      gulika: {
        start: formatTime(gulikaStart, timeZone),
        end: formatTime(gulikaEnd, timeZone)
      },
      durmuhurtham: durmuhurthamList,
      varjyam: {
        start: formatTime(varjyamStart, timeZone),
        end: formatTime(varjyamEnd, timeZone)
      }
    },
    auspiciousTimings: {
      abhijitMuhurtham: effectiveDay === 3 ? "బుధవారం నాడు అభిజిత్ వర్జ్యం (Wed: Not Recommended)" : {
        start: formatTime(abhijitStart, timeZone),
        end: formatTime(abhijitEnd, timeZone)
      },
      amruthaKalam: {
        start: formatTime(amruthaStart, timeZone),
        end: formatTime(amruthaEnd, timeZone)
      },
      brahmaMuhurtham: {
        start: formatTime(brahmaStart, timeZone),
        end: formatTime(brahmaEnd, timeZone)
      }
    },
    choghadiya: {
      day: dayChoghadiya,
      night: nightChoghadiya
    },
    festivalBanner: {
      current: currentFestival,
      next: nextFestival
    },
    allRaashis,
    allNakshatras,
    festivals: TELUGU_FESTIVALS
  };
}

/**
 * Generate full Monthly Calendar data for a given year and month (1-12)
 */
function getMonthlyCalendar(year = 2026, month = 10, lat = 17.3850, lng = 78.4867, timeZone = "Asia/Kolkata") {
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(year, month - 1, d, 6, 0, 0); // 6 AM evaluation
    const panchangam = calculatePanchangam(dayDate, lat, lng, 500, timeZone);
    const fest = TELUGU_FESTIVALS.find(f => f.month === month && f.day === d) || null;

    calendarDays.push({
      dayNumber: d,
      dateString: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dayOfWeek: dayDate.getDay(),
      dayName: VAARAMS[dayDate.getDay()].english.split(' ')[0],
      dayNameTe: VAARAMS[dayDate.getDay()].telugu.split(' ')[0],
      tithi: panchangam.panchaAngas.tithi.telugu,
      tithiEn: panchangam.panchaAngas.tithi.english,
      paksha: panchangam.calendar.paksham.telugu,
      isPournami: panchangam.panchaAngas.tithi.id === 15,
      isAmavasya: panchangam.panchaAngas.tithi.id === 30,
      isEkadashi: panchangam.panchaAngas.tithi.id === 11 || panchangam.panchaAngas.tithi.id === 26,
      nakshatra: panchangam.panchaAngas.nakshatram.telugu,
      nakshatraEn: panchangam.panchaAngas.nakshatram.english,
      chandraRasi: panchangam.astrology.chandraRasi.telugu,
      festival: fest
    });
  }

  return {
    year,
    month,
    monthNameEn: new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' }),
    daysInMonth,
    firstDayOfWeek: new Date(year, month - 1, 1).getDay(), // 0 = Sun
    days: calendarDays
  };
}

module.exports = {
  calculatePanchangam,
  getMonthlyCalendar,
  getLahiriAyanamsha,
  formatTime,
  formatDate
};
