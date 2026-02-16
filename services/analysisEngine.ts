/**
 * WISE Enhanced Clinical Analysis Engine v5.0
 * 
 * Major Improvements:
 * 1. Emergency detection (bypasses normal flow)
 * 2. Red flag detection from conditions database
 * 3. Improved probability calculations
 * 4. Differential diagnosis logic
 * 5. Age-specific and risk factor adjustments
 * 6. Severity-based triage escalation
 * 
 * Medical Review: Dr. Leslie Appiah, MD
 * Last Updated: February 2026
 */

import { AnalysisResult, Condition, UserProfile } from '../types';
import { CONDITIONS_DB } from '../constants';

/**
 * Emergency conditions that require immediate medical attention
 */
const EMERGENCY_CONDITION_IDS = [
  'ectopic_pregnancy',
  'ovarian_torsion',
  'pelvic_inflammatory_disease',
  'severe_hemorrhage'
];

/**
 * Main analysis function
 */
export const analyzeSymptoms = (
  answers: Record<string, any>,
  profile: UserProfile,
  reportDate: string
): AnalysisResult => {
  
  // STEP 1: Check for emergencies FIRST
  const emergencyResult = checkForEmergencies(answers, profile);
  if (emergencyResult) {
    return emergencyResult;
  }

  // STEP 2: Check all red flags
  const redFlagMessages = checkRedFlags(answers);
  
  // STEP 3: Score all conditions
  const scoredConditions = scoreAllConditions(answers, profile);
  
  // STEP 4: Calculate probabilities with Bayesian adjustment
  const rankedConditions = calculateProbabilities(scoredConditions, answers, profile);
  
  // STEP 5: Determine triage status
  const triageStatus = determineTriageStatus(rankedConditions, redFlagMessages);
  
  // STEP 6: Generate summary
  const summary = generateSummary(answers, rankedConditions, triageStatus);
  
  return {
    triageStatus,
    rankedConditions: rankedConditions.slice(0, 5), // Top 5 conditions
    redFlagMessages: Array.from(new Set(redFlagMessages)),
    summary,
    reportDate
  };
};

/**
 * STEP 1: Emergency Detection
 * Checks for life-threatening conditions that need immediate care
 */
function checkForEmergencies(
  answers: Record<string, any>,
  profile: UserProfile
): AnalysisResult | null {
  
  const emergencyConditions = CONDITIONS_DB.filter(c => 
    EMERGENCY_CONDITION_IDS.includes(c.id)
  );
  
  for (const condition of emergencyConditions) {
    const score = scoreCondition(condition, answers, profile);
    
    // Emergency threshold: if score > 100, this is likely an emergency
    if (score.totalScore > 100) {
      
      // Get red flags for this emergency
      const emergencyRedFlags = getRedFlagsForCondition(condition, answers);
      
      return {
        triageStatus: 'Emergency',
        rankedConditions: [{
          condition,
          probability: 95, // High probability for emergencies
          explanation: score.matchedTriggers.join('; ')
        }],
        redFlagMessages: emergencyRedFlags.length > 0 
          ? emergencyRedFlags 
          : ['🚨 EMERGENCY: Based on your symptoms, you need immediate medical attention. Go to the ER or call 911.'],
        summary: `EMERGENCY ASSESSMENT: Your symptoms are concerning for ${condition.name}. This is a medical emergency requiring immediate evaluation. Do not delay - seek emergency care now.`,
        reportDate: new Date().toISOString().split('T')[0]
      };
    }
  }
  
  return null; // No emergency detected
}

/**
 * STEP 2: Red Flag Detection
 * Checks all conditions for red flag criteria
 */
function checkRedFlags(answers: Record<string, any>): string[] {
  const redFlags: string[] = [];
  
  for (const condition of CONDITIONS_DB) {
    if (!condition.redFlags) continue;
    
    for (const redFlag of condition.redFlags) {
      const answer = answers[redFlag.questionId];
      if (!answer) continue;
      
      const isMatch = Array.isArray(redFlag.answerValue)
        ? redFlag.answerValue.some(v => 
            Array.isArray(answer) ? answer.includes(v) : answer === v
          )
        : Array.isArray(answer) 
          ? answer.includes(redFlag.answerValue)
          : answer === redFlag.answerValue;
      
      if (isMatch) {
        redFlags.push(redFlag.message);
      }
    }
  }
  
  return redFlags;
}

/**
 * Get red flags specific to a condition
 */
function getRedFlagsForCondition(
  condition: Condition,
  answers: Record<string, any>
): string[] {
  if (!condition.redFlags) return [];
  
  const flags: string[] = [];
  for (const redFlag of condition.redFlags) {
    const answer = answers[redFlag.questionId];
    if (!answer) continue;
    
    const isMatch = Array.isArray(redFlag.answerValue)
      ? redFlag.answerValue.some(v => 
          Array.isArray(answer) ? answer.includes(v) : answer === v
        )
      : Array.isArray(answer)
        ? answer.includes(redFlag.answerValue)
        : answer === redFlag.answerValue;
    
    if (isMatch) {
      flags.push(redFlag.message);
    }
  }
  
  return flags;
}

/**
 * STEP 3: Score All Conditions
 */
interface ScoredCondition {
  condition: Condition;
  totalScore: number;
  matchedTriggers: string[];
  triggerCount: number;
}

function scoreAllConditions(
  answers: Record<string, any>,
  profile: UserProfile
): ScoredCondition[] {
  
  const scored: ScoredCondition[] = [];
  
  for (const condition of CONDITIONS_DB) {
    const score = scoreCondition(condition, answers, profile);
    
    if (score.totalScore > 0) {
      scored.push(score);
    }
  }
  
  // Sort by score (highest first)
  scored.sort((a, b) => b.totalScore - a.totalScore);
  
  return scored;
}

/**
 * Score individual condition with age and risk factor adjustments
 */
function scoreCondition(
  condition: Condition,
  answers: Record<string, any>,
  profile: UserProfile
): ScoredCondition {
  
  let totalScore = 0;
  const matchedTriggers: string[] = [];
  let triggerCount = 0;
  
  const userAge = parseInt(answers['age_selection'] || profile.age?.toString() || '28');
  
  // Check each trigger
  for (const trigger of condition.triggers) {
    const answer = answers[trigger.questionId];
    if (!answer) continue;
    
    const isMatch = Array.isArray(trigger.answerValue)
      ? trigger.answerValue.some(v => 
          Array.isArray(answer) ? answer.includes(v) : answer === v
        )
      : Array.isArray(answer)
        ? answer.includes(trigger.answerValue)
        : answer === trigger.answerValue;
    
    if (isMatch) {
      totalScore += trigger.weight;
      triggerCount++;
      
      // Add readable explanation
      if (Array.isArray(trigger.answerValue)) {
        matchedTriggers.push(`${trigger.questionId}: ${trigger.answerValue.join(' or ')}`);
      } else {
        matchedTriggers.push(`${trigger.questionId}: ${trigger.answerValue}`);
      }
    }
  }
  
  // Age-specific adjustments
  totalScore = applyAgeAdjustment(condition, userAge, totalScore);
  
  // Risk factor adjustments
  totalScore = applyRiskFactorAdjustment(condition, answers, totalScore);
  
  return {
    condition,
    totalScore,
    matchedTriggers,
    triggerCount
  };
}

/**
 * Apply age-specific scoring adjustments
 */
function applyAgeAdjustment(
  condition: Condition,
  age: number,
  baseScore: number
): number {
  
  // Age-specific condition likelihood adjustments
  const ageAdjustments: Record<string, (age: number) => number> = {
    // Endometriosis: More common in 25-40 age range
    'endometriosis_wise': (age) => {
      if (age >= 25 && age <= 40) return baseScore * 1.2;
      if (age < 20 || age > 45) return baseScore * 0.8;
      return baseScore;
    },
    
    // PCOS: Peak diagnosis in teens to early 30s
    'pcos_wise': (age) => {
      if (age >= 15 && age <= 35) return baseScore * 1.2;
      if (age > 40) return baseScore * 0.7;
      return baseScore;
    },
    
    // Fibroids: More common 30-50
    'uterine_fibroids': (age) => {
      if (age >= 30 && age <= 50) return baseScore * 1.3;
      if (age < 25) return baseScore * 0.5;
      return baseScore;
    },
    
    // Adenomyosis: Peak 40-50
    'adenomyosis_wise': (age) => {
      if (age >= 40 && age <= 50) return baseScore * 1.3;
      if (age < 30) return baseScore * 0.6;
      return baseScore;
    },
    
    // POI: By definition before age 40
    'premature_ovarian_insufficiency': (age) => {
      if (age < 40) return baseScore * 1.5;
      return baseScore * 0.1; // Very unlikely after 40
    },
    
    // Primary dysmenorrhea: More common in teens/20s
    'primary_dysmenorrhea': (age) => {
      if (age >= 15 && age <= 25) return baseScore * 1.3;
      if (age > 35) return baseScore * 0.8;
      return baseScore;
    }
  };
  
  const adjustmentFn = ageAdjustments[condition.id];
  return adjustmentFn ? adjustmentFn(age) : baseScore;
}

/**
 * Apply risk factor adjustments
 */
function applyRiskFactorAdjustment(
  condition: Condition,
  answers: Record<string, any>,
  baseScore: number
): number {
  
  let adjustedScore = baseScore;
  
  // Parity adjustments
  const parity = answers['number_of_births'];
  
  if (condition.id === 'endometriosis_wise' && parity === '0') {
    adjustedScore *= 1.2; // Nulliparity increases endometriosis likelihood
  }
  
  if (condition.id === 'adenomyosis_wise' && parity && parity !== '0') {
    adjustedScore *= 1.3; // Multiparity increases adenomyosis likelihood
  }
  
  if (condition.id === 'pelvic_organ_prolapse' && parity && parseInt(parity) >= 2) {
    adjustedScore *= 1.4; // Multiple births increase prolapse risk
  }
  
  // BMI/Obesity adjustments
  const obesity = answers['obesity_status'];
  
  if ((condition.id === 'pcos_wise' || condition.id === 'endometrial_hyperplasia') && 
      obesity?.includes('Obese')) {
    adjustedScore *= 1.3; // Obesity increases risk
  }
  
  // Diabetes adjustments
  const diabetes = answers['diabetes_status'];
  
  if (condition.id === 'vulvovaginal_candidiasis' && 
      diabetes && diabetes !== 'No diabetes') {
    adjustedScore *= 1.5; // Diabetes increases yeast infection risk
  }
  
  // Recent antibiotic use
  const antibiotics = answers['recent_antibiotics'];
  
  if (condition.id === 'vulvovaginal_candidiasis' && 
      antibiotics?.includes('Yes')) {
    adjustedScore *= 1.4; // Antibiotics increase yeast risk
  }
  
  if (condition.id === 'bacterial_vaginosis' && 
      antibiotics?.includes('Yes')) {
    adjustedScore *= 0.7; // Antibiotics may have treated BV
  }
  
  return adjustedScore;
}

/**
 * STEP 4: Calculate Probabilities with Bayesian Adjustment
 */
function calculateProbabilities(
  scoredConditions: ScoredCondition[],
  answers: Record<string, any>,
  profile: UserProfile
): AnalysisResult['rankedConditions'] {
  
  if (scoredConditions.length === 0) {
    return [];
  }
  
  // Get top score for normalization
  const maxScore = scoredConditions[0].totalScore;
  
  return scoredConditions.map(scored => {
    // Base probability from score (relative to max)
    let probability = Math.round((scored.totalScore / maxScore) * 100);
    
    // Cap at 95% (never 100% certain without definitive testing)
    probability = Math.min(probability, 95);
    
    // Minimum threshold - if we're including it, at least 15%
    probability = Math.max(probability, 15);
    
    // Adjust based on number of triggers matched
    // More triggers = higher confidence
    if (scored.triggerCount >= 5) {
      probability = Math.min(probability + 10, 95);
    } else if (scored.triggerCount <= 2) {
      probability = Math.max(probability - 10, 15);
    }
    
    return {
      condition: scored.condition,
      probability,
      explanation: generateExplanation(scored, answers)
    };
  });
}

/**
 * Generate human-readable explanation
 */
function generateExplanation(
  scored: ScoredCondition,
  answers: Record<string, any>
): string {
  
  const explanations: string[] = [];
  
  // Summarize key matching symptoms
  const symptoms = answers['pelvic_symptoms_current'] as string[];
  if (symptoms && symptoms.length > 0) {
    explanations.push(`Symptoms: ${symptoms.slice(0, 3).join(', ')}`);
  }
  
  // Add key risk factors
  const age = answers['age_selection'];
  if (age) {
    explanations.push(`Age: ${age}`);
  }
  
  const parity = answers['number_of_births'];
  if (parity) {
    explanations.push(`Births: ${parity}`);
  }
  
  // Add trigger count
  explanations.push(`Matched ${scored.triggerCount} clinical criteria`);
  
  return explanations.join(' | ');
}

/**
 * STEP 5: Determine Triage Status
 */
function determineTriageStatus(
  rankedConditions: AnalysisResult['rankedConditions'],
  redFlags: string[]
): AnalysisResult['triageStatus'] {
  
  if (rankedConditions.length === 0) {
    return 'Routine';
  }
  
  // Check top condition's severity
  const topCondition = rankedConditions[0].condition;
  
  // Emergency conditions
  if (topCondition.severity === 'Emergency') {
    return 'Emergency';
  }
  
  // Urgent conditions
  if (topCondition.severity === 'Urgent') {
    return 'Urgent';
  }
  
  // Red flags can escalate triage
  if (redFlags.length > 0) {
    // Check if any red flag indicates emergency
    const hasEmergencyFlag = redFlags.some(flag => 
      flag.includes('🚨 EMERGENCY') || flag.includes('CALL 911')
    );
    
    if (hasEmergencyFlag) {
      return 'Emergency';
    }
    
    // Check for urgent flags
    const hasUrgentFlag = redFlags.some(flag => 
      flag.includes('⚠️ URGENT') || flag.includes('same-day') || flag.includes('today')
    );
    
    if (hasUrgentFlag) {
      return 'Urgent';
    }
    
    // Any red flag at least warrants "Soon"
    return 'Soon';
  }
  
  // Check second condition for differential diagnosis considerations
  if (rankedConditions.length > 1 && rankedConditions[1].condition.severity === 'Urgent') {
    return 'Soon'; // Multiple concerning conditions
  }
  
  // Default to top condition severity
  if (topCondition.severity === 'Soon') return 'Soon';
  if (topCondition.severity === 'Routine') return 'Routine';
  
  return 'Self-care';
}

/**
 * STEP 6: Generate Summary
 */
function generateSummary(
  answers: Record<string, any>,
  rankedConditions: AnalysisResult['rankedConditions'],
  triageStatus: AnalysisResult['triageStatus']
): string {
  
  if (rankedConditions.length === 0) {
    return 'Based on your responses, no specific conditions were identified. Please consult with a healthcare provider if you have concerns.';
  }
  
  const topCondition = rankedConditions[0].condition;
  const topProbability = rankedConditions[0].probability;
  
  // Emergency summary
  if (triageStatus === 'Emergency') {
    return `🚨 EMERGENCY: Your symptoms are most consistent with ${topCondition.name}. This requires immediate medical attention. Go to the emergency room or call 911 now. Do not wait.`;
  }
  
  // Urgent summary
  if (triageStatus === 'Urgent') {
    return `⚠️ URGENT: Your symptoms suggest ${topCondition.name} (${topProbability}% match). You should seek medical care today - call your provider, go to urgent care, or visit the ER. Early treatment is important to prevent complications.`;
  }
  
  // Soon summary
  if (triageStatus === 'Soon') {
    let summary = `Your symptoms are most consistent with ${topCondition.name} (${topProbability}% match). `;
    
    if (rankedConditions.length > 1) {
      const secondCondition = rankedConditions[1].condition;
      summary += `Other possibilities include ${secondCondition.name}. `;
    }
    
    summary += `Schedule an appointment with your healthcare provider within the next 1-2 weeks for evaluation.`;
    return summary;
  }
  
  // Routine summary
  if (triageStatus === 'Routine') {
    let summary = `Your symptoms may be related to ${topCondition.name} (${topProbability}% match). `;
    
    if (rankedConditions.length > 1) {
      const otherConditions = rankedConditions.slice(1, 3).map(c => c.condition.name);
      summary += `Other considerations: ${otherConditions.join(', ')}. `;
    }
    
    summary += `Discuss these findings with your healthcare provider at your next visit.`;
    return summary;
  }
  
  // Self-care summary
  return `Your symptoms may be managed with self-care measures for ${topCondition.name}. However, if symptoms persist or worsen, consult a healthcare provider.`;
}

/**
 * Utility function to get emergency conditions
 */
export function getEmergencyConditions(): Condition[] {
  return CONDITIONS_DB.filter(c => c.severity === 'Emergency');
}

/**
 * Utility function to get condition by ID
 */
export function getConditionById(id: string): Condition | undefined {
  return CONDITIONS_DB.find(c => c.id === id);
}

/**
 * Export for testing
 */
export const testHelpers = {
  checkForEmergencies,
  checkRedFlags,
  scoreCondition,
  calculateProbabilities,
  determineTriageStatus
};
