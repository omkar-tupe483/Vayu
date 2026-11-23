import { AIService, ChatContext } from './ai';
import { RuleBasedAIService } from './ruleBasedAI';

export interface WebLLMLoadProgress {
  progress: number; // 0 to 1
  text: string;
}

export class WebLLMService implements AIService {
  name = 'WebLLM (In-Browser GPU)';
  mode = 'web_llm' as const;
  isAvailable = false;
  isLoading = false;
  private engine: unknown = null;
  private fallbackService = new RuleBasedAIService();
  private selectedModel = 'SmolLM2-135M-Instruct-q4f16_1-MLC';

  static isWebGPUSupported(): boolean {
    return typeof navigator !== 'undefined' && 'gpu' in navigator;
  }

  async initialize(onProgress?: (progress: WebLLMLoadProgress) => void): Promise<boolean> {
    if (!WebLLMService.isWebGPUSupported()) {
      this.isAvailable = false;
      return false;
    }

    if (this.engine) {
      this.isAvailable = true;
      return true;
    }

    this.isLoading = true;
    try {
      // Dynamic import to keep main bundle tiny (< 4 MB constraint)
      const webllm = await import('@mlc-ai/web-llm');

      const initProgressCallback = (report: { progress: number; text: string }) => {
        if (onProgress) {
          onProgress({
            progress: report.progress,
            text: report.text,
          });
        }
      };

      this.engine = await webllm.CreateMLCEngine(this.selectedModel, {
        initProgressCallback,
      });

      this.isAvailable = true;
      this.isLoading = false;
      return true;
    } catch (err) {
      console.warn('WebLLM initialization failed or unsupported, using rule-based fallback:', err);
      this.isAvailable = false;
      this.isLoading = false;
      return false;
    }
  }

  async generateResponse(
    prompt: string,
    context: ChatContext,
    onProgress?: (partialText: string) => void
  ): Promise<string> {
    if (!this.engine || !this.isAvailable) {
      return this.fallbackService.generateResponse(prompt, context, onProgress);
    }

    try {
      const aqi = Math.round(context.currentAqi ?? context.airQualityData?.us_aqi ?? 50);
      const systemPrompt = `You are Vayu, a concise, friendly urban air quality assistant for ${context.city}.
Current US AQI: ${aqi}.
User profile: ${context.userProfile || 'general'}.
Language: ${context.language}.
Give concise, helpful, non-diagnostic guidance in 2-3 sentences. Never prescribe medication or give clinical medical diagnosis. If severe chest pain or breathing difficulty is described, tell them to call emergency services immediately.`;

      interface MLCEngineInterface {
        chat: {
          completions: {
            create: (params: {
              messages: Array<{ role: string; content: string }>;
              stream?: boolean;
            }) => Promise<{
              choices: Array<{ message: { content: string } }>;
            }>;
          };
        };
      }

      const engine = this.engine as MLCEngineInterface;
      const reply = await engine.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      });

      const responseText = reply.choices[0]?.message.content?.trim();
      return responseText || (await this.fallbackService.generateResponse(prompt, context, onProgress));
    } catch (err) {
      console.warn('WebLLM execution failed, falling back to rule engine:', err);
      return this.fallbackService.generateResponse(prompt, context, onProgress);
    }
  }
}
