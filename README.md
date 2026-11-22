# Vayu

> **Know your air. Breathe smarter.**

Vayu is a frontend-only Urban Air Quality Assistant designed for hackathons and public wellness. Built with transparent Open-Meteo atmospheric dispersion models, OpenStreetMap spatial tiles, and in-browser AI with zero API keys and zero tracking.

---

## 🌟 Architecture & Features

- **Frontend-Only**: Vite, React, strict TypeScript, Tailwind CSS, React Router, TanStack Query, Framer Motion.
- **Design Token System**: Strictly token-driven theme with Powder Blue, Soft Lavender, and Warm Sunset Peach in light mode, and dark navy/slate in dark mode with persistent user preference.
- **Single Source of Truth for AQI**: Separate health colors in `src/constants/aqi.ts` meeting WCAG AA contrast for every category badge.
- **Trilingual Accessibility**: Fully localized in English, Hindi (हिंदी), and Marathi (मराठी) without hardcoded UI strings.
- **No API Keys & No Login**: 100% open data via Open-Meteo and OpenStreetMap.

---

## 📁 Folder Structure

```text
src/
├── components/
│   ├── layout/       # AppShell, Header, Footer, LanguageSelector
│   ├── aqi/          # AQI overview cards, badges, pollutant breakdowns
│   ├── map/          # Leaflet OpenStreetMap interactive map
│   ├── health/       # Health advisories and tier guidance
│   ├── chat/         # In-browser WebLLM assistant with rule-based fallback
│   ├── forecast/     # Temporal atmospheric projections
│   ├── route/        # Low-pollution route comparisons via OSRM
│   └── ui/           # Design system tokens: Button, Card, Input, Modal, etc.
├── constants/        # Single source of truth (aqi.ts, etc.)
├── contexts/         # ThemeContext, LanguageContext, ToastContext
├── hooks/            # Custom hooks
├── locales/          # en.json, hi.json, mr.json with nested keys
├── pages/            # Landing (/), Dashboard (/app), Settings (/settings)
├── services/         # Open-Meteo geocoding & air quality service
├── types/            # Strict TypeScript interfaces
└── utils/            # Helper utilities and validators
```

---

## 🚀 Setup Steps

Anyone can run Vayu in three simple steps:

```bash
# 1. Clone the repository
git clone https://github.com/omkar-tupe483/Vayu.git
cd Vayu

# 2. Install dependencies (all pinned exact versions)
npm install

# 3. Start the local development server
npm run dev
```

### Additional Verification Scripts

- `npm run typecheck` — Run strict TypeScript verification (`tsc --noEmit`).
- `npm run lint` — Run ESLint rules.
- `npm run build` — Build production bundle.
- `npm run preview` — Preview the production bundle locally.
