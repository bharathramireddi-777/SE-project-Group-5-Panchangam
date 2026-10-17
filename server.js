const express = require('express');
const cors = require('cors');
const path = require('path');
const { calculatePanchangam, getMonthlyCalendar } = require('./engine');
const { POPULAR_CITIES, RASIS, NAKSHATRAMS } = require('./constants');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// HTML Page Routes (Multi-Page Redirects)
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: PUBLIC_DIR });
});

app.get('/panchangam', (req, res) => {
  res.sendFile('panchangam.html', { root: PUBLIC_DIR });
});

app.get('/calendar', (req, res) => {
  res.sendFile('calendar.html', { root: PUBLIC_DIR });
});

app.get('/raashulu', (req, res) => {
  res.sendFile('raashulu.html', { root: PUBLIC_DIR });
});

app.get('/nakshatralu', (req, res) => {
  res.sendFile('nakshatralu.html', { root: PUBLIC_DIR });
});

app.get('/muhurthams', (req, res) => {
  res.sendFile('muhurthams.html', { root: PUBLIC_DIR });
});

app.get('/festivals', (req, res) => {
  res.sendFile('festivals.html', { root: PUBLIC_DIR });
});

// API: Daily Panchangam
app.get('/api/panchangam', (req, res) => {
  try {
    const { date, lat, lng, timeZone } = req.query;
    
    const evalDate = date ? new Date(date) : new Date();
    const evalLat = lat ? parseFloat(lat) : 17.3850;
    const evalLng = lng ? parseFloat(lng) : 78.4867;
    const evalTz = timeZone || "Asia/Kolkata";

    if (isNaN(evalDate.getTime())) {
      return res.status(400).json({ error: "Invalid date parameter. Use YYYY-MM-DD format." });
    }

    const panchangam = calculatePanchangam(evalDate, evalLat, evalLng, 500, evalTz);
    res.json(panchangam);
  } catch (err) {
    console.error("Calculation Error:", err);
    res.status(500).json({ error: "Failed to calculate Panchangam", details: err.message });
  }
});

// API: Monthly Calendar
app.get('/api/monthly-calendar', (req, res) => {
  try {
    const { year, month, lat, lng, timeZone } = req.query;
    const curDate = new Date();
    const evalYear = year ? parseInt(year) : curDate.getFullYear();
    const evalMonth = month ? parseInt(month) : (curDate.getMonth() + 1);
    const evalLat = lat ? parseFloat(lat) : 17.3850;
    const evalLng = lng ? parseFloat(lng) : 78.4867;
    const evalTz = timeZone || "Asia/Kolkata";

    const calendarData = getMonthlyCalendar(evalYear, evalMonth, evalLat, evalLng, evalTz);
    res.json(calendarData);
  } catch (err) {
    console.error("Monthly Calendar Error:", err);
    res.status(500).json({ error: "Failed to generate monthly calendar", details: err.message });
  }
});

// API: All 12 Raashis
app.get('/api/raashis', (req, res) => {
  const panchangam = calculatePanchangam(new Date());
  res.json({
    currentChandraRasi: panchangam.astrology.chandraRasi,
    currentSuryaRasi: panchangam.astrology.suryaRasi,
    chandrashtamaRasi: panchangam.astrology.chandrashtamaRasi,
    raashis: panchangam.allRaashis
  });
});

// API: All 27 Nakshatras
app.get('/api/nakshatras', (req, res) => {
  const panchangam = calculatePanchangam(new Date());
  res.json({
    currentNakshatra: panchangam.panchaAngas.nakshatram,
    nakshatras: panchangam.allNakshatras
  });
});

// API: Supported Cities
app.get('/api/cities', (req, res) => {
  res.json(POPULAR_CITIES);
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ☀️  3D SOLAR SYSTEM TELUGU PANCHANGAM SERVER RUNNING`);
  console.log(` 🌐 Home Dashboard : http://localhost:${PORT}`);
  console.log(` 🪔 Daily Panchangam: http://localhost:${PORT}/panchangam`);
  console.log(` 📅 Monthly Calendar: http://localhost:${PORT}/calendar`);
  console.log(` ♈ 12 Raashis      : http://localhost:${PORT}/raashulu`);
  console.log(` ✨ 27 Nakshatras   : http://localhost:${PORT}/nakshatralu`);
  console.log(` ⏳ Muhurthams      : http://localhost:${PORT}/muhurthams`);
  console.log(` 🎉 Festivals       : http://localhost:${PORT}/festivals`);
  console.log(`=======================================================`);
});
