import defaultWheelBg from '../assets/images/yuga_cosmic_wheel_bg_1794594990566.jpg';

export type YugaId = 'satya' | 'treta' | 'dvapara' | 'kali';

export interface YugaEvent {
  id: string;
  yugaId: YugaId;
  title: string;
  sanskritTerm: string;
  epochPhase: 'Sandhya (Dawn)' | 'Main Epoch' | 'Sandhyamsa (Twilight)';
  /** Normalized 0..1 position inside this specific Yuga's span */
  positionInYuga: number;
  /** Exact wheel angle in degrees (0..360) clockwise from 12 o'clock */
  wheelAngleDeg: number;
  /** Year offset within this Yuga (0 .. humanYears) */
  yugaYear: number;
  /** Cumulative year within the 4,320,000-year Mahayuga */
  mahayugaYear: number;
  figureOrAvatar: string;
  sourceTradition: string;
  summary: string;
  significance: string;
  highlights: string[];
}

export interface YugaDefinition {
  id: YugaId;
  name: string;
  alternateName: string;
  sanskrit: string;
  ratio: number;
  percentage: number;
  degrees: number;
  startAngle: number;
  endAngle: number;
  startYear: number;
  endYear: number;
  humanYears: number;
  divineYears: number;
  sandhyaYears: number;
  mainEpochYears: number;
  sandhyamsaYears: number;
  dharmaPillars: number;
  primaryVirtue: string;
  elementalTone: string;
  accentHex: string;
  accentSoftHex: string;
  accentBorderHex: string;
  description: string;
  events: YugaEvent[];
}

export const TOTAL_MAHAYUGA_YEARS = 4_320_000;
export const TOTAL_DIVINE_YEARS = 12_000;
export const DEFAULT_WHEEL_BG = defaultWheelBg;

const RAW_YUGAS: Array<
  Omit<YugaDefinition, 'events'> & {
    rawEvents: Array<Omit<YugaEvent, 'yugaId' | 'wheelAngleDeg' | 'yugaYear' | 'mahayugaYear'>>;
  }
> = [
  {
    id: 'satya',
    name: 'Satya Yuga',
    alternateName: 'Krita Yuga',
    sanskrit: 'सत्य युग',
    ratio: 4,
    percentage: 40,
    degrees: 144,
    startAngle: 0,
    endAngle: 144,
    startYear: 0,
    endYear: 1_728_000,
    humanYears: 1_728_000,
    divineYears: 4_800,
    sandhyaYears: 144_000,
    mainEpochYears: 1_440_000,
    sandhyamsaYears: 144_000,
    dharmaPillars: 4,
    primaryVirtue: 'Tapas (Austerity & Truth)',
    elementalTone: 'Luminous Gold',
    accentHex: '#FACC15',
    accentSoftHex: 'rgba(250, 204, 21, 0.14)',
    accentBorderHex: 'rgba(250, 204, 21, 0.48)',
    description:
      'The Golden Age of Truth, occupying four-tenths of the Mahayuga. Dharma stands balanced on all four pillars—truthfulness, austerity, compassion, and purity—without institutional conflict.',
    rawEvents: [
      {
        id: 'satya-matsya',
        title: 'Matsya Avatar & The Cosmic Deluge',
        sanskritTerm: 'मत्स्यावतार',
        epochPhase: 'Sandhya (Dawn)',
        positionInYuga: 0.08,
        figureOrAvatar: 'Matsya · Vaivasvata Manu · Seven Rishis',
        sourceTradition: 'Matsya Purana · Shatapatha Brahmana',
        summary:
          'At the dawn of the cosmic cycle, Vishnu takes the form of a horned fish to guide Vaivasvata Manu and the Saptarishis in a vessel tethered to his horn across the pralaya floodwaters, recovering the stolen Vedas from Hayagriva.',
        significance:
          'Establishes the continuity of sacred knowledge and biological seed across cyclical cosmic dissolutions.',
        highlights: [
          'Preserves the four Vedas at the threshold of Satya Yuga',
          'Anchors the Ark to Mount Himavat until waters recede',
          'Inaugurates the lineage of the current Manvantara',
        ],
      },
      {
        id: 'satya-kurma',
        title: 'Samudra Manthana & Kurma Avatar',
        sanskritTerm: 'समुद्रमन्थन',
        epochPhase: 'Main Epoch',
        positionInYuga: 0.34,
        figureOrAvatar: 'Kurma · Devas & Asuras · Dhanvantari',
        sourceTradition: 'Bhagavata Purana · Mahabharata Adi Parva',
        summary:
          'Devas and Asuras cooperate to churn the Cosmic Ocean of Milk using Mount Mandara as the churning rod and Vasuki as the rope, resting upon the vast shell of Kurma, the cosmic tortoise.',
        significance:
          'Yields fourteen celestial treasures—including Lakshmi, Chandra, Kamadhenu, and the nectar Amrita—alongside the Halahala poison swallowed by Shiva.',
        highlights: [
          'Demonstrates cosmic equilibrium between opposing forces',
          'Emergence of Ayurveda through Dhanvantari',
          'Distribution of Amrita establishes celestial order',
        ],
      },
      {
        id: 'satya-varaha',
        title: 'Varaha Avatar & Restoration of Bhumi',
        sanskritTerm: 'वराहावतार',
        epochPhase: 'Main Epoch',
        positionInYuga: 0.62,
        figureOrAvatar: 'Varaha · Bhumi Devi',
        sourceTradition: 'Varaha Purana · Bhagavata Purana Canto 3',
        summary:
          'When the asura Hiranyaksha plunges the Earth into the primordial cosmic ocean (Garbhodaka), Vishnu manifests as the cosmic boar Varaha, lifting Bhumi Devi securely upon his tusks and restoring planetary orbit.',
        significance:
          'Symbolizes the rescue of terrestrial order from abyssal chaos and the sacred bond between cosmic law and the living Earth.',
        highlights: [
          'Cosmic battle in the primordial waters',
          'Re-establishes the seven planetary continents and seasons',
          'Revered in classical astronomy as the stabilization of Earth',
        ],
      },
      {
        id: 'satya-narasimha',
        title: 'Narasimha & Prahlada’s Dawn',
        sanskritTerm: 'नरसिंहावतार',
        epochPhase: 'Sandhyamsa (Twilight)',
        positionInYuga: 0.91,
        figureOrAvatar: 'Narasimha · Prahlada · Hiranyakashipu',
        sourceTradition: 'Narasimha Purana · Vishnu Purana',
        summary:
          'Emerges at twilight from a palace pillar—neither man nor beast, neither inside nor outside, neither day nor night—to protect the young sage Prahlada and uphold dharma beyond every technical loophole of tyranny.',
        significance:
          'Marks the closing threshold of Satya Yuga, demonstrating that devotion and cosmic truth transcend hubris and rigid literalism.',
        highlights: [
          'Manifestation at the liminal sandhya twilight hour',
          'Defends inner devotion over authoritarian power',
          'Transitions the cycle toward the ceremonial order of Treta',
        ],
      },
    ],
  },
  {
    id: 'treta',
    name: 'Treta Yuga',
    alternateName: 'Silver Age',
    sanskrit: 'त्रेता युग',
    ratio: 3,
    percentage: 30,
    degrees: 108,
    startAngle: 144,
    endAngle: 252,
    startYear: 1_728_000,
    endYear: 3_024_000,
    humanYears: 1_296_000,
    divineYears: 3_600,
    sandhyaYears: 108_000,
    mainEpochYears: 1_080_000,
    sandhyamsaYears: 108_000,
    dharmaPillars: 3,
    primaryVirtue: 'Jnana & Yajna (Sacred Action)',
    elementalTone: 'Burnished Amber',
    accentHex: '#FB923C',
    accentSoftHex: 'rgba(251, 146, 60, 0.15)',
    accentBorderHex: 'rgba(251, 146, 60, 0.48)',
    description:
      'Spanning three-tenths of the cycle (108°), Treta Yuga introduces ritual sacrifice (yajna), structured kingdoms, and conscious duty as Dharma rests on three pillars.',
    rawEvents: [
      {
        id: 'treta-vamana',
        title: 'Vamana Avatar & King Bali’s Three Strides',
        sanskritTerm: 'वामनावतार',
        epochPhase: 'Sandhya (Dawn)',
        positionInYuga: 0.12,
        figureOrAvatar: 'Vamana (Trivikrama) · Mahabali',
        sourceTradition: 'Rigveda (Three Strides) · Vamana Purana',
        summary:
          'Appearing as a diminutive scholar-mendicant at the grand sacrifice of King Mahabali, Vamana asks only for three paces of land—then expands to span Earth, Sky, and the infinite cosmos, honoring Bali’s humility.',
        significance:
          'Connects the Vedic motif of Vishnu’s three cosmic strides with the ethics of generosity and ego surrender.',
        highlights: [
          'Grants Mahabali sovereignty over Sutala',
          'Establishes cosmic measurement of space in three steps',
          'Commemorated in the harvest festival of Onam',
        ],
      },
      {
        id: 'treta-parashurama',
        title: 'Parashurama & The Warrior Reckoning',
        sanskritTerm: 'परशुराम',
        epochPhase: 'Main Epoch',
        positionInYuga: 0.38,
        figureOrAvatar: 'Parashurama · Jamadagni · Kartavirya Arjuna',
        sourceTradition: 'Brahmanda Purana · Mahabharata',
        summary:
          'A sage-warrior wielding the axe of Shiva who confronts unchecked royal arrogance across twenty-one campaigns, reclaiming coastal lands from the sea before retiring to penance in the Western Ghats.',
        significance:
          'Illustrates the tension between spiritual authority and corrupt military power during the middle Treta kingdoms.',
        highlights: [
          'Defends hermitages from predatory monarchs',
          'Shapes the Konkan and Malabar littoral traditions',
          'Mentors future epic heroes across epochs',
        ],
      },
      {
        id: 'treta-ganga',
        title: 'Bhagiratha & Descent of the Ganga',
        sanskritTerm: 'गङ्गावतरण',
        epochPhase: 'Main Epoch',
        positionInYuga: 0.65,
        figureOrAvatar: 'King Bhagiratha · Ganga · Shiva',
        sourceTradition: 'Valmiki Ramayana Balakanda · Bhagavata Purana',
        summary:
          'Through relentless multi-generational perseverance, King Bhagiratha petitions Brahma and Shiva to cushion the torrential descent of the celestial river Ganga through Shiva’s matted locks down to the plains and ocean.',
        significance:
          'Defines the archetype of persistent human effort ("Bhagiratha Prayatna") channeling celestial grace into terrestrial sustenance.',
        highlights: [
          'Shiva tempers the cosmic force at Gangotri and the Himalayas',
          'Nurtures the fertile Gangetic civilization',
          'Liberates the ancestors of the Ikshvaku dynasty',
        ],
      },
      {
        id: 'treta-ramayana',
        title: 'Rama Avatar & The Ramayana Epoch',
        sanskritTerm: 'रामायण',
        epochPhase: 'Sandhyamsa (Twilight)',
        positionInYuga: 0.90,
        figureOrAvatar: 'Rama · Sita · Lakshmana · Hanuman',
        sourceTradition: 'Valmiki Ramayana · Adhyatma Ramayana',
        summary:
          'Prince Rama of Ayodhya embodies steadfast duty through fourteen years of forest exile, the alliance with Sugriva and Hanuman, the crossing to Lanka against Ravana, and the subsequent reign of Rama Rajya.',
        significance:
          'Sets the enduring civilizational ideal of ethical governance, personal integrity, and devotion at the close of Treta Yuga.',
        highlights: [
          'Construction of the ocean bridge to Lanka',
          'Dialogue of duty, fidelity, and statecraft',
          'Precedes the transition into Dvapara Yuga',
        ],
      },
    ],
  },
  {
    id: 'dvapara',
    name: 'Dvapara Yuga',
    alternateName: 'Bronze Age',
    sanskrit: 'द्वापर युग',
    ratio: 2,
    percentage: 20,
    degrees: 72,
    startAngle: 252,
    endAngle: 324,
    startYear: 3_024_000,
    endYear: 3_888_000,
    humanYears: 864_000,
    divineYears: 2_400,
    sandhyaYears: 72_000,
    mainEpochYears: 720_000,
    sandhyamsaYears: 72_000,
    dharmaPillars: 2,
    primaryVirtue: 'Archana (Worship & Discernment)',
    elementalTone: 'Celestial Cerulean',
    accentHex: '#38BDF8',
    accentSoftHex: 'rgba(56, 189, 248, 0.15)',
    accentBorderHex: 'rgba(56, 189, 248, 0.48)',
    description:
      'Representing two-tenths of the cycle (72°), Dvapara Yuga witnesses duality, complex philosophy, the codification of the Vedas, and Dharma standing on two pillars.',
    rawEvents: [
      {
        id: 'dvapara-vyasa',
        title: 'Vyasa’s Division of the Four Vedas',
        sanskritTerm: 'वेदव्यास',
        epochPhase: 'Main Epoch',
        positionInYuga: 0.25,
        figureOrAvatar: 'Krishna Dvaipayana Vyasa · Paila · Vaishampayana · Jaimini · Sumantu',
        sourceTradition: 'Vishnu Purana · Mahabharata Shanti Parva',
        summary:
          'Anticipating diminishing human lifespan and memory in upcoming ages, the sage Vyasa organizes the single primordial Veda into four structured canons—Rig, Yajur, Sama, and Atharva—entrusting each to a principal disciple.',
        significance:
          'Preserves oral, philosophical, and liturgical knowledge into systematic lineages accessible to future generations.',
        highlights: [
          'Codifies the fourfold Vedic corpus and eighteen Puranas',
          'Establishes distinct schools of recitation and commentary',
          'Lays the textual foundation of classical Indian thought',
        ],
      },
      {
        id: 'dvapara-krishna-dwarka',
        title: 'Krishna’s Vrindavan & Dwarka Era',
        sanskritTerm: 'द्वारका लीला',
        epochPhase: 'Main Epoch',
        positionInYuga: 0.56,
        figureOrAvatar: 'Krishna · Balarama · Radha · Uddhava',
        sourceTradition: 'Harivamsha · Bhagavata Purana Canto 10',
        summary:
          'From the pastoral groves of Vrindavan and the lifting of Mount Govardhana to the founding of the maritime citadel of Dwarka, Krishna reshapes political alliances and introduces loving devotion (bhakti) as a direct path.',
        significance:
          'Synthesizes pastoral mysticism with statecraft at a pivotal moment in ancient Indian history.',
        highlights: [
          'Elevates ecological and community harmony at Govardhana',
          'Founds the fortified island city of Dwarka',
          'Establishes Bhakti alongside Jnana and Karma',
        ],
      },
      {
        id: 'dvapara-kurukshetra',
        title: 'Kurukshetra War & Bhagavad Gita',
        sanskritTerm: 'भगवद्गीता',
        epochPhase: 'Sandhyamsa (Twilight)',
        positionInYuga: 0.82,
        figureOrAvatar: 'Krishna · Arjuna · Pandavas & Kauravas',
        sourceTradition: 'Mahabharata Bhishma Parva',
        summary:
          'On the eve of the eighteen-day fratricidal war at Kurukshetra, Krishna delivers the 700-verse Bhagavad Gita to Arjuna, reconciling action without attachment, philosophical wisdom, and cosmic consciousness.',
        significance:
          'Stands as the philosophical keystone of the late Dvapara epoch, addressing moral crisis in times of civilizational upheaval.',
        highlights: [
          'Synthesizes Karma, Bhakti, Raja, and Jnana Yogas',
          'Vision of the Vishvarupa (Universal Cosmic Form)',
          'Reshapes every major dynasty of the subcontinent',
        ],
      },
      {
        id: 'dvapara-departure',
        title: 'Departure of Krishna & Epoch Transition',
        sanskritTerm: 'द्वापर अवसान',
        epochPhase: 'Sandhyamsa (Twilight)',
        positionInYuga: 0.98,
        figureOrAvatar: 'Krishna · Uddhava · King Yudhishthira',
        sourceTradition: 'Mahabharata Mausala Parva · Bhagavata Purana Canto 11',
        summary:
          'Thirty-six years after Kurukshetra, following the Uddhava Gita and the submersion of Dwarka, Krishna departs mortal embodiment—traditionally dated to February 18, 3102 BCE—marking the exact astronomical hinge into Kali Yuga.',
        significance:
          'Provides the traditional epoch zero-point used by ancient Indian astronomers such as Aryabhata.',
        highlights: [
          'Traditional astronomical alignment of planets in 3102 BCE',
          'Pandavas’ final northern ascent (Mahaprasthana)',
          'Submersion of Dwarka beneath the Arabian Sea',
        ],
      },
    ],
  },
  {
    id: 'kali',
    name: 'Kali Yuga',
    alternateName: 'Age of Strife & Renewal',
    sanskrit: 'कलि युग',
    ratio: 1,
    percentage: 10,
    degrees: 36,
    startAngle: 324,
    endAngle: 360,
    startYear: 3_888_000,
    endYear: 4_320_000,
    humanYears: 432_000,
    divineYears: 1_200,
    sandhyaYears: 36_000,
    mainEpochYears: 360_000,
    sandhyamsaYears: 36_000,
    dharmaPillars: 1,
    primaryVirtue: 'Dana & Nama (Compassion & Remembrance)',
    elementalTone: 'Crimson Ember',
    accentHex: '#FB7185',
    accentSoftHex: 'rgba(251, 113, 133, 0.16)',
    accentBorderHex: 'rgba(251, 113, 133, 0.50)',
    description:
      'The shortest and most intense segment at one-tenth of the wheel (36°). Though Dharma rests on a single pillar—truthful compassion—scriptures note that spiritual realization is swift through sincerity.',
    rawEvents: [
      {
        id: 'kali-parikshit',
        title: 'Dawn of Kali & Parikshit’s Vigil',
        sanskritTerm: 'कलि प्रारम्भ',
        epochPhase: 'Sandhya (Dawn)',
        positionInYuga: 0.12,
        figureOrAvatar: 'King Parikshit · Shuka Goswami',
        sourceTradition: 'Bhagavata Purana Canto 1 & 12',
        summary:
          'Inheriting the throne of Hastinapura at the dawn of Kali Yuga (c. 3102 BCE), King Parikshit restrains the personified spirit of Kali to limited domains and listens to the seven-day recitation of the Bhagavata Purana by Sage Shuka.',
        significance:
          'Signals that even in the darkest age, conscious vigilance and contemplation preserve clarity.',
        highlights: [
          'Traditional start of the Kali Era calendar',
          'Codification of the Bhagavata Purana narrative',
          'Establishes mindfulness as an antidote to materialism',
        ],
      },
      {
        id: 'kali-wisdom',
        title: 'Axial Philosophy & Siddha Treatises',
        sanskritTerm: 'दर्शन व गणित',
        epochPhase: 'Sandhya (Dawn)',
        positionInYuga: 0.38,
        figureOrAvatar: 'Upanishadic Sages · Buddha · Aryabhata',
        sourceTradition: 'Surya Siddhanta · Aryabhatiya · Upanishads',
        summary:
          'During the opening millennia of Kali Yuga, humanity pioneers formal logic, contemplative liberation movements, zero-based positional mathematics, and precise astronomical calculations of the 4,320,000-year Mahayuga itself.',
        significance:
          'Highlights the paradox of Kali Yuga: external fragmentation paired with acute analytical and scientific breakthroughs.',
        highlights: [
          'Aryabhata (499 CE) computes the Kali Yuga epoch and planetary periods',
          'Flourishing of Nyaya, Samkhya, Vedanta, and Buddhist philosophy',
          'Transmission of astronomical tables across civilizations',
        ],
      },
      {
        id: 'kali-bhakti',
        title: 'Global Synthesis & Inner Awakening',
        sanskritTerm: 'संकीर्तन युग',
        epochPhase: 'Main Epoch',
        positionInYuga: 0.66,
        figureOrAvatar: 'Poet-Saints · Seekers Across Cultures',
        sourceTradition: 'Vishnu Purana Book 6 · Bhakti Poetry',
        summary:
          'Across the long middle expanse of Kali Yuga, texts emphasize that austere rituals are replaced by universal accessibility—shared compassion, song, ecological stewardship, and direct self-inquiry.',
        significance:
          'Fulfills Vyasa’s insight in the Vishnu Purana that what took decades in Satya can be attained through sincere heart in Kali.',
        highlights: [
          'Democratization of philosophical & devotional wisdom',
          'Cross-cultural dialogue between science and consciousness',
          'Testing of humanity’s stewardship over technology and nature',
        ],
      },
      {
        id: 'kali-kalki',
        title: 'Kalki Avatar & Turning of the Wheel',
        sanskritTerm: 'कल्कि अवतार',
        epochPhase: 'Sandhyamsa (Twilight)',
        positionInYuga: 0.94,
        figureOrAvatar: 'Kalki · Devadatta · Shambhala',
        sourceTradition: 'Kalki Purana · Bhagavata Purana Canto 12',
        summary:
          'At the culmination of 432,000 years, when disorder peaks, Kalki appears upon the white steed Devadatta to dissolve corruption and inaugurate the dawn of a fresh Satya Yuga—completing the 360° turn of the wheel.',
        significance:
          'Closes the Mahayuga cycle, affirming that cosmic time is regenerative rather than terminal.',
        highlights: [
          'Completes the 4,320,000-year Mahayuga revolution',
          'Restores Dharma back to all four pillars',
          'Transitions seamlessly into the next Satya Yuga (0°)',
        ],
      },
    ],
  },
];

export const YUGAS: YugaDefinition[] = RAW_YUGAS.map((yuga) => ({
  id: yuga.id,
  name: yuga.name,
  alternateName: yuga.alternateName,
  sanskrit: yuga.sanskrit,
  ratio: yuga.ratio,
  percentage: yuga.percentage,
  degrees: yuga.degrees,
  startAngle: yuga.startAngle,
  endAngle: yuga.endAngle,
  startYear: yuga.startYear,
  endYear: yuga.endYear,
  humanYears: yuga.humanYears,
  divineYears: yuga.divineYears,
  sandhyaYears: yuga.sandhyaYears,
  mainEpochYears: yuga.mainEpochYears,
  sandhyamsaYears: yuga.sandhyamsaYears,
  dharmaPillars: yuga.dharmaPillars,
  primaryVirtue: yuga.primaryVirtue,
  elementalTone: yuga.elementalTone,
  accentHex: yuga.accentHex,
  accentSoftHex: yuga.accentSoftHex,
  accentBorderHex: yuga.accentBorderHex,
  description: yuga.description,
  events: yuga.rawEvents.map((ev) => {
    const wheelAngleDeg = yuga.startAngle + ev.positionInYuga * yuga.degrees;
    const yugaYear = Math.round(ev.positionInYuga * yuga.humanYears);
    const mahayugaYear = yuga.startYear + yugaYear;
    return {
      ...ev,
      yugaId: yuga.id,
      wheelAngleDeg,
      yugaYear,
      mahayugaYear,
    };
  }),
}));

export const ALL_EVENTS: YugaEvent[] = YUGAS.flatMap((y) => y.events);

/**
 * Given a wheel rotation angle in degrees (clockwise visual rotation),
 * compute which angle of the wheel currently sits under the fixed 12-o'clock reading needle.
 */
export function getNeedleWheelAngle(rotationDeg: number): number {
  const normalized = ((-rotationDeg % 360) + 360) % 360;
  return normalized;
}

export function getYugaAtWheelAngle(wheelAngleDeg: number): YugaDefinition {
  const a = ((wheelAngleDeg % 360) + 360) % 360;
  return (
    YUGAS.find((y) => a >= y.startAngle && a < y.endAngle) ?? YUGAS[YUGAS.length - 1]
  );
}

export function getMahayugaYearAtWheelAngle(wheelAngleDeg: number): number {
  const a = ((wheelAngleDeg % 360) + 360) % 360;
  return Math.round((a / 360) * TOTAL_MAHAYUGA_YEARS);
}

export function formatYears(years: number): string {
  return years.toLocaleString('en-US');
}
