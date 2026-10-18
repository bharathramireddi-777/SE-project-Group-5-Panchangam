# 🕉️ శ్రీ తెలుగు పంచాంగం (Telugu Panchangam Web Application)

An authentic, astronomical Luni-Solar Almanac & Astrological Computation Engine built with **Node.js, Express, Astronomy-Engine**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 1. The Five Limbs (పంచాంగములు - Pancha Angas)
* **తిథి (Tithi)**: Calculated via $(\lambda_{\text{Moon}} - \lambda_{\text{Sun}}) / 12^\circ$ with exact end-time boundary search.
* **వారం (Vaaram)**: Weekday based on local Sunrise (*Suryodaya*).
* **నక్షత్రం (Nakshatram)**: 27 lunar mansions with Pada (1–4) and exact transition time using Lahiri Ayanamsha.
* **యోగం (Yogam)**: 27 Luni-Solar yogas $(\lambda_{\text{Moon}} + \lambda_{\text{Sun}})$.
* **కరణం (Karanam)**: Half-tithi ($6^\circ$) featuring 7 repeating and 4 fixed karanas.

### 2. Telugu Calendar Era Metadata
* **సంవత్సరం (Samvatsaram)**: 60-year Jovian cycle (e.g., *పరాభవ నామ సంవత్సరం*).
* **ఆయనం (Ayanam)**: *ఉత్తరాయణం* (Uttarayanam) vs *దక్షిణాయనం* (Dakshinayanam).
* **ఋతువు (Ruthuvu)**: 6 seasons (*వసంత, గ్రీష్మ, వర్ష, శరద్, హేమంత, శిశిర*).
* **మాసం (Masam)**: 12 Telugu Lunar months (*చైత్రం* to *ఫాల్గుణం*).
* **పక్షం (Paksham)**: *శుక్ల పక్షం* (Waxing) & *కృష్ణ పక్షం* (Waning).

### 3. Auspicious & Inauspicious Timings
* **అశుభ సమయాలు**: రాహుకాలం (Rahu Kalam), యమగండం (Yamagandam), గుళిక కాలం (Gulika Kalam), దుర్ముహూర్తం (Durmuhurtham), వర్జ్యం (Varjyam).
* **శుభ సమయాలు**: అభిజిత్ ముహూర్తం (Abhijit Muhurtham), అమృత కాలం (Amrutha Kalam), బ్రహ్మ ముహూర్తం (Brahma Muhurtham).

### 4. దక్షిణ భారత జాతక చక్రం (South Indian Kundali Chart)
* Clockwise fixed 12-Rasi square grid.
* Real-time calculation of **9 Grahas** (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) and **Lagna (Ascendant)** degrees.

### 5. Multi-City & Bilingual
* Real-time location adjustments for Hyderabad, Vijayawada, Visakhapatnam, Tirupati, Warangal, Bengaluru, Dallas, etc.
* Instant toggle between **తెలుగు** (Noto Sans Telugu) and **English**.
* WhatsApp / Clipboard export for daily sharing.

---

## 🚀 Running the Project

Run this in root directory:

- Install dependencies
```powershell
npm install 
```
- Run the server
```powershell
```
```
node server.js
```

Open your browser to:
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **JSON API**: [http://localhost:3000/api/panchangam](http://localhost:3000/api/panchangam)

---

## 📐 Mathematical Formulation

* **Lahiri Ayanamsha (Chitra Paksha)**:
  $$\text{Ayanamsa}(T) = 23.85709^\circ + 1.396042^\circ T + 0.000308^\circ T^2$$
  where $T = \frac{\text{JD} - 2451545.0}{36525.0}$.
* **Sidereal Longitude**:
  $$\lambda_{\text{sidereal}} = (\lambda_{\text{tropical}} - \text{Ayanamsa}) \pmod{360^\circ}$$
