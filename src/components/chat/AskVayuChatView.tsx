import { useState, useRef, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { ChatMessage, HouseholdMember } from '../../types';
import { WindIcon } from '../common/Icons';

interface AskVayuChatViewProps {
  city: string;
  aqi: number;
  household: HouseholdMember[];
  language?: string;
}

const DEFAULT_PROMPT_CHIPS = [
  'Can I open the windows today?',
  'Is it safe for children to play outside?',
  'Should I wear an N95 mask right now?',
  'How effective is a DIY box fan purifier?',
  'What should I do if my child has a cough?',
];

export function AskVayuChatView({ city, aqi, household, language = 'en' }: AskVayuChatViewProps): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init',
      role: 'assistant',
      content: `Hello! I am Vayu, your calm environmental air quality assistant for ${city}. Current US AQI is ${aqi}. How can I help you navigate smog, room ventilation, or mask protection today?`,
      timestamp: Date.now(),
      groundedAqi: aqi,
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const householdSummary = household.map((m) => `${m.name} (${m.role}, ${m.riskLevel} risk)`).join(', ');

  const handleSend = async (userText: string) => {
    const text = userText.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          city,
          aqi,
          language,
          householdSummary,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      interface ChatApiResponse {
        reply?: string;
        groundedAqi?: number;
      }
      const data = (await res.json()) as ChatApiResponse;

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: data.reply || 'Air quality guidance is available based on current conditions.',
        timestamp: Date.now(),
        groundedAqi: data.groundedAqi || aqi,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Local fallback in case network or backend proxy is unreachable
      let fallback = `Current AQI in ${city} is ${aqi}. `;
      const lower = text.toLowerCase();
      if (lower.includes('chest pain') || lower.includes('cannot breathe') || lower.includes('breath')) {
        fallback += '⚠️ Emergency Notice: If you are experiencing acute chest pain or breathing distress, call 108 / 112 / 911 immediately. Vayu cannot provide clinical emergency diagnosis.';
      } else if (lower.includes('window') || lower.includes('ventilate')) {
        fallback += aqi <= 70
          ? 'It is safe to open windows for cross-ventilation.'
          : 'Keep windows closed facing traffic streets; ventilate only during midday thermal dispersion.';
      } else if (lower.includes('mask')) {
        fallback += aqi > 100
          ? 'A well-fitted certified N95 or FFP2 respirator is recommended outdoors. Cloth and surgical masks do not filter fine PM2.5.'
          : 'Mask is optional for healthy individuals in current conditions.';
      } else if (lower.includes('child') || lower.includes('kid')) {
        fallback += aqi > 150
          ? 'Children should limit strenuous outdoor sports and play indoors today.'
          : 'Safe for normal outdoor recess and play.';
      } else {
        fallback += 'Focus on indoor clean air sanctuaries, timing necessary outdoor errands during the midday window, and wearing a certified N95 when traveling in traffic.';
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        content: fallback,
        timestamp: Date.now(),
        groundedAqi: aqi,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="card" style={{ display: 'flex', flexDirection: 'column', height: '620px', padding: 0, overflow: 'hidden' }}>
      {/* Chat Header */}
      <div style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <WindIcon size={20} className="text-blue" />
          <h2 style={{ fontSize: '1rem', fontWeight: '800' }}>Ask Vayu Air Assistant</h2>
        </div>
        <span class="badge badge-blue">
          Grounded in {city} (AQI {aqi})
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Vayu Conversation Log"
        style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
      >
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isUser ? 'var(--c-blue-primary)' : 'var(--bg-elevated)',
                color: isUser ? '#FFFFFF' : 'var(--text-main)',
                border: isUser ? 'none' : '1px solid var(--border-subtle)',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
            </div>
          );
        })}

        {isLoading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '0.6rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-elevated)',
              fontSize: '0.85rem',
              color: 'var(--text-subtle)',
            }}
          >
            Vayu is thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'var(--bg-surface)' }}>
        {DEFAULT_PROMPT_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => handleSend(chip)}
            disabled={isLoading}
            class="badge badge-lavender"
            style={{ cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSend(input);
        }}
        style={{ padding: '0.75rem', borderTop: '1px solid var(--border-strong)', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-elevated)' }}
      >
        <label htmlFor="chat-input" class="sr-only">Ask Vayu a question</label>
        <input
          id="chat-input"
          type="text"
          class="input"
          maxLength={500}
          placeholder="Ask about smog, ventilation, or masks..."
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          class="btn-primary"
          style={{ padding: '0.65rem 1.25rem' }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
