import { AIService, ChatContext } from './ai';
import { getAqiCategory } from '../constants/aqi';
import { getAdvice } from '../utils/advisor';

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

    // 2. Outdoor Exercise / Running / Jogging
    const exerciseTriggers = [
      'exercise',
      'run',
      'jog',
      'walk',
      'workout',
      'gym',
      'cycling',
      'दौड़',
      'कसरत',
      'टहलना',
      'व्यायाम',
      'धावणे',
      'धावा',
      'धाव',
      'चालणे',
      'चाल',
      'खेळणे',
      'खेळ',
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

    // 3. Mask & Respirator Questions
    const maskTriggers = [
      'mask',
      'n95',
      'ffp2',
      'kn95',
      'respirator',
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

    // 4. Windows & Ventilation
    const windowTriggers = [
      'window',
      'ventilation',
      'fresh air',
      'air purifier',
      'purifier',
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

    // 5. Children and Elderly Sensitivity
    const sensitiveTriggers = [
      'child',
      'children',
      'kid',
      'kids',
      'baby',
      'elderly',
      'senior',
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

    // 6. What is PM2.5 / Ozone / Pollutant Explanations
    const pollutantTriggers = [
      'pm2.5',
      'pm25',
      'pm10',
      'ozone',
      'no2',
      'what is',
      'pollutant',
      'प्रदूषक',
      'ओज़ोन',
      'काय आहे',
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

    // 7. General Current Air Quality Summary
    const statusTriggers = [
      'air',
      'aqi',
      'how is',
      'quality',
      'today',
      'pune',
      'delhi',
      'mumbai',
      'status',
      'हवा',
      'कैसी है',
      'कशी आहे',
    ];

    if (statusTriggers.some((t) => text.includes(t)) || text.length > 0) {
      if (lang === 'hi') {
        return `वर्तमान में ${city} का वायु गुणवत्ता सूचकांक (US AQI) ${aqi} है, जो श्रेणी "${category.label}" में आता है।\n\n📌 सारांश: ${advice.summary.params ? advice.summary.key : advice.summary.key}\n• व्यायाम: ${aqi <= 100 ? 'बाहर व्यायाम सामान्यतः सुरक्षित है।' : 'इनडोर व्यायाम को प्राथमिकता दें।'}\n• खिड़कियां: ${aqi <= 80 ? 'खिड़कियां खोल सकते हैं।' : 'धूल से बचने के लिए खिड़कियां बंद रखें।'}\n\n(डेटा स्रोत: Open-Meteo वायुमंडलीय मॉडल अनुमान)`;
      }
      if (lang === 'mr') {
        return `सध्या ${city} मधील हवेचा गुणवत्ता निर्देशांक (US AQI) ${aqi} असून तो "${category.label}" श्रेणीत मोडतो.\n\n📌 संक्षिप्त माहिती: हवेची स्थिती सर्वसामान्य आहे.\n• व्यायाम: ${aqi <= 100 ? 'बाहेर व्यायाम सुरक्षित आहे.' : 'घरामध्ये व्यायाम करा.'}\n• खिडक्या: ${aqi <= 80 ? 'खिडक्या उघडू शकता.' : 'बाहेरील धूर टाळण्यासाठी खिडक्या बंद ठेवा.'}\n\n(माहिती स्रोत: Open-Meteo मॉडेल आधारित अंदाज)`;
      }
      return `Current US AQI in ${city} is ${aqi}, categorized as ${category.label}.\n\n• Health impact: Air quality is ${category.label.toLowerCase()} for the community.\n• Exercise: ${aqi <= 100 ? 'Safe for most workouts' : 'Prefer indoor cardio'}\n• Ventilation: ${aqi <= 80 ? 'Open windows freely' : 'Keep windows closed'}\n• Model disclosure: Open-Meteo atmospheric estimates, not ground sensors.`;
    }

    // 8. Default Friendly Fallback
    if (lang === 'hi') {
      return `नमस्ते! मैं वायु (Vayu) का इन-ब्राउज़र स्मार्ट सहायक हूँ। आप मुझसे ${city} की हवा की स्थिति, दौड़ने के सुरक्षित समय, N95 मास्क और खिड़कियां खोलने के बारे में पूछ सकते हैं।`;
    }
    if (lang === 'mr') {
      return `नमस्कार! मी वायू (Vayu) चा इन-ब्राउझर स्मार्ट सहाय्यक आहे. आपण मला ${city} मधील हवेची स्थिती, धावण्याचा सुरक्षित वेळ, मास्क आणि खिडक्या उघडण्याबाबत विचारू शकता.`;
    }
    return `Hello! I'm Vayu's in-browser atmospheric assistant. Ask me about air quality in ${city}, whether it's safe to run outside, mask guidelines, or when the cleanest forecast window is.`;
  }
}
