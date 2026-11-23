import React, { useState, useEffect } from 'react';
import { useCity } from '../../contexts/CityContext';
import { useToast } from '../ui/toastContext';
import { alertThresholdSchema } from '../../schemas/settingsSchema';
import { Modal } from '../ui/Modal';
import { BellRing, ShieldAlert, Check, Sparkles, AlertCircle } from 'lucide-react';

export interface AlertConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALERTS_STORAGE_KEY = 'vayu_aqi_alerts';

export const AlertConfigModal: React.FC<AlertConfigModalProps> = ({ isOpen, onClose }) => {
  const { currentCity } = useCity();
  const { addToast } = useToast();

  const [threshold, setThreshold] = useState<number>(100);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }

    try {
      const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const cityConfig = parsed[currentCity.name];
        if (cityConfig && typeof cityConfig.thresholdAqi === 'number') {
          setThreshold(cityConfig.thresholdAqi);
        }
      }
    } catch {
      // Ignored
    }
  }, [currentCity]);

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      addToast({
        title: 'Notifications Unsupported',
        message: 'Your browser does not support Web Notifications.',
        type: 'warning',
      });
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setHasPermission(perm === 'granted');
      if (perm === 'granted') {
        addToast({
          title: 'Notifications Granted',
          message: 'Browser alert notifications successfully enabled.',
          type: 'success',
        });
      } else {
        addToast({
          title: 'Permission Denied',
          message: 'Notifications were blocked in browser settings.',
          type: 'error',
        });
      }
    } catch {
      // Ignored
    }
  };

  const handleSaveAlert = () => {
    const config = {
      cityId: `${currentCity.name}-${currentCity.latitude}-${currentCity.longitude}`,
      cityName: currentCity.name,
      thresholdAqi: threshold,
      enabled: true,
    };

    const valid = alertThresholdSchema.safeParse(config);
    if (!valid.success) {
      addToast({
        title: 'Invalid Threshold',
        message: 'Please choose an AQI threshold between 50 and 500.',
        type: 'error',
      });
      return;
    }

    try {
      const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
      const allAlerts = stored ? JSON.parse(stored) : {};
      allAlerts[currentCity.name] = valid.data;
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(allAlerts));

      addToast({
        title: 'Alert Configured',
        message: `You will be alerted whenever AQI in ${currentCity.name} exceeds ${threshold}.`,
        type: 'success',
      });
      onClose();
    } catch {
      addToast({
        title: 'Save Failed',
        message: 'Unable to save alert preference to local storage.',
        type: 'error',
      });
    }
  };

  const handleTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Air Quality Alert: ${currentCity.name}`, {
          body: `Simulated trigger: AQI reached ${threshold + 15} (exceeds your limit of ${threshold}). Stay indoors.`,
          icon: '/favicon.svg',
        });
      } catch {
        // Fallback to toast
      }
    }

    addToast({
      title: `Simulated AQI Alert: ${currentCity.name}`,
      message: `AQI exceeded ${threshold}. Sensitive groups should limit outdoor exertion.`,
      type: 'warning',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configure Air Alert: ${currentCity.name}`}>
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-vayu-surface-tint border border-vayu-border">
          <BellRing className="w-5 h-5 text-vayu-accent shrink-0" aria-hidden="true" />
          <p className="text-xs text-vayu-text-secondary leading-relaxed">
            Set a custom threshold for <strong>{currentCity.name}</strong>. Vayu will notify you when particulate pollution exceeds safe levels.
          </p>
        </div>

        {/* Threshold Slider (50 to 300) */}
        <div className="space-y-2 p-4 rounded-2xl bg-vayu-surface border border-vayu-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-vayu-text-secondary">
              Alert Trigger Threshold
            </label>
            <span className="font-mono font-black text-base text-vayu-text">
              AQI {threshold}
            </span>
          </div>

          <input
            type="range"
            min={50}
            max={300}
            step={10}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-vayu-accent cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-vayu-text-secondary pt-1">
            <span>50 (Moderate)</span>
            <span>100 (Sensitive)</span>
            <span>150 (Unhealthy)</span>
            <span>200+ (Hazardous)</span>
          </div>
        </div>

        {/* Browser Permission Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-vayu-surface border border-vayu-border text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-vayu-primary" />
            <span className="font-bold text-vayu-text">
              {hasPermission ? 'Browser notifications allowed' : 'Browser permission needed'}
            </span>
          </div>

          {!hasPermission ? (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="px-3 py-1 rounded-xl bg-vayu-primary text-vayu-btn-text font-bold hover:opacity-90"
            >
              Enable
            </button>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Active</span>
            </span>
          )}
        </div>

        {/* Honest Background Execution Notice */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-vayu-surface-tint border border-vayu-border/60 text-[11px] text-vayu-text-secondary">
          <AlertCircle className="w-3.5 h-3.5 text-vayu-primary shrink-0 mt-0.5" />
          <p>
            Note: Without a cloud backend or battery-draining server, web notifications fire while Vayu is running or open in a browser tab.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleTestNotification}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-vayu-border text-xs font-bold text-vayu-text hover:bg-vayu-surface-tint"
          >
            <Sparkles className="w-3.5 h-3.5 text-vayu-accent" />
            <span>Test Notification</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-vayu-text-secondary hover:text-vayu-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAlert}
              className="px-5 py-2 rounded-xl bg-vayu-accent text-vayu-btn-text text-xs font-black shadow-md hover:opacity-90"
            >
              Save Alert
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
