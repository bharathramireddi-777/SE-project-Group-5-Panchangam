const { calculatePanchangam } = require('./engine');
const { POPULAR_CITIES } = require('./constants');

console.log("=======================================================================");
console.log("       శ్రీ శుభమస్తు - TELUGU PANCHANGAM ASTRONOMICAL ENGINE TEST");
console.log("=======================================================================\n");

const testCity = POPULAR_CITIES[0]; // Hyderabad
const now = new Date();

console.log(`Calculating Panchangam for: ${testCity.telugu} (${testCity.name})`);
console.log(`Date & Time: ${now.toLocaleString("en-IN", { timeZone: testCity.tz })}\n`);

const result = calculatePanchangam(now, testCity.lat, testCity.lng, 500, testCity.tz);

console.log("------------------ క్యాలెండర్ వివరాలు (CALENDAR DETAILS) ------------------");
console.log(`సంవత్సరం (Year)   : ${result.calendar.samvatsaram.telugu} నామ సంవత్సరం (${result.calendar.samvatsaram.english})`);
console.log(`ఆయనం (Ayanam)     : ${result.calendar.ayanam.telugu} (${result.calendar.ayanam.english})`);
console.log(`ఋతువు (Season)    : ${result.calendar.ruthuvu.telugu} (${result.calendar.ruthuvu.english})`);
console.log(`మాసం (Month)      : ${result.calendar.masam.telugu} (${result.calendar.masam.english})`);
console.log(`పక్షం (Paksham)    : ${result.calendar.paksham.telugu} (${result.calendar.paksham.english})`);
console.log(`అయనాంశం (Ayanamsa): ${result.metadata.ayanamshaDegrees}°\n`);

console.log("------------------ పంచాంగం (THE FIVE LIMBS / PANCHA-ANGAS) ------------------");
console.log(`1. తిథి (Tithi)      : ${result.panchaAngas.tithi.telugu} (${result.panchaAngas.tithi.english}) - ముగింపు: ${result.panchaAngas.tithi.endsAt}`);
console.log(`2. వారం (Vaaram)     : ${result.panchaAngas.vaaram.telugu} (${result.panchaAngas.vaaram.english})`);
console.log(`3. నక్షత్రం (Star)   : ${result.panchaAngas.nakshatram.telugu} (${result.panchaAngas.nakshatram.english}) [పాదం: ${result.panchaAngas.nakshatram.pada}] - ముగింపు: ${result.panchaAngas.nakshatram.endsAt}`);
console.log(`4. యోగం (Yoga)       : ${result.panchaAngas.yogam.telugu} (${result.panchaAngas.yogam.english})`);
console.log(`5. కరణం (Karana)     : ${result.panchaAngas.karanam.telugu} (${result.panchaAngas.karanam.english})\n`);

console.log("------------------ సూర్యోదయ / చంద్రాస్తమయ సమయాలు (SUN & MOON) ------------------");
console.log(`సూర్యోదయం (Sunrise) : ${result.astronomy.sunrise}`);
console.log(`సూర్యాస్తమయం (Sunset) : ${result.astronomy.sunset}`);
console.log(`చంద్రోదయం (Moonrise): ${result.astronomy.moonrise}`);
console.log(`చంద్రాస్తమయం (Moonset): ${result.astronomy.moonset}`);
console.log(`చంద్ర రాశి (Moon Sign): ${result.astrology.chandraRasi.telugu} (${result.astrology.chandraRasi.english})`);
console.log(`సూర్య రాశి (Sun Sign) : ${result.astrology.suryaRasi.telugu} (${result.astrology.suryaRasi.english})\n`);

console.log("------------------ వర్జ్య సమయాలు (INAUSPICIOUS TIMINGS) ------------------");
console.log(`రాహుకాలం (Rahu Kalam)   : ${result.inauspiciousTimings.rahuKalam.start} నుండి ${result.inauspiciousTimings.rahuKalam.end}`);
console.log(`యమగండం (Yamagandam)     : ${result.inauspiciousTimings.yamagandam.start} నుండి ${result.inauspiciousTimings.yamagandam.end}`);
console.log(`గుళిక కాలం (Gulika)      : ${result.inauspiciousTimings.gulika.start} నుండి ${result.inauspiciousTimings.gulika.end}`);
console.log(`దుర్ముహూర్తం (Durmuhurtham): ${result.inauspiciousTimings.durmuhurtham.map(d => `${d.start} - ${d.end}`).join(', ')}`);
console.log(`వర్జ్యం (Varjyam)         : ${result.inauspiciousTimings.varjyam.start} నుండి ${result.inauspiciousTimings.varjyam.end}\n`);

console.log("------------------ శుభ సమయాలు (AUSPICIOUS TIMINGS) ------------------");
if (typeof result.auspiciousTimings.abhijitMuhurtham === 'string') {
  console.log(`అభిజిత్ ముహూర్తం (Abhijit) : ${result.auspiciousTimings.abhijitMuhurtham}`);
} else {
  console.log(`అభిజిత్ ముహూర్తం (Abhijit) : ${result.auspiciousTimings.abhijitMuhurtham.start} నుండి ${result.auspiciousTimings.abhijitMuhurtham.end}`);
}
console.log(`అమృత కాలం (Amrutha Kalam) : ${result.auspiciousTimings.amruthaKalam.start} నుండి ${result.auspiciousTimings.amruthaKalam.end}`);
console.log(`బ్రహ్మ ముహూర్తం (Brahma)   : ${result.auspiciousTimings.brahmaMuhurtham.start} నుండి ${result.auspiciousTimings.brahmaMuhurtham.end}`);
console.log("\n=======================================================================");
