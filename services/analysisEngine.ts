import { AnalysisResult, Condition, UserProfile } from '../types';
import { CONDITIONS_DB } from '../constants';

/**
 * WISE Clinical Analysis Engine (v4.1)
 * Specialized for gynecological symptom differentiation including parity factors.
 */
export const analyzeSymptoms = (
  answers: Record<string, any>,
  profile: UserProfile,
  reportDate: string
): AnalysisResult => {
  let redFlagMessages: string[] = [];
  let triageStatus: AnalysisResult['triageStatus'] = 'Routine';
  const scores: { condition: Condition; score: number; explanation: string }[] = [];

  const userAge = parseInt(answers['age_selection'] || profile.age.toString());
  const menstrualFlow = answers['menstrual_flow'] as string;
  const painIntensity = answers['pain_scale_0_10'] as string;
  const parity = answers['number_of_births'] as string;
  const symptoms = (answers['pelvic_symptoms_current'] as string[]) || [];

  // 1. Safety Guardrails
  if (menstrualFlow?.includes('Very heavy') || menstrualFlow?.includes('Heavy')) {
    redFlagMessages.push('Clinical Alert: Heavy flow soaking through products quickly requires iron-level and clotting evaluation.');
    triageStatus = 'Soon';
  }

  if (painIntensity === '7–10: severe pain') {
    triageStatus = 'Soon';
  }

  // 2. Multi-factorial Condition Scoring
  for (const condition of CONDITIONS_DB) {
    let score = 0;
    let matchedItems: string[] = [];

    // Apply Variation Logic for Endometriosis (Variation 1: Classic Young/Nulliparous)
    if (condition.id === 'endometriosis_wise') {
      if (userAge <= 35 && painIntensity === '7–10: severe pain') {
        score += 20;
        matchedItems.push('Classic young patient profile');
      }
      if (parity === '0') {
        score += 10;
        matchedItems.push('Nulliparous history');
      }
      if (userAge >= 40 && symptoms.includes('Pain with bowel movements')) {
        score += 30;
        matchedItems.push('Atypical GI presentation');
      }
    }

    // Apply Logic for Adenomyosis (Variation 4: Multiparity)
    if (condition.id === 'adenomyosis_wise') {
      if (parity && parity !== '0') {
        score += 15;
        matchedItems.push('Multiparous history');
      }
    }

    condition.triggers.forEach((trigger) => {
      const actualAns = answers[trigger.questionId];
      if (!actualAns) return;

      const isMatch = Array.isArray(trigger.answerValue)
        ? trigger.answerValue.some((v) => Array.isArray(actualAns) ? actualAns.includes(v) : actualAns === v)
        : Array.isArray(actualAns) ? actualAns.includes(trigger.answerValue) : actualAns === trigger.answerValue;

      if (isMatch) {
        score += trigger.weight;
        matchedItems.push(trigger.questionId);
      }
    });

    if (score > 0) {
      scores.push({
        condition,
        score,
        explanation: matchedItems.join(', '),
      });
    }
  }

  scores.sort((a, b) => b.score - a.score);
  
  // Normalization: Using 75 as a base for high-confidence match
  const rankedConditions = scores.slice(0, 3).map((item) => ({
    condition: item.condition,
    probability: Math.min(98, Math.round((item.score / 75) * 100)),
    explanation: item.explanation,
  }));

  const cycle = answers['cycle_length'] || 'unreported';
  const summary = `Assessment based on ${cycle} cycle and reported symptoms. Your profile suggests priority clinical screening.`;

  return {
    triageStatus,
    rankedConditions,
    redFlagMessages: Array.from(new Set(redFlagMessages)),
    summary,
    reportDate,
  };
};