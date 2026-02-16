
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: number;
  genderIdentity?: string;
  userPersona?: 'Self' | 'Parent';
  isPregnant: boolean;
  isPostpartum: boolean;
  contraception: string;
  knownConditions: string[];
  medications: string[];
  isUpgraded?: boolean;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'scale' | 'date' | 'dropdown' | 'text';
  options?: string[];
  category: string;
  section: 'About You' | 'Menstrual History' | 'Menstrual and Pain' | 'Lifestyle' | 'Medical History' | 'Preventive Health' | 'Fertility and Family Planning' | 'Support' | 'Associated Symptoms';
  condition?: (answers: Record<string, any>, profile: UserProfile) => boolean;
  isSubQuestion?: boolean;
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  severity: 'Routine' | 'Soon' | 'Urgent' | 'Emergency' | 'Self-care';
  triggers: {
    questionId: string;
    answerValue: string | string[];
    weight: number;
  }[];
  redFlags?: {
    questionId: string;
    answerValue: string | string[];
    message: string;
  }[];
  nextSteps: string[];
  providerQuestions: string[]; // Added: Specific questions for the doctor
  relevantTests: string[];     // Added: Tests the user should discuss
}

export interface AnalysisResult {
  triageStatus: 'Emergency' | 'Urgent' | 'Soon' | 'Routine' | 'Self-care';
  rankedConditions: {
    condition: Condition;
    probability: number;
    explanation: string;
  }[];
  redFlagMessages: string[];
  summary: string;
  reportDate: string;
}

export interface EducationArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
}

export enum AppScreen {
  ONBOARDING = 'ONBOARDING',
  SIGNUP = 'SIGNUP',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  PROFILE = 'PROFILE',
  WHAT_IS_WISE = 'WHAT_IS_WISE',
  SURVEY = 'SURVEY',
  RESULTS = 'RESULTS',
  TRACKER = 'TRACKER',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN',
  MEMBERSHIP = 'MEMBERSHIP',
  INELIGIBLE = 'INELIGIBLE',
}
