# Vayu

> **Know your air. Breathe smarter.**

An accessible, lightweight, frontend-only Urban Air Quality Assistant built for hackathons and public health awareness.

---

## 🌟 Core Pillars

- **100% Client-Side & Zero-API-Key**: Powered by the **Open-Meteo Geocoding & Air Quality APIs**, **OpenStreetMap tiles**, and in-browser AI.
- **Trilingual Localization**: Fully available in **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** without hardcoded text.
- **Honest Data Disclosure**: Explicitly discloses that atmospheric metrics are modelled estimates, not ground-sensor readings.
- **Strict Accessibility (a11y)**: Built with semantic HTML, WCAG AA contrast ratios, visible focus indicators, skip navigation links, and respect for `prefers-reduced-motion`.
- **Single Source of Truth**: All AQI categories, color palettes, and health advice are centralized in [`src/constants/aqi.ts`](src/constants/aqi.ts).
- **Zod Schema Validation**: All external API payloads are validated strictly with Zod at runtime.

---

## 📁 Architecture & Folder Structure

```text
src/
├── components/
│   ├── common/             # Header, Footer, navigation, language switcher
│   ├── dashboard/          # CitySearch, AQIOverviewCard, PollutantGrid
│   └── map/                # Interactive Leaflet map with OpenStreetMap tiles
├── constants/
│   └── aqi.ts              # Single source of truth for AQI colors & tiers
├── i18n/
│   ├── translations/       # English (en.ts), Hindi (hi.ts), Marathi (mr.ts)
│   ├── types.ts            # Type definitions for languages and keys
│   └── index.tsx           # LanguageContext, t() helper, and useTranslation()
├── pages/
│   ├── DashboardPage.tsx   # Live search, metric cards, and interactive map
│   ├── HealthGuidancePage.tsx # Detailed tiers and health advisories
│   ├── AboutPage.tsx       # Methodology and transparency disclosure
│   └── NotFoundPage.tsx    # 404 fallback page
├── schemas/
│   ├── airQualitySchema.ts # Zod schema for Open-Meteo air quality response
│   └── geocodingSchema.ts  # Zod schema for Open-Meteo geocoding search
├── services/
│   └── openMeteo.ts        # Type-safe API calls with Zod validation & timeout
├── App.tsx                 # Client-side router layout
├── index.css               # Tailwind CSS, Leaflet styles & a11y overrides
└── main.tsx                # Application bootstrap (QueryClient & LanguageProvider)
```

---

## 🚀 Quick Start

Anyone can run Vayu in three simple steps:

```bash
# 1. Clone the repository
git clone https://github.com/omkar-tupe483/Vayu.git
cd Vayu

# 2. Install dependencies (all pinned exact versions)
npm install

# 3. Start the Vite development server
npm run dev
```

### Additional Commands

- `npm run typecheck`: Run strict TypeScript checks (`tsc --noEmit`).
- `npm run lint`: Run ESLint.
- `npm run build`: Build the production bundle.
- `npm run preview`: Preview the production build locally.

