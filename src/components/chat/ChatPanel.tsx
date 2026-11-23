import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAI } from '../../contexts/AIContext';
import { useToast } from '../ui/toastContext';
import {
  Bot,
  User,
  Send,
  Trash2,
  Copy,
  RotateCcw,
  Sparkles,
  Cpu,
  AlertCircle,
  Check,
} from 'lucide-react';

export interface ChatPanelProps {
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const {
    messages,
    isGenerating,
    aiMode,
    webLLM,
    sendMessage,
    regenerateLast,
    clearChat,
    suggestedPrompts,
  } = useAI();
  const { addToast } = useToast();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isGenerating) return;

    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      addToast({
        title: 'Copied to Clipboard',
        message: 'Message content copied.',
        type: 'success',
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      addToast({
        title: 'Copy Failed',
        message: 'Clipboard permission denied.',
        type: 'error',
      });
    }
  };

  const handleEnableWebLLM = async () => {
    const ok = await webLLM.enableAI();
    if (ok) {
      addToast({
        title: 'In-Browser AI Enabled',
        message: 'WebLLM initialized with local browser WebGPU acceleration.',
        type: 'success',
      });
    } else if (webLLM.error) {
      addToast({
        title: 'AI Initialization Alert',
        message: webLLM.error,
        type: 'warning',
      });
    }
  };

  return (
    <div
      className={`flex flex-col h-[580px] sm:h-[640px] rounded-3xl bg-vayu-surface-elevated border border-vayu-border shadow-2xl overflow-hidden ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-vayu-border-subtle bg-vayu-surface">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-vayu-accent/20 text-vayu-accent-link">
            <Bot className="w-5 h-5 text-vayu-accent" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-black text-vayu-text flex items-center gap-2">
              <span>{t('chat.assistantTitle') || 'Vayu Air Assistant'}</span>
              <span
                className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${
                  aiMode === 'web_llm'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30'
                    : 'bg-vayu-surface-tint text-vayu-text-secondary border-vayu-border'
                }`}
              >
                {aiMode === 'web_llm' ? 'WebLLM (GPU)' : 'Rule Engine'}
              </span>
            </h3>
            <p className="text-xs text-vayu-text-secondary">
              {t('chat.assistantSubtitle') || 'Instant atmospheric guidance & conversational advice'}
            </p>
          </div>
        </div>

        {/* Clear History Button */}
        <button
          type="button"
          onClick={clearChat}
          title={t('chat.clear') || 'Clear conversation'}
          aria-label={t('chat.clear') || 'Clear conversation'}
          className="p-2 rounded-xl text-vayu-text-secondary hover:text-rose-500 hover:bg-vayu-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* WebLLM Engine Activation Banner */}
      <div className="px-5 py-2.5 bg-vayu-surface border-b border-vayu-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-vayu-primary" aria-hidden="true" />
          <span className="font-semibold text-vayu-text">
            {webLLM.isWebGPUSupported
              ? webLLM.isEnabled
                ? 'WebLLM running locally in your browser'
                : 'Accelerate with in-browser WebLLM'
              : 'WebGPU not detected (Rule engine active)'}
          </span>
        </div>

        {webLLM.isWebGPUSupported && !webLLM.isEnabled && (
          <button
            type="button"
            onClick={handleEnableWebLLM}
            disabled={webLLM.isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vayu-accent text-vayu-btn-text text-xs font-bold hover:opacity-90 shadow-sm focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{webLLM.isLoading ? 'Downloading Model...' : 'Enable AI'}</span>
          </button>
        )}
      </div>

      {/* Model Loading Progress Bar */}
      {webLLM.isLoading && webLLM.progress && (
        <div className="px-5 py-2 bg-purple-500/5 border-b border-purple-500/20 text-xs space-y-1">
          <div className="flex justify-between font-medium text-purple-700 dark:text-purple-300">
            <span className="truncate">{webLLM.progress.text}</span>
            <span>{Math.round(webLLM.progress.progress * 100)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-purple-200 dark:bg-purple-900/40 overflow-hidden">
            <div
              style={{ width: `${Math.round(webLLM.progress.progress * 100)}%` }}
              className="h-full bg-purple-600 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Air Quality Assistant Chat"
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
      >
        {messages.map((m) => {
          const isUser = m.role === 'user';
          const isCopied = copiedId === m.id;

          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`p-2 rounded-2xl shrink-0 mt-0.5 ${
                  isUser
                    ? 'bg-vayu-accent text-vayu-btn-text'
                    : 'bg-vayu-surface-tint text-vayu-primary border border-vayu-border'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Bot className="w-4 h-4" aria-hidden="true" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-3xl p-3.5 sm:p-4 text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line shadow-sm ${
                  isUser
                    ? 'bg-vayu-accent text-vayu-btn-text rounded-tr-sm'
                    : m.isError
                    ? 'bg-rose-500/10 text-rose-800 dark:text-rose-200 border border-rose-500/30 rounded-tl-sm'
                    : 'bg-vayu-surface text-vayu-text border border-vayu-border rounded-tl-sm'
                }`}
              >
                {/* Plain text rendering for security */}
                <p>{m.text}</p>

                {/* Actions for Assistant messages */}
                {!isUser && (
                  <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-vayu-border-subtle/50 text-[11px] text-vayu-text-secondary">
                    <button
                      type="button"
                      onClick={() => handleCopy(m.id, m.text)}
                      title="Copy message"
                      aria-label="Copy message"
                      className="p-1 rounded hover:bg-vayu-surface-tint hover:text-vayu-text flex items-center gap-1"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={regenerateLast}
                      title="Regenerate last response"
                      aria-label="Regenerate last response"
                      className="p-1 rounded hover:bg-vayu-surface-tint hover:text-vayu-text flex items-center gap-1 ml-auto"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Dots Indicator */}
        {isGenerating && (
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-2xl bg-vayu-surface-tint text-vayu-primary border border-vayu-border shrink-0">
              <Bot className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="p-4 rounded-3xl rounded-tl-sm bg-vayu-surface border border-vayu-border flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-vayu-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-vayu-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-vayu-primary animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-vayu-surface border-t border-vayu-border-subtle overflow-x-auto scrollbar-none flex gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessage(prompt)}
            disabled={isGenerating}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-vayu-surface-tint border border-vayu-border text-vayu-text hover:border-vayu-accent hover:text-vayu-accent-link transition-colors focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-vayu-surface border-t border-vayu-border">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            maxLength={500}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.placeholder') || 'Ask about air quality, running, or masks...'}
            disabled={isGenerating}
            className="w-full py-3 pl-4 pr-24 rounded-2xl bg-vayu-surface-elevated border border-vayu-border text-xs sm:text-sm text-vayu-text placeholder:text-vayu-text-secondary focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring disabled:opacity-50"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <span className="text-[10px] text-vayu-text-secondary hidden sm:inline">
              {input.length}/500
            </span>

            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              aria-label={t('chat.send') || 'Send message'}
              className="p-2 rounded-xl bg-vayu-accent text-vayu-btn-text hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring disabled:opacity-40"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-vayu-text-secondary">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-vayu-primary" />
            <span>Honest advice, not medical diagnosis.</span>
          </span>
          <span>Press Enter to send</span>
        </div>
      </form>
    </div>
  );
};
