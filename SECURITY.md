# Security Policy

## Overview & Threat Model

**Vayu** ("Know your air. Breathe smarter.") is designed with a **zero-trust, frontend-only architecture**. The application contains no custom backend server, database, user authentication system, or cookies. It operates entirely client-side inside the user's modern web browser.

---

## 1. Domain Inventory & Network Egress

Vayu connects exclusively to documented, public, read-only APIs and services without sending private credentials:

| Domain | Purpose | Authentication | Egress Data |
|---|---|---|---|
| `https://geocoding-api.open-meteo.com` | City name search & geocoding autocomplete | None (Public) | City search query string |
| `https://api.open-meteo.com` | Live air quality metrics & 24h predictive forecast | None (Public) | Latitude & longitude coordinates |
| `https://*.tile.openstreetmap.org` | OpenStreetMap cartographic map tiles | None (Public) | Standard tile coordinate requests (`z/x/y.png`) |
| `https://router.project-osrm.org` | Open Source Routing Machine (OSRM) driving/walking directions | None (Public) | Start & destination coordinates |
| `https://huggingface.co` / `*.huggingface.co` | WebLLM model weights (only fetched when user clicks "Enable AI") | None (Public) | Static model shard GET requests |

No other external servers or telemetry trackers are contacted.

---

## 2. In-Browser AI & Privacy

- **Client-Side Execution:** In-browser AI is powered by `@mlc-ai/web-llm` utilizing WebGPU.
- **Zero Remote Telemetry:** Prompts and conversation history never leave the user's browser memory or device.
- **Rule-Based Fallback:** If WebGPU is unavailable or disabled, Vayu operates via an instant rule engine that executes purely synchronously client-side.

---

## 3. Cross-Site Scripting (XSS) & Content Security Policy

- **No Dangerous HTML:** `dangerouslySetInnerHTML`, `eval()`, and inline script executions are strictly prohibited across the codebase.
- **Plain Text Rendering:** All AI conversational outputs, error messages, and user-generated text inputs are rendered as inert text nodes.
- **Strict Content Security Policy (CSP):** Implemented in `index.html`, `public/_headers`, and `vercel.json`:
  ```http
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https://*.tile.openstreetmap.org https://unpkg.com;
  connect-src 'self' https://geocoding-api.open-meteo.com https://api.open-meteo.com https://router.project-osrm.org https://huggingface.co https://*.huggingface.co https://raw.githubusercontent.com;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  ```

---

## 4. Input Sanitization & Rate Limiting

- **Character Limits:**
  - City search inputs: Capped at 100 characters.
  - AI Assistant chat prompts: Capped at 500 characters.
  - Custom alert thresholds: Constrained between 50 and 500 AQI.
- **Validation:** Every API response and localStorage read is strictly validated using [Zod](https://zod.dev) schemas before processing or state updates.
- **Rate-Limiting:** All user input events are debounced to prevent excessive outbound API requests.

---

## 5. Vulnerability Reporting

If you discover a security vulnerability in Vayu, please report it privately:
1. Open a **Private Security Advisory** on the GitHub repository: `https://github.com/omkar-tupe483/Vayu/security/advisories/new`
2. Provide a clear description, reproduction steps, and impact assessment.
3. We will respond within 48 hours and coordinate a public fix.
