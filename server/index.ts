import http from 'node:http';
import https from 'node:https';

const PORT = parseInt(process.env.PORT || '3000', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// In-memory per-IP rate limiter (max 30 requests per minute)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  entry.count += 1;
  return true;
}

function cleanInput(text: unknown, maxLen = 500): string {
  if (typeof text !== 'string') return '';
  // Strip control characters (except newline) and cap length
  return text.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '').trim().slice(0, maxLen);
}

function setSecurityHeaders(res: http.ServerResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function callGeminiDirect(systemInstruction: string, userPrompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600,
      },
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const parsed = new URL(url);

    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 8000,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              interface GeminiResponse {
                candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
              }
              const json = JSON.parse(body) as GeminiResponse;
              const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
              resolve(text || null);
            } else {
              resolve(null);
            }
          } catch {
            resolve(null);
          }
        });
      }
    );

    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  // 1. Health check
  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  // Rate limiting for API mutations
  if (!checkRateLimit(clientIp)) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }));
    return;
  }

  // 2. Chat Endpoint
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 32 * 1024) req.destroy(); // 32KB max body
    });

    req.on('end', async () => {
      try {
        interface ChatRequestBody {
          message?: string;
          city?: string;
          aqi?: number;
          language?: string;
          householdSummary?: string;
        }

        const json = (JSON.parse(body || '{}')) as ChatRequestBody;
        const message = cleanInput(json.message, 500);
        const city = cleanInput(json.city, 100) || 'your city';
        const aqi = Math.round(Number(json.aqi) || 50);
        const lang = json.language === 'hi' ? 'Hindi' : json.language === 'mr' ? 'Marathi' : 'English';
        const household = cleanInput(json.householdSummary, 200) || 'General household';

        if (!message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Message cannot be empty.' }));
          return;
        }

        const systemPrompt = `You are Vayu, a calm, warm, non-alarmist urban air quality assistant for ${city}.
Current US AQI in ${city} is ${aqi}. Household context: ${household}.
Guidelines:
1. Provide practical, health-first environmental advice in plain ${lang} (grade-8 reading level).
2. Never provide clinical medical diagnosis or prescribe medications.
3. If the user mentions acute chest pain, choking, or severe shortness of breath, immediately advise calling local emergency services (108 / 112 / 911).
4. For every recommendation, explain "Why this matters" and state estimated impact with confidence (Low/Medium/High).
5. Never invent numbers. Emphasize that estimates are environmental indicators, not medical facts.
6. Keep response concise (under 120 words).`;

        const userPrompt = `User question: "${message}"`;
        const aiResponse = await callGeminiDirect(systemPrompt, userPrompt);

        // Fallback response if Gemini is unavailable
        let finalReply = aiResponse;
        if (!finalReply) {
          if (aqi <= 50) {
            finalReply = `Current air quality in ${city} is Good (AQI ${aqi}). It is safe for outdoor activities and home ventilation. No special mask is required.`;
          } else if (aqi <= 100) {
            finalReply = `Air quality in ${city} is Moderate (AQI ${aqi}). Sensitive individuals and asthmatics should take breaks during outdoor exercise and keep a rescue inhaler nearby.`;
          } else if (aqi <= 200) {
            finalReply = `Air quality is elevated in ${city} (AQI ${aqi}). We recommend wearing a certified N95 respirator during outdoor travel and keeping windows sealed during rush hours.`;
          } else {
            finalReply = `Air alert: Current AQI in ${city} is ${aqi} (Hazardous/Severe). Stay indoors in filtered rooms, avoid all strenuous exertion, and use an N95 respirator if stepping outside.`;
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: finalReply, groundedAqi: aqi }));
      } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to process request.' }));
      }
    });
    return;
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Vayu Backend Proxy running on http://localhost:${PORT}`);
});
