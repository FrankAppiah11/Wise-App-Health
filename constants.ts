import { Condition, SurveyQuestion, UserProfile, EducationArticle } from './types';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // 0. Persona Selection
  {
    id: 'user_persona',
    text: 'Who is using WISE today?',
    type: 'single',
    section: 'About You',
    category: 'Demographics',
    options: [
      'I am using this for myself (Age 15+)',
      'I am a parent/guardian using this for my child (Ages 12-14)'
    ],
  },
  // 1. About You (Demographics)
  {
    id: 'age_selection',
    text: '{{age_question}}',
    type: 'dropdown',
    section: 'About You',
    category: 'Demographics',
    options: Array.from({ length: 89 }, (_, i) => (i + 12).toString()),
  },
  {
    id: 'gender_identity',
    text: 'How {{verb_do}} {{subject}} identify?',
    type: 'single',
    section: 'About You',
    category: 'Demographics',
    options: [
      'Female',
      'Male',
      'Transfemale',
      'Transmale',
      'Non-binary',
      'Prefer to self-describe',
      'Prefer not to say'
    ],
  },
  {
    id: 'born_with_uterus',
    text: '{{Verb_were}} {{subject}} born with a uterus?',
    type: 'single',
    section: 'About You',
    category: 'Demographics',
    options: ['Yes', 'No'],
    condition: (a) => ['Male', 'Transfemale', 'Transmale'].includes(a['gender_identity']),
  },

  // ---------------------------------------------------------
  // SYSTEMIC MEDICAL HISTORY (Metabolic, Cancer, Autoimmune)
  // ---------------------------------------------------------
  {
    id: 'chronic_conditions',
    text: '{{Verb_have}} {{subject}} ever been diagnosed with any of the following conditions?',
    type: 'multiple',
    section: 'Medical History',
    category: 'Systemic Health',
    options: [
      'HEADER:Metabolic & Endocrine',
      'Type 2 Diabetes',
      'Gestational Diabetes (history of)',
      'Thyroid Disorder',
      'Hypertension (High Blood Pressure)',
      'High Cholesterol',
      'HEADER:Autoimmune & Inflammatory',
      'Lupus (SLE)',
      'Rheumatoid Arthritis',
      'Celiac Disease',
      'Multiple Sclerosis',
      'Inflammatory Bowel Disease (Crohn\'s/Colitis)',
      'HEADER:Cancer History',
      'Breast Cancer',
      'Ovarian Cancer',
      'Uterine/Cervical Cancer',
      'Colon Cancer',
      'Other Cancer',
      'HEADER:Other',
      'None of the above'
    ],
  },

  // ---------------------------------------------------------
  // PREGNANCY HISTORY (For 18+)
  // ---------------------------------------------------------
  {
    id: 'ever_pregnant',
    text: '{{Verb_have}} {{subject}} ever been pregnant?',
    type: 'single',
    section: 'Medical History',
    category: 'Pregnancy History',
    condition: (a) => parseInt(a['age_selection'] || '18') >= 18,
    options: ['Yes', 'No'],
  },
  {
    id: 'number_of_pregnancies',
    text: 'How many times {{verb_have}} {{subject}} been pregnant in total?',
    type: 'dropdown',
    section: 'Medical History',
    category: 'Pregnancy History',
    isSubQuestion: true,
    condition: (a) => a['ever_pregnant'] === 'Yes' && parseInt(a['age_selection'] || '18') >= 18,
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
  },
  {
    id: 'number_of_births',
    text: 'Of those, how many were live births?',
    type: 'dropdown',
    section: 'Medical History',
    category: 'Pregnancy History',
    isSubQuestion: true,
    condition: (a) => a['ever_pregnant'] === 'Yes' && !!a['number_of_pregnancies'],
    options: ['0', '1', '2', '3', '4', '5+'],
  },
  {
    id: 'number_of_miscarriages',
    text: 'How many were miscarriages (spontaneous losses before 20 weeks)?',
    type: 'dropdown',
    section: 'Medical History',
    category: 'Pregnancy History',
    isSubQuestion: true,
    condition: (a) => a['ever_pregnant'] === 'Yes' && !!a['number_of_pregnancies'],
    options: ['0', '1', '2', '3', '4', '5+'],
  },
  {
    id: 'number_of_terminations',
    text: 'How many were terminations of pregnancy?',
    type: 'dropdown',
    section: 'Medical History',
    category: 'Pregnancy History',
    isSubQuestion: true,
    condition: (a) => a['ever_pregnant'] === 'Yes' && !!a['number_of_pregnancies'],
    options: ['0', '1', '2', '3', '4', '5+'],
  },
  {
    id: 'number_of_ectopics',
    text: 'How many were ectopic (tubal) pregnancies?',
    type: 'dropdown',
    section: 'Medical History',
    category: 'Pregnancy History',
    isSubQuestion: true,
    condition: (a) => a['ever_pregnant'] === 'Yes' && !!a['number_of_pregnancies'],
    options: ['0', '1', '2', '3+'],
  },

  // ---------------------------------------------------------
  // GYNECOLOGIC PROCEDURE HISTORY (For 18+)
  // ---------------------------------------------------------
  {
    id: 'ever_had_gyn_surgery',
    text: '{{Verb_have}} {{subject}} ever had any gynecologic surgeries or procedures?',
    type: 'single',
    section: 'Medical History',
    category: 'Gynecologic History',
    condition: (a) => parseInt(a['age_selection'] || '18') >= 18,
    options: ['Yes', 'No'],
  },
  {
    id: 'gyn_surgeries_list',
    text: 'Which procedures {{verb_have}} {{subject}} had?',
    type: 'multiple',
    section: 'Medical History',
    category: 'Gynecologic History',
    isSubQuestion: true,
    condition: (a) => a['ever_had_gyn_surgery'] === 'Yes' && parseInt(a['age_selection'] || '18') >= 18,
    options: [
      'HEADER:Minor or Diagnostic',
      'Laparoscopy',
      'Hysteroscopy',
      'D&C (Dilation and Curettage)',
      'LEEP or Cone Biopsy',
      'HEADER:Major or Therapeutic',
      'Hysterectomy (removal of uterus)',
      'Myomectomy (removal of fibroids)',
      'Oophorectomy (removal of ovaries)',
      'Ovarian Cystectomy (removal of cyst)',
      'Tubal Ligation or Salpingectomy',
      'Endometrial Ablation',
      'HEADER:Other',
      'Other'
    ],
  },

  // ---------------------------------------------------------
  // CHIEF COMPLAINT
  // ---------------------------------------------------------
  {
    id: 'primary_concerns',
    text: 'What health or wellness areas would you like to explore today?',
    type: 'multiple',
    section: 'About You',
    category: 'Intake',
    condition: (a) => parseInt(a['age_selection'] || '18') >= 18,
    options: [
      'HEADER:Menstrual Concerns',
      'Irregular or absent periods',
      'Heavy periods',
      'Painful periods',
      'Difficulty conceiving',
      'Desire to conceive',
      'Preparing for pregnancy',
      'HEADER:Postpartum Support',
      'Postpartum recovery/wellness',
      'Postpartum mood or anxiety concerns',
      'Postpartum physical symptoms (e.g., headache, swelling)',
      'HEADER:Other Areas',
      'PCOS symptoms',
      'Endometriosis symptoms',
      'Perimenopause/menopause symptoms',
      'Birth control decision',
      'Understanding the cycle better',
      'General reproductive wellness',
      'Seeking a second opinion',
      'Other'
    ],
  },
  {
    id: 'primary_concerns_teen',
    text: 'What health or wellness areas would you like to explore today?',
    type: 'multiple',
    section: 'About You',
    category: 'Intake',
    condition: (a) => parseInt(a['age_selection'] || '18') < 18,
    options: [
      'HEADER:Menstrual Concerns',
      'Irregular or absent periods',
      'Heavy periods',
      'Painful periods',
      'Understanding the cycle better',
      'HEADER:Other Areas',
      'PCOS symptoms',
      'Endometriosis symptoms',
      'Birth control decision',
      'General reproductive wellness',
      'Seeking a second opinion',
      'Other'
    ],
  },

  // ---------------------------------------------------------
  // FERTILITY FOLLOW-UP (If Difficulty Conceiving or Desire to conceive)
  // ---------------------------------------------------------
  {
    id: 'ttc_duration',
    text: 'How long {{verb_have}} {{subject}} been trying to conceive?',
    type: 'single',
    section: 'Fertility and Family Planning',
    category: 'Conception Attempts',
    condition: (a) => {
      const concerns = a['primary_concerns'] || [];
      return concerns.includes('Difficulty conceiving') || concerns.includes('Desire to conceive');
    },
    options: [
      'Less than 6 months',
      '6–12 months',
      '1–2 years',
      'More than 2 years'
    ],
  },
  {
    id: 'fertility_tracking_methods',
    text: 'Which methods {{verb_have}} {{subject}} used to track the fertile window?',
    type: 'multiple',
    section: 'Fertility and Family Planning',
    category: 'Conception Attempts',
    condition: (a) => {
      const concerns = a['primary_concerns'] || [];
      return concerns.includes('Difficulty conceiving') || concerns.includes('Desire to conceive');
    },
    options: [
      'Timed intercourse (based on cycle dates)',
      'Ovulation predictor kits (LH kits)',
      'Cervical mucus monitoring',
      'Basal body temperature (BBT) tracking',
      'Fertility tracking app',
      'HEADER:Other',
      'None of the above'
    ],
  },
  {
    id: 'fertility_evaluation_history',
    text: '{{Verb_have}} {{subject}} had any prior fertility evaluation or treatment?',
    type: 'multiple',
    section: 'Fertility and Family Planning',
    category: 'Conception Attempts',
    condition: (a) => {
      const concerns = a['primary_concerns'] || [];
      return concerns.includes('Difficulty conceiving') || concerns.includes('Desire to conceive');
    },
    options: [
      'Consultation with an OBGYN',
      'Consultation with a Fertility Specialist (REI)',
      'Hormone blood testing (e.g., AMH, Day 3 FSH)',
      'Uterine/Tubal imaging (e.g., HSG, Saline Ultrasound)',
      'Semen analysis (for partner)',
      'Fertility medications (e.g., Clomid, Letrozole)',
      'Advanced treatments (e.g., IUI, IVF)',
      'HEADER:Other',
      'No prior evaluation'
    ],
  },

  // ---------------------------------------------------------
  // MENSTRUAL HISTORY
  // ---------------------------------------------------------
  {
    id: 'period_typicality',
    text: 'What best describes {{possessive}} current menstrual status?',
    type: 'dropdown',
    section: 'Menstrual History',
    category: 'Cycle',
    options: [
      'Having menstrual cycles',
      'Previous had cycles but they have stopped',
      'Perimenopausal',
      'Menopausal/Postmenopausal',
      'Pregnant',
      'Postpartum',
      'Breastfeeding'
    ],
  },
  {
    id: 'cycle_length',
    text: 'How long is your typical menstrual cycle?',
    type: 'dropdown',
    section: 'Menstrual History',
    category: 'Cycle',
    condition: (a) => a['period_typicality'] === 'Having menstrual cycles' || a['period_typicality'] === 'Perimenopausal',
    options: [
      'Less than 21 days',
      '21-24 days',
      '25-30 days',
      '31-35 days',
      '36-40 days',
      'More than 40 days',
      'Varies significantly',
      'Not sure'
    ],
  },
  {
    id: 'menstrual_flow',
    text: 'How would you describe your menstrual flow?',
    type: 'dropdown',
    section: 'Menstrual History',
    category: 'Cycle',
    condition: (a) => a['period_typicality'] === 'Having menstrual cycles' || a['period_typicality'] === 'Perimenopausal',
    options: [
      'Very light',
      'Light',
      'Moderate',
      'Heavy (changing products every 1-2 hours)',
      'Very heavy (flooding or large clots)',
      'Not applicable'
    ],
  },

  // ---------------------------------------------------------
  // ASSOCIATED SYMPTOMS
  // ---------------------------------------------------------
  {
    id: 'pelvic_symptoms_current',
    text: "Select all symptoms {{subject}} {{verb_are}} currently experiencing:",
    type: 'multiple',
    section: 'Associated Symptoms', 
    category: 'Symptoms',
    options: [
      'HEADER:Pelvic & Reproductive',
      'Severe menstrual cramps',
      'Pelvic pain (not during period)',
      'Lower back pain',
      'Pain during intercourse',
      'Pain with bowel movements',
      'Pain with urination',
      'HEADER:Hormonal & Endocrine',
      'Excessive hair growth (face, abdomen)',
      'Moderate to severe acne',
      'Fatigue or low energy',
      'Unexplained weight changes',
      'Hot flashes',
      'Night sweats',
      'HEADER:Other',
      'None of these'
    ],
  },
  {
    id: 'pain_scale_0_10',
    text: "On a scale from 0 to 10, how bad is the pain during {{possessive}} period on the worst day?",
    type: 'single',
    section: 'Associated Symptoms',
    category: 'Pain Assessment',
    condition: (a) => {
      const symps = a['pelvic_symptoms_current'] || [];
      return symps.includes('Severe menstrual cramps') || symps.includes('Pelvic pain (not during period)');
    },
    options: [
      '0: no pain',
      '1–3: mild pain',
      '4–6: moderate pain',
      '7–10: severe pain'
    ]
  },

  // ---------------------------------------------------------
  // FINAL SUPPORT & EDUCATION
  // ---------------------------------------------------------
  {
    id: 'educational_interests',
    text: 'What health or wellness topics would {{subject}} like to learn more about?',
    type: 'multiple',
    section: 'Support',
    category: 'Education',
    options: [
      'Understanding the menstrual cycle',
      'PCOS and metabolic health',
      'Endometriosis and chronic pelvic pain',
      'Fertility and family planning',
      'Perimenopause and menopause transition',
      'Mental health and hormonal wellness',
      'Navigating healthcare and second opinions',
      'Nutrition and lifestyle for hormones',
      'Sexual health and wellness',
      'HEADER:Other',
      'Other'
    ],
  },
];

export const CONDITIONS_DB: Condition[] = [
  {
    id: 'endometriosis_wise',
    name: 'Endometriosis',
    description: 'Growth of uterine-like tissue outside the uterus, causing progressive cyclical or chronic pain, dyspareunia, and potential fertility challenges.',
    severity: 'Soon',
    triggers: [
      { questionId: 'primary_concerns', answerValue: ['Endometriosis symptoms', 'Painful periods', 'Difficulty conceiving'], weight: 40 },
      { questionId: 'pelvic_symptoms_current', answerValue: ['Severe menstrual cramps', 'Pain during intercourse', 'Pain with bowel movements', 'Pelvic pain (not during period)'], weight: 35 },
      { questionId: 'pain_scale_0_10', answerValue: ['7–10: severe pain', '4–6: moderate pain'], weight: 25 },
      { questionId: 'number_of_births', answerValue: ['0'], weight: 10 } // Nulliparity weight
    ],
    nextSteps: [
      'Discuss diagnostic imaging (MRI or TVUS with endo protocol).',
      'Consider consultation with a Minimally Invasive Gynecologic Surgeon (MIGS).',
      'Track GI symptoms specifically relative to menses.'
    ],
    providerQuestions: [
      "Could my cyclical bowel pain be linked to endometriosis?",
      "Is my pain level consistent with deep infiltrating endometriosis?",
      "Should we explore a diagnostic laparoscopy?"
    ],
    relevantTests: ["Specialized Pelvic MRI", "TVUS (Endometriosis Protocol)", "Laparoscopy"]
  },
  {
    id: 'adenomyosis_wise',
    name: 'Adenomyosis',
    description: 'Uterine lining tissue grows into the muscular wall of the uterus, often leading to a bulky uterus, heavy bleeding, and intense cramping.',
    severity: 'Soon',
    triggers: [
      { questionId: 'menstrual_flow', answerValue: ['Heavy (changing products every 1-2 hours)', 'Very heavy (flooding or large clots)'], weight: 50 },
      { questionId: 'pelvic_symptoms_current', answerValue: ['Severe menstrual cramps', 'Lower back pain'], weight: 30 },
      { questionId: 'number_of_births', answerValue: ['2', '3', '4', '5+'], weight: 15 } // Higher parity weight for Adeno
    ],
    nextSteps: [
      'Pelvic ultrasound to assess uterine size and texture.',
      'Discussion of hormonal management or surgical options.'
    ],
    providerQuestions: [
      "Is my uterus enlarged on exam or imaging?",
      "Could adenomyosis be the cause of my heavy flow and intense cramping?"
    ],
    relevantTests: ["Transvaginal Ultrasound", "Pelvic MRI"]
  },
  {
    id: 'pcos_wise',
    name: 'Polycystic Ovary Syndrome (PCOS)',
    description: 'A hormonal imbalance causing irregular cycles, excess androgen levels (acne/hirsutism), and metabolic shifts.',
    severity: 'Routine',
    triggers: [
      { questionId: 'cycle_length', answerValue: ['More than 40 days', 'Varies significantly'], weight: 60 },
      { questionId: 'pelvic_symptoms_current', answerValue: ['Excessive hair growth (face, abdomen)', 'Moderate to severe acne', 'Unexplained weight changes'], weight: 40 },
      { questionId: 'primary_concerns', answerValue: ['PCOS symptoms', 'Irregular or absent periods'], weight: 30 }
    ],
    nextSteps: [
      'Hormonal blood panel (Androgens, TSH, Prolactin).',
      'Glucose/Insulin screening.',
      'Evaluation for Rotterdam criteria.'
    ],
    providerQuestions: [
      "Do I meet the clinical criteria for PCOS diagnosis?",
      "How can we manage my cycle irregularity and androgen symptoms?"
    ],
    relevantTests: ["Total & Free Testosterone", "Fasting Glucose/HbA1c", "Pelvic Ultrasound"]
  }
];

export const EDUCATION_ARTICLES: EducationArticle[] = [
  { id: '1', title: 'Endometriosis: Beyond the Period', category: 'Clinical Insights', readTime: '6 min' },
  { id: '2', title: 'Navigating PCOS and Metabolic Health', category: 'Wellness', readTime: '5 min' },
  { id: '3', title: 'Adenomyosis vs Fibroids: What’s the Difference?', category: 'Clinical Insights', readTime: '7 min' }
];