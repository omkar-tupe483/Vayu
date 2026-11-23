import { CleanAirQualityModel } from '../schemas/airQualitySchema';
import { CleanForecastModel } from '../schemas/forecastSchema';
import { UserProfileId } from '../utils/advisor';

export type AIMode = 'rule_based' | 'web_llm';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  source: AIMode;
  isError?: boolean;
}

export interface ChatContext {
  city: string;
  currentAqi?: number | null;
  airQualityData?: CleanAirQualityModel | null;
  forecastData?: CleanForecastModel | null;
  userProfile?: UserProfileId;
  language: 'en' | 'hi' | 'mr';
}

export interface AIService {
  name: string;
  mode: AIMode;
  isAvailable: boolean;
  generateResponse(
    prompt: string,
    context: ChatContext,
    onProgress?: (partialText: string) => void
  ): Promise<string>;
}
