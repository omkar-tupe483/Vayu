import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { UserProfileId } from '../../utils/advisor';
import { User, Baby, HeartPulse, Activity, Wind } from 'lucide-react';

export interface UserProfileSelectorProps {
  selectedProfile: UserProfileId;
  onSelectProfile: (profile: UserProfileId) => void;
  className?: string;
}

interface ProfileOption {
  id: UserProfileId;
  labelKey: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

const PROFILES: ProfileOption[] = [
  { id: 'general', labelKey: 'advisor.profileLabel.general', icon: User },
  { id: 'child', labelKey: 'advisor.profileLabel.child', icon: Baby },
  { id: 'elderly', labelKey: 'advisor.profileLabel.elderly', icon: HeartPulse },
  { id: 'runner', labelKey: 'advisor.profileLabel.runner', icon: Activity },
  { id: 'asthma_sensitive', labelKey: 'advisor.profileLabel.asthma_sensitive', icon: Wind },
];

export const UserProfileSelector: React.FC<UserProfileSelectorProps> = ({
  selectedProfile,
  onSelectProfile,
  className = '',
}) => {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % PROFILES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + PROFILES.length) % PROFILES.length;
    }

    if (nextIndex !== index) {
      const nextProfile = PROFILES[nextIndex]?.id;
      if (nextProfile) {
        onSelectProfile(nextProfile);
        document.getElementById(`profile-tab-${nextProfile}`)?.focus();
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-bold uppercase tracking-wider text-vayu-text-secondary block">
        {t('advisor.selectProfile') || 'Select Sensitivity Profile'}
      </label>

      <div
        role="tablist"
        aria-label="Health Profile Selection"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-vayu-surface border border-vayu-border"
      >
        {PROFILES.map((profile, idx) => {
          const isSelected = selectedProfile === profile.id;
          const Icon = profile.icon;

          return (
            <button
              key={profile.id}
              id={`profile-tab-${profile.id}`}
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelectProfile(profile.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${
                isSelected
                  ? 'bg-vayu-accent text-vayu-btn-text border-vayu-accent shadow-md scale-[1.02]'
                  : 'bg-transparent text-vayu-text-secondary border-transparent hover:bg-vayu-surface-tint hover:text-vayu-text'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{t(profile.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
