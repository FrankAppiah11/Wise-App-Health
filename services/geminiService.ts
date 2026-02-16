/**
 * WISE Gemini AI Service
 * 
 * Comprehensive AI integration for:
 * - Explaining assessment results in patient-friendly language
 * - Answering follow-up questions
 * - Providing educational content
 * - Preparing for doctor appointments
 * - Analyzing symptom patterns
 */

import { GoogleGenAI } from '@google/genai';
import type { AnalysisResult, Condition, UserProfile } from '../types';
import type { SymptomLog } from './symptomTracker';

// Initialize Gemini AI
const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }
  return new GoogleGenAI({ apiKey });
};

// ============================================================================
// ASSESSMENT EXPLANATION
// ============================================================================

/**
 * Explain assessment results in patient-friendly language
 */
export async function explainAssessmentResults(
  analysisResult: AnalysisResult,
  userAge: number
): Promise<string> {
  try {
    const ai = getAI();
    
    const topCondition = analysisResult.rankedConditions[0];
    const otherConditions = analysisResult.rankedConditions.slice(1, 3);
    
    const prompt = `You are a compassionate women's health educator explaining medical assessment results.

USER'S ASSESSMENT RESULTS:
- Triage Level: ${analysisResult.triageStatus}
- Top Condition: ${topCondition.condition.name} (${topCondition.probability}% match)
- Other Possibilities: ${otherConditions.map(c => c.condition.name).join(', ')}
- Red Flags: ${analysisResult.redFlagMessages.join('; ')}
- User Age: ${userAge}

TASK: Explain these results in clear, empathetic language that:
1. Helps the patient understand what these findings mean
2. Explains why this condition is suspected (based on symptoms)
3. Reassures while being honest
4. Clarifies next steps based on triage level
5. Uses analogies when helpful
6. Avoids medical jargon or explains terms simply

Keep response under 250 words. Be warm and supportive.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 500
      }
    });

    return response.text || 'Unable to generate explanation at this time.';
  } catch (error) {
    console.error('Error explaining assessment:', error);
    return 'I apologize, but I\'m having trouble generating an explanation right now. Please try again or consult your healthcare provider for clarification.';
  }
}

/**
 * Explain a specific condition in simple terms
 */
export async function explainCondition(
  condition: Condition,
  userAge: number,
  userContext?: string
): Promise<string> {
  try {
    const ai = getAI();
    
    const prompt = `You are a patient educator explaining a gynecological condition.

CONDITION: ${condition.name}
DESCRIPTION: ${condition.description}
SEVERITY LEVEL: ${condition.severity}
USER AGE: ${userAge}
${userContext ? `USER CONTEXT: ${userContext}` : ''}

TASK: Explain this condition in patient-friendly language:
1. What it is (simple definition)
2. Common symptoms
3. Why it happens (causes)
4. How it's diagnosed
5. Treatment options available
6. What to expect
7. Important things to know

Use simple language, short paragraphs, and be reassuring. Under 300 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 600
      }
    });

    return response.text || 'Unable to generate explanation.';
  } catch (error) {
    console.error('Error explaining condition:', error);
    return condition.description || 'No explanation available.';
  }
}

// ============================================================================
// DOCTOR APPOINTMENT PREPARATION
// ============================================================================

/**
 * Generate personalized questions to ask doctor
 */
export async function generateDoctorQuestions(
  analysisResult: AnalysisResult,
  symptomLogs: SymptomLog[],
  userAge: number
): Promise<string[]> {
  try {
    const ai = getAI();
    
    const topCondition = analysisResult.rankedConditions[0]?.condition;
    
    // Analyze symptom patterns
    const avgPain = symptomLogs.reduce((sum, log) => sum + (log.pain_level || 0), 0) / Math.max(symptomLogs.length, 1);
    const commonSymptoms = getCommonSymptoms(symptomLogs);
    
    const prompt = `You are helping a patient prepare for their gynecology appointment.

PATIENT SITUATION:
- Suspected Condition: ${topCondition?.name}
- Average Pain Level: ${avgPain.toFixed(1)}/10
- Common Symptoms: ${commonSymptoms.join(', ')}
- Triage Level: ${analysisResult.triageStatus}
- Age: ${userAge}

TASK: Generate 6-8 specific, actionable questions this patient should ask their doctor.
Questions should:
- Be direct and clear
- Help with diagnosis
- Cover treatment options
- Address concerns about this specific condition
- Include lifestyle/management questions
- Be appropriate for this triage level

Format: Return ONLY the questions, one per line, numbered.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 400
      }
    });

    const text = response.text || '';
    const questions = text.split('\n').filter(q => q.trim() && /^\d+\./.test(q.trim()));
    return questions.map(q => q.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error('Error generating doctor questions:', error);
    return [
      'What tests do you recommend to confirm the diagnosis?',
      'What are my treatment options?',
      'What can I do at home to manage symptoms?',
      'When should I follow up?',
      'Are there any lifestyle changes that could help?'
    ];
  }
}

/**
 * Create appointment preparation summary
 */
export async function createAppointmentSummary(
  analysisResult: AnalysisResult,
  symptomLogs: SymptomLog[],
  userProfile: UserProfile
): Promise<string> {
  try {
    const ai = getAI();
    
    const recentLogs = symptomLogs.slice(0, 30); // Last 30 days
    const painDays = recentLogs.filter(l => l.pain_level && l.pain_level >= 5).length;
    const commonSymptoms = getCommonSymptoms(recentLogs);
    
    const prompt = `You are helping create a concise summary for a patient to bring to their doctor.

PATIENT DATA:
- Age: ${userProfile.age}
- Suspected Condition: ${analysisResult.rankedConditions[0]?.condition.name}
- Days with Significant Pain (≥5/10) in last month: ${painDays}
- Most Common Symptoms: ${commonSymptoms.slice(0, 5).join(', ')}
- Red Flags: ${analysisResult.redFlagMessages.length > 0 ? 'Yes' : 'No'}

TASK: Create a brief, professional summary (3-4 bullet points) that:
- Highlights key concerns
- Quantifies symptom patterns
- Notes impact on daily life if mentioned
- Mentions relevant medical history if provided

Keep it concise and clinical. This will be shown to a doctor.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.6,
        maxOutputTokens: 300
      }
    });

    return response.text || 'Summary unavailable.';
  } catch (error) {
    console.error('Error creating appointment summary:', error);
    return 'Summary unavailable at this time.';
  }
}

// ============================================================================
// PATTERN ANALYSIS & INSIGHTS
// ============================================================================

/**
 * Analyze symptom patterns and provide insights
 */
export async function analyzeSymptomPatterns(
  symptomLogs: SymptomLog[],
  userAge: number
): Promise<string> {
  try {
    const ai = getAI();
    
    // Calculate patterns
    const avgPain = symptomLogs.reduce((sum, log) => sum + (log.pain_level || 0), 0) / Math.max(symptomLogs.length, 1);
    const avgEnergy = symptomLogs.reduce((sum, log) => sum + (log.energy_level || 3), 0) / Math.max(symptomLogs.length, 1);
    const avgSleep = symptomLogs.reduce((sum, log) => sum + (log.sleep_quality || 3), 0) / Math.max(symptomLogs.length, 1);
    
    const flowDays = symptomLogs.filter(l => l.flow_level && !['none', 'spotting'].includes(l.flow_level)).length;
    const commonSymptoms = getCommonSymptoms(symptomLogs);
    const commonMoods = getCommonMoods(symptomLogs);
    
    const prompt = `You are analyzing a patient's symptom tracking data to provide helpful insights.

TRACKED DATA (last ${symptomLogs.length} days):
- Average Pain: ${avgPain.toFixed(1)}/10
- Average Energy: ${avgEnergy.toFixed(1)}/5
- Average Sleep Quality: ${avgSleep.toFixed(1)}/5
- Days with Flow: ${flowDays}
- Common Symptoms: ${commonSymptoms.join(', ')}
- Common Moods: ${commonMoods.join(', ')}
- Age: ${userAge}

TASK: Provide 2-3 helpful insights about patterns you notice:
- What trends stand out
- Correlations between symptoms (e.g., pain and sleep)
- Suggestions for what to track more carefully
- Lifestyle recommendations if patterns suggest them

Be specific, actionable, and encouraging. Under 200 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 400
      }
    });

    return response.text || 'Insufficient data for pattern analysis.';
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    return 'Unable to analyze patterns at this time.';
  }
}

// ============================================================================
// EDUCATIONAL CONTENT
// ============================================================================

/**
 * Generate educational content about a topic
 */
export async function getEducationalContent(
  topic: string,
  userAge: number,
  keepItSimple: boolean = true
): Promise<string> {
  try {
    const ai = getAI();
    
    const prompt = `You are a women's health educator creating content about: ${topic}

TARGET AUDIENCE: ${userAge}-year-old seeking to understand their reproductive health
READING LEVEL: ${keepItSimple ? 'Simple, accessible language (8th grade level)' : 'General public'}

TASK: Provide clear, accurate educational content covering:
1. What it is / Overview
2. Key facts to know
3. Common misconceptions (if any)
4. When to seek medical care
5. Resources for learning more

Keep it informative, evidence-based, and empowering. Under 400 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    });

    return response.text || 'Content unavailable.';
  } catch (error) {
    console.error('Error generating educational content:', error);
    return 'Unable to generate content at this time.';
  }
}

// ============================================================================
// CONVERSATIONAL Q&A
// ============================================================================

/**
 * Answer follow-up questions with context
 */
export async function answerQuestion(
  question: string,
  context: {
    analysisResult?: AnalysisResult;
    recentSymptoms?: SymptomLog[];
    userAge?: number;
  }
): Promise<string> {
  try {
    const ai = getAI();
    
    let contextStr = '';
    if (context.analysisResult) {
      contextStr += `\nUSER'S RECENT ASSESSMENT: ${context.analysisResult.rankedConditions[0]?.condition.name}`;
    }
    if (context.recentSymptoms && context.recentSymptoms.length > 0) {
      const commonSymptoms = getCommonSymptoms(context.recentSymptoms);
      contextStr += `\nRECENT SYMPTOMS: ${commonSymptoms.slice(0, 3).join(', ')}`;
    }
    if (context.userAge) {
      contextStr += `\nUSER AGE: ${context.userAge}`;
    }
    
    const prompt = `You are WISE AI, a supportive women's health assistant.

QUESTION: ${question}
${contextStr}

TASK: Provide a helpful, evidence-based answer that:
- Addresses the question directly
- Uses context if relevant
- Provides actionable information
- Encourages medical consultation for specific concerns
- Is warm and supportive
- Stays within scope of educational guidance

Keep response under 250 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `You are WISE AI, a supportive reproductive health assistant created by Dr. Leslie Appiah. You provide evidence-based educational information about gynecological health, menstrual cycles, and symptoms. You are empathetic, professional, and always encourage consulting healthcare providers for medical decisions. You stay within your scope as an educational tool.`,
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    return response.text || 'I apologize, I\'m having trouble answering right now.';
  } catch (error) {
    console.error('Error answering question:', error);
    return 'I\'m unable to answer at this time. Please try again or consult a healthcare provider.';
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCommonSymptoms(logs: SymptomLog[]): string[] {
  const symptomCounts = new Map<string, number>();
  
  logs.forEach(log => {
    if (log.symptoms) {
      log.symptoms.forEach(symptom => {
        symptomCounts.set(symptom, (symptomCounts.get(symptom) || 0) + 1);
      });
    }
  });
  
  return Array.from(symptomCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([symptom]) => symptom)
    .slice(0, 5);
}

function getCommonMoods(logs: SymptomLog[]): string[] {
  const moodCounts = new Map<string, number>();
  
  logs.forEach(log => {
    if (log.mood) {
      log.mood.forEach(mood => {
        moodCounts.set(mood, (moodCounts.get(mood) || 0) + 1);
      });
    }
  });
  
  return Array.from(moodCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([mood]) => mood)
    .slice(0, 3);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  explainAssessmentResults,
  explainCondition,
  generateDoctorQuestions,
  createAppointmentSummary,
  analyzeSymptomPatterns,
  getEducationalContent,
  answerQuestion
};
