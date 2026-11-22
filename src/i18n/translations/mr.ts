import { TranslationDictionary } from '../types';

export const mrTranslations: TranslationDictionary = {
  // Brand
  'brand.name': 'वायू',
  'brand.tagline': 'हवा जाणून घ्या. शहाणपणाने श्वास घ्या.',
  'brand.subtitle': 'शहरी हवा गुणवत्ता सहाय्यक',

  // Navigation & Accessibility
  'nav.skipToContent': 'मुख्य मजकुराकडे जा',
  'nav.home': 'डॅशबोर्ड',
  'nav.routes': 'स्वच्छ मार्ग',
  'nav.health': 'आरोग्य मार्गदर्शन',
  'nav.about': 'माहिती',
  'nav.language': 'भाषा',
  'nav.selectLanguage': 'इंटरफेस भाषा निवडा',

  // Search
  'search.placeholder': 'जगातील कोणतेही शहर शोधा (उदा. मुंबई, पुणे, दिल्ली)...',
  'search.quickPicks': 'त्वरित निवड:',
  'search.searching': 'ओपन-मीटिओ शोध चालू आहे...',
  'search.clear': 'शोध साफ करा',
  'search.noResults': 'कोणतेही शहर आढळले नाही:',
  'search.error': 'शहर शोधण्यात अडचण आली. कृपया इंटरनेट तपासा.',

  // AQI Overview Card
  'aqi.title': 'हवा गुणवत्ता निर्देशांक',
  'aqi.scale': 'US AQI प्रमाण',
  'aqi.measuredAt': 'अंदाजित वेळ',
  'aqi.refresh': 'रिफ्रेश करा',
  'aqi.refreshing': 'रिफ्रेश होत आहे...',
  'aqi.liveSnapshot': 'वातावरणीय स्थिती',

  // AQI Levels (Colors explicitly in single source of truth)
  'aqi.levels.good': 'चांगले (हिरवा)',
  'aqi.levels.moderate': 'मध्यम (पिवळा)',
  'aqi.levels.unhealthy_sensitive': 'संवेदनशील घटकांसाठी अस्वास्थ्यकर (केशरी)',
  'aqi.levels.unhealthy': 'अस्वास्थ्यकर (लाल)',
  'aqi.levels.very_unhealthy': 'अतिशय अस्वास्थ्यकर (जांभळा)',
  'aqi.levels.hazardous': 'धोकादायक (तपकिरी-लाल/मॅरून)',

  // Health Advice
  'aqi.advice.good': 'हवेची गुणवत्ता उत्तम आहे. मैदानी खेळांचा आणि ताज्या हवेचा मनमुराद आनंद घ्या.',
  'aqi.advice.moderate': 'हवेची गुणवत्ता स्वीकार्य आहे. अतिसंवेदनशील व्यक्तींनी जास्त वेळ बाहेर कसरती करणे टाळावे.',
  'aqi.advice.unhealthy_sensitive': 'संवेदनशील गट (दमा, वृद्ध, लहान मुले) यांनी N95 मास्क वापरावा आणि बाहेरील फिरणे मर्यादित ठेवावे.',
  'aqi.advice.unhealthy': 'हवा सर्वांसाठी अस्वास्थ्यकर आहे. बाहेर जाणे टाळा, खिडक्या बंद ठेवा आणि एअर प्युरिफायर वापरा.',
  'aqi.advice.very_unhealthy': 'आरोग्य इशारा: गंभीर हानीचा धोका. घरातच राहा आणि सतत HEPA फिल्टर्स चालू ठेवा.',
  'aqi.advice.hazardous': 'आरोग्य आणीबाणी: सर्व नागरिक प्रभावित होऊ शकतात. घराबाहेर पडणे पूर्णपणे टाळा.',

  // Pollutants
  'pollutants.title': 'तपशीलवार प्रदूषक विश्लेषण',
  'pollutants.subtitle': 'ओपन-मीटिओ वातावरणीय मॉडेल',
  'pollutants.pm2_5.name': 'PM2.5',
  'pollutants.pm2_5.fullName': 'अतिसूक्ष्म कण',
  'pollutants.pm2_5.description': '२.५ मायक्रोमीटरपेक्षा लहान कण जे फुफ्फुसात खोलवर जाऊन रक्तप्रवाहात मिसळतात.',
  'pollutants.pm10.name': 'PM10',
  'pollutants.pm10.fullName': 'श्वास घेण्यायोग्य कण',
  'pollutants.pm10.description': '१० मायक्रोमीटरपेक्षा लहान कण जसे की रस्त्यावरील धूळ आणि बांधकामाचे कण.',
  'pollutants.nitrogen_dioxide.name': 'NO₂',
  'pollutants.nitrogen_dioxide.fullName': 'नायट्रोजन डायऑक्साइड',
  'pollutants.nitrogen_dioxide.description': 'वाहनांचा धूर आणि इंधनाच्या ज्वलनातून तयार होणारा विषारी वायू.',
  'pollutants.ozone.name': 'ओझोन (O₃)',
  'pollutants.ozone.fullName': 'भू-पातळीवरील ओझोन',
  'pollutants.ozone.description': 'सूर्यप्रकाश आणि रासायनिक प्रदूषकांच्या संयोगाने तयार होणारा दुय्यम प्रदूषक.',

  // Pollutant Statuses
  'status.good': 'चांगले',
  'status.moderate': 'मध्यम',
  'status.poor': 'खराब',
  'status.unhealthy': 'अस्वास्थ्यकर',
  'status.hazardous': 'धोकादायक',

  // Interactive Map
  'map.title': 'परस्परसंवादी हवा गुणवत्ता नकाशा',
  'map.subtitle': 'OpenStreetMap टाइल्ससह निवडलेल्या शहरावर केंद्रित',
  'map.recenter': 'शहरावर केंद्रित करा',
  'map.clickHint': 'AQI आणि प्रमुख प्रदूषक पाहण्यासाठी मार्करवर क्लिक करा',
  'map.legend': 'AQI प्रमाण रंग सूची',

  // States
  'state.loading': 'ओपन-मीटिओ कडून हवा गुणवत्ता डेटा मिळवला जात आहे...',
  'state.errorTitle': 'हवा गुणवत्ता डेटा लोड करण्यात अयशस्वी',
  'state.retry': 'पुन्हा प्रयत्न करा',
  'state.offlineNotice': 'तुम्ही ऑफलाइन आहात. जुना जतन केलेला अंदाज दाखवला जात आहे.',
  'state.empty': 'हवा गुणवत्ता पाहण्यासाठी वरील शहरांची यादी वापरा.',

  // Disclaimers (Strict Honesty & Quality rules)
  'disclaimer.modelled': 'प्रामाणिक प्रकटीकरण: ओपन-मीटिओ आकडेवारी ही वातावरणीय मॉडेलवर आधारित आहे, थेट जमिनीवरील सेन्सर वाचन नाही.',
  'disclaimer.health': 'आरोग्य मार्गदर्शन सूचना: ही केवळ सामान्य आरोग्यासाठी माहिती आहे, वैद्यकीय निदान किंवा उपचार नाही.',

  // Footer & About
  'footer.copyright': 'हवा जाणून घ्या. शहाणपणाने श्वास घ्या.',
  'footer.poweredBy': 'Open-Meteo आणि OpenStreetMap द्वारे समर्थित • मोफत आणि खुली माहिती',
  'about.title': 'वायू बद्दल',
  'about.description': 'वायू हे शहरी नागरिकांसाठी बनवलेले एक पारदर्शक हवा गुणवत्ता सहाय्यक आहे. कोणत्याही लॉगिन किंवा एपीआय चाव्यांची गरज नाही.',
  'about.featuresTitle': 'प्रमुख वैशिष्ट्ये',
  'about.feature1Title': 'वातावरणीय मॉडेल',
  'about.feature1Desc': 'ओपन-मीटिओच्या जागतिक मॉडेल्समधून पारदर्शक डेटा.',
  'about.feature2Title': 'त्रिभाषिक सहाय्य',
  'about.feature2Desc': 'इंग्रजी, हिंदी आणि मराठीमध्ये संपूर्ण सुलभता.',
  'about.feature3Title': 'शून्य ट्रॅकिंग',
  'about.feature3Desc': 'सर्व काही थेट तुमच्या ब्राउझरमध्ये चालते.',
};

