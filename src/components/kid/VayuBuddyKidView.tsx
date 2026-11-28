import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { StarIcon } from '../common/Icons';

interface VayuBuddyKidViewProps {
  aqi: number;
}

export function VayuBuddyKidView({ aqi }: VayuBuddyKidViewProps): JSX.Element {
  const [stars, setStars] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('vayu_kid_stars') || '2', 10);
    } catch {
      return 2;
    }
  });

  const [missions, setMissions] = useState<Array<{ id: number; title: string; completed: boolean }>>([
    { id: 1, title: '💧 Drink 4 big sips of clean water', completed: true },
    { id: 2, title: '🚪 Check that the bedroom window is closed', completed: false },
    { id: 3, title: '👟 Keep dirty outdoor shoes outside the front door', completed: false },
  ]);

  const toggleMission = (id: number) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = !m.completed;
          const newStars = next ? stars + 1 : Math.max(0, stars - 1);
          setStars(newStars);
          try {
            localStorage.setItem('vayu_kid_stars', String(newStars));
          } catch {
            // Ignore
          }
          return { ...m, completed: next };
        }
        return m;
      })
    );
  };

  const isSmoggy = aqi > 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Friendly Mascot Hero Card */}
      <div class="card card-peach" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Inline SVG Mascot Character: Vayu Buddy */}
        <div style={{ flexShrink: 0 }}>
          <svg width="110" height="110" viewBox="0 0 100 100" fill="none" role="img" aria-label="Smiling cloud hero Vayu Buddy">
            {/* Superhero Cape */}
            <path d="M25 45 C15 70 20 90 35 95 C45 85 45 65 40 50 Z" fill="var(--c-peach-soft)" />
            {/* Cloud Body */}
            <path
              d="M30 65 A16 16 0 0 1 20 45 A18 18 0 0 1 42 22 A24 24 0 0 1 75 28 A18 18 0 0 1 85 52 A16 16 0 0 1 72 68 Z"
              fill="#FFFFFF"
              stroke="var(--c-blue-primary)"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Eyes */}
            <circle cx="45" cy="42" r="3.5" fill="var(--c-blue-primary)" />
            <circle cx="65" cy="42" r="3.5" fill="var(--c-blue-primary)" />
            {/* Cheeks */}
            <circle cx="38" cy="48" r="4.5" fill="rgba(232, 140, 100, 0.4)" />
            <circle cx="72" cy="48" r="4.5" fill="rgba(232, 140, 100, 0.4)" />
            {/* Smile */}
            <path d="M47 52 Q55 60 63 52" stroke="var(--c-peach-primary)" strokeWidth="3" strokeLinecap="round" />
            {/* Tiny Superhero Star on Forehead */}
            <polygon points="55 24 57 28 61 29 58 32 59 36 55 34 51 36 52 32 49 29 53 28" fill="var(--c-peach-primary)" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <span class="badge badge-peach" style={{ marginBottom: '0.4rem' }}>
            VAYU BUDDY MODE
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Hi, Little Air Explorer! 👋
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            {isSmoggy
              ? 'The air outside is coughing today! The sky has grumpy gray dust blankets. The best place for our superhero lungs right now is indoors building a cozy blanket fort!'
              : 'Yay! The air is super happy and clean right now! You can run, laugh, and play outside with your friends!'}
          </p>
        </div>
      </div>

      {/* Air Hero Star Challenge */}
      <div class="card card-lavender">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Air Hero Star Challenge ⭐</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complete missions to protect your family’s lungs!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--bg-surface)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
            <span style={{ color: 'var(--c-peach-primary)', display: 'flex' }}>
              <StarIcon size={18} />
            </span>
            <span style={{ fontSize: '1rem', fontWeight: '900' }}>{stars} Stars</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {missions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMission(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: m.completed ? 'var(--c-blue-light)' : 'var(--bg-surface)',
                border: `1px solid ${m.completed ? 'var(--c-blue-primary)' : 'var(--border-subtle)'}`,
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', textDecoration: m.completed ? 'line-through' : 'none' }}>
                {m.title}
              </span>
              <span style={{ fontSize: '1.1rem' }}>
                {m.completed ? '⭐ Done!' : 'Tap to Complete'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
