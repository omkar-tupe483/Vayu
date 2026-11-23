import { AIService, ChatContext } from './ai';
import { getAqiCategory } from '../constants/aqi';
import { getAdvice } from '../utils/advisor';
import enLocale from '../locales/en.json';
import hiLocale from '../locales/hi.json';
import mrLocale from '../locales/mr.json';

function getLocalizedText(
  lang: 'en' | 'hi' | 'mr',
  keyPath: string,
  params?: Record<string, string | number>
): string | undefined {
  const locale: Record<string, unknown> = lang === 'hi' ? hiLocale : lang === 'mr' ? mrLocale : enLocale;
  const parts = keyPath.split('.');
  let current: unknown = locale;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  if (typeof current !== 'string') return undefined;
  let text = current;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return text;
}

export class RuleBasedAIService implements AIService {
  name = 'Vayu Rule Engine';
  mode = 'rule_based' as const;
  isAvailable = true;

  async generateResponse(
    prompt: string,
    context: ChatContext,
    _onProgress?: (partialText: string) => void
  ): Promise<string> {
    const text = prompt.toLowerCase().trim();
    const lang = context.language;
    const aqi = Math.round(context.currentAqi ?? context.airQualityData?.us_aqi ?? 50);
    const category = getAqiCategory(aqi);
    const city = context.city || 'your city';
    const profile = context.userProfile || 'general';
    const advice = getAdvice(context.airQualityData, profile, context.forecastData);

    // 1. Critical Medical Emergency Detection
    const emergencyTriggers = [
      'chest pain',
      'cannot breathe',
      'cant breathe',
      'severe breathing',
      'choking',
      'heart attack',
      'सीने में दर्द',
      'सांस नहीं आ रही',
      'सांस फूलना',
      'छातीत दुखणे',
      'श्वास घेता येत नाही',
      'दम लागणे',
    ];

    if (emergencyTriggers.some((t) => text.includes(t))) {
      if (lang === 'hi') {
        return `⚠️ तत्काल आपातकालीन चिकित्सा सूचना: यदि आपको या किसी को सीने में तेज दर्द, सांस लेने में अत्यधिक कठिनाई या दम घुटने का अनुभव हो रहा है, तो कृपया तुरंत नजदीकी अस्पताल की आपातकालीन सेवा (108 / 112) से संपर्क करें। वायु (Vayu) केवल एक सूचनात्मक सहायक है, यह आपातकालीन चिकित्सा उपचार का विकल्प नहीं है।`;
      }
      if (lang === 'mr') {
        return `⚠️ तात्काळ वैद्यकीय आणीबाणी सूचना: आपल्याला किंवा कोणालाही छातीत तीव्र वेदना, श्वास घेण्यास गंभीर अडचण अथवा गुदमरल्यासारखे वाटत असल्यास तात्काळ जवळच्या रुग्णालयात किंवा आपत्कालीन मदत क्रमांक (108 / 112) वर संपर्क साधा. वायू (Vayu) केवळ माहितीपर सहाय्यक असून हे वैद्यकीय उपचारांचा पर्याय नाही.`;
      }
      return `⚠️ Urgent Medical Emergency Notice: If you or someone with you is experiencing severe breathing distress, acute chest pain, or choking, please call emergency medical services (such as 108/112/911) immediately or proceed to the nearest emergency room. Vayu is an informational assistant and cannot provide clinical diagnosis or emergency medical care.`;
    }

    // 2. Greetings, Identity & App Capabilities ("hi", "who are you", "what can you do")
    const greetingTriggers = [
      'hello',
      'hi',
      'hey',
      'namaste',
      'greetings',
      'who are you',
      'what are you',
      'what can you do',
      'help',
      'introduce',
      'who made you',
      'नमस्ते',
      'नमस्कार',
      'तुम्ही कोण आहात',
      'तू कोण आहेस',
      'आप कौन हैं',
      'मदत',
      'सहायता',
    ];

    const isDirectGreeting =
      greetingTriggers.some((t) => text === t || text.startsWith(t + ' ') || text.endsWith(' ' + t)) ||
      text === 'hi' ||
      text === 'hello' ||
      text === 'hey' ||
      text === 'help';

    if (isDirectGreeting) {
      if (lang === 'hi') {
        return `नमस्ते! मैं वायु (Vayu) का इन-ब्राउज़र वायुमंडलीय सहायक हूँ।\n\nमैं ${city} के वास्तविक वायु गुणवत्ता सूचकांक (AQI ${aqi}) के आधार पर आपकी मदद कर सकता हूँ:\n• 🏃 बाहर दौड़ने व कसरत करने की सुरक्षा\n• 😷 N95 मास्क व रेस्पिरेटर की आवश्यकता\n• 🪟 खिड़कियां खोलने व एयर प्यूरीफायर की सलाह\n• 👶 बच्चों, बुजुर्गों व दमा (Asthma) मरीजों के लिए सावधानी\n• ⏰ 24-घंटे के दौरान सबसे स्वच्छ समय\n• 🗺️ कम प्रदूषण वाले सबसे सुरक्षित यात्रा मार्ग\n\nआज मैं आपकी क्या सहायता कर सकता हूँ?`;
      }
      if (lang === 'mr') {
        return `नमस्कार! मी वायू (Vayu) चा इन-ब्राउझर वायुमंडलीय सहाय्यक आहे.\n\nमी ${city} मधील हवेच्या गुणवत्तेच्या (AQI ${aqi}) आधारे आपल्याला खालील बाबींमध्ये मदत करू शकतो:\n• 🏃 बाहेर धावणे व व्यायामाची सुरक्षितता\n• 😷 N95 मास्क वापरण्याचा सल्ला\n• 🪟 खिडक्या उघडणे व एअर प्युरिफायर वापर\n• 👶 मुले, ज्येष्ठ आणि दम्याच्या रुग्णांसाठी दक्षता\n• ⏰ दिवसातील सर्वात स्वच्छ हवेची वेळ\n• 🗺️ सर्वात कमी प्रदूषणाचा प्रवासाचा मार्ग\n\nआज मी आपल्याला कशी मदत करू शकेन?`;
      }
      return `Hello! I am Vayu, your in-browser urban air quality assistant for ${city}.\n\nBased on the current US AQI of ${aqi} (${category.label}), I can help you with:\n• 🏃 Outdoor running, walking & workout safety\n• 😷 N95 mask & respirator recommendations\n• 🪟 Window cross-ventilation & HEPA air purifiers\n• 👶 Precautions for children, seniors & asthma sensitivities\n• ⏰ 24-hour cleanest atmospheric time windows\n• 🗺️ Low-exposure cleanest commute navigation\n\nWhat would you like to know today?`;
    }

    // 3. Gratitude & Courtesy ("thanks", "thank you", "bye")
    const gratitudeTriggers = [
      'thank you',
      'thanks',
      'thx',
      'dhanyawad',
      'shukriya',
      'bye',
      'goodbye',
      'धन्यवाद',
      'शुक्रिया',
      'आभार',
      'अलविदा',
    ];

    if (gratitudeTriggers.some((t) => text.includes(t))) {
      if (lang === 'hi') {
        return `आपका बहुत-बहुत धन्यवाद! स्वस्थ रहें, स्वच्छ सांस लें और आवश्यकता पड़ने पर कभी भी Vayu से सलाह लें।`;
      }
      if (lang === 'mr') {
        return `आपले मनःपूर्वक धन्यवाद! निरोगी राहा, स्वच्छ श्वास घ्या आणि हवेच्या माहितीसाठी कधीही वायूची (Vayu) मदत घ्या.`;
      }
      return `You're very welcome! Stay safe, breathe clean air, and feel free to ask Vayu anytime you need air quality advice.`;
    }

    // 4. Asthma, Allergies & Respiratory Sensitivity
    const asthmaTriggers = [
      'asthma',
      'inhaler',
      'wheezing',
      'allergy',
      'allergies',
      'bronchitis',
      'lungs',
      'respiratory',
      'heart patient',
      'दमा',
      'अस्थमा',
      'एलर्जी',
      'श्वासाचा त्रास',
      'फुफ्फुस',
    ];

    if (asthmaTriggers.some((t) => text.includes(t))) {
      if (aqi <= 50) {
        return lang === 'hi'
          ? `वर्तमान में ${city} की हवा पूरी तरह स्वच्छ है (AQI ${aqi})। दमा (Asthma) या एलर्जी से पीड़ित व्यक्तियों के लिए वायुमंडलीय ट्रिगर नगण्य हैं। सामान्य दिनचर्या जारी रख सकते हैं।`
          : lang === 'mr'
          ? `सध्या ${city} मधील हवा अतिशय स्वच्छ आहे (AQI ${aqi}). दमा किंवा ॲलर्जी असलेल्या व्यक्तींसाठी हवेत ट्रिगर्स नाहीत. सामान्य दिनक्रम चालू ठेवू शकता.`
          : `Air quality in ${city} is currently pristine (AQI ${aqi}, ${category.label}). Airborne particulate triggers are minimal for asthma and allergy sufferers. Normal routines are safe.`;
      }
      if (aqi <= 100) {
        return lang === 'hi'
          ? `वर्तमान AQI ${aqi} (मध्यम) है। दमा या सांस की संवेदनशीलता वाले लोगों को बाहर भारी कसरत सीमित रखनी चाहिए और अपना क्विक-रिलीफ इन्हेलर पास रखना चाहिए।`
          : lang === 'mr'
          ? `सध्याचा AQI ${aqi} (मध्यम) आहे. दम्याचा त्रास असणाऱ्यांनी जास्त धावपळ टाळावी आणि आपला इनहेलर जवळ बाळगावा.`
          : `Current AQI in ${city} is ${aqi} (Moderate). Sensitive individuals and asthmatics should keep a quick-relief rescue inhaler accessible and avoid intense cardio near heavy traffic junctions.`;
      }
      return lang === 'hi'
        ? `⚠️ दमा व श्वसन संवेदनशीलता चेतावनी: AQI ${aqi} (${category.label}) सांस के मरीजों के लिए प्रतिकूल है! बाहर जाने से बचें, खिड़कियां बंद रखें, घर में HEPA प्यूरीफायर चलाएं और आपातकालीन दवाएं तैयार रखें। सांस फूलने पर तुरंत डॉक्टर से संपर्क करें।`
        : lang === 'mr'
        ? `⚠️ दमा व श्वसन दक्षता इशारा: सध्याचा AQI ${aqi} (${category.label}) दम्याच्या रुग्णांसाठी त्रासदायक आहे! घराबाहेर पडणे टाळा, खिडक्या बंद ठेवा आणि इनहेलर जवळ ठेवा. त्रास वाढल्यास तात्काळ वैद्यकीय सल्ला घ्या.`
        : `⚠️ Asthma & Respiratory Alert: The current AQI in ${city} is ${aqi} (${category.label}). Microscopic PM2.5 particulates can trigger airway inflammation and bronchospasms. Stay indoors with sealed windows, run HEPA air cleaners, and keep rescue inhalers immediately accessible.`;
    }

    // 5. Outdoor Exercise / Running / Jogging / Workouts
    const exerciseTriggers = [
      'exercise',
      'run',
      'running',
      'jog',
      'jogging',
      'walk',
      'walking',
      'workout',
      'gym',
      'cycling',
      'sports',
      'marathon',
      'दौड़',
      'कसरत',
      'टहलना',
      'व्यायाम',
      'धाव',
      'धावणे',
      'धावायला',
      'चाल',
      'चालणे',
      'चालायला',
      'खेळणे',
      'खेळायला',
    ];

    if (exerciseTriggers.some((t) => text.includes(t))) {
      let rec = '';
      if (aqi <= 50) {
        rec =
          lang === 'hi'
            ? `हवा पूरी तरह स्वच्छ है (AQI ${aqi})। आप बेझिझक बाहर दौड़, कसरत और साइकिलिंग कर सकते हैं!`
            : lang === 'mr'
            ? `हवा अतिशय स्वच्छ आहे (AQI ${aqi}). आपण कोणताही संकोच न बाळगता बाहेर धावू शकता आणि व्यायाम करू शकता!`
            : `The air in ${city} is currently pristine (AQI ${aqi}, ${category.label}). It is ideal for outdoor running, sprints, and cycling!`;
      } else if (aqi <= 100) {
        rec =
          lang === 'hi'
            ? `हवा मध्यम है (AQI ${aqi})। बाहर व्यायाम करना सुरक्षित है, लेकिन यदि आपको सांस की परेशानी रहती है तो अत्यधिक भारी कसरत सीमित रखें।`
            : lang === 'mr'
            ? `हवा मध्यम आहे (AQI ${aqi}). बाहेर व्यायाम करणे सुरक्षित आहे, परंतु दम्याचा त्रास असल्यास जास्त धावपळ करणे टाळा.`
            : `The air quality is Moderate in ${city} (AQI ${aqi}). Outdoor workouts are safe for most people. Sensitive athletes should consider lighter intensity.`;
      } else {
        rec =
          lang === 'hi'
            ? `वायु गुणवत्ता अस्वस्थ है (AQI ${aqi})! बाहर दौड़ने से फेफड़ों में हानिकारक कण जाते हैं। कृपया इनडोर ट्रेडमिल या जिम में वर्कआउट करें।`
            : lang === 'mr'
            ? `हवेची गुणवत्ता अस्वास्थ्यकर आहे (AQI ${aqi})! बाहेर धावणे टाळा आणि घरातील जिम किंवा ट्रेडमिलवर व्यायाम करा.`
            : `Air quality in ${city} is elevated (AQI ${aqi}, ${category.label}). Strenuous aerobic workouts force fine PM2.5 deep into lungs. It is strongly advised to switch to indoor exercise.`;
      }

      if (advice.bestTimeWindow && advice.bestTimeWindow.hasSafeWindow) {
        const windowNote =
          lang === 'hi'
            ? `\n\n💡 सर्वोत्तम समय: पूर्वानुमान के अनुसार ${advice.bestTimeWindow.startHour} से ${advice.bestTimeWindow.endHour} के बीच हवा सबसे साफ रहने की संभावना है (अनुमानित AQI ~${advice.bestTimeWindow.avgAqi})।`
            : lang === 'mr'
            ? `\n\n💡 सर्वोत्तम वेळ: अंदाजानुसार ${advice.bestTimeWindow.startHour} ते ${advice.bestTimeWindow.endHour} दरम्यान हवा सर्वात स्वच्छ असेल (AQI ~${advice.bestTimeWindow.avgAqi}).`
            : `\n\n💡 Best Window: Open-Meteo forecasts the cleanest air between ${advice.bestTimeWindow.startHour} and ${advice.bestTimeWindow.endHour} (projected AQI ~${advice.bestTimeWindow.avgAqi}).`;
        rec += windowNote;
      }
      return rec;
    }

    // 6. General Outdoor Safety ("can I go out?", "is it safe outside?")
    const safetyTriggers = [
      'go out',
      'go outside',
      'safe outside',
      'can i go',
      'going out',
      'outside',
      'outdoor',
      'safe today',
      'बाहर जाना',
      'बाहर निकलना',
      'बाहेर जाणे',
      'बाहेर पडणे',
      'बाहेर सुरक्षित',
    ];

    if (safetyTriggers.some((t) => text.includes(t))) {
      if (aqi <= 50) {
        return lang === 'hi'
          ? `हाँ, आज बाहर जाना पूरी तरह सुरक्षित है! ${city} में AQI ${aqi} (अच्छा) है, प्रदूषण का कोई खतरा नहीं है।`
          : lang === 'mr'
          ? `होय, आज बाहेर जाणे पूर्णपणे सुरक्षित आहे! ${city} मध्ये AQI ${aqi} (उत्कृष्ट) असून हवेत प्रदूषण नाही.`
          : `Yes, it is completely safe to go outdoors! The current US AQI in ${city} is ${aqi} (${category.label}), indicating clean atmospheric conditions.`;
      }
      if (aqi <= 100) {
        return lang === 'hi'
          ? `बाहर जाना अधिकांश लोगों के लिए सुरक्षित है (AQI ${aqi}, मध्यम)। यदि आपको धूल या धुएं से एलर्जी है, तो मुख्य ट्रैफिक सड़कों से दूर रहें।`
          : lang === 'mr'
          ? `बाहेर जाणे बहुतेकांसाठी सुरक्षित आहे (AQI ${aqi}, मध्यम). जास्त रहदारी व धुराच्या रस्त्यांवर जाणे टाळा.`
          : `Going outdoors is generally safe for most people in ${city} (AQI ${aqi}, Moderate). Sensitive individuals should steer clear of heavy traffic corridors.`;
      }
      return lang === 'hi'
        ? `सावधानी: वर्तमान में बाहर जाना अस्वस्थ हो सकता है (AQI ${aqi}, ${category.label})। गैर-ज़रूरी काम के लिए बाहर न निकलें। यदि बाहर जाना अनिवार्य हो तो N95 मास्क अवश्य पहनें।`
        : lang === 'mr'
        ? `काळजी घ्या: सध्या बाहेर पडणे आरोग्यासाठी अयोग्य ठरू शकते (AQI ${aqi}, ${category.label}). अत्यावश्यक नसल्यास बाहेर जाणे टाळा व जाताना N95 मास्क वापरा.`
        : `Caution advised: Outdoor air quality in ${city} is currently ${aqi} (${category.label}). Avoid non-essential outdoor trips, and equip an N95 respirator if stepping near congested roadways.`;
    }

    // 7. Mask & Respirator Questions
    const maskTriggers = [
      'mask',
      'n95',
      'ffp2',
      'kn95',
      'respirator',
      'face cover',
      'मास्क',
      'मास्क पहनें',
      'मास्क घालावा',
    ];

    if (maskTriggers.some((t) => text.includes(t))) {
      if (aqi <= 50) {
        return lang === 'hi'
          ? `वर्तमान AQI ${aqi} (अच्छा) है। इस समय बाहरी वातावरण में मास्क की कोई आवश्यकता नहीं है।`
          : lang === 'mr'
          ? `सध्याचा AQI ${aqi} (उत्कृष्ट) आहे. सध्या बाहेर मास्क घालण्याची अजिबात गरज नाही.`
          : `Current AQI in ${city} is ${aqi} (Good). No mask is needed as airborne particulate concentrations are negligible.`;
      }
      if (aqi <= 100) {
        return lang === 'hi'
          ? `AQI ${aqi} (मध्यम) है। सामान्य लोगों के लिए मास्क ऐच्छिक है। यदि आप धूल भरी या भारी ट्रैफिक वाली सड़कों पर जा रहे हैं, तो N95 मास्क उपयोगी हो सकता है।`
          : lang === 'mr'
          ? `AQI ${aqi} (मध्यम) आहे. सर्वसामान्यांसाठी मास्क ऐच्छिक आहे. जास्त वाहतूक असलेल्या रस्त्यावर N95 मास्क वापरणे चांगले.`
          : `Current AQI in ${city} is ${aqi} (Moderate). Standard masks are optional, though sensitive individuals near traffic junctions may benefit from an N95 respirator.`;
      }
      return lang === 'hi'
        ? `चेतावनी: वर्तमान AQI ${aqi} (${category.label}) है। बाहर जाने पर प्रमाणित N95 या FFP2 रेस्पिरेटर अवश्य पहनें। ध्यान दें: सामान्य कपड़े का मास्क या सर्जिकल मास्क सूक्ष्म PM2.5 कणों को नहीं रोक पाता है।`
        : lang === 'mr'
        ? `इशारा: सध्याचा AQI ${aqi} (${category.label}) आहे. बाहेर पडताना प्रमाणित N95 किंवा FFP2 मास्क वापरा. टीप: साधा कपड्याचा मास्क PM2.5 रोखू शकत नाही.`
        : `Air alert: The current AQI in ${city} is ${aqi} (${category.label}). A well-fitted certified N95 or FFP2 respirator is strongly recommended outdoors. Note: cloth and surgical masks cannot filter fine PM2.5 particulates.`;
    }

    // 8. Windows & Ventilation
    const windowTriggers = [
      'window',
      'windows',
      'ventilation',
      'fresh air',
      'air purifier',
      'purifier',
      'hepa',
      'खिड़की',
      'प्यूरीफायर',
      'खिडकी',
      'हवा खेळती',
    ];

    if (windowTriggers.some((t) => text.includes(t))) {
      if (aqi <= 70) {
        return lang === 'hi'
          ? `हवा अच्छी है (AQI ${aqi})! आप घर और दफ्तर की सभी खिड़कियां खोलकर ताज़ी हवा का संचार कर सकते हैं।`
          : lang === 'mr'
          ? `हवेची गुणवत्ता चांगली आहे (AQI ${aqi})! आपण खिडक्या उघडून घरात मोकळी ताजी हवा घेऊ शकता.`
          : `Air quality is clean in ${city} (AQI ${aqi}). Feel free to open your windows for fresh airflow and natural cross-ventilation.`;
      }
      return lang === 'hi'
        ? `AQI ${aqi} है। खिड़कियां और दरवाजे बंद रखें ताकि बाहर का धुआं अंदर न आए। यदि उपलब्ध हो, तो कमरे में HEPA एयर प्यूरीफायर चलाएं।`
        : lang === 'mr'
        ? `AQI ${aqi} आहे. बाहेरील धूर घरात येऊ नये म्हणून खिडक्या-दारे बंद ठेवा आणि शक्य असल्यास घरात HEPA एअर प्युरिफायर चालू ठेवा.`
        : `With an AQI of ${aqi} in ${city}, keep windows closed facing streets. Use indoor HEPA air filtration and set AC units to internal recirculation.`;
    }

    // 9. Children and Elderly Sensitivity
    const sensitiveTriggers = [
      'child',
      'children',
      'kid',
      'kids',
      'baby',
      'babies',
      'elderly',
      'senior',
      'seniors',
      'parents',
      'grandparents',
      'बच्चे',
      'बच्चों',
      'बुजुर्ग',
      'वृद्ध',
      'लहान मुले',
      'ज्येष्ठ',
    ];

    if (sensitiveTriggers.some((t) => text.includes(t))) {
      if (aqi <= 50) {
        return lang === 'hi'
          ? `बच्चों और बुजुर्गों के लिए मौसम बहुत सुखद और सुरक्षित है (AQI ${aqi})। बच्चे बाहर खेल सकते हैं और बुजुर्ग आराम से सैर कर सकते हैं।`
          : lang === 'mr'
          ? `लहान मुले आणि ज्येष्ठांसाठी वातावरण अतिशय सुरक्षित आहे (AQI ${aqi}). मुले मोकळेपणाने खेळू शकतात आणि ज्येष्ठ फिरू शकतात.`
          : `Atmospheric conditions in ${city} are safe for young children and seniors (AQI ${aqi}, ${category.label}). Outdoor activities support healthy development.`;
      }
      return lang === 'hi'
        ? `सावधानी: AQI ${aqi} संवेदनशील फेफड़ों (बच्चों व बुजुर्गों) पर प्रतिकूल प्रभाव डाल सकता है। बच्चों को बाहर खेलने न भेजें और बुजुर्गों की सैर इनडोर रखें।`
        : lang === 'mr'
        ? `काळजी घ्या: AQI ${aqi} लहान मुले व ज्येष्ठांच्या आरोग्यासाठी अयोग्य ठरू शकतो. मुलांचे मैदानी खेळ थांबवा आणि ज्येष्ठांनी घरातच सुरक्षित राहावे.`
        : `Precaution advised: Air quality in ${city} is currently ${aqi} (${category.label}). Children's growing lungs and elderly cardiovascular systems are particularly vulnerable. Shift recess and walks indoors.`;
    }

    // 10. Forecast / Best Time of Day / Timing Questions
    const timingTriggers = [
      'best time',
      'cleanest time',
      'cleanest air',
      'when to',
      'what time',
      'forecast',
      'tomorrow',
      'timing',
      'schedule',
      'सर्वोत्तम समय',
      'सर्वोत्तम वेळ',
      'वेळ',
      'समय',
      'पूर्वानुमान',
      'अंदाज',
    ];

    if (timingTriggers.some((t) => text.includes(t))) {
      if (advice.bestTimeWindow && advice.bestTimeWindow.hasSafeWindow) {
        return lang === 'hi'
          ? `Open-Meteo के 24-घंटे के पूर्वानुमान के अनुसार, ${city} में सबसे साफ हवा ${advice.bestTimeWindow.startHour} से ${advice.bestTimeWindow.endHour} के बीच रहने का अनुमान है (औसत AQI ~${advice.bestTimeWindow.avgAqi})। दौड़ने या काम के लिए यह समय सबसे उपयुक्त है।`
          : lang === 'mr'
          ? `Open-Meteo च्या 24-तासांच्या अंदाजानुसार, ${city} मध्ये सर्वात स्वच्छ हवा ${advice.bestTimeWindow.startHour} ते ${advice.bestTimeWindow.endHour} दरम्यान असेल (सरासरी AQI ~${advice.bestTimeWindow.avgAqi}). बाहेर धावण्यासाठी ही सर्वोत्तम वेळ आहे.`
          : `According to the 24-hour Open-Meteo forecast, the cleanest atmospheric window in ${city} is expected between ${advice.bestTimeWindow.startHour} and ${advice.bestTimeWindow.endHour} with an estimated AQI of ~${advice.bestTimeWindow.avgAqi}. Plan outdoor workouts or walks during this period.`;
      }
      return lang === 'hi'
        ? `वर्तमान AQI ${aqi} है। पूरे 24-घंटे का विस्तृत घंटावार वायु पूर्वानुमान देखने के लिए कृपया ऊपर 'पूर्वानुमान' (Forecast) सेक्शन देखें।`
        : lang === 'mr'
        ? `सध्याचा AQI ${aqi} आहे. २४ तासांचा सविस्तर अंदाज पाहण्यासाठी कृपया वरील 'पूर्वानुमान' (Forecast) विभाग तपासा.`
        : `Current AQI in ${city} is ${aqi}. You can explore the full interactive 24-hour hourly trend and best activity window in the Forecast section above.`;
    }

    // 11. Clean Route / Navigation / Commute Inquiries
    const routeTriggers = [
      'route',
      'routes',
      'commute',
      'travel',
      'driving',
      'cleanest route',
      'traffic',
      'रास्ता',
      'मार्ग',
      'प्रवास',
    ];

    if (routeTriggers.some((t) => text.includes(t))) {
      return lang === 'hi'
        ? `प्रदूषण से बचने के लिए Vayu का 'क्लीन रूट नेविगेटर' (/route) इस्तेमाल करें! यह सबसे तेज हाईवे के मुकाबले कम प्रदूषण वाली गलियों व पार्कों से होकर न्यूनतम पार्टिकुलेट एक्सपोजर वाला सुरक्षित मार्ग चुनता है।`
        : lang === 'mr'
        ? `प्रदूषण टाळण्यासाठी वायूचे 'क्लीन रूट नेव्हिगेटर' (/route) वापरा! हे सर्वाधिक रहदारीच्या महामार्गांऐवजी कमी प्रदूषणाच्या पर्यायी मार्गाने सुरक्षित प्रवासाचा मार्ग दाखवते.`
        : `To minimize particulate inhalation during travel, check out Vayu's Clean Route Navigator (/route)! It compares the fastest route against low-pollution alternatives through green corridors to calculate total respiratory exposure.`;
    }

    // 12. AQI Explanation & Scale ("What is AQI?", "Explain AQI")
    const aqiConceptTriggers = [
      'what is aqi',
      'aqi scale',
      'explain aqi',
      'aqi meaning',
      'how is aqi measured',
      'what does aqi mean',
      'aqi क्या है',
      'सूचकांक क्या है',
      'aqi म्हणजे काय',
    ];

    if (aqiConceptTriggers.some((t) => text.includes(t))) {
      return lang === 'hi'
        ? `AQI (एयर क्वालिटी इंडेक्स) 0 से 500 का एक मानक पैमाना है:\n• 0-50: अच्छा (Good - हरा)\n• 51-100: मध्यम (Moderate - पीला)\n• 101-150: संवेदनशील समूहों के लिए अस्वस्थ (नारंगी)\n• 151-200: अस्वस्थ (Unhealthy - लाल)\n• 201-300: बहुत अस्वस्थ (बैंगनी)\n• 301+: खतरनाक (Hazardous - मैरून)\n\nवर्तमान में ${city} का AQI ${aqi} (${category.label}) है।`
        : lang === 'mr'
        ? `AQI (हवा गुणवत्ता निर्देशांक) हा ० ते ५०० चा आंतरराष्ट्रीय स्तर आहे:\n• ०-५०: उत्तम (Good - हिरवा)\n• ५१-१००: मध्यम (Moderate - पिवळा)\n• १०१-१५०: संवेदनशील लोकांसाठी अस्वास्थ्यकर (केशरी)\n• १५१-२००: अस्वास्थ्यकर (लाल)\n• २०१-३००: अत्यंत अस्वास्थ्यकर (जांभळा)\n• ३०१+: घातक (Hazardous)\n\nसध्या ${city} चा AQI ${aqi} (${category.label}) आहे.`
        : `The Air Quality Index (US AQI) is a standard scale from 0 to 500:\n• 0-50: Good (Green)\n• 51-100: Moderate (Yellow)\n• 101-150: Unhealthy for Sensitive Groups (Orange)\n• 151-200: Unhealthy (Red)\n• 201-300: Very Unhealthy (Purple)\n• 301+: Hazardous (Maroon)\n\nCurrent AQI in ${city} is ${aqi}, placing it in the "${category.label}" category.`;
    }

    // 13. Specific Pollutant Inquiries (PM2.5, PM10, Ozone, NO2, SO2, CO)
    const pollutantTriggers = [
      'pm2.5',
      'pm25',
      'pm10',
      'ozone',
      'o3',
      'no2',
      'so2',
      'carbon monoxide',
      'pollutant',
      'pollutants',
      'प्रदूषक',
      'ओज़ोन',
    ];

    if (pollutantTriggers.some((t) => text.includes(t))) {
      const pm25Value = context.airQualityData?.pollutants?.pm2_5?.value ?? 'N/A';
      if (lang === 'hi') {
        return `PM2.5 वे अतिसूक्ष्म कण होते हैं जिनका व्यास 2.5 माइक्रोमीटर या उससे कम होता है (मानव बाल की मोटाई का लगभग 3%)। ये फेफड़ों की गहराई तक पहुंचकर रक्त प्रवाह में प्रवेश कर सकते हैं। वर्तमान में ${city} में PM2.5 का अनुमानित स्तर ${pm25Value} µg/m³ है।`;
      }
      if (lang === 'mr') {
        return `PM2.5 हे हवेतील अतिसूक्ष्म घातक कण असतात ज्यांचा व्यास 2.5 मायक्रोमीटरपेक्षा लहान असतो. हे कण थेट फुप्फुसात शिरून रक्तात मिसळू शकतात. सध्या ${city} मध्ये PM2.5 ची पातळी ${pm25Value} µg/m³ आहे.`;
      }
      return `PM2.5 refers to fine inhalable particulate matter with diameters 2.5 micrometers and smaller (less than 3% the diameter of a human hair). Because of their micro size, they penetrate deep into lung alveoli and the bloodstream. Current estimated PM2.5 in ${city} is ${pm25Value} µg/m³.`;
    }

    // 14. General Current Air Quality Summary
    const statusTriggers = [
      'air',
      'aqi',
      'how is',
      'quality',
      'today',
      'status',
      'condition',
      'city',
      'pune',
      'delhi',
      'mumbai',
      'हवा',
      'कैसी है',
      'कशी आहे',
    ];

    if (statusTriggers.some((t) => text.includes(t))) {
      const localizedSummary =
        getLocalizedText(lang, advice.summary.key, advice.summary.params) ||
        (lang === 'hi' ? 'वायुमंडलीय स्थिति सामान्य है।' : lang === 'mr' ? 'हवेची स्थिती सर्वसामान्य आहे.' : 'Air quality is acceptable.');

      if (lang === 'hi') {
        return `वर्तमान में ${city} का वायु गुणवत्ता सूचकांक (US AQI) ${aqi} है, जो श्रेणी "${category.label}" में आता है।\n\n📌 स्वास्थ्य सारांश: ${localizedSummary}\n• व्यायाम: ${aqi <= 100 ? 'बाहर व्यायाम सामान्यतः सुरक्षित है।' : 'इनडोर व्यायाम को प्राथमिकता दें।'}\n• खिड़कियां: ${aqi <= 80 ? 'खिड़कियां खोल सकते हैं।' : 'धूल से बचने के लिए खिड़कियां बंद रखें।'}\n\n(डेटा स्रोत: Open-Meteo वायुमंडलीय मॉडल अनुमान)`;
      }
      if (lang === 'mr') {
        return `सध्या ${city} मधील हवेचा गुणवत्ता निर्देशांक (US AQI) ${aqi} असून तो "${category.label}" श्रेणीत मोडतो.\n\n📌 आरोग्य सारांश: ${localizedSummary}\n• व्यायाम: ${aqi <= 100 ? 'बाहेर व्यायाम सुरक्षित आहे.' : 'घरामध्ये व्यायाम करा.'}\n• खिडक्या: ${aqi <= 80 ? 'खिडक्या उघडू शकता.' : 'बाहेरील धूर टाळण्यासाठी खिडक्या बंद ठेवा.'}\n\n(माहिती स्रोत: Open-Meteo मॉडेल आधारित अंदाज)`;
      }
      return `Current US AQI in ${city} is ${aqi}, categorized as ${category.label}.\n\n• Health Summary: ${localizedSummary}\n• Exercise: ${aqi <= 100 ? 'Safe for most workouts' : 'Prefer indoor cardio'}\n• Ventilation: ${aqi <= 80 ? 'Open windows freely' : 'Keep windows closed'}\n• Model disclosure: Open-Meteo atmospheric estimates, not ground sensors.`;
    }

    // 15. Default Friendly Fallback
    if (lang === 'hi') {
      return `नमस्ते! मैं वायु (Vayu) का इन-ब्राउज़र स्मार्ट सहायक हूँ। आप मुझसे ${city} की हवा की स्थिति, दौड़ने के सुरक्षित समय, N95 मास्क और खिड़कियां खोलने के बारे में पूछ सकते हैं।`;
    }
    if (lang === 'mr') {
      return `नमस्कार! मी वायू (Vayu) चा इन-ब्राउझर स्मार्ट सहाय्यक आहे. आपण मला ${city} मधील हवेची स्थिती, धावण्याचा सुरक्षित वेळ, मास्क आणि खिडक्या उघडण्याबाबत विचारू शकता.`;
    }
    return `Hello! I'm Vayu's in-browser atmospheric assistant. Ask me about air quality in ${city}, whether it's safe to run outside, mask guidelines, or when the cleanest forecast window is.`;
  }
}
