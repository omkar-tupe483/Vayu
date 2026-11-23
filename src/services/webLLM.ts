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
  private selectedModel = 'SmolLM2-135M-Instruct-q0f16-MLC';
  private fallbackModel = 'SmolLM2-135M-Instruct-q0f32-MLC';

  static isWebGPUSupported(): boolean {
    return typeof navigator !== 'undefined' && 'gpu' in navigator;
  }

  static async getOptimalModel(): Promise<string> {
    if (WebLLMService.isWebGPUSupported()) {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter && adapter.features.has('shader-f16')) {
          return 'SmolLM2-135M-Instruct-q0f16-MLC';
        }
      } catch {
        // fallback
      }
    }
    return 'SmolLM2-135M-Instruct-q0f32-MLC';
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
    const modelToTry = await WebLLMService.getOptimalModel();
    this.selectedModel = modelToTry;

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

      try {
        this.engine = await webllm.CreateMLCEngine(this.selectedModel, {
          initProgressCallback,
        });
      } catch (errFirst) {
        if (this.selectedModel !== this.fallbackModel) {
          console.warn('Initial model load failed, retrying universal fallback model:', errFirst);
          this.selectedModel = this.fallbackModel;
          this.engine = await webllm.CreateMLCEngine(this.selectedModel, {
            initProgressCallback,
          });
        } else {
          throw errFirst;
        }
      }

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
    // For Hindi and Marathi, or when WebLLM is uninitialized, rule engine provides natural localized clinical responses
    if (context.language !== 'en' || !this.engine || !this.isAvailable) {
      return this.fallbackService.generateResponse(prompt, context, onProgress);
    }

    try {
      const aqi = Math.round(context.currentAqi ?? context.airQualityData?.us_aqi ?? 50);
      const systemPrompt = `You are Vayu, a concise, friendly urban air quality assistant for ${context.city}.
Current US AQI in ${context.city}: ${aqi}.
User sensitivity profile: ${context.userProfile || 'general'}.
Give concise, helpful, non-diagnostic guidance in 2-3 sentences. Never prescribe medication or give clinical medical diagnosis. If severe chest pain or breathing difficulty is described, tell them to call emergency services (108/112/911) immediately.`;

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

