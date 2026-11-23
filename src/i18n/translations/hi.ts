import { TranslationDictionary } from '../types';

export const hiTranslations: TranslationDictionary = {
  // Brand
  'brand.name': 'वायु',
  'brand.tagline': 'हवा को जानें। समझदारी से सांस लें।',
  'brand.subtitle': 'शहरी वायु गुणवत्ता सहायक',

  // Navigation & Accessibility
  'nav.skipToContent': 'मुख्य सामग्री पर जाएं',
  'nav.home': 'डैशबोर्ड',
  'nav.routes': 'स्वच्छ मार्ग',
  'nav.health': 'स्वास्थ्य मार्गदर्शन',
  'nav.about': 'हमारे बारे में',
  'nav.language': 'भाषा',
  'nav.selectLanguage': 'इंटरफ़ेस भाषा चुनें',

  // Search
  'search.placeholder': 'दुनिया के किसी भी शहर को खोजें (उदा. दिल्ली, मुंबई, लंदन)...',
  'search.quickPicks': 'त्वरित चयन:',
  'search.searching': 'ओपन-मीटियो खोज जारी है...',
  'search.clear': 'खोज साफ़ करें',
  'search.noResults': 'कोई शहर नहीं मिला:',
  'search.error': 'शहर खोजने में असमर्थ। कृपया कनेक्शन जांचें।',

  // AQI Overview Card
  'aqi.title': 'वायु गुणवत्ता सूचकांक',
  'aqi.scale': 'US AQI पैमाना',
  'aqi.measuredAt': 'अनुमानित समय',
  'aqi.refresh': 'ताज़ा करें',
  'aqi.refreshing': 'ताज़ा हो रहा है...',
  'aqi.liveSnapshot': 'वायुमंडलीय स्थिति',

  // AQI Levels (Colors explicitly in single source of truth)
  'aqi.levels.good': 'अच्छा (हरा)',
  'aqi.levels.moderate': 'मध्यम (पीला)',
  'aqi.levels.unhealthy_sensitive': 'संवेदनशील समूहों के लिए अस्वस्थ (नारंगी)',
  'aqi.levels.unhealthy': 'अस्वस्थ (लाल)',
  'aqi.levels.very_unhealthy': 'बहुत अस्वस्थ (बैंगनी)',
  'aqi.levels.hazardous': 'खतरनाक (मैरून)',

  // Health Advice
  'aqi.advice.good': 'वायु गुणवत्ता आदर्श है। बाहर की गतिविधियों और ताजी हवा का आनंद लें।',
  'aqi.advice.moderate': 'हवा स्वीकार्य है। अत्यधिक संवेदनशील व्यक्तियों को लंबे समय तक बाहरी परिश्रम सीमित करना चाहिए।',
  'aqi.advice.unhealthy_sensitive': 'संवेदनशील समूह (अस्थमा, हृदय रोगी, बच्चे, बुजुर्ग) N95 मास्क पहनें और बाहरी व्यायाम सीमित करें।',
  'aqi.advice.unhealthy': 'हवा सभी के लिए अस्वस्थ है। बाहरी गतिविधियां कम करें, खिड़कियां बंद रखें और एयर प्यूरीफायर चलाएं।',
  'aqi.advice.very_unhealthy': 'स्वास्थ्य चेतावनी: गंभीर जोखिम। घर के अंदर रहें और लगातार HEPA फिल्टर का उपयोग करें।',
  'aqi.advice.hazardous': 'स्वास्थ्य आपातकाल: पूरी आबादी प्रभावित हो सकती है। पूरी तरह से घर के अंदर रहें।',

  // Pollutants
  'pollutants.title': 'विस्तृत प्रदूषक विश्लेषण',
  'pollutants.subtitle': 'ओपन-मीटियो वायुमंडलीय फैलाव मॉडल',
  'pollutants.pm2_5.name': 'PM2.5',
  'pollutants.pm2_5.fullName': 'सूक्ष्म कण प्रदूषण',
  'pollutants.pm2_5.description': '2.5 माइक्रोमीटर से छोटे कण जो फेफड़ों में गहराई तक जाकर रक्तप्रवाह में पहुंच सकते हैं।',
  'pollutants.pm10.name': 'PM10',
  'pollutants.pm10.fullName': 'श्वास लेने योग्य मोटे कण',
  'pollutants.pm10.description': '10 माइक्रोमीटर से छोटे कण जैसे सड़क की धूल, परागकण और निर्माण धूल।',
  'pollutants.nitrogen_dioxide.name': 'NO₂',
  'pollutants.nitrogen_dioxide.fullName': 'नाइट्रोजन डाइऑक्साइड',
  'pollutants.nitrogen_dioxide.description': 'वाहनों के धुएं, कारखानों और ईंधन के जलने से उत्पन्न जहरीली गैस।',
  'pollutants.ozone.name': 'ओजोन (O₃)',
  'pollutants.ozone.fullName': 'सतही ओजोन',
  'pollutants.ozone.description': 'धूप और रासायनिक प्रदूषकों की प्रतिक्रिया से बनने वाला द्वितीयक प्रदूषक।',

  // Pollutant Statuses
  'status.good': 'अच्छा',
  'status.moderate': 'मध्यम',
  'status.poor': 'खराब',
  'status.unhealthy': 'अस्वस्थ',
  'status.hazardous': 'खतरनाक',

  // Interactive Map
  'map.title': 'इंटरैक्टिव वायु गुणवत्ता मानचित्र',
  'map.subtitle': 'OpenStreetMap टाइल्स के साथ चयनित निर्देशांक पर केंद्रित',
  'map.recenter': 'शहर पर केंद्रित करें',
  'map.clickHint': 'AQI और मुख्य प्रदूषकों को देखने के लिए मार्कर पर क्लिक करें',
  'map.legend': 'AQI पैमाना संकेत',

  // States
  'state.loading': 'ओपन-मीटियो से लाइव डेटा प्राप्त हो रहा है...',
  'state.errorTitle': 'वायु गुणवत्ता डेटा लोड करने में असमर्थ',
  'state.retry': 'पुनः प्रयास करें',
  'state.offlineNotice': 'आप ऑफ़लाइन हैं। पुराना सहेजा गया डेटा दिखाया जा रहा है।',
  'state.empty': 'वायु गुणवत्ता जांचने के लिए ऊपर एक शहर चुनें।',

  // Disclaimers (Strict Honesty & Quality rules)
  'disclaimer.modelled': 'ईमानदार प्रकटीकरण: ओपन-मीटियो मान वायुमंडलीय अनुमानित मॉडल हैं, न कि ग्राउंड सेंसर रीडिंग।',
  'disclaimer.health': 'स्वास्थ्य मार्गदर्शन सूचना: केवल सामान्य स्वास्थ्य जानकारी, चिकित्सीय निदान या उपचार नहीं।',

  // Footer & About
  'footer.copyright': 'हवा को जानें। समझदारी से सांस लें।',
  'footer.poweredBy': 'Open-Meteo और OpenStreetMap द्वारा संचालित • खुला और मुफ़्त डेटा',
  'about.title': 'वायु के बारे में',
  'about.description': 'वायु एक आधुनिक और हल्का शहरी वायु गुणवत्ता सहायक है। कोई लॉगिन या एपीआई कुंजी की आवश्यकता नहीं है।',
  'about.featuresTitle': 'प्रमुख विशेषताएं',
  'about.feature1Title': 'अनुमानित मॉडल',
  'about.feature1Desc': 'ओपन-मीटियो के वैश्विक मॉडलों से पारदर्शी वायु गुणवत्ता डेटा।',
  'about.feature2Title': 'त्रिभाषी पहुंच',
  'about.feature2Desc': 'अंग्रेजी, हिंदी और मराठी में पूर्ण स्थानीयकरण और सुलभता।',
  'about.feature3Title': 'शून्य ट्रैकिंग',
  'about.feature3Desc': 'सब कुछ आपके ब्राउज़र में चलता है। कोई ट्रैकिंग या लॉगिन नहीं।',
};

