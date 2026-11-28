import {
  AirQualityData,
  HouseholdMember,
  LifestyleProfile,
  DailyPlanItem,
  RoomHack,
  SustainableSwap,
  WhatIfInputs,
  WhatIfResult,
} from '../types';

/**
 * Deterministic Rule Engine for Vayu
 * Guarantees that the app is 100% functional even when offline or without a Gemini API key.
 */

export function generateDailyPlan(
  aqiData: AirQualityData,
  household: HouseholdMember[],
  lifestyle: LifestyleProfile
): DailyPlanItem[] {
  const aqi = aqiData.aqi;
  const hasVulnerable = household.some(
    (m) => m.riskLevel === 'High' || m.riskLevel === 'Severe' || m.hasAsthmaOrHeart
  );
  const bestWindow = aqiData.bestWindow;

  const plan: DailyPlanItem[] = [];

  // 1. Morning Slot (6-10 AM) - Typically highest winter smog inversion
  if (aqi > 200) {
    plan.push({
      id: 'plan-m-severe',
      timeSlot: 'Morning (6-10 AM)',
      action: 'Keep windows tightly sealed and complete all morning exercise indoors.',
      whyThisMatters:
        'Cold winter nights trap particulate smog in a dense ground inversion layer. Morning outdoor air has peak PM2.5 concentrations.',
      estimatedImpact: hasVulnerable
        ? 'Avoids up to 60-75% peak particulate exposure during morning bronchospasm peak.'
        : 'Reduces morning alveolar particulate inhalation by an estimated 50-65%.',
      confidence: 'High',
      effort: 'Easy',
      cost: 'Free',
    });
  } else if (aqi > 100) {
    plan.push({
      id: 'plan-m-mod',
      timeSlot: 'Morning (6-10 AM)',
      action: 'Shift morning jog or brisk walk to gentle indoor mobility or light stretching.',
      whyThisMatters:
        'Aerobic breathing increases lung air intake 5x to 10x, forcing fine particles deep into lung tissue.',
      estimatedImpact: 'Reduces inhaled particle volume by an estimated 40-50%.',
      confidence: 'High',
      effort: 'Easy',
      cost: 'Free',
    });
  } else {
    plan.push({
      id: 'plan-m-good',
      timeSlot: 'Morning (6-10 AM)',
      action: 'Open windows for 20 minutes of fresh cross-ventilation before morning traffic picks up.',
      whyThisMatters: 'Outdoor air is currently acceptable. Flushes indoor CO2 and nighttime humidity buildup.',
      estimatedImpact: 'Lowers indoor CO2 by 300-500 ppm, boosting focus and alertness.',
      confidence: 'High',
      effort: 'Easy',
      cost: 'Free',
    });
  }

  // 2. Midday Slot (10 AM-4 PM) - Best dispersion window
  const windowText = bestWindow ? `${bestWindow.startTime}-${bestWindow.endTime}` : '1-3 PM';
  if (aqi > 150) {
    plan.push({
      id: 'plan-md-window',
      timeSlot: 'Midday (10 AM-4 PM)',
      action: `Schedule mandatory outdoor errands, grocery trips, or dog walks during the ${windowText} window.`,
      whyThisMatters:
        'Solar warming raises the atmospheric boundary layer, providing the cleanest relative breathing slot of the day.',
      estimatedImpact: 'Up to 20-30% lower exposure compared to commuting at morning or evening rush hours.',
      confidence: 'Medium',
      effort: 'Moderate',
      cost: 'Free',
    });
  } else {
    plan.push({
      id: 'plan-md-general',
      timeSlot: 'Midday (10 AM-4 PM)',
      action: 'Ideal window for outdoor activities, school recess, and airing out bedding.',
      whyThisMatters: 'Sunlight and thermal mixing provide the day’s most dispersed atmospheric conditions.',
      estimatedImpact: 'Safe, beneficial sun exposure and physical activity for kids and seniors.',
      confidence: 'High',
      effort: 'Easy',
      cost: 'Free',
    });
  }

  // 3. Evening Slot (4-8 PM) - Commute & Dinner Preparation
  if (lifestyle.cookingFuel === 'biomass_wood_coal') {
    plan.push({
      id: 'plan-ev-cook-bio',
      timeSlot: 'Evening (4-8 PM)',
      action: 'Cook outdoors under an open awning or keep the kitchen door closed to bedrooms with exhaust on.',
      whyThisMatters:
        'Biomass cooking indoors can generate PM2.5 spikes exceeding 1,000 µg/m³, trapping fine smoke inside sleeping quarters.',
      estimatedImpact: 'Prevents massive acute indoor spikes, cutting indoor family exposure by an estimated 60-80%.',
      confidence: 'High',
      effort: 'Moderate',
      cost: 'Free',
    });
  } else {
    plan.push({
      id: 'plan-ev-cook-clean',
      timeSlot: 'Evening (4-8 PM)',
      action: 'Turn on kitchen exhaust or keep a rear window cracked 2 inches while sautéing or frying.',
      whyThisMatters:
        'Even clean cooking fuels (LPG/induction) release oil particulates and ultrafine aerosols during high-heat cooking.',
      estimatedImpact: 'Clears cooking aerosols 3x faster, preventing fine oil haze from settling into living areas.',
      confidence: 'Medium',
      effort: 'Easy',
      cost: 'Free',
    });
  }

  // 4. Night Slot (8 PM-6 AM) - Bedroom Air Preservation
  if (lifestyle.hasPurifier) {
    plan.push({
      id: 'plan-n-purifier',
      timeSlot: 'Night (8 PM-6 AM)',
      action: 'Move air purifier to the primary bedroom, set to low/quiet mode 30 minutes before bedtime.',
      whyThisMatters:
        'We spend 7-9 continuous hours sleeping in one room. A quiet continuous purifier creates a clean air sanctuary.',
      estimatedImpact: 'Maintains bedroom PM2.5 below 25 µg/m³ throughout the 8-hour sleep cycle.',
      confidence: 'High',
      effort: 'Easy',
      cost: 'Low',
    });
  } else {
    plan.push({
      id: 'plan-n-diy',
      timeSlot: 'Night (8 PM-6 AM)',
      action: 'Tightly close bedroom doors and windows, and place a damp towel at the threshold draft gap.',
      whyThisMatters:
        'Nighttime winter temperatures drop, drawing heavy outdoor smog through cracks under doors and window gaps.',
      estimatedImpact: 'Reduces nighttime infiltration of outdoor smog by an estimated 25-35%.',
      confidence: 'Medium',
      effort: 'Easy',
      cost: 'Free',
    });
  }

  return plan;
}

export function generateIndoorLabHacks(aqiData: AirQualityData, lifestyle: LifestyleProfile): RoomHack[] {
  const isSevere = aqiData.aqi > 200;
  const hasPurifier = lifestyle.hasPurifier;

  return [
    {
      id: 'room-bedroom',
      room: 'Bedroom',
      title: 'Sleep Sanctuary Strategy',
      guidance: isSevere
        ? 'Keep windows shut and seal door gaps. Prioritize this room as your clean air bubble where your lungs recover.'
        : 'Ventilate for 15 minutes during midday, then close before evening traffic.',
      ventilationTiming: isSevere
        ? 'Do not open windows today. Only open during midday window if outdoor AQI drops below 100.'
        : 'Safest window: 12:30 PM to 2:30 PM.',
      purifierTip: hasPurifier
        ? 'Position purifier at least 1 meter away from walls, pointing clean airflow toward the bed breathing zone.'
        : 'If no purifier, avoid lighting mosquito coils or incense, which produce heavy indoor particulate matter equivalent to several cigarettes.',
      diyOption: {
        description:
          'DIY Box Fan + MERV 13/HEPA Filter (Corsi-Rosenthal principle): Tape a 20x20 inch MERV 13 HVAC filter onto the back of a standard box fan.',
        honestEffectiveness:
          'Peer-reviewed studies confirm a properly sealed box fan with MERV 13 filters achieves 60-75% of a commercial HEPA CADR at 1/5th the cost. Note: ensure motor is safe from overheating and do not leave unattended overnight.',
      },
      confidence: 'High',
    },
    {
      id: 'room-kitchen',
      room: 'Kitchen',
      title: 'Cooking Emission Management',
      guidance:
        'Cooking is often the highest indoor pollutant source. Put lids on pans and boil/steam whenever possible rather than deep frying.',
      ventilationTiming: 'Run exhaust fan during cooking and leave on for 10 minutes afterwards.',
      purifierTip: 'Never place a HEPA purifier right next to an open stove; cooking grease clogs HEPA pores permanently.',
      diyOption: {
        description: 'Cross-draft vent shield: open a window slightly behind the stove and keep living room doors shut.',
        honestEffectiveness: 'Contains 70% of grease particulates within the kitchen footprint.',
      },
      confidence: 'High',
    },
    {
      id: 'room-living',
      room: 'Living Room',
      title: 'High-Traffic Dust Minimisation',
      guidance: 'Leave outdoor shoes at the entryway door. Outdoor dust carries toxic heavy metals and brake particles.',
      ventilationTiming: 'Keep balcony doors closed during evening rush hour (5-9 PM).',
      purifierTip: hasPurifier
        ? 'Run purifier on auto during daytime, but elevate it off the floor to catch airborne aerosols.'
        : 'Damp-mop hard floors with water instead of dry sweeping, which recirculates settled dust into breathing air.',
      diyOption: {
        description: 'Damp microfiber doormats placed both inside and outside the threshold.',
        honestEffectiveness: 'Traps up to 60% of shoe-borne soil and road particles before they reach indoor rugs.',
      },
      confidence: 'Medium',
    },
    {
      id: 'room-balcony',
      room: 'Balcony/Entry',
      title: 'Outdoor Transition Zone',
      guidance:
        'Brush heavy coats and jackets on the balcony before entering. Dry laundry indoors on drying racks during high smog alerts.',
      ventilationTiming: 'Close transition doors quickly when entering.',
      purifierTip: 'Do not attempt to purify semi-open balcony spaces—it wastes energy and exhausts filters rapidly.',
      diyOption: {
        description: 'Weatherstripping adhesive foam tape applied around balcony door frames.',
        honestEffectiveness: 'Stops 30-40% of micro-drafts from leaking through warped aluminum or wooden frames.',
      },
      confidence: 'High',
    },
  ];
}

export function generateSustainableSwaps(lifestyle: LifestyleProfile): SustainableSwap[] {
  const swaps: SustainableSwap[] = [
    {
      id: 'swap-commute',
      category: 'Commute',
      currentHabit: lifestyle.commuteMode === 'car_motorcycle' ? 'Solo personal motor trip for short errands' : 'Motorized transit',
      betterSwap: 'Combine multiple errands into a single trip, or switch trips under 2 km to walking/bicycling with an N95 mask.',
      whyThisMatters:
        'Cold-start car engines emit 3x to 5x more unburned hydrocarbons and particulate matter in their first 5 minutes.',
      weeklyImpact: 'Avoids an estimated 1.8 kg of CO2 and 45g of toxic NOx per week for a typical household.',
      effort: 'Moderate',
      confidence: 'High',
    },
    {
      id: 'swap-cooking',
      category: 'Cooking',
      currentHabit: lifestyle.cookingFuel === 'biomass_wood_coal' ? 'Solid biomass / wood / coal cooking' : 'Open-pan cooking',
      betterSwap:
        lifestyle.cookingFuel === 'biomass_wood_coal'
          ? 'Electric induction cooktop or LPG cylinder with government subsidy program.'
          : 'Pressure cooking and covered pots for lentils, beans, and stews.',
      whyThisMatters: 'Pressure cooking reduces cooking time by 50-70%, conserving gas and lowering indoor heat and emissions.',
      weeklyImpact: 'Saves 3-5 kg LPG equivalent and eliminates direct kitchen smoke inhalation.',
      effort: 'Easy',
      confidence: 'High',
    },
    {
      id: 'swap-heating',
      category: 'Heating',
      currentHabit: 'Burning scrap wood, paper, or coal in outdoor heaters / open street fires',
      betterSwap: 'Layered thermal clothing, hot water bottles, and heated electric blankets for sleeping.',
      whyThisMatters:
        'Smoldering scrap wood and plastic waste releases carcinogenic dioxins and high-concentration black carbon right at chest height.',
      weeklyImpact: 'Directly protects neighborhood air and prevents acute smoke exposure for neighborhood children.',
      effort: 'Moderate',
      confidence: 'High',
    },
    {
      id: 'swap-waste',
      category: 'Waste',
      currentHabit: 'Burning dry garden leaves or trash in the backyard or street corner',
      betterSwap: 'Compost dry leaves in a corner pit or bag them for municipal brown-waste collection.',
      whyThisMatters: 'Leaf burning creates smoldering smoke with extremely high carbon monoxide and fine PM2.5 levels.',
      weeklyImpact: 'Prevents 10-20 kg of dense neighborhood smoke from lingering at ground level.',
      effort: 'Easy',
      confidence: 'High',
    },
  ];

  return swaps;
}

export function calculateWhatIfImpact(inputs: WhatIfInputs, currentAqi: number): WhatIfResult {
  // Model formula for estimated exposure reduction
  let reduction = 0;

  if (inputs.wearN95Commute) {
    // Certified well-fitted N95 filters ~95% of particulates; real-world user fit yields 70-85% reduction during commute
    reduction += 25;
  }
  if (inputs.runPurifierHours > 0) {
    // 0 to 24 hours of bedroom/living purifier
    const purifierRatio = Math.min(1, inputs.runPurifierHours / 12);
    reduction += purifierRatio * 30;
  }
  if (inputs.ventilateCleanestHour) {
    reduction += 12;
  }
  if (inputs.switchCookingToClean) {
    reduction += 18;
  }

  // Cap total realistic personal exposure reduction
  const finalReductionPct = Math.min(85, Math.round(reduction));

  // Community emissions avoided (e.g. car trip reduction: ~120g CO2 & 0.4g PM2.5 per km)
  const kmAvoided = inputs.skipCarTripKm;
  const avoidedGrams = Math.round(kmAvoided * 120 + (inputs.switchCookingToClean ? 450 : 0));

  let confidence: 'Low' | 'Medium' | 'High' = 'Medium';
  if (inputs.runPurifierHours > 8 || inputs.wearN95Commute) {
    confidence = 'High';
  }

  const explanation =
    currentAqi > 200
      ? `On severe smog days (AQI ${currentAqi}), combining an N95 respirator outdoors with a clean bedroom sanctuary yields the highest personal protection.`
      : `With an AQI of ${currentAqi}, modest behavioral shifts like timing ventilation and reducing short vehicle trips substantially lower lung exposure.`;

  return {
    personalExposureReductionPct: finalReductionPct,
    communityEmissionAvoidedGrams: avoidedGrams,
    confidence,
    explanation,
  };
}

export function getHealthShieldGuidance(member: HouseholdMember, aqi: number) {
  const isSevere = aqi > 200;
  const isModerate = aqi > 100;

  switch (member.role) {
    case 'child':
      return {
        outdoorAdvice: isSevere
          ? 'Strictly cancel outdoor playground time and sports. Moving recess indoors is essential.'
          : isModerate
          ? 'Limit intense continuous running outdoors to under 30 minutes; encourage indoor games.'
          : 'Safe for normal outdoor sports and playground play.',
        maskAdvice: isSevere
          ? 'Certified pediatric-sized N95 or KN95 if outdoor transit is mandatory. Ensure airtight nose bridge seal.'
          : 'Mask optional for healthy children; recommended near busy traffic avenues.',
        symptomsToWatch: 'Persistent dry cough, audible wheezing, eye redness, unusual fatigue after play.',
        whenToSeekDoctor:
          'Difficulty catching breath, breathing so fast ribs pull inward (retractions), or inability to speak full sentences.',
      };

    case 'elderly':
    case 'respiratory':
    case 'pregnant':
      return {
        outdoorAdvice: isSevere
          ? 'Stay indoors in filtered rooms. Postpone non-essential appointments or arrange doorstep delivery.'
          : isModerate
          ? 'Limit outdoor walks to the midday window; avoid morning and evening rush hour.'
          : 'Safe for gentle morning or afternoon walks.',
        maskAdvice: isSevere
          ? 'Well-fitted certified N95 / FFP2 respirator. Note: if breathing through mask feels labored, stay indoors without mask.'
          : 'N95 recommended for walks along bus or truck routes.',
        symptomsToWatch:
          'Tightness in chest, shortness of breath on mild exertion, throat scratchiness, lightheadedness.',
        whenToSeekDoctor:
          'Severe chest pressure, blue-tinted lips/fingernails, sudden confusion, or no relief from rescue inhaler within 15 minutes.',
      };

    case 'pet':
      return {
        outdoorAdvice: isSevere
          ? 'Quick 5-minute leash relief walks only. No fetch, running, or outdoor park play.'
          : 'Normal walks; wipe paws upon returning.',
        maskAdvice: 'Commercial pet masks generally do not seal effectively. Keep indoors instead.',
        symptomsToWatch: 'Excessive panting while resting, watery eyes, coughing, lethargy.',
        whenToSeekDoctor: 'Gums turning pale or blue, continuous wheezing, or refusal to drink water.',
      };

    default:
      return {
        outdoorAdvice: isSevere
          ? 'Avoid prolonged outdoor cardio or heavy lifting. Switch gym workouts indoors.'
          : 'Safe for workouts; prefer shaded routes away from congested arterial roads.',
        maskAdvice: isSevere ? 'Certified N95/FFP2 respirator for all outdoor walking or commuting.' : 'Optional.',
        symptomsToWatch: 'Headache, eye burning, dry throat, coughing.',
        whenToSeekDoctor: 'Persistent chest discomfort or acute respiratory distress.',
      };
  }
}
