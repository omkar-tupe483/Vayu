/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_TAGLINE?: string;
  readonly VITE_AQI_API_KEY?: string;
  readonly VITE_AQI_API_BASE_URL?: string;
  readonly VITE_DEFAULT_CITY?: string;
  readonly VITE_DEFAULT_LAT?: string;
  readonly VITE_DEFAULT_LON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

