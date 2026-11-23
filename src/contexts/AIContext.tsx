/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { ChatMessage, AIMode, ChatContext } from '../services/ai';
import { RuleBasedAIService } from '../services/ruleBasedAI';
import { useWebLLM, UseWebLLMReturn } from '../hooks/useWebLLM';
import { useCity } from './CityContext';
import { useTranslation, Language } from './LanguageContext';
import { useAirQuality } from '../hooks/useAirQuality';
import { useAirQualityForecast } from '../hooks/useAirQualityForecast';
import { UserProfileId } from '../utils/advisor';

export interface AIContextValue {
  messages: ChatMessage[];
  isGenerating: boolean;
  aiMode: AIMode;
  webLLM: UseWebLLMReturn;
  sendMessage: (text: string) => Promise<void>;
  regenerateLast: () => Promise<void>;
  clearChat: () => void;
  suggestedPrompts: string[];
}

const AIContext = createContext<AIContextValue | undefined>(undefined);

const INITIAL_MESSAGES: Record<'en' | 'hi' | 'mr', string> = {
  en: "Hello! I am Vayu's in-browser atmospheric assistant. How can I help you navigate air quality, workouts, or ventilation today?",
  hi: "नमस्ते! मैं वायु (Vayu) का इन-ब्राउज़र वायुमंडलीय सहायक हूँ। आज मैं वायु गुणवत्ता, व्यायाम या खिड़कियां खोलने के बारे में आपकी क्या मदद कर सकता हूँ?",
  mr: "नमस्कार! मी वायू (Vayu) चा इन-ब्राउझर सहाय्यक आहे. आज मी हवेची गुणवत्ता, धावणे किंवा खिडक्या उघडण्याबाबत आपल्याला कशी मदत करू शकेन?",
};

const SUGGESTIONS: Record<'en' | 'hi' | 'mr', string[]> = {
  en: [
    'Can I run outdoors today?',
    'Should I wear an N95 mask?',
    'Can I open the windows?',
    'Is the air safe for kids?',
    'What is PM2.5?',
  ],
  hi: [
    'क्या मैं आज बाहर दौड़ सकता हूँ?',
    'क्या N95 मास्क पहनना जरूरी है?',
    'क्या घर की खिड़की खोल सकते हैं?',
    'क्या बच्चों के लिए बाहर खेलना सुरक्षित है?',
    'PM2.5 क्या होता है?',
  ],
  mr: [
    'मी आज बाहेर धावायला जाऊ शकतो का?',
    'N95 मास्क घालणे आवश्यक आहे का?',
    'घरातील खिडक्या उघडू शकतो का?',
    'लहान मुलांसाठी हवा सुरक्षित आहे का?',
    'PM2.5 म्हणजे नेमके काय?',
  ],
};

const ruleService = new RuleBasedAIService();

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentCity } = useCity();
  const { language } = useTranslation();
  const { data: aqiData } = useAirQuality(currentCity);
  const { data: forecastData } = useAirQualityForecast(currentCity);

  const webLLM = useWebLLM();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      role: 'assistant',
      text: INITIAL_MESSAGES[language as Language] || INITIAL_MESSAGES.en,
      timestamp: Date.now(),
      source: 'rule_based',
    },
  ]);

  // Sync initial welcome message if language switches before user sends messages
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0]?.role === 'assistant') {
        return [
          {
            id: 'init-1',
            role: 'assistant',
            text: INITIAL_MESSAGES[language as Language] || INITIAL_MESSAGES.en,
            timestamp: Date.now(),
            source: 'rule_based',
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const [isGenerating, setIsGenerating] = useState(false);

  const aiMode: AIMode = webLLM.isEnabled ? 'web_llm' : 'rule_based';

  const chatContext: ChatContext = useMemo(() => {
    let savedProfile: UserProfileId = 'general';
    try {
      const stored = localStorage.getItem('vayu_profile');
      if (stored) savedProfile = stored as UserProfileId;
    } catch {
      // ignore
    }
    return {
      city: currentCity.name,
      currentAqi: aqiData?.us_aqi,
      airQualityData: aqiData,
      forecastData: forecastData,
      userProfile: savedProfile,
      language: language,
    };
  }, [currentCity, aqiData, forecastData, language]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isGenerating) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
        timestamp: Date.now(),
        source: aiMode,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsGenerating(true);

      try {
        let reply = '';
        if (webLLM.isEnabled && webLLM.webLLMService.isAvailable) {
          reply = await webLLM.webLLMService.generateResponse(trimmed, chatContext);
        } else {
          // Rule-based engine with natural async pacing
          await new Promise((res) => setTimeout(res, 350));
          reply = await ruleService.generateResponse(trimmed, chatContext);
        }

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: reply,
          timestamp: Date.now(),
          source: aiMode,
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, I encountered an issue generating a response. Please try again.',
          timestamp: Date.now(),
          source: aiMode,
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, aiMode, webLLM, chatContext]
  );

  const regenerateLast = useCallback(async () => {
    if (isGenerating || messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Remove last assistant message
    setMessages((prev) => {
      const idx = prev.map((m) => m.role).lastIndexOf('assistant');
      if (idx !== -1) {
        return prev.slice(0, idx);
      }
      return prev;
    });

    await sendMessage(lastUserMsg.text);
  }, [isGenerating, messages, sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        text: INITIAL_MESSAGES[language as Language] || INITIAL_MESSAGES.en,
        timestamp: Date.now(),
        source: aiMode,
      },
    ]);
  }, [language, aiMode]);

  const suggestedPrompts = useMemo(() => {
    return SUGGESTIONS[language as Language] || SUGGESTIONS.en;
  }, [language]);

  return (
    <AIContext.Provider
      value={{
        messages,
        isGenerating,
        aiMode,
        webLLM,
        sendMessage,
        regenerateLast,
        clearChat,
        suggestedPrompts,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export function useAI(): AIContextValue {
  const ctx = useContext(AIContext);
  if (!ctx) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return ctx;
}
