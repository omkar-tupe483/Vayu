import { describe, it, expect } from 'vitest';
import { RuleBasedAIService } from '../ruleBasedAI';
import { WebLLMService } from '../webLLM';
import { ChatContext } from '../ai';

describe('AI Services (Phase 6)', () => {
  const ruleEngine = new RuleBasedAIService();

  const mockContext: ChatContext = {
    city: 'Pune',
    currentAqi: 45,
    userProfile: 'general',
    language: 'en',
    airQualityData: {
      city: 'Pune',
      country: 'India',
      latitude: 18.52,
      longitude: 73.85,
      timezone: 'Asia/Kolkata',
      time: '2026-11-23T12:00',
      us_aqi: 45,
      dominantPollutant: 'pm2_5',
      isModelledEstimate: true,
      pollutants: {
        pm2_5: { key: 'pm2_5', name: 'PM2.5', formula: 'PM2.5', value: 12, unit: 'μg/m³', subAqi: 45, description: 'Fine particulate matter' },
        pm10: { key: 'pm10', name: 'PM10', formula: 'PM10', value: 25, unit: 'μg/m³', subAqi: 30, description: 'Coarse particulate matter' },
        nitrogen_dioxide: { key: 'nitrogen_dioxide', name: 'NO2', formula: 'NO₂', value: 15, unit: 'μg/m³', subAqi: 20, description: 'Nitrogen dioxide' },
        ozone: { key: 'ozone', name: 'Ozone', formula: 'O₃', value: 20, unit: 'μg/m³', subAqi: 25, description: 'Ground-level ozone' },
        carbon_monoxide: { key: 'carbon_monoxide', name: 'CO', formula: 'CO', value: 200, unit: 'μg/m³', subAqi: 10, description: 'Carbon monoxide' },
        sulphur_dioxide: { key: 'sulphur_dioxide', name: 'SO2', formula: 'SO₂', value: 5, unit: 'μg/m³', subAqi: 5, description: 'Sulphur dioxide' },
      },
    },
  };

  describe('Emergency Medical Triggers', () => {
    it('returns urgent medical emergency warning for chest pain in English', async () => {
      const res = await ruleEngine.generateResponse('I have severe chest pain and cannot breathe', mockContext);
      expect(res).toContain('Urgent Medical Emergency Notice');
      expect(res).toContain('108/112/911');
    });

    it('returns emergency warning for breathing distress in Hindi', async () => {
      const res = await ruleEngine.generateResponse('मुझे सीने में दर्द है और सांस नहीं आ रही', {
        ...mockContext,
        language: 'hi',
      });
      expect(res).toContain('आपातकालीन चिकित्सा सूचना');
      expect(res).toContain('108 / 112');
    });

    it('returns emergency warning for choking/chest pain in Marathi', async () => {
      const res = await ruleEngine.generateResponse('माझ्या छातीत दुखणे सुरू आहे आणि श्वास घेता येत नाही', {
        ...mockContext,
        language: 'mr',
      });
      expect(res).toContain('तात्काळ वैद्यकीय आणीबाणी सूचना');
      expect(res).toContain('108 / 112');
    });
  });

  describe('Outdoor Exercise Intent', () => {
    it('encourages running outdoors when AQI is Good (45)', async () => {
      const res = await ruleEngine.generateResponse('Can I run outside today?', mockContext);
      expect(res).toContain('ideal for outdoor running');
    });

    it('advises indoor workouts when AQI is Unhealthy (175)', async () => {
      const unhealthyContext: ChatContext = {
        ...mockContext,
        currentAqi: 175,
        airQualityData: {
          ...mockContext.airQualityData!,
          us_aqi: 175,
        },
      };
      const res = await ruleEngine.generateResponse('Should I go for a run?', unhealthyContext);
      expect(res).toContain('indoor');
    });

    it('answers exercise queries in Hindi', async () => {
      const res = await ruleEngine.generateResponse('क्या मैं आज दौड़ सकता हूँ?', {
        ...mockContext,
        language: 'hi',
      });
      expect(res).toContain('हवा पूरी तरह स्वच्छ है');
    });

    it('answers exercise queries in Marathi', async () => {
      const res = await ruleEngine.generateResponse('मी आज धावायला जाऊ शकतो का?', {
        ...mockContext,
        language: 'mr',
      });
      expect(res).toContain('बाहेर धावू शकता');
    });
  });

  describe('Mask Advice Intent', () => {
    it('notes mask is not needed when AQI is 45', async () => {
      const res = await ruleEngine.generateResponse('Should I wear a mask?', mockContext);
      expect(res).toContain('No mask is needed');
    });

    it('recommends N95 respirator when AQI is high (180)', async () => {
      const res = await ruleEngine.generateResponse('Do I need a mask?', {
        ...mockContext,
        currentAqi: 180,
      });
      expect(res).toContain('N95');
      expect(res).toContain('PM2.5');
    });
  });

  describe('Pollutant Explanation & AQI Concepts', () => {
    it('explains PM2.5 in detail', async () => {
      const res = await ruleEngine.generateResponse('What is PM2.5?', mockContext);
      expect(res).toContain('PM2.5');
      expect(res).toContain('2.5 micrometers');
    });

    it('explains the 0-500 AQI scale when asked "what is AQI?"', async () => {
      const res = await ruleEngine.generateResponse('What is AQI?', mockContext);
      expect(res).toContain('Air Quality Index');
      expect(res).toContain('0 to 500');
      expect(res).not.toContain('PM2.5 refers to fine inhalable');
    });
  });

  describe('Greetings, Help & Sensitivity Intents', () => {
    it('greets user and introduces capabilities for "hi"', async () => {
      const res = await ruleEngine.generateResponse('hi', mockContext);
      expect(res).toContain('Hello! I am Vayu');
      expect(res).toContain('Outdoor running');
    });

    it('provides asthma-specific precautions', async () => {
      const res = await ruleEngine.generateResponse('I have asthma, is it safe?', {
        ...mockContext,
        currentAqi: 120,
      });
      expect(res).toContain('Asthma');
      expect(res).toContain('inhaler');
    });

    it('answers outdoor safety question directly', async () => {
      const res = await ruleEngine.generateResponse('Can I go outside today?', mockContext);
      expect(res).toContain('safe to go outdoors');
    });

    it('does not display raw localization keys in status response', async () => {
      const res = await ruleEngine.generateResponse('How is the air in Pune today?', {
        ...mockContext,
        language: 'hi',
      });
      expect(res).not.toContain('advisor.summary');
      expect(res).toContain('स्वास्थ्य सारांश');
    });
  });

  describe('WebLLM Fallback Integrity', () => {
    it('detects WebGPU static availability method', () => {
      expect(typeof WebLLMService.isWebGPUSupported).toBe('function');
    });

    it('falls back seamlessly to rule engine when WebLLM is uninitialized', async () => {
      const webLLM = new WebLLMService();
      const res = await webLLM.generateResponse('How is the air?', mockContext);
      expect(res.length).toBeGreaterThan(10);
    });
  });
});
