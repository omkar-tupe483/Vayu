import { useState, useEffect, useCallback, useRef } from 'react';
import { WebLLMService, WebLLMLoadProgress } from '../services/webLLM';

export interface UseWebLLMReturn {
  isWebGPUSupported: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  progress: WebLLMLoadProgress | null;
  error: string | null;
  webLLMService: WebLLMService;
  enableAI: () => Promise<boolean>;
  disableAI: () => void;
}

export function useWebLLM(): UseWebLLMReturn {
  const [isWebGPUSupported, setIsWebGPUSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<WebLLMLoadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceRef = useRef<WebLLMService>(new WebLLMService());

  useEffect(() => {
    setIsWebGPUSupported(WebLLMService.isWebGPUSupported());
  }, []);

  const enableAI = useCallback(async (): Promise<boolean> => {
    if (!WebLLMService.isWebGPUSupported()) {
      setError('WebGPU is not supported by your current browser or hardware.');
      return false;
    }

    setIsLoading(true);
    setError(null);
    setProgress({ progress: 0, text: 'Initializing in-browser AI runtime...' });

    try {
      const success = await serviceRef.current.initialize((p) => {
        setProgress(p);
      });

      if (success) {
        setIsEnabled(true);
        setIsLoading(false);
        setProgress(null);
        return true;
      } else {
        setError('Failed to load in-browser AI model. Reverting to rule engine.');
        setIsLoading(false);
        setIsEnabled(false);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown WebLLM error');
      setIsLoading(false);
      setIsEnabled(false);
      return false;
    }
  }, []);

  const disableAI = useCallback(() => {
    setIsEnabled(false);
    setProgress(null);
    setError(null);
  }, []);

  return {
    isWebGPUSupported,
    isEnabled,
    isLoading,
    progress,
    error,
    webLLMService: serviceRef.current,
    enableAI,
    disableAI,
  };
}
