import { useState, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import { WindIcon, SunIcon, MoonIcon, ShieldIcon } from './components/common/Icons';

export function App(): JSX.Element {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vayu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vayu_theme', 'light');
    }
  };

  useEffect(() => {
    // Sync with system theme if user has not set explicit preference
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('vayu_theme')) {
        setIsDark(e.matches);
        if (e.matches) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return (
    <div class="app-layout">
      <header class="header">
        <div class="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ color: 'var(--c-blue-primary)', display: 'flex' }}>
              <WindIcon size={28} />
            </span>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                Vayu <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--c-peach-primary)' }}>वायु</span>
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Urban Smog & Clean Air Assistant</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" class="container" style={{ padding: '2rem 1rem' }}>
        <div class="card card-peach" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ShieldIcon size={20} className="text-peach" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Health & Non-Medical Advice Notice</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Vayu provides evidence-informed environmental guidance for winter smog and air pollution. Vayu is not a medical device and cannot replace personal diagnosis or clinical advice from a physician. If you experience acute chest pain, severe shortness of breath, or emergency symptoms, seek immediate medical attention.
          </p>
        </div>
      </main>
    </div>
  );
}
