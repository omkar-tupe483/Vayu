# Vayu

> **Know your air. Breathe smarter.**  
> A lightweight, frontend-only Urban Air Quality Assistant built for the Google Promptwars hackathon.

## Overview
Vayu is a privacy-first, zero-barrier air quality companion designed for urban citizens. It provides live US AQI, pollutant breakdowns, 24-hour atmospheric forecasts, clean route planning, rule-based health guidance, and in-browser AI without accounts, databases, or API keys.

## Quick Start
```bash
git clone https://github.com/omkar-tupe483/Vayu.git
cd Vayu
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

## Architecture & Data
- **Live AQI & Forecasts**: Open-Meteo Atmospheric Chemistry & Geocoding API (modelled estimates).
- **Interactive Maps**: OpenStreetMap tiles with Leaflet.
- **Clean Routes**: Open Source Routing Machine (OSRM) with batched atmospheric exposure scoring.
- **Local AI**: WebLLM Web Worker + rule-based multilingual fallback.
- **Localization**: English, Hindi (हिंदी), and Marathi (मराठी).
