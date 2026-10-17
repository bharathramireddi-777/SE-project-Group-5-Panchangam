/**
 * Telugu Panchangam - Universal Controller & Full Bilingual i18n Engine
 * Translates the entire website between Telugu and English dynamically
 */

// 1. STARFIELD BACKGROUND ENGINE
function initStarfield() {
  if (document.getElementById('starfield-canvas')) return;
  
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield-canvas';
  document.body.prepend(canvas);

  const n1 = document.createElement('div');
  n1.className = 'nebula-glow-1';
  const n2 = document.createElement('div');
  n2.className = 'nebula-glow-2';
  document.body.prepend(n2);
  document.body.prepend(n1);

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  const STAR_COUNT = 200;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = (Math.random() - 0.5) * width * 1.5;
      this.y = (Math.random() - 0.5) * height * 1.5;
      this.z = Math.random() * 1000;
      this.radius = Math.random() * 1.4 + 0.3;
      this.hue = Math.random() > 0.6 ? 190 + Math.random() * 80 : 40 + Math.random() * 30;
      this.alpha = Math.random() * 0.7 + 0.3;
      this.twinkleSpeed = 0.02 + Math.random() * 0.03;
    }
    update() {
      this.z -= 0.35;
      this.alpha += Math.sin(Date.now() * this.twinkleSpeed) * 0.015;
      if (this.alpha < 0.2) this.alpha = 0.2;
      if (this.alpha > 0.95) this.alpha = 0.95;
      if (this.z <= 0) {
        this.reset();
        this.z = 1000;
      }
    }
    draw() {
      const sx = (this.x / this.z) * 400 + width / 2;
      const sy = (this.y / this.z) * 400 + height / 2;

      if (sx < 0 || sx >= width || sy < 0 || sy >= height) return;

      const r = (1 - this.z / 1000) * this.radius * 2;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.6, r), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(s => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// 2. BILINGUAL DICTIONARY (TELUGU <-> ENGLISH)
const I18N = {
  te: {
    // Header & Brand
    brand_sub: "సౌర కుటుంబం • ఖగోళ పంచాంగం",
    brand_title: "శ్రీ తెలుగు పంచాంగం",
    nav_home: "సౌర కుటుంబం",
    nav_panchangam: "పంచాంగం",
    nav_calendar: "క్యాలెండర్",
    nav_raashulu: "రాశులు",
    nav_nakshatralu: "నక్షత్రాలు",
    nav_muhurthams: "ముహూర్తాలు",
    nav_festivals: "పండుగలు",
    btn_lang_toggle: "English",

    // Cities
    city_hyd: "హైదరాబాద్ (Hyderabad)",
    city_bza: "విజయవాడ (Vijayawada)",
    city_vtz: "విశాఖపట్నం (Vizag)",
    city_tpt: "తిరుపతి (Tirupati)",
    city_wgl: "వరంగల్ (Warangal)",
    city_blr: "బెంగళూరు (Bengaluru)",
    city_dal: "డల్లాస్ (Dallas USA)",

    // Hero Section
    hero_badge: "✨ సౌర మండల ఖగోళ పంచాంగం • REALISTIC SOLAR SYSTEM",
    hero_title: "సూర్య కేంద్రక ఖగోళ కాలగణన",
    hero_sub: "సూర్యుని చుట్టూ భ్రమణం చేస్తున్న గ్రహాలు, తిథి, నక్షత్ర, ముహూర్త మరియు చంద్రాష్టమ ఖగోళ స్థితిగతుల ప్రత్యక్ష దర్శనం.",
    hero_btn_panchangam: "🪔 నేటి సమగ్ర పంచాంగం (Daily View)",
    hero_btn_calendar: "📅 మాస క్యాలెండర్ (Monthly Grid)",

    // Festival Alert Banner
    fest_alert_label: "పండుగ సమాచారం:",
    fest_all_link: "అన్ని పండుగలు ➔",

    // Today Overview Dashboard
    dash_tithi_heading: "01. తిథి (CURRENT TITHI)",
    dash_nakshatra_heading: "02. నక్షత్రం (LUNAR MANSION)",
    dash_rahu_heading: "03. రాహుకాలం కౌంట్‌డౌన్ (COUNTDOWN)",
    dash_completed_suffix: "పూర్తయింది",
    dash_ends_at: "ముగింపు సమయం:",
    dash_hours_rem: "ఇంకా {h} గంటలు",
    dash_ruler_label: "అధిపతి గ్రహం:",
    dash_rahu_slot_label: "నేటి రాహుకాల సమయం:",
    dash_rahu_start_msg: "రాహుకాలం ప్రారంభానికి సమయం",
    dash_rahu_active_msg: "ప్రస్తుతం రాహుకాలం అమల్లో ఉంది (వర్జ్యం)",
    dash_rahu_end_msg: "నేటి రాహుకాలం ముగిసినది",
    badge_upcoming: "త్వరలో రానుంది",
    badge_active: "ప్రస్తుతం అమల్లో ఉంది",
    badge_completed: "ముగిసినది",

    // Modules Section
    modules_heading: "ఖగోళ విభాగాలు • EXPLORE MODULES",
    modules_sub: "అన్ని విభాగాలు అందుబాటులో ఉన్నాయి ➔",
    mod_panchangam_title: "వివర పంచాంగం",
    mod_panchangam_desc: "5 అంగాల సమగ్ర పట్టిక",
    mod_calendar_title: "నెలవారీ క్యాలెండర్",
    mod_calendar_desc: "పూర్తి మాస దినదర్శిక",
    mod_raashulu_title: "ద్వాదశ రాశులు",
    mod_raashulu_desc: "12 రాశులు & చంద్రాష్టమం",
    mod_nakshatralu_title: "27 నక్షత్రాలు",
    mod_nakshatralu_desc: "నక్షత్ర పాదాలు & అధిపతులు",
    mod_muhurthams_title: "శుభ & వర్జ్యాలు",
    mod_muhurthams_desc: "చోఘడియా & సమయాలు",
    mod_festivals_title: "పండుగలు & వ్రతాలు",
    mod_festivals_desc: "సంవత్సర పర్వదినాలు",

    // Panchangam Page Detailed
    p_page_tag: "🌌 ఖగోళ వేద కాలదర్శిక",
    p_page_title: "నేటి సమగ్ర పంచాంగం (Daily Panchangam)",
    p_page_desc: "సూర్యోదయ ఆధారిత తిథి, వార, నక్షత్ర, యోగ, కరణ, ముహూర్త, చోఘడియా మరియు చంద్రాష్టమ ఖగోళ గణనలు",
    p_samvat_label: "సంవత్సరం (Year)",
    p_ayanam_label: "ఆయనం (Solstice)",
    p_ruthu_label: "ఋతువు (Season)",
    p_masam_label: "మాసం (Month)",
    p_paksham_label: "పక్షం (Fortnight)",
    p_ayanamsa_label: "అయనాంశం (Lahiri)",
    p_chandrashtama_title: "చంద్రాష్టమ రాశి సూచిక (Chandrashtama Indicator)",
    p_chandrashtama_badge: "జాగ్రత్త అవసరం",
    p_chandrashtama_prefix: "నేటి చంద్రాష్టమం:",
    p_chandrashtama_desc: "చంద్రుడు జన్మరాశికి 8వ రాశిలో సంచరించు కాలం. ఈ రాశివారు వివాదాలు, కొత్త కార్యారంభాలు, మరియు ప్రధాన ప్రయాణాలలో అప్రమత్తంగా ఉండవలెను.",
    p_rahu_title: "రాహుకాలం లైవ్ సమయం (Rahu Kalam Tracker)",
    p_rahu_desc: "రాహుకాలంలో శుభకార్యాలు, క్రయవిక్రయాలు ప్రారంభించరాదని జ్యోతిష్య శాస్త్ర నియమం.",
    p_limbs_title: "పంచాంగములు - ఐదు ప్రధాన అంగాలు (The 5 Cosmic Limbs)",
    p_limb_tithi: "01. తిథి (TITHI)",
    p_limb_vaaram: "02. వారం (VAARAM)",
    p_limb_nakshatram: "03. నక్షత్రం (STAR)",
    p_limb_yogam: "04. యోగం (YOGAM)",
    p_limb_karanam: "05. కరణం (KARANAM)",
    p_ruler_label: "వాసర అధిపతి:",
    p_nature_label: "స్వభావం:",
    p_upcoming_karana_label: "తదుపరి కరణం:",
    p_sun_moon_timings: "సూర్యోదయ & చంద్రోదయ సమయాలు (Sun & Moon Timings)",
    p_sunrise: "సూర్యోదయం (Sunrise)",
    p_sunset: "సూర్యాస్తమయం (Sunset)",
    p_moonrise: "చంద్రోదయం (Moonrise)",
    p_moonset: "చంద్రాస్తమయం (Moonset)",
    p_coords_label: "ఖగోళ నిరూపకాలు:",
    p_day_dur_label: "సౌర దిన సమయం:",
    p_planetary_rasis: "రాశి సంచారము (Planetary Rasis)",
    p_sun_rasi: "సూర్య రాశి (Sun Sign)",
    p_moon_rasi: "చంద్ర రాశి (Moon Sign)",
    p_ausp_timings: "శుభ సమయాలు (Auspicious Timings)",
    p_inausp_timings: "అశుభ సమయాలు (Inauspicious Timings)",
    p_brahma_muhurtham: "బ్రహ్మ ముహూర్తం (Brahma Muhurtham)",
    p_abhijit_muhurtham: "అభిజిత్ ముహూర్తం (Abhijit Muhurtham)",
    p_amrit_kalam: "అమృత కాలం (Amrit Kalam)",
    p_rahu_kalam: "రాహు కాలం (Rahu Kalam)",
    p_yamagandam: "యమగండం (Yamagandam)",
    p_gulika: "గుళికా కాలం (Gulika Kalam)",
    p_durmuhurtham: "దుర్ముహూర్తం (Durmuhurtham)",
    p_varjyam: "వర్జ్యం (Varjyam)",
    p_choghadiya_title: "గౌరీ పంచాంగం & చోఘడియా (Gauri Panchangam & Choghadiya)",
    p_choghadiya_sub: "తక్షణ నిర్ణయాల కోసం పగలు మరియు రాత్రి ఎనిమిది విభాగాల సమయ సూచిక",
    p_btn_day: "☀️ పగటి సమయాలు (Day)",
    p_btn_night: "🌙 రాత్రి సమయాలు (Night)",
    p_tbl_slot: "విభాగం (Slot)",
    p_tbl_timing: "సమయం (Timing)",
    p_tbl_choghadiya: "చోఘడియా (Choghadiya)",
    p_tbl_gauri: "గౌరీ పంచాంగం",
    p_tbl_status: "ఫలితం (Status)",
    p_tbl_significance: "వివరణ (Significance)",
    status_good: "శుభం (Good)",
    status_bad: "అశుభం (Bad)",

    // Calendar Page
    cal_tag: "📅 సౌర & చాంద్రమాన దినదర్శిక",
    cal_title: "తెలుగు మాస క్యాలెండర్ (Telugu Calendar Grid)",
    cal_desc: "ప్రతి రోజూ తిథి, నక్షత్రం, పౌర్ణమి, అమావాస్య మరియు పండుగల సమగ్ర పట్టిక. ఏ తేదీనైనా క్లిక్ చేసి సమగ్ర పంచాంగం చూడవచ్చు.",
    cal_btn_prev: "◀ పూర్వ మాసం",
    cal_btn_next: "తదుపరి మాసం ▶",
    cal_fest_heading: "ఈ మాసంలోని ప్రధాన పండుగలు & వ్రతాలు (Festivals this Month)",
    badge_pournami: "పౌర్ణమి",
    badge_amavasya: "అమావాస్య",
    badge_ekadashi: "ఏకాదశి",

    // Footer
    footer_text: "శ్రీ తెలుగు పంచాంగం • సౌర కుటుంబ ఖగోళ వివరాలు & పంచాంగ గణన వ్యవస్థ"
  },

  en: {
    // Header & Brand
    brand_sub: "Solar System • Vedic Almanac",
    brand_title: "Sri Telugu Panchangam",
    nav_home: "Solar System",
    nav_panchangam: "Panchangam",
    nav_calendar: "Calendar",
    nav_raashulu: "Raashis",
    nav_nakshatralu: "Nakshatras",
    nav_muhurthams: "Muhurthams",
    nav_festivals: "Festivals",
    btn_lang_toggle: "తెలుగు",

    // Cities
    city_hyd: "Hyderabad (HYD)",
    city_bza: "Vijayawada (BZA)",
    city_vtz: "Visakhapatnam (VTZ)",
    city_tpt: "Tirupati (TPT)",
    city_wgl: "Warangal (WGL)",
    city_blr: "Bengaluru (BLR)",
    city_dal: "Dallas (USA)",

    // Hero Section
    hero_badge: "✨ COSMIC SOLAR SYSTEM • REALISTIC EPHEMERIS",
    hero_title: "Heliocentric Cosmic Almanac",
    hero_sub: "Live celestial observation of planetary orbits around the Sun, Tithi, Nakshatra, Muhurthams, and Chandrashtama.",
    hero_btn_panchangam: "🪔 Detailed Daily Panchangam",
    hero_btn_calendar: "📅 Monthly Calendar Grid",

    // Festival Alert Banner
    fest_alert_label: "Festival Alert:",
    fest_all_link: "All Festivals ➔",

    // Today Overview Dashboard
    dash_tithi_heading: "01. TITHI (Lunar Day)",
    dash_nakshatra_heading: "02. NAKSHATRAM (Constellation)",
    dash_rahu_heading: "03. RAHU KALAM (Live Countdown)",
    dash_completed_suffix: "Completed",
    dash_ends_at: "Ends At:",
    dash_hours_rem: "{h} hours remaining",
    dash_ruler_label: "Ruling Planet:",
    dash_rahu_slot_label: "Today's Rahu Kalam Window:",
    dash_rahu_start_msg: "Time until Rahu Kalam begins",
    dash_rahu_active_msg: "Rahu Kalam is currently ACTIVE (Avoid new ventures)",
    dash_rahu_end_msg: "Rahu Kalam has ended for today",
    badge_upcoming: "UPCOMING",
    badge_active: "ACTIVE NOW",
    badge_completed: "COMPLETED",

    // Modules Section
    modules_heading: "COSMIC MODULES • EXPLORE",
    modules_sub: "ALL MODULES LINKED & REDIRECTING ➔",
    mod_panchangam_title: "Daily Panchangam",
    mod_panchangam_desc: "5 Limbs Tabular View",
    mod_calendar_title: "Monthly Calendar",
    mod_calendar_desc: "Full Month Grid & Festivals",
    mod_raashulu_title: "12 Zodiac Signs",
    mod_raashulu_desc: "12 Signs & Chandrashtama",
    mod_nakshatralu_title: "27 Nakshatras",
    mod_nakshatralu_desc: "Quarter Padas & Deities",
    mod_muhurthams_title: "Muhurthams & Choghadiya",
    mod_muhurthams_desc: "Auspicious & Inauspicious Timings",
    mod_festivals_title: "Festivals & Vratams",
    mod_festivals_desc: "Sacred Celebrations of the Year",

    // Panchangam Page Detailed
    p_page_tag: "🌌 ASTRONOMICAL VEDIC ALMANAC",
    p_page_title: "Detailed Daily Panchangam",
    p_page_desc: "Sunrise-based calculations of Tithi, Vaaram, Nakshatra, Yoga, Karana, Muhurtham, Choghadiya & Chandrashtama.",
    p_samvat_label: "Year (Samvatsara)",
    p_ayanam_label: "Solstice (Ayanam)",
    p_ruthu_label: "Season (Ritu)",
    p_masam_label: "Month (Masa)",
    p_paksham_label: "Fortnight (Paksha)",
    p_ayanamsa_label: "Ayanamsha (Lahiri)",
    p_chandrashtama_title: "Chandrashtama Indicator (Moon in 8th House)",
    p_chandrashtama_badge: "Caution Advised",
    p_chandrashtama_prefix: "Today's Chandrashtama:",
    p_chandrashtama_desc: "The period when the Moon transits the 8th sign from the birth moon sign. Individuals with this sign should exercise extra caution in new ventures, travel, and conflicts.",
    p_rahu_title: "Rahu Kalam Live Tracker",
    p_rahu_desc: "According to Vedic astrology, avoid initiating auspicious ventures and major agreements during Rahu Kalam.",
    p_limbs_title: "Pancha-Angas: The Five Cosmic Limbs",
    p_limb_tithi: "01. TITHI (Lunar Day)",
    p_limb_vaaram: "02. VAARAM (Solar Day)",
    p_limb_nakshatram: "03. NAKSHATRAM (Constellation)",
    p_limb_yogam: "04. YOGAM (Luni-Solar Angle)",
    p_limb_karanam: "05. KARANAM (Half Tithi)",
    p_ruler_label: "Day Ruler:",
    p_nature_label: "Nature:",
    p_upcoming_karana_label: "Upcoming Karana:",
    p_sun_moon_timings: "Sun & Moon Timings (Ephemeris)",
    p_sunrise: "Sunrise",
    p_sunset: "Sunset",
    p_moonrise: "Moonrise",
    p_moonset: "Moonset",
    p_coords_label: "Coordinates:",
    p_day_dur_label: "Daylight Duration:",
    p_planetary_rasis: "Planetary Transits (Signs)",
    p_sun_rasi: "Sun Sign (Surya Rasi)",
    p_moon_rasi: "Moon Sign (Chandra Rasi)",
    p_ausp_timings: "Auspicious Timings (Good Hours)",
    p_inausp_timings: "Inauspicious Timings (Avoidance)",
    p_brahma_muhurtham: "Brahma Muhurtham",
    p_abhijit_muhurtham: "Abhijit Muhurtham",
    p_amrit_kalam: "Amrit Kalam",
    p_rahu_kalam: "Rahu Kalam",
    p_yamagandam: "Yamagandam",
    p_gulika: "Gulika Kalam",
    p_durmuhurtham: "Durmuhurtham",
    p_varjyam: "Varjyam",
    p_choghadiya_title: "Gauri Panchangam & Choghadiya",
    p_choghadiya_sub: "Eight-slot daily divisions for quick decision making (Day & Night)",
    p_btn_day: "☀️ Day Timings",
    p_btn_night: "🌙 Night Timings",
    p_tbl_slot: "Slot #",
    p_tbl_timing: "Timing Window",
    p_tbl_choghadiya: "Choghadiya",
    p_tbl_gauri: "Gauri Panchangam",
    p_tbl_status: "Status",
    p_tbl_significance: "Significance",
    status_good: "Good (Auspicious)",
    status_bad: "Bad (Inauspicious)",

    // Calendar Page
    cal_tag: "📅 LUNISOLAR MONTHLY ALMANAC",
    cal_title: "Monthly Calendar Grid",
    cal_desc: "Comprehensive monthly calendar with daily Tithi, Nakshatra, Full Moon, New Moon, and festival highlights.",
    cal_btn_prev: "◀ Previous Month",
    cal_btn_next: "Next Month ▶",
    cal_fest_heading: "Major Festivals & Observances this Month",
    badge_pournami: "Pournami (Full Moon)",
    badge_amavasya: "Amavasya (New Moon)",
    badge_ekadashi: "Ekadashi",

    // Footer
    footer_text: "Sri Telugu Panchangam • Astronomical Ephemeris & Vedic Calculations"
  }
};

// 3. STATE MANAGEMENT & GETTERS/SETTERS
function getStoredLang() {
  const l = localStorage.getItem('telugu_panchangam_lang') || localStorage.getItem('astra_lang');
  return (l === 'en' || l === 'te') ? l : 'te';
}

function setStoredLang(lang) {
  localStorage.setItem('telugu_panchangam_lang', lang);
  localStorage.setItem('astra_lang', lang);
}

function getStoredCity() {
  return localStorage.getItem('telugu_panchangam_city') || localStorage.getItem('astra_city') || '17.3850,78.4867,Hyderabad,Asia/Kolkata';
}

function setStoredCity(cityStr) {
  localStorage.setItem('telugu_panchangam_city', cityStr);
  localStorage.setItem('astra_city', cityStr);
}

function getStoredDate() {
  const urlParams = new URLSearchParams(window.location.search);
  const qDate = urlParams.get('date');
  if (qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate)) {
    localStorage.setItem('telugu_panchangam_date', qDate);
    return qDate;
  }
  const d = localStorage.getItem('telugu_panchangam_date') || localStorage.getItem('astra_date');
  if (d) return d;
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function setStoredDate(dateStr) {
  localStorage.setItem('telugu_panchangam_date', dateStr);
}

// 4. AUTOMATIC PAGE LOCALIZATION
function applyI18nTranslations(lang = null) {
  const activeLang = lang || getStoredLang();
  const dict = I18N[activeLang] || I18N.te;

  // Apply to all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  // Apply to all elements with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (dict[key]) {
      el.setAttribute('title', dict[key]);
    }
  });

  // Update language toggle button label
  const langToggleBtn = document.getElementById('globalLangToggle') || document.getElementById('home-lang-label');
  if (langToggleBtn) {
    langToggleBtn.textContent = dict.btn_lang_toggle;
  }

  // Update City dropdown options
  const citySelect = document.getElementById('globalCitySelect') || document.getElementById('home-city-select');
  if (citySelect) {
    const opts = citySelect.options;
    if (opts.length >= 7) {
      opts[0].textContent = dict.city_hyd;
      opts[1].textContent = dict.city_bza;
      opts[2].textContent = dict.city_vtz;
      opts[3].textContent = dict.city_tpt;
      opts[4].textContent = dict.city_wgl;
      opts[5].textContent = dict.city_blr;
      opts[6].textContent = dict.city_dal;
    }
  }
}

// 5. CLEAN SUB-PAGE HEADER WITH SYNCED TRANSLATION
function renderCosmicHeader(activePage = 'home') {
  const lang = getStoredLang();
  const dict = I18N[lang] || I18N.te;

  const headerHtml = `
  <header class="border-b border-white/10 backdrop-blur-2xl bg-black/80 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      
      <!-- Back to Solar System Button -->
      <a href="/" class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/60 text-slate-200 hover:text-white transition group">
        <span class="text-amber-400 group-hover:-translate-x-1 transition">←</span>
        <span class="text-base">☀️</span>
        <span class="text-xs font-bold font-mono uppercase tracking-wider text-amber-300" data-i18n="nav_home">${dict.nav_home}</span>
      </a>

      <!-- Quick Direct Redirect Hub -->
      <div class="flex flex-wrap items-center gap-1.5">
        <a href="/panchangam" class="px-2.5 py-1 rounded-lg text-xs font-semibold ${activePage === 'panchangam' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'} transition">
          🪔 <span data-i18n="nav_panchangam">${dict.nav_panchangam}</span>
        </a>
        <a href="/calendar" class="px-2.5 py-1 rounded-lg text-xs font-semibold ${activePage === 'calendar' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'text-slate-400 hover:text-white'} transition">
          📅 <span data-i18n="nav_calendar">${dict.nav_calendar}</span>
        </a>
        <a href="/raashulu" class="px-2.5 py-1 rounded-lg text-xs font-semibold ${activePage === 'raashulu' ? 'bg-violet-950 text-violet-300 border border-violet-500/50' : 'text-slate-400 hover:text-white'} transition">
          ♈ <span data-i18n="nav_raashulu">${dict.nav_raashulu}</span>
        </a>
        <a href="/nakshatralu" class="px-2.5 py-1 rounded-lg text-xs font-semibold ${activePage === 'nakshatralu' ? 'bg-amber-950 text-amber-300 border border-amber-500/50' : 'text-slate-400 hover:text-white'} transition">
          ✨ <span data-i18n="nav_nakshatralu">${dict.nav_nakshatralu}</span>
        </a>
        <a href="/muhurthams" class="px-2.5 py-1 rounded-lg text-xs font-semibold ${activePage === 'muhurthams' ? 'bg-rose-950 text-rose-300 border border-rose-500/50' : 'text-slate-400 hover:text-white'} transition">
          ⏳ <span data-i18n="nav_muhurthams">${dict.nav_muhurthams}</span>
        </a>
        <a href="/festivals" class="px-2.5 py-1 rounded-lg text-xs font-semibold ${activePage === 'festivals' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'} transition">
          🎉 <span data-i18n="nav_festivals">${dict.nav_festivals}</span>
        </a>
      </div>

      <!-- Controls: City, Date, Language -->
      <div class="flex items-center gap-2">
        <div class="flex items-center bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs">
          <span class="text-cyan-400 mr-1">📍</span>
          <select id="globalCitySelect" onchange="onGlobalCityChange(this.value)" class="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer">
            <option value="17.3850,78.4867,Hyderabad,Asia/Kolkata" class="bg-slate-900">${dict.city_hyd}</option>
            <option value="16.5062,80.6480,Vijayawada,Asia/Kolkata" class="bg-slate-900">${dict.city_bza}</option>
            <option value="17.6868,83.2185,Visakhapatnam,Asia/Kolkata" class="bg-slate-900">${dict.city_vtz}</option>
            <option value="13.6288,79.4192,Tirupati,Asia/Kolkata" class="bg-slate-900">${dict.city_tpt}</option>
            <option value="17.9689,79.5941,Warangal,Asia/Kolkata" class="bg-slate-900">${dict.city_wgl}</option>
            <option value="12.9716,77.5946,Bengaluru,Asia/Kolkata" class="bg-slate-900">${dict.city_blr}</option>
            <option value="32.7767,-96.7970,Dallas,America/Chicago" class="bg-slate-900">${dict.city_dal}</option>
          </select>
        </div>

        <input type="date" id="globalDatePicker" onchange="onGlobalDateChange(this.value)" class="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none cursor-pointer">

        <button id="globalLangToggle" onclick="toggleGlobalLang()" class="px-2.5 py-1 bg-gradient-to-r from-amber-600/40 to-orange-600/40 hover:from-amber-600/60 hover:to-orange-600/60 border border-amber-500/50 rounded-lg text-xs font-bold text-amber-200 transition">
          ${dict.btn_lang_toggle}
        </button>
      </div>

    </div>
  </header>
  `;

  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = headerHtml;
    const citySel = document.getElementById('globalCitySelect');
    if (citySel) citySel.value = getStoredCity();
    const dateInput = document.getElementById('globalDatePicker');
    if (dateInput) dateInput.value = getStoredDate();
  }
}

function onGlobalCityChange(val) {
  setStoredCity(val);
  if (typeof window.onDataStateChanged === 'function') {
    window.onDataStateChanged();
  } else {
    location.reload();
  }
}

function onGlobalDateChange(val) {
  setStoredDate(val);
  if (typeof window.onDataStateChanged === 'function') {
    window.onDataStateChanged();
  } else {
    location.reload();
  }
}

function toggleGlobalLang() {
  const current = getStoredLang();
  const next = current === 'te' ? 'en' : 'te';
  setStoredLang(next);
  applyI18nTranslations(next);
  if (typeof window.onDataStateChanged === 'function') {
    window.onDataStateChanged();
  } else {
    location.reload();
  }
}

async function fetchPanchangamData() {
  const cityVal = getStoredCity().split(',');
  const lat = cityVal[0];
  const lng = cityVal[1];
  const timeZone = cityVal[3];
  const dateVal = getStoredDate();

  try {
    const res = await fetch(`/api/panchangam?date=${encodeURIComponent(dateVal)}&lat=${lat}&lng=${lng}&timeZone=${timeZone}`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    return null;
  }
}

// Global initialization helper
document.addEventListener('DOMContentLoaded', () => {
  applyI18nTranslations();
});
