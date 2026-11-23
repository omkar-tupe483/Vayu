# Vayu — Hackathon Demonstration & Judging Guide

Welcome to **Vayu** ("Know your air. Breathe smarter."). This guide provides a rapid tour of all key capabilities built for the Google Promptwars hackathon.

---

## 1. Quick Launch

1. Start the app: `npm run dev`
2. Open your browser to `http://localhost:5173`
3. Landing Page: Notice the animated air-swirl illustration, live Pune preview badge, "How Vayu Works" walk-through, and FAQ accordion.
4. Click **"Explore Dashboard"** or navigate to `/app`.

---

## 2. Interactive Feature Walkthrough

### A. Live City Search & Atmospheric Hero
- **City Search Combobox:** Type any city (e.g. "Pune", "Delhi", "Bengaluru", "Tokyo", "London"). The debounced autocomplete suggests matching locations with country/region names.
- **Hero Card:** Displays large AQI badge with category colors (`Good`, `Moderate`, `Unhealthy for Sensitive Groups`, `Unhealthy`, `Very Unhealthy`, `Hazardous`).
- **Data Honesty:** Notice the honest disclosure badge: *"Modelled estimates (Open-Meteo), not ground-sensor readings"*.
- **Pollutants Breakdown:** Detailed cards for PM2.5, PM10, Ozone, NO2, CO, and SO2 with unit badges and health descriptions.

### B. Interactive Leaflet Map
- Map smoothly centers and flies to the selected city coordinates.
- Leaflet marker is custom-colored by the city's AQI category with an animated ambient pulse ring.
- Click the marker to inspect area metrics.
- Click the **Target Location** control to geolocate your real position with translated denial/error handling.

### C. 24-Hour Predictive Forecast & Best Window Finder
- **SVG Forecast Chart:** Hand-written, lightweight responsive curve with color bands, "Now" marker, peak pollution hotspot, and cleanest hour badge.
- **Hourly Timeline:** Horizontally scrollable strip highlighting poor air intervals and optimal outdoor hours.
- **Best Time Window Card:** Adjust the profile selector or custom threshold slider to dynamically calculate the longest continuous safe window for outdoor workouts.

### D. Personalized Health Advisor
- Located on the Dashboard page or accessed via the **"View health advice"** hero button.
- Choose between 5 sensitivity profiles:
  1. **General Public**
  2. **Children**
  3. **Seniors (65+)**
  4. **Athletes & Runners**
  5. **Asthma & Sensitive**
- **Dev QA Simulation Tool:** Click the slider icon on the risk card to test any AQI from 0 to 500 in real-time.
- **N95 Respirator Guidance:** Context-aware mask advice stating the exact limitations (e.g., surgical masks do not filter PM2.5, respirators do not filter toxic gases).
- **Protective Measures Accordion:** Expandable measures for air purifiers, ventilation, hydration, and emergency action plans.

### E. Cleanest Route Navigator (`/routes`)
- Accessible via the navigation header link **"Clean Routes"**.
- Enter a starting point and destination in Pune (default preset: Pune Station to Kothrud).
- Toggle travel mode: Walking, Cycling, or Driving.
- Click **"Find Cleanest Route"**:
  - Fetches route geometry from public OSRM.
  - Samples waypoints along each polyline and samples atmospheric data.
  - Computes the distance-weighted exposure score: `sum(segment_km * aqi) / total_km`.
  - Compares the cleanest path against the fastest traffic corridor, highlighting the percentage improvement (e.g. *"24% cleaner air exposure"*).

### F. In-Browser Conversational AI Assistant
- Click the floating **"Ask Vayu AI"** button in the bottom right corner.
- **Multilingual Support:** Ask questions in English, Hindi (हिंदी), or Marathi (मराठी):
  - English: *"Can I run outdoors today?"*
  - Hindi: *"क्या मैं आज बाहर दौड़ सकता हूँ?"*
  - Marathi: *"मी आज धावायला जाऊ शकतो का?"*
- **Critical Medical Emergency Detection:** Type *"I have severe chest pain and cannot breathe"*. The assistant immediately displays an urgent red emergency alert directing the user to emergency medical services.
- **WebLLM Acceleration:** If WebGPU is supported by your browser, click **"Enable AI"** to run local model weights entirely in browser memory.

### G. Saved Locations, Threshold Alerts & Preferences (`/settings`)
- **Quick City Chips:** Bookmark current cities with one click; switch between favorites on the dashboard instantly.
- **Alert Modal:** Click **"Set alert"** on the hero card to set a custom AQI threshold (50-300) with a browser notification test trigger.
- **Accessibility:** Toggle **"Reduce motion"** to instantly disable animations across all cards, charts, and maps.
- **Data Privacy:** Click **"Clear All Saved Local Data"** to wipe all preferences with confirmation.

---

## 3. Technology Highlights & Constraints Adherence

| Constraint | Requirement | Vayu Implementation |
|---|---|---|
| **Repository Size** | < 10 MB (target < 3 MB) | **0.52 MB** source footprint |
| **Production Dist Size** | < 4 MB (excluding lazy chunks) | **0.46 MB** initial bundle |
| **API Keys** | Zero API keys | 100% public Open-Meteo, OSM, OSRM |
| **Zero Backend** | Serverless / Frontend-only | Runs entirely client-side |
| **Localization** | Trilingual | English (`en`), Hindi (`hi`), Marathi (`mr`) |
| **Security** | Strict CSP & No XSS | Verified zero `dangerouslySetInnerHTML`, strict CSP headers |
| **Unit Testing** | Vitest coverage | **39 passing tests** covering math, logic, and schemas |
