# Vayu

> **Know your air. Breathe smarter.**

Vayu is an Urban Air Quality Assistant designed to help city dwellers track ambient air pollution (AQI, PM2.5, PM10, NO2, etc.) in real time and receive intelligent health advisories to protect themselves and their families.

---

## 🚀 Features

- **Real-Time AQI Monitoring**: Live Air Quality Index tracking across urban centers.
- **Pollutant Breakdown**: Granular readings for PM2.5, PM10, NO2, SO2, CO, and Ozone.
- **Smart Health Advisories**: Timely recommendations based on air toxicity tiers.
- **Modern Tech Stack**: Built with Vite, React, TypeScript, and Tailwind CSS.

---

## 📁 Project Structure

```text
vayu/
├── public/
│   └── favicon.svg           # Project favicon with "Vayu" branding
├── src/
│   ├── components/           # Reusable UI components (Header, AQICard, etc.)
│   ├── hooks/                # Custom React hooks (useAirQuality, etc.)
│   ├── services/             # API services and data fetchers
│   ├── utils/                # Helper utilities and AQI calculations
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   ├── index.css             # Tailwind CSS entrypoint
│   ├── main.tsx              # Application root mount
│   └── vite-env.d.ts         # Vite environment types
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore rules (includes .env)
├── index.html                # HTML template (Title & Favicon: Vayu)
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript project references
├── tsconfig.app.json         # TypeScript app config
├── tsconfig.node.json        # TypeScript Node/Vite config
└── vite.config.ts            # Vite configuration
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <repo-url>
   cd Vayu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```
