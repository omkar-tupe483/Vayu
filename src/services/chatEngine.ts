export interface ChatEngineInput {
  message: string;
  city: string;
  aqi: number;
  language?: string;
  householdSummary?: string;
}

const EMERGENCY_TRIGGERS = [
  'chest pain',
  'chest pressure',
  'cannot breathe',
  "can't breathe",
  'cant breathe',
  'shortness of breath',
  'trouble breathing',
  'hard to breathe',
  'difficulty breathing',
  'struggling to breathe',
  'choking',
  'heart attack',
  'blue lips',
  'सीने में दर्द',
  'सांस नहीं आ रही',
  'छातीत दुखणे',
  'श्वास घेता येत नाही',
];

const GREETING_TRIGGERS = ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'good morning', 'good evening'];

const ACKNOWLEDGEMENT_TRIGGERS = [
  'no problem',
  'no problems',
  'dont have any problem',
  "don't have any problem",
  'i am fine',
  "i'm fine",
  'im fine',
  'i am healthy',
  "i'm healthy",
  'all good',
  'okay',
  'ok',
  'got it',
  'thanks',
  'thank you',
];

export function generateChatReply({ message, city, aqi, language = 'en' }: ChatEngineInput): string {
  const lower = message.toLowerCase().trim();
  const isHighSmog = aqi > 150;
  const isModerate = aqi > 50 && aqi <= 150;

  // 1. Genuine Medical Emergency (strict phrases, never triggered by "improve my breathing")
  if (EMERGENCY_TRIGGERS.some((t) => lower.includes(t))) {
    if (language === 'hi') {
      return '⚠️ आपातकालीन सूचना: यदि आपको सीने में दर्द या सांस लेने में गंभीर कठिनाई हो रही है, तो कृपया तुरंत 108 / 112 पर कॉल करें या नजदीकी अस्पताल जाएं। वायु कोई चिकित्सा उपकरण नहीं है।';
    }
    if (language === 'mr') {
      return '⚠️ तात्काळ वैद्यकीय सूचना: छातीत दुखणे किंवा श्वास घेण्यास गंभीर त्रास होत असल्यास कृपया लगेच 108 / 112 वर संपर्क साधा. वायू हे वैद्यकीय उपकरण नाही.';
    }
    return '⚠️ Emergency Notice: If you are experiencing acute chest pain, choking, or severe difficulty breathing, please call emergency services (108 / 112 / 911) or go to the nearest emergency room right away. Vayu is not a medical device and cannot diagnose emergencies.';
  }

  // 2. Greetings
  if (GREETING_TRIGGERS.some((g) => lower === g || lower.startsWith(g + ' '))) {
    return `Hi there! I can help you with practical ways to reduce smog exposure in ${city}, indoor air hacks, mask fit, or daily timing. What would you like to focus on?`;
  }

  // 3. Reassurance / "I don't have any problems" / Acknowledgments
  if (ACKNOWLEDGEMENT_TRIGGERS.some((t) => lower.includes(t))) {
    if (lower.includes('thank')) {
      return 'You’re welcome! Take care and let me know whenever you want to check indoor air tips or mask advice.';
    }
    return isHighSmog
      ? `Glad to hear you're feeling well! Even when you feel completely fine, heavy pollution (like AQI ${aqi} right now) quietly irritates airways over time. Simple steps—like keeping windows closed during rush hour and wearing an N95 on busy roads—protect your long-term lung health.`
      : `Good to hear! With current conditions in ${city}, you can stick to your normal routine—just keep an eye on rush-hour traffic fumes.`;
  }

  // 4. Breathing Improvement / Lung Comfort
  if (
    lower.includes('improve') && lower.includes('breath') ||
    lower.includes('breathing exercise') ||
    lower.includes('breathe easier') ||
    lower.includes('lung health')
  ) {
    return [
      `Here are practical ways to breathe more comfortably${isHighSmog ? ` during heavy smog (AQI ${aqi})` : ''}:`,
      `1. Breathe through your nose outdoors: Nasal passages warm and filter larger dust particles before air reaches your lungs.`,
      `2. Do breathing exercises indoors only: Practice slow diaphragmatic or pursed-lip breathing inside a closed, clean room—never outdoors in smog.`,
      `3. Stay hydrated: Drinking water keeps your airway lining moist so cilia can clear trapped dust naturally.`,
      `4. Create a clean sleep space: ${isHighSmog ? 'Keep bedroom windows sealed at night and run a HEPA purifier if available.' : 'Keep dust down with damp mopping instead of dry sweeping.'}`,
      `\nWhy this matters: Reducing mouth-breathing and nighttime particle exposure lowers airway inflammation (Estimated impact: 25–45% lower respiratory irritation, Medium confidence). Note: For persistent breathing issues, consult a doctor.`,
    ].join('\n');
  }

  // 5. Cough / Mild Throat Irritation (non-emergency)
  if (lower.includes('cough') || lower.includes('throat') || lower.includes('sore') || lower.includes('irritation')) {
    return [
      `Smog particulates often dry out and irritate the throat. A few gentle, non-medical comfort steps:`,
      `• Keep indoor air clean: Close street-facing windows and avoid incense, candles, or frying smoke.`,
      `• Soothe airways: Warm water, herbal tea, or plain saline gargles help clear dust from the throat.`,
      `• Rest outdoors: Pause outdoor jogging or heavy exertion until air clears.`,
      `\nNote: Vayu is not a doctor. If a cough lasts more than a few days, worsens, or comes with fever or wheezing, please see a qualified physician.`,
    ].join('\n');
  }

  // 6. DIY Purifier / Corsi-Rosenthal
  if (lower.includes('diy') || lower.includes('box fan') || lower.includes('purifier')) {
    return [
      `A DIY box fan filter (Corsi-Rosenthal style) uses a standard box fan taped tightly to a MERV 13 (or HEPA) pleated HVAC filter:`,
      `• Honest effectiveness: Peer-reviewed tests show it delivers roughly 60–75% of the clean air delivery rate of commercial HEPA purifiers at a fraction of the cost (High confidence).`,
      `• Safety tip: Make sure the fan grille isn't obstructed, use a modern thermally protected fan, and turn it off when sleeping or leaving home.`,
    ].join('\n');
  }

  // 7. Windows & Ventilation
  if (lower.includes('window') || lower.includes('ventilat') || lower.includes('open')) {
    if (aqi <= 70) {
      return `Outdoor air in ${city} is currently acceptable (AQI ${aqi}). Opening opposite windows for 15–20 minutes creates helpful cross-ventilation to clear indoor CO₂ and cooking fumes (High confidence).`;
    }
    return `With AQI at ${aqi} in ${city}, it's best to keep street-facing windows closed—especially during morning and evening rush hours. If you need fresh air, briefly crack a window during the warmest midday hours (around 1–3 PM) when smog disperses most, and keep kitchen exhaust running while cooking (Medium confidence).`;
  }

  // 8. Masks & Respirators
  if (lower.includes('mask') || lower.includes('n95') || lower.includes('ffp2')) {
    if (aqi <= 50) {
      return `At AQI ${aqi}, particulate levels are low—no mask is needed for routine outdoor activities.`;
    }
    return `For AQI ${aqi}, a certified N95, FFP2, or KN95 respirator is recommended for commuting or walking near traffic. Press the nose clip firmly for an airtight seal. Note: Cloth and loose surgical masks do not filter fine PM2.5 particles (High confidence).`;
  }

  // 9. Children / Elderly / Pregnancy / Asthma
  if (
    lower.includes('child') ||
    lower.includes('kid') ||
    lower.includes('elder') ||
    lower.includes('senior') ||
    lower.includes('pregnant') ||
    lower.includes('asthma')
  ) {
    if (isHighSmog) {
      return `At AQI ${aqi}, children, seniors, pregnant people, and anyone with asthma face higher risk. Shift playground time and walks indoors, keep quick-relief inhalers accessible if prescribed, and use a well-fitted pediatric/adult N95 if travel is unavoidable (High confidence).`;
    }
    if (isModerate) {
      return `At AQI ${aqi}, sensitive groups can go out briefly during midday, but should skip heavy running near busy roads and watch for coughing or fatigue (Medium confidence).`;
    }
    return `Conditions are currently good (AQI ${aqi})—safe for normal outdoor play and walks.`;
  }

  // 10. Off-topic / Diagnosis refusal
  if (
    lower.includes('prescribe') ||
    lower.includes('medicine') ||
    lower.includes('medication') ||
    lower.includes('diagnose') ||
    lower.includes('tablet') ||
    lower.includes('antibiotic')
  ) {
    return `I can't prescribe medication or diagnose medical conditions—only a licensed doctor can do that safely. I can, however, share ways to reduce your exposure to air pollution at home and outdoors.`;
  }

  // 11. Helpful, non-repetitive default
  return `I'm focused on helping you navigate air quality and smog protection in ${city}. You can ask me about:\n• Ways to breathe easier & indoor air hacks\n• When to open windows or run a DIY purifier\n• N95 mask fit & protection for kids or seniors\n• Cleanest time of day to step outside`;
}
