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
    width = canvas.width = document.documentElement.clientWidth || window.innerWidth;
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
    brand_sub: "వేదిక్ ఆస్ట్రో • వైదిక ఖగోళ పంచాంగం",
    brand_title: "VedicAstro",
    nav_home: "హోమ్",
    nav_panchangam: "పంచాంగం",
    nav_calendar: "క్యాలెండర్",
    nav_raashulu: "రాశులు",
    nav_nakshatralu: "నక్షత్రాలు",
    nav_muhurthams: "ముహూర్తాలు",
    nav_festivals: "పండుగలు",
    btn_lang_toggle: "తెలుగు",

    // Cities
    city_hyd: "హైదరాబాద్ (Hyderabad)",
    city_bza: "విజయవాడ (Vijayawada)",
    city_vtz: "విశాఖపట్నం (Vizag)",
    city_tpt: "తిరుపతి (Tirupati)",
    city_wgl: "వరంగల్ (Warangal)",
    city_blr: "బెంగళూరు (Bengaluru)",
    city_dal: "డల్లాస్ (Dallas USA)",

    // Hero Section
    hero_badge: "🪔 శ్రీ శుభ పంచాంగం • నేటి కాలదర్శిక",
    hero_title: "సమగ్ర తెలుగు దిన పంచాంగం",
    hero_sub: "సూర్యోదయ ఆధారిత తిథి, నక్షత్రం, రాహుకాలం, అమృత ఘడియలు మరియు శుభ ముహూర్తాల ఖచ్చితమైన సమాచారం.",
    hero_btn_panchangam: "🪔 నేటి పంచాంగం చూడండి",
    hero_btn_calendar: "📅 మాస క్యాలెండర్",

    // Quick Stats Bar
    quick_sunrise: "సూర్యోదయం",
    quick_sunset: "సూర్యాస్తమయం",
    quick_abhijit: "అభిజిత్ ముహూర్తం",
    quick_moon_sign: "చంద్ర రాశి",

    // Festival Alert Banner
    fest_alert_label: "నేటి విశేషం / పండుగ:",
    fest_all_link: "అన్ని పండుగలు ➔",

    // Introduction to Panchangam (Home Page)
    intro_hero_badge: "🪔 పరిచయం • పంచాంగం & ఐదు ప్రధాన విభాగాలు",
    intro_hero_title: "పంచాంగం అంటే ఏమిటి? (Introduction to Panchangam)",
    intro_hero_sub: "భారతీయ కాలగణన ప్రకారం పంచాంగం అనగా 'ఐదు అంగాలు' (పంచ + అంగ). సూర్యుడు, చంద్రుడు మరియు నక్షత్రాల ఖగోళ గతుల ఆధారంగా కాల ప్రవాహాన్ని నిర్ధారించే ప్రాచీన వైదిక కాలదర్శిక.",
    intro_verse: "శ్లోకం: తిథేశ్చ శ్రియమాప్నోతి వారాదాయుష్యవర్ధనం | నక్షత్రాద్ధరతే పాపం యోగాద్రోగనివారణం | కరణాత్కార్యసిద్ధిశ్చ పంచాంగం దశలక్షణం ||",
    intro_verse_meaning: "తాత్పర్యం: తిథి సంపదను, వారం ఆయుష్షును, నక్షత్రం పాపనాశనాన్ని, యోగం రోగనివారణను, కరణం కార్యసిద్ధిని ప్రసాదిస్తాయి.",
    intro_btn_panchangam: "🪔 నేటి పంచాంగం చూడండి",
    intro_btn_calendar: "📅 మాస క్యాలెండర్",

    // Pancha Angas 5 Subdivisions
    intro_angas_heading: "పంచాంగాలు • 5 ప్రధాన విభాగాలు (The 5 Subdivisions)",
    intro_angas_sub: "ప్రతిరోజూ కాలగణనలో ప్రాధాన్యత వహించే 5 మూలస్తంభాల సమగ్ర వివరణ & నేటి ప్రత్యక్ష స్థితి:",

    intro_tithi_title: "1. తిథి (Tithi) • చంద్రకళా విభాగం",
    intro_tithi_desc: "సూర్యుడు మరియు చంద్రుల మధ్య కోణీయ దూరం ప్రతి 12 డిగ్రీలకు ఒక తిథిగా ఏర్పడుతుంది. శుక్ల పక్షం (15 తిథులు), కృష్ణ పక్షం (15 తిథులు) కలిసి ఒక చాంద్రమాన మాసంలో 30 తిథులు ఉంటాయి.",
    intro_tithi_fruit: "ఫలం: శ్రీయమాప్నోతి (సంపద, ఆధ్యాత్మిక తేజస్సు, నిత్య పూజలు & వ్రతాల నిర్ణయం).",

    intro_vaaram_title: "2. వారం (Vaaram) • సౌర దినం",
    intro_vaaram_desc: "సూర్యోదయం నుండి మరుసటి సూర్యోదయం వరకు గల సౌర దినం. రవి, సోమ, మంగళ, బుధ, గురు, శుక్ర, శని అనే 7 ప్రధాన గ్రహాధిపతుల ఆధారంగా 7 వారాలు ఏర్పడ్డాయి.",
    intro_vaaram_fruit: "ఫలం: ఆయుష్యవర్ధనం (శారీరక శక్తి, జీవకళ మరియు దీర్ఘాయుష్షు వృద్ధి).",

    intro_nakshatra_title: "3. నక్షత్రం (Nakshatram) • నక్షత్ర మండలం",
    intro_nakshatra_desc: "360 డిగ్రీల రాశి చక్రంలో చంద్రుని సంచార మార్గంలోని 27 నక్షత్రాలు (ఒక్కొక్కటి 13°20'). ప్రతి నక్షత్రానికి 4 పాదాలు ఉంటాయి (మొత్తం 108 పాదాలు).",
    intro_nakshatra_fruit: "ఫలం: పాపహరణం (మానసిక ప్రశాంతత, జన్మ నైజం & శుభకార్యాల ఆరంభం).",

    intro_yogam_title: "4. యోగం (Yogam) • రవిచంద్ర సంయోగం",
    intro_yogam_desc: "సూర్యుడు మరియు చంద్రుల స్పష్ట భోగాల మొత్తం (సూర్య స్ఫుటం + చంద్ర స్ఫుటం / 13°20'). మొత్తం 27 యోగాలు ఉంటాయి (విష్కంభం నుండి వైధృతి వరకు).",
    intro_yogam_fruit: "ఫలం: రోగనివారణం (ఆరోగ్య రక్షణ, శారీరక సమతుల్యత మరియు దోష నివారణ).",

    intro_karanam_title: "5. కరణం (Karanam) • అర్ధ తిథి",
    intro_karanam_desc: "ఒక తిథిలోని సగభాగం (6 డిగ్రీలు) కరణం అవుతుంది. ఒక మాసంలో 60 కరణాలుంటాయి. 7 చర కరణాలు (బవ, బాలవ...) మరియు 4 స్థిర కరణాలు (శకుని, చతుష్పాద...) ఉంటాయి.",
    intro_karanam_fruit: "ఫలం: కార్యసిద్ధి (తీసుకునే నిర్ణయాలు, నూతన ఒప్పందాలు & వ్యవహారాల సాఫల్యం).",

    intro_label_live: "నేటి ప్రత్యక్ష స్థితి:",
    intro_label_ends: "ముగింపు:",
    intro_label_lord: "అధిపతి:",
    intro_label_nature: "స్వభావం:",
    intro_label_next: "తదుపరి కరణం:",

    // Principles
    intro_timing_heading: "వైదిక కాలగణన & ముహూర్త సూత్రాలు",
    intro_timing_sub: "పాశ్చాత్య అర్ధరాత్రి గణనకు భిన్నంగా సనాతన సూర్యోదయ ఆధారిత జీవన చక్రం:",
    principle_sunrise_title: "సూర్యోదయమే దినారంభం (Solar Dawn)",
    principle_sunrise_desc: "వైదిక సంప్రదాయంలో రోజు సూర్యోదయంతో మొదలవుతుంది. తిథి, వారం, ముహూర్తాలన్నీ స్థానిక సూర్యోదయాన్ని ప్రాతిపదికగా తీసుకుని గణిస్తారు.",
    principle_abhijit_title: "అభిజిత్ ముహూర్తం (విజయ కాలం)",
    principle_abhijit_desc: "పగటి కాలాన్ని 15 ముహూర్తాలుగా విభజిస్తే, మధ్యాహ్నం వచ్చే 8వ ముహూర్తం 'అభిజిత్'. ఇది సమస్త గ్రహ దోషాలను హరించి సకల కార్యజయాన్ని ఇస్తుంది.",
    principle_rahu_title: "రాహుకాలం & వర్జ్యం (జాగ్రత్త సమయాలు)",
    principle_rahu_desc: "పగటి కాలంలో రాహువు ఆధిపత్యంలో ఉండే 1/8వ భాగం రాహుకాలం. అలాగే నక్షత్రంలో విష ఘడియల సమయం వర్జ్యం. ఈ సమయాల్లో కొత్త పనులు ప్రారంభించరాదు.",

    // Today Overview Dashboard
    dash_tithi_heading: "నేటి తిథి (Tithi)",
    dash_nakshatra_heading: "నక్షత్రం (Nakshatra)",
    dash_rahu_heading: "రాహుకాలం (Rahu Kalam)",
    dash_completed_suffix: "పూర్తయింది",
    dash_ends_at: "ముగింపు వేళ:",
    dash_hours_rem: "ఇంకా {h} గంటలు",
    dash_ruler_label: "అధిపతి గ్రహం:",
    dash_rahu_slot_label: "రాహుకాల సమయం:",
    dash_rahu_start_msg: "రాహుకాలం ప్రారంభానికి వ్యవధి",
    dash_rahu_active_msg: "ప్రస్తుతం రాహుకాలం అమల్లో ఉంది (శుభకార్యాలు నివారించండి)",
    dash_rahu_end_msg: "నేటి రాహుకాల సమయం ముగిసినది",
    badge_upcoming: "రాబోయే సమయం",
    badge_active: "ప్రస్తుతం ఉంది",
    badge_completed: "ముగిసినది",
    badge_victorious: "విజయప్రదం",

    // Modules Section
    modules_heading: "పంచాంగ విభాగాలు",
    modules_sub: "అన్ని విభాగాలు అందుబాటులో ఉన్నాయి ➔",
    mod_panchangam_title: "సమగ్ర పంచాంగం",
    mod_panchangam_desc: "తిథి, వార, నక్షత్ర, యోగ, కరణాలు",
    mod_calendar_title: "నెలవారీ క్యాలెండర్",
    mod_calendar_desc: "పండుగలు, పౌర్ణమి, అమావాస్య",
    mod_raashulu_title: "ద్వాదశ రాశులు",
    mod_raashulu_desc: "12 రాశుల విశేషాలు & చంద్రాష్టమం",
    mod_nakshatralu_title: "27 నక్షత్రాలు",
    mod_nakshatralu_desc: "నక్షత్ర పాదాలు & అధిపతులు",
    mod_muhurthams_title: "శుభ & వర్జ్యాలు",
    mod_muhurthams_desc: "అమృత ఘడియలు & దుర్ముహూర్తం",
    mod_festivals_title: "పండుగలు & వ్రతాలు",
    mod_festivals_desc: "సంవత్సర పర్వదినాలు & విశేషాలు",

    // Panchangam Page Detailed
    p_page_tag: "శ్రీ శుభ పంచాంగం • దినదర్శిక",
    p_page_title: "నేటి సమగ్ర పంచాంగం (Daily Panchangam)",
    p_page_desc: "సూర్యోదయ ఆధారిత తిథి, వార, నక్షత్ర, యోగ, కరణ, ముహూర్త, చోఘడియా మరియు చంద్రాష్టమ గణనలు.",
    p_samvat_label: "సంవత్సరం (Year)",
    p_ayanam_label: "ఆయనం (Solstice)",
    p_ruthu_label: "ఋతువు (Season)",
    p_masam_label: "మాసం (Month)",
    p_paksham_label: "పక్షం (Fortnight)",
    p_ayanamsa_label: "అయనాంశం (Lahiri)",
    p_chandrashtama_title: "చంద్రాష్టమ రాశి సూచిక (Chandrashtama)",
    p_chandrashtama_badge: "జాగ్రత్త అవసరం",
    p_chandrashtama_prefix: "నేటి చంద్రాష్టమం:",
    p_chandrashtama_desc: "చంద్రుడు జన్మరాశికి 8వ రాశిలో సంచరించే సమయం. ఈ రాశివారు వివాదాలు, కొత్త కార్యారంభాలు, ముఖ్య ప్రయాణాలలో జాగ్రత్త వహించాలి.",
    p_rahu_title: "రాహుకాల సమయం (Rahu Kalam)",
    p_rahu_desc: "రాహుకాలంలో శుభకార్యాలు, క్రయవిక్రయాలు ప్రారంభించరాదని జ్యోతిష్య నియమం.",
    p_limbs_title: "పంచాంగములు - ఐదు ప్రధాన అంగాలు (5 Limbs)",
    p_limb_tithi: "తిథి (Tithi)",
    p_limb_vaaram: "వారం (Vaaram)",
    p_limb_nakshatram: "నక్షత్రం (Nakshatram)",
    p_limb_yogam: "యోగం (Yogam)",
    p_limb_karanam: "కరణం (Karanam)",
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

    p_tithi_sub: "నిత్య తిథి వివరాలు",
    p_vaaram_sub: "సౌర దినం",
    p_nakshatra_rem_lbl: "మిగిలిన సమయం:",
    p_surya_transit_lbl: "సౌర సంక్రమణం",
    p_chandra_transit_lbl: "జన్మరాశి సంచారం",
    badge_prohibited: "వర్జనీయం",
    p_brahma_desc: "ధ్యానము, పూజ మరియు అధ్యయనానికి శ్రేష్టం",
    p_abhijit_desc: "సర్వ కార్య విజయదాయక మధ్యాహ్న సమయం",
    p_amrit_desc: "నూతన కార్యారంభానికి శుభప్రదం",
    p_rahu_sub: "ప్రయాణాలు, వ్యాపార ఆరంభాలు నిషేధం",
    p_yama_sub: "ప్రమాదాలు నివారించడానికి పనులు ఆపవలెను",
    p_gulika_sub: "మధ్యస్థ సమయం / శుభకార్యాలు వాయిదా",
    p_dur_sub: "సర్వ కార్య ప్రతిబంధక ఘడియలు",
    p_varjyam_sub: "నక్షత్ర ఆధారిత విష ఘడియలు",

    // Calendar Legends
    cal_leg_today: "నేటి దినం (Today)",
    cal_leg_pournami: "పౌర్ణమి (Full Moon)",
    cal_leg_amavasya: "అమావాస్య (New Moon)",
    cal_leg_ekadashi: "ఏకాదశి (Ekadashi)",
    cal_leg_festival: "పండుగ (Festival)",

    // Nakshatras Modal
    nak_modal_deity: "అధిదేవత (DEITY)",
    nak_modal_yoni: "యోని జంతువు (YONI)",
    nak_modal_element: "తత్వం (ELEMENT)",
    nak_modal_tyajya: "వర్జ్య ఘడియలు (TYAJYA)",
    nak_modal_syllables: "నామాక్షరాలు (INITIAL NAMING SYLLABLES)",
    nak_ruler_lbl: "అధిపతి:",
    nak_deity_lbl: "అధిదేవత:",

    // Festivals
    fest_count_label: "16 ప్రధాన పర్వదినాలు",

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

    // Muhurthams Page
    muh_page_tag: "శుభ & అశుభ కాలాలు • COSMIC WINDOWS",
    muh_page_title: "శుభ & అశుభ ముహూర్తములు (Muhurthams)",
    muh_page_desc: "సూర్యోదయం నుండి సూర్యాస్తమయం వరకు 8 విభాగాలలో రాహుకాల, యమగండ మరియు అమృత ఘడియల సమయాలు.",
    muh_shubha_title: "శుభ సమయాలు (Auspicious Timings)",
    muh_varjya_title: "అశుభ / వర్జ్య కాలాలు (Prohibited Windows)",
    muh_abhijit_label: "అభిజిత్ ముహూర్తం",
    muh_abhijit_sub: "మధ్యాహ్న కాల విజయ ముహూర్తం (సర్వకార్య సిద్ధి)",
    muh_amrutha_label: "అమృత కాలం",
    muh_amrutha_sub: "అమృత ఘడియలు (నూతన ప్రారంభాలకు ఉత్తమం)",
    muh_brahma_label: "బ్రహ్మ ముహూర్తం",
    muh_brahma_sub: "సూర్యోదయ పూర్వ ధ్యాన, యోగ, పూజా సమయం",
    muh_rahu_label: "రాహుకాలం (Rahu Kalam)",
    muh_rahu_sub: "నూతన కార్యాలు, ప్రయాణాలు నిషిద్ధం",
    muh_yama_label: "యమగండం (Yamagandam)",
    muh_yama_sub: "మృత్యు కారక యమ భాగం",
    muh_gulika_label: "గుళిక కాలం (Gulika Kalam)",
    muh_gulika_sub: "శని పుత్రుని కాలం",
    muh_dur_label: "దుర్ముహూర్తం (Durmuhurtham)",
    muh_dur_sub: "శాస్త్ర ప్రకారం వర్జ్యమైన సమయం",
    muh_varjyam_label: "వర్జ్యం (Varjyam / Tyajya)",
    muh_varjyam_sub: "నక్షత్ర త్యాజ్య కాలం (4 ఘడియలు = 96 నిమిషాలు)",

    // Festivals Page
    fest_page_tag: "పవిత్ర పర్వదినాలు • SACRED CELEBRATIONS",
    fest_page_title: "ప్రధాన పండుగలు & వ్రతాలు (Festivals & Vratams)",
    fest_page_desc: "చాంద్రమాన మాసాల ప్రకారం జరుపుకునే సాంప్రదాయ పండుగలు మరియు వాటి ఆధ్యాత్మిక ప్రాశస్త్యం.",
    fest_status_label: "పండుగల సంఖ్య:",
    fest_search_ph: "పండుగ కోసం వెతకండి (ఉదా: ఉగాది, దసరా, దీపావళి)...",

    // Nakshatras Page
    nak_page_tag: "నక్షత్ర మండల దర్శనం • 27 LUNAR MANSIONS",
    nak_page_title: "సప్తవింశతి నక్షత్రములు (27 Nakshatras)",
    nak_page_desc: "అశ్విని నుండి రేవతి వరకు 27 నక్షత్రాలు, 4 పాదాలు, వింశోత్తరి గ్రహాధిపతులు మరియు ఖగోళ విశేషాలు.",
    nak_active_label: "ప్రస్తుత చలనం:",
    nak_filter_all: "అన్ని నక్షత్రాలు (27)",
    nak_filter_deva: "దేవ గణము",
    nak_filter_manushya: "మనుష్య గణము",
    nak_filter_rakshasa: "రాక్షస గణము",

    // Raashulu Page
    raa_page_tag: "ద్వాదశ రాశి చక్రం • 12 ZODIAC ARCS",
    raa_page_title: "ద్వాదశ రాశులు (12 Zodiac Signs)",
    raa_page_desc: "రాశి చక్రంలోని 12 రాశుల తత్వాలు, అధిపతులు, జన్మ రత్నాలు మరియు నేటి ఖగోళ స్థితి.",
    raa_goto_nakshatras: "✨ 27 నక్షత్రాల విభాగం",
    raa_active_moon_tag: "● ప్రస్తుత చంద్ర సంచార రాశి (ACTIVE MOON SIGN)",
    raa_moon_sign_label: "నేటి చంద్ర రాశి:",
    raa_sun_sign_label: "నేటి సూర్య రాశి:",
    raa_sun_sign_lbl: "సూర్య రాశి (Sun Sign)",
    raa_filter_lbl: "వడపోత:",
    raa_filter_all: "అన్నీ (All 12)",
    raa_filter_fire: "🔥 అగ్ని తత్వం (Fire)",
    raa_filter_earth: "🌍 భూ తత్వం (Earth)",
    raa_filter_air: "💨 వాయు తత్వం (Air)",
    raa_filter_water: "💧 జల తత్వం (Water)",
    raa_gem_lbl: "జన్మ రత్నం (GEMSTONE)",
    raa_col_lbl: "అదృష్ట రంగు (LUCKY COLOR)",
    raa_num_lbl: "అదృష్ట సంఖ్యలు (NUMBERS)",
    raa_qua_lbl: "లక్షణాలు (QUALITIES)",
    raa_nak_lbl: "నక్షత్ర పాదాలు (CONSTELLATION SPAN)",

    // Footer
    footer_text: "VedicAstro (వేదిక్ ఆస్ట్రో) • ఖగోళ వివరాలు & పంచాంగ గణన వ్యవస్థ"
  },

  en: {
    // Header & Brand
    brand_sub: "Vedic Almanac & Astronomical Ephemeris",
    brand_title: "VedicAstro",
    nav_home: "Home",
    nav_panchangam: "Panchangam",
    nav_calendar: "Calendar",
    nav_raashulu: "Raashis",
    nav_nakshatralu: "Nakshatras",
    nav_muhurthams: "Muhurthams",
    nav_festivals: "Festivals",
    btn_lang_toggle: "English",

    // Cities
    city_hyd: "Hyderabad (HYD)",
    city_bza: "Vijayawada (BZA)",
    city_vtz: "Visakhapatnam (VTZ)",
    city_tpt: "Tirupati (TPT)",
    city_wgl: "Warangal (WGL)",
    city_blr: "Bengaluru (BLR)",
    city_dal: "Dallas (USA)",

    // Hero Section
    hero_badge: "🪔 Traditional Vedic Almanac • Daily Panchangam",
    hero_title: "Daily Vedic Almanac & Panchangam",
    hero_sub: "Accurate daily Tithi, Nakshatram, Rahu Kalam, sunrise timings, and auspicious Muhurthams calculated for your city.",
    hero_btn_panchangam: "🪔 View Full Panchangam",
    hero_btn_calendar: "📅 Monthly Calendar",

    // Quick Stats Bar
    quick_sunrise: "Sunrise",
    quick_sunset: "Sunset",
    quick_abhijit: "Abhijit Muhurtham",
    quick_moon_sign: "Moon Sign",

    // Festival Alert Banner
    fest_alert_label: "Today's Festival / Occasion:",
    fest_all_link: "All Festivals ➔",

    // Introduction to Panchangam (Home Page)
    intro_hero_badge: "🪔 Introduction • Panchangam & The 5 Limbs",
    intro_hero_title: "What is Panchangam? (Introduction to Panchangam)",
    intro_hero_sub: "In Vedic astronomy, Panchangam translates directly to 'Five Limbs' (Pancha + Anga). It is the sacred lunisolar almanac that maps cosmic time through the synchronized geometries of the Sun, Moon, and Stars.",
    intro_verse: "Verse: Tithēścha Śriyamāpnōti Vārādāyushyavardhanam | Nakshatrāddharatē Pāpam Yōgādrōganivāraṇam | Karaṇātkāryasiddhischa Panchāngam Daśalakshaṇam ||",
    intro_verse_meaning: "Meaning: Tithi confers spiritual wealth; Vaaram enhances longevity; Nakshatra cleanses negative karmas; Yogam heals ailments; Karanam guarantees success in undertakings.",
    intro_btn_panchangam: "🪔 View Today's Panchangam",
    intro_btn_calendar: "📅 Monthly Calendar",

    // Pancha Angas 5 Subdivisions
    intro_angas_heading: "The 5 Sacred Subdivisions (Pancha-Angas)",
    intro_angas_sub: "The five cosmic pillars defining every day, along with today's live astronomical values:",

    intro_tithi_title: "1. Tithi (Lunar Phase)",
    intro_tithi_desc: "The 12-degree angular separation between the Sun and Moon. 15 Tithis in Shukla Paksha (waxing) and 15 in Krishna Paksha (waning), totaling 30 per lunar month.",
    intro_tithi_fruit: "Essence: Bestows prosperity, spiritual radiance, and dictates sacred festivals, fasts, and ceremonies.",

    intro_vaaram_title: "2. Vaaram (Solar Weekday)",
    intro_vaaram_desc: "The solar weekday measured from local sunrise to the next sunrise. 7 weekdays, each ruled by a presiding cosmic planetary deity (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn).",
    intro_vaaram_fruit: "Essence: Enhances physical vitality, health, and aligns daily endeavors with planetary energies.",

    intro_nakshatra_title: "3. Nakshatram (Lunar Mansion)",
    intro_nakshatra_desc: "The 27 asterisms along the 360° zodiac (13°20' each) marking the Moon's real-time transit. Each nakshatra is divided into 4 padas (totaling 108 padas).",
    intro_nakshatra_fruit: "Essence: Cleanses negative karmas, shapes mental temperament, and guides auspicious moments.",

    intro_yogam_title: "4. Yogam (Lunisolar Period)",
    intro_yogam_desc: "The mathematical sum of the Sun and Moon's sidereal longitudes ((Sun + Moon) % 360° / 13°20'). There are 27 Yogams spanning from Vishkambha to Vaidhriti.",
    intro_yogam_fruit: "Essence: Heals ailments, fosters emotional equilibrium, and protects wellbeing.",

    intro_karanam_title: "5. Karanam (Half Lunar Day)",
    intro_karanam_desc: "Half of a Tithi (6° angular elongation between Sun and Moon). 60 Karanas in a lunar month cycling through 7 movable and 4 fixed archetypes.",
    intro_karanam_fruit: "Essence: Ensures success (Karya Siddhi) in new undertakings, negotiations, and journeys.",

    intro_label_live: "Live Status Today:",
    intro_label_ends: "Ends at:",
    intro_label_lord: "Ruling Deity:",
    intro_label_nature: "Nature:",
    intro_label_next: "Next Karana:",

    // Principles
    intro_timing_heading: "Vedic Astronomical Principles & Muhurtha",
    intro_timing_sub: "Unlike the Gregorian midnight clock, Vedic time is rooted in dawn and cosmic geometry:",
    principle_sunrise_title: "Sunrise as Day's Dawn (Solar Dawn)",
    principle_sunrise_desc: "A Vedic day begins precisely at local sunrise. All tithis, weekdays, and muhurthas are calculated relative to dawn at your local coordinates.",
    principle_abhijit_title: "Abhijit Muhurtham (Golden Hour)",
    principle_abhijit_desc: "The 8th muhurtha of daytime around local noon. Blessed by Lord Vishnu, it neutralizes astrological afflictions and grants victory.",
    principle_rahu_title: "Rahu Kalam & Varjyam (Caution Windows)",
    principle_rahu_desc: "A daily 1/8th daytime window associated with Rahu, along with toxic lunar degree windows (Varjyam). Initiating new ventures during these periods is avoided.",

    // Today Overview Dashboard
    dash_tithi_heading: "Today's Tithi",
    dash_nakshatra_heading: "Today's Nakshatra",
    dash_rahu_heading: "Rahu Kalam",
    dash_completed_suffix: "Completed",
    dash_ends_at: "Ends at:",
    dash_hours_rem: "{h} hours left",
    dash_ruler_label: "Ruling Planet:",
    dash_rahu_slot_label: "Rahu Kalam Window:",
    dash_rahu_start_msg: "Starts in",
    dash_rahu_active_msg: "Active now (Avoid starting new tasks or travel)",
    dash_rahu_end_msg: "Concluded for today",
    badge_upcoming: "Upcoming",
    badge_active: "Active Now",
    badge_completed: "Concluded",
    badge_victorious: "Victorious",

    // Modules Section
    modules_heading: "Panchangam Sections",
    modules_sub: "Explore all sections ➔",
    mod_panchangam_title: "Daily Panchangam",
    mod_panchangam_desc: "Tithi, Vaaram, Nakshatra, Yoga, Karana",
    mod_calendar_title: "Monthly Calendar",
    mod_calendar_desc: "Month grid, Festivals, Pournami, Amavasya",
    mod_raashulu_title: "12 Zodiac Signs",
    mod_raashulu_desc: "12 signs, planetary rulers & Chandrashtama",
    mod_nakshatralu_title: "27 Nakshatras",
    mod_nakshatralu_desc: "Quarters, Dasha lords & celestial signs",
    mod_muhurthams_title: "Timings & Muhurthams",
    mod_muhurthams_desc: "Amrutha Kalam, Rahu Kalam & Varjyam",
    mod_festivals_title: "Festivals & Vratams",
    mod_festivals_desc: "Yearly auspicious dates & celebrations",

    // Panchangam Page Detailed
    p_page_tag: "Daily Vedic Almanac & Panchangam",
    p_page_title: "Today's Detailed Panchangam",
    p_page_desc: "Sunrise-based calculations of Tithi, Vaaram, Nakshatram, Yogam, Karanam, Muhurthams, and Chandrashtama.",
    p_samvat_label: "Samvatsaram (Year)",
    p_ayanam_label: "Ayanam (Solstice)",
    p_ruthu_label: "Ruthuvu (Season)",
    p_masam_label: "Masam (Month)",
    p_paksham_label: "Paksham (Fortnight)",
    p_ayanamsa_label: "Ayanamsa (Lahiri)",
    p_chandrashtama_title: "Chandrashtama Indicator",
    p_chandrashtama_badge: "Exercise Caution",
    p_chandrashtama_prefix: "Today's Chandrashtama:",
    p_chandrashtama_desc: "When the Moon transits the 8th house from one's natal sign. Caution is advised for new undertakings, disputes, or important travel.",
    p_rahu_title: "Rahu Kalam Window",
    p_rahu_desc: "Scriptural principles advise avoiding new ventures, contracts, or long journeys during Rahu Kalam.",
    p_limbs_title: "Panchangam - The Five Sacred Limbs",
    p_limb_tithi: "Tithi (Lunar Day)",
    p_limb_vaaram: "Vaaram (Weekday)",
    p_limb_nakshatram: "Nakshatram (Birth Star)",
    p_limb_yogam: "Yogam (Lunisolar Period)",
    p_limb_karanam: "Karanam (Half-Tithi)",
    p_ruler_label: "Day Ruler:",
    p_nature_label: "Nature:",
    p_upcoming_karana_label: "Next Karana:",
    p_sun_moon_timings: "Sunrise & Sunset Timings",
    p_sunrise: "Sunrise",
    p_sunset: "Sunset",
    p_moonrise: "Moonrise",
    p_moonset: "Moonset",
    p_coords_label: "Location Coordinates:",
    p_day_dur_label: "Daylight Duration:",
    p_planetary_rasis: "Planetary Positions",
    p_sun_rasi: "Sun Sign (Surya Rasi)",
    p_moon_rasi: "Moon Sign (Chandra Rasi)",
    p_ausp_timings: "Auspicious Timings",
    p_inausp_timings: "Inauspicious / Varjya Windows",
    p_brahma_muhurtham: "Brahma Muhurtham",
    p_abhijit_muhurtham: "Abhijit Muhurtham",
    p_amrit_kalam: "Amrutha Kalam",
    p_rahu_kalam: "Rahu Kalam",
    p_yamagandam: "Yamagandam",
    p_gulika: "Gulika Kalam",
    p_durmuhurtham: "Durmuhurtham",
    p_varjyam: "Varjyam",
    p_choghadiya_title: "Gauri Panchangam & Choghadiya",
    p_choghadiya_sub: "Traditional 8-division daytime and nighttime timing guide for immediate decisions",
    p_btn_day: "☀️ Daytime (Day)",
    p_btn_night: "🌙 Nighttime (Night)",
    p_tbl_slot: "Division (Slot)",
    p_tbl_timing: "Timing",
    p_tbl_choghadiya: "Choghadiya",
    p_tbl_gauri: "Gauri Panchangam",
    p_tbl_status: "Status",
    p_tbl_significance: "Significance",
    status_good: "Good",
    status_bad: "Avoid",

    p_tithi_sub: "Daily lunar phase & ritual context",
    p_vaaram_sub: "Solar Day",
    p_nakshatra_rem_lbl: "Time Remaining:",
    p_surya_transit_lbl: "Solar Transit",
    p_chandra_transit_lbl: "Lunar Transit",
    badge_prohibited: "Inauspicious Window",
    p_brahma_desc: "Ideal for meditation, prayers and studies",
    p_abhijit_desc: "Midday victory hour for success in all ventures",
    p_amrit_desc: "Auspicious nectar period for new beginnings",
    p_rahu_sub: "Avoid travels and new financial starts",
    p_yama_sub: "Avoid starting risky or vital ventures",
    p_gulika_sub: "Intermediate slot / defer new beginnings",
    p_dur_sub: "Obstructive slots for auspicious actions",
    p_varjyam_sub: "Inauspicious star-based duration",

    // Calendar Legends
    cal_leg_today: "Today",
    cal_leg_pournami: "Full Moon (Pournami)",
    cal_leg_amavasya: "New Moon (Amavasya)",
    cal_leg_ekadashi: "Ekadashi",
    cal_leg_festival: "Festival",

    // Nakshatras Modal
    nak_modal_deity: "Presiding Deity",
    nak_modal_yoni: "Animal Symbol (Yoni)",
    nak_modal_element: "Element",
    nak_modal_tyajya: "Inauspicious Window (Tyajya)",
    nak_modal_syllables: "Initial Naming Syllables",
    nak_ruler_lbl: "Ruling Lord:",
    nak_deity_lbl: "Deity:",

    // Festivals
    fest_count_label: "16 Major Celestial Celebrations",

    // Calendar Page
    cal_tag: "Traditional Lunisolar Calendar",
    cal_title: "Monthly Telugu Calendar",
    cal_desc: "Monthly calendar with daily Tithi, Nakshatram, Full Moon (Pournami), New Moon (Amavasya), and major festivals.",
    cal_btn_prev: "◀ Previous Month",
    cal_btn_next: "Next Month ▶",
    cal_fest_heading: "Major Festivals & Observances this Month",
    badge_pournami: "Pournami (Full Moon)",
    badge_amavasya: "Amavasya (New Moon)",
    badge_ekadashi: "Ekadashi",

    // Muhurthams Page
    muh_page_tag: "Daily Muhurtham & Timings",
    muh_page_title: "Auspicious & Inauspicious Muhurthams",
    muh_page_desc: "Daily planetary divisions from sunrise to sunset for Rahu Kalam, Yamagandam, and Amrutha timings.",
    muh_shubha_title: "Auspicious Timings (Shubha Kalam)",
    muh_varjya_title: "Inauspicious Windows (Varjya Kalam)",
    muh_abhijit_label: "Abhijit Muhurtham",
    muh_abhijit_sub: "Midday Victory Muhurtham (Favorable for all endeavors)",
    muh_amrutha_label: "Amrutha Kalam",
    muh_amrutha_sub: "Auspicious nectar hours for starting new activities",
    muh_brahma_label: "Brahma Muhurtham",
    muh_brahma_sub: "Pre-dawn sacred hour for meditation and prayer",
    muh_rahu_label: "Rahu Kalam",
    muh_rahu_sub: "Inauspicious interval; avoid initiating new tasks or travel",
    muh_yama_label: "Yamagandam",
    muh_yama_sub: "Inauspicious interval; unfavorable for new beginnings",
    muh_gulika_label: "Gulika Kalam",
    muh_gulika_sub: "Favorable interval for routine and recurring activities",
    muh_dur_label: "Durmuhurtham",
    muh_dur_sub: "Inauspicious window per classical principles",
    muh_varjyam_label: "Varjyam (Tyajya)",
    muh_varjyam_sub: "Stellar discard period (4 Ghadikas = 96 minutes)",

    // Festivals Page
    fest_page_tag: "Sacred Festivals & Celebrations",
    fest_page_title: "Traditional Festivals & Vratams",
    fest_page_desc: "Traditional Hindu festivals calculated per lunisolar months and their spiritual significance.",
    fest_status_label: "Celebrations Count:",
    fest_search_ph: "Search festival (e.g. Ugadi, Dasara, Diwali)...",

    // Nakshatras Page
    nak_page_tag: "The 27 Birth Stars",
    nak_page_title: "The 27 Nakshatras (Constellations)",
    nak_page_desc: "From Ashwini to Revati: quarter padas, planetary rulers (Dasha lords), and celestial attributes.",
    nak_active_label: "Current Active Star:",
    nak_filter_all: "All Nakshatras (27)",
    nak_filter_deva: "Deva Gana",
    nak_filter_manushya: "Manushya Gana",
    nak_filter_rakshasa: "Rakshasa Gana",

    // Raashulu Page
    raa_page_tag: "The 12 Zodiac Signs",
    raa_page_title: "12 Zodiac Signs (Raashis)",
    raa_page_desc: "Solar and lunar transits, planetary rulers, elements, lucky gemstones, and Chandrashtama influences.",
    raa_goto_nakshatras: "✨ 27 Nakshatras Section",
    raa_active_moon_tag: "● CURRENT MOON SIGN (CHANDRA RASI)",
    raa_moon_sign_label: "Current Moon Sign:",
    raa_sun_sign_label: "Current Sun Sign:",
    raa_sun_sign_lbl: "Sun Sign (Surya Rasi)",
    raa_filter_lbl: "FILTER:",
    raa_filter_all: "All (All 12)",
    raa_filter_fire: "🔥 Fire (Agni)",
    raa_filter_earth: "🌍 Earth (Prithvi)",
    raa_filter_air: "💨 Air (Vayu)",
    raa_filter_water: "💧 Water (Jala)",
    raa_gem_lbl: "GEMSTONE",
    raa_col_lbl: "LUCKY COLOR",
    raa_num_lbl: "LUCKY NUMBERS",
    raa_qua_lbl: "QUALITIES",
    raa_nak_lbl: "CONSTELLATION SPAN",

    // Footer
    footer_text: "VedicAstro • Traditional Daily Vedic Almanac & Panchangam based on authentic astronomical principles"
  }
};

// 3. STATE MANAGEMENT & GETTERS/SETTERS
function getStoredLang() {
  const urlParam = typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search).get('lang') : null;
  if (urlParam === 'en' || urlParam === 'te') return urlParam;
  const l = typeof localStorage !== 'undefined' ? (localStorage.getItem('telugu_panchangam_lang') || localStorage.getItem('astra_lang')) : null;
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

// Helper to extract Telugu or English from strings formatted like "తెలుగు (English)"
function getLocalizedBilingual(text, isTe) {
  if (!text) return '';
  if (typeof text !== 'string') return text;
  const match = text.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return isTe ? match[1].trim() : match[2].trim();
  }
  return text;
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

  // Apply to all elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Sync language select dropdown
  const langSelect = document.getElementById('globalLangSelect');
  if (langSelect) {
    langSelect.value = activeLang;
  }

  // Update language toggle button label if present
  const langToggleBtn = document.getElementById('globalLangToggle') || document.getElementById('home-lang-label');
  if (langToggleBtn) {
    const labelSpan = langToggleBtn.querySelector('#globalLangLabel') || langToggleBtn.querySelector('span:last-child');
    if (labelSpan && labelSpan !== langToggleBtn) {
      labelSpan.textContent = dict.btn_lang_toggle;
    } else {
      langToggleBtn.innerHTML = `<span class="text-[11px]">🌐</span><span id="globalLangLabel">${dict.btn_lang_toggle}</span>`;
    }
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

// 5. MODERN OPENAI-STYLE CLEAN TOP NAVIGATION HEADER
function renderCosmicHeader(activePage = 'home') {
  const lang = getStoredLang();
  const dict = I18N[lang] || I18N.te;

  const headerHtml = `
  <header class="sticky top-0 z-50 w-full max-w-full border-b border-white/[0.08] bg-black/90 backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
      
      <!-- Brand Logo (Clicking takes user Home) -->
      <a href="/" class="flex items-center gap-2 shrink-0 group mr-1" title="VedicAstro Home">
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 p-[1px] shadow-sm shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
          <div class="w-full h-full bg-black rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-cyan-300">
            🌌
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-sm sm:text-base font-bold tracking-tight text-white font-sans">Vedic<span class="text-cyan-400">Astro</span></span>
        </div>
      </a>

      <!-- Top Navigation Links (Always visible in fullscreen & windowed/non-fullscreen) -->
      <nav class="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 min-w-0 flex-1">
        <a href="/panchangam" class="top-nav-link ${activePage === 'panchangam' ? 'active' : ''}">
          <span class="text-xs">🪔</span>
          <span data-i18n="nav_panchangam">${dict.nav_panchangam}</span>
        </a>
        <a href="/calendar" class="top-nav-link ${activePage === 'calendar' ? 'active' : ''}">
          <span class="text-xs">📅</span>
          <span data-i18n="nav_calendar">${dict.nav_calendar}</span>
        </a>
        <a href="/raashulu" class="top-nav-link ${activePage === 'raashulu' ? 'active' : ''}">
          <span class="text-xs">♈</span>
          <span data-i18n="nav_raashulu">${dict.nav_raashulu}</span>
        </a>
        <a href="/nakshatralu" class="top-nav-link ${activePage === 'nakshatralu' ? 'active' : ''}">
          <span class="text-xs">✨</span>
          <span data-i18n="nav_nakshatralu">${dict.nav_nakshatralu}</span>
        </a>
        <a href="/muhurthams" class="top-nav-link ${activePage === 'muhurthams' ? 'active' : ''}">
          <span class="text-xs">⏳</span>
          <span data-i18n="nav_muhurthams">${dict.nav_muhurthams}</span>
        </a>
        <a href="/festivals" class="top-nav-link ${activePage === 'festivals' ? 'active' : ''}">
          <span class="text-xs">🎉</span>
          <span data-i18n="nav_festivals">${dict.nav_festivals}</span>
        </a>
      </nav>

      <!-- Right: Utility Controls (City, Date, Language) -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <!-- City Selector -->
        <div class="flex items-center bg-black/80 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-xs transition max-w-[105px] sm:max-w-[145px]">
          <span class="text-zinc-400 mr-1 text-[11px] shrink-0">📍</span>
          <select id="globalCitySelect" onchange="onGlobalCityChange(this.value)" class="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer w-full truncate">
            <option value="17.3850,78.4867,Hyderabad,Asia/Kolkata" class="bg-black">${dict.city_hyd}</option>
            <option value="16.5062,80.6480,Vijayawada,Asia/Kolkata" class="bg-black">${dict.city_bza}</option>
            <option value="17.6868,83.2185,Visakhapatnam,Asia/Kolkata" class="bg-black">${dict.city_vtz}</option>
            <option value="13.6288,79.4192,Tirupati,Asia/Kolkata" class="bg-black">${dict.city_tpt}</option>
            <option value="17.9689,79.5941,Warangal,Asia/Kolkata" class="bg-black">${dict.city_wgl}</option>
            <option value="12.9716,77.5946,Bengaluru,Asia/Kolkata" class="bg-black">${dict.city_blr}</option>
            <option value="32.7767,-96.7970,Dallas,America/Chicago" class="bg-black">${dict.city_dal}</option>
          </select>
        </div>

        <!-- Date Input (Visible on sm+) -->
        <input type="date" id="globalDatePicker" onchange="onGlobalDateChange(this.value)" class="hidden sm:inline-block bg-black/80 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none cursor-pointer transition w-[115px] sm:w-[125px]">

        <!-- Language Selector Dropdown (Unambiguous & Direct) -->
        <div class="flex items-center bg-black/80 border border-white/10 hover:border-white/20 rounded-lg px-2 py-1 text-xs transition">
          <span class="text-cyan-400 mr-1 text-[11px] shrink-0">🌐</span>
          <select id="globalLangSelect" onchange="onGlobalLangChange(this.value)" class="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer">
            <option value="te" class="bg-black" ${lang === 'te' ? 'selected' : ''}>తెలుగు</option>
            <option value="en" class="bg-black" ${lang === 'en' ? 'selected' : ''}>English</option>
          </select>
        </div>
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
    applyI18nTranslations(lang);
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

function onGlobalLangChange(val) {
  setStoredLang(val);
  applyI18nTranslations(val);
  if (typeof window.onDataStateChanged === 'function') {
    window.onDataStateChanged();
  } else {
    location.reload();
  }
}

function toggleGlobalLang() {
  const current = getStoredLang();
  const next = current === 'te' ? 'en' : 'te';
  onGlobalLangChange(next);
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
