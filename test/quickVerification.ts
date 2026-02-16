/**
 * WISE App - Quick Verification Tests
 * 
 * Run this to verify survey questions and enhanced analysis engine work together
 * 
 * To run: 
 * 1. Import this file in your App.tsx or a test file
 * 2. Call runQuickTests() 
 * 3. Check console for results
 */

import { CONDITIONS_DB, SURVEY_QUESTIONS } from './constants';
import { analyzeSymptoms } from './services/enhancedAnalysisEngine';
import { UserProfile } from './types';

/**
 * Test 1: Verify all question IDs referenced in conditions database exist in survey
 */
export function testQuestionCoverage(): { passed: boolean; missing: string[] } {
  console.log('🧪 TEST 1: Question Coverage Check');
  
  const questionIds = new Set(SURVEY_QUESTIONS.map(q => q.id));
  const missingQuestions: string[] = [];
  
  // Check all triggers in conditions database
  for (const condition of CONDITIONS_DB) {
    for (const trigger of condition.triggers) {
      if (!questionIds.has(trigger.questionId)) {
        missingQuestions.push(`${condition.id} → ${trigger.questionId}`);
      }
    }
    
    // Check red flags
    if (condition.redFlags) {
      for (const redFlag of condition.redFlags) {
        if (!questionIds.has(redFlag.questionId)) {
          missingQuestions.push(`${condition.id} (red flag) → ${redFlag.questionId}`);
        }
      }
    }
  }
  
  if (missingQuestions.length === 0) {
    console.log('✅ All condition triggers reference valid question IDs');
    return { passed: true, missing: [] };
  } else {
    console.error('❌ Missing question IDs:', missingQuestions);
    return { passed: false, missing: missingQuestions };
  }
}

/**
 * Test 2: Emergency Detection - Ectopic Pregnancy
 */
export function testEctopicDetection(): boolean {
  console.log('\n🧪 TEST 2: Ectopic Pregnancy Emergency Detection');
  
  const testProfile: UserProfile = {
    id: 'test-user',
    anonymous_id: 'test-anon',
    name: 'Test User',
    age: 28,
    created_at: new Date().toISOString()
  };
  
  const ectopicAnswers = {
    pregnancy_test_recent: 'Positive',
    pain_scale_0_10: '7–10: severe pain',
    pain_onset: 'Sudden (within minutes to hours)',
    pain_location: ['One-sided lower abdomen (right or left)', 'Shoulder pain'],
    systemic_symptoms: ['Lightheadedness/dizziness'],
    age_selection: '28'
  };
  
  const result = analyzeSymptoms(ectopicAnswers, testProfile, '2026-02-16');
  
  const isEmergency = result.triageStatus === 'Emergency';
  const isEctopic = result.rankedConditions[0]?.condition.id === 'ectopic_pregnancy';
  const hasRedFlag = result.redFlagMessages.some(msg => msg.includes('EMERGENCY'));
  
  if (isEmergency && isEctopic && hasRedFlag) {
    console.log('✅ Ectopic pregnancy correctly detected as EMERGENCY');
    console.log('   Triage:', result.triageStatus);
    console.log('   Top condition:', result.rankedConditions[0]?.condition.name);
    console.log('   Red flag:', result.redFlagMessages[0]?.substring(0, 100) + '...');
    return true;
  } else {
    console.error('❌ Ectopic pregnancy NOT detected correctly');
    console.error('   Expected: Emergency triage, ectopic_pregnancy condition, red flag');
    console.error('   Got:', {
      triage: result.triageStatus,
      topCondition: result.rankedConditions[0]?.condition.id,
      hasRedFlag
    });
    return false;
  }
}

/**
 * Test 3: Urgent Detection - PID with High Fever
 */
export function testPIDDetection(): boolean {
  console.log('\n🧪 TEST 3: PID (High Fever) Urgent Detection');
  
  const testProfile: UserProfile = {
    id: 'test-user',
    anonymous_id: 'test-anon',
    name: 'Test User',
    age: 24,
    created_at: new Date().toISOString()
  };
  
  const pidAnswers = {
    fever_present: 'Yes',
    fever_temp: 'Above 102°F (high)',
    pelvic_symptoms_current: ['Lower abdominal pain (both sides)', 'Abnormal vaginal discharge'],
    pain_scale_0_10: '7–10: severe pain',
    sexual_activity_status: 'Sexually active',
    new_sexual_partners: 'Yes (within last 6 months)',
    age_selection: '24'
  };
  
  const result = analyzeSymptoms(pidAnswers, testProfile, '2026-02-16');
  
  const isUrgent = result.triageStatus === 'Urgent' || result.triageStatus === 'Emergency';
  const isPID = result.rankedConditions[0]?.condition.id === 'pelvic_inflammatory_disease';
  const hasRedFlag = result.redFlagMessages.some(msg => msg.includes('URGENT') || msg.includes('fever'));
  
  if (isUrgent && isPID && hasRedFlag) {
    console.log('✅ PID correctly detected as URGENT');
    console.log('   Triage:', result.triageStatus);
    console.log('   Top condition:', result.rankedConditions[0]?.condition.name);
    console.log('   Probability:', result.rankedConditions[0]?.probability + '%');
    return true;
  } else {
    console.error('❌ PID NOT detected correctly');
    console.error('   Expected: Urgent triage, PID condition');
    console.error('   Got:', {
      triage: result.triageStatus,
      topCondition: result.rankedConditions[0]?.condition.id,
      hasRedFlag
    });
    return false;
  }
}

/**
 * Test 4: PCOS with Age/Risk Factor Adjustments
 */
export function testPCOSAdjustments(): boolean {
  console.log('\n🧪 TEST 4: PCOS with Risk Factor Adjustments');
  
  const testProfile: UserProfile = {
    id: 'test-user',
    anonymous_id: 'test-anon',
    name: 'Test User',
    age: 22,
    created_at: new Date().toISOString()
  };
  
  const pcosAnswers = {
    cycle_length: 'More than 40 days',
    pelvic_symptoms_current: ['Excessive hair growth (face, abdomen)', 'Moderate to severe acne'],
    primary_concerns: ['PCOS symptoms', 'Irregular or absent periods'],
    age_selection: '22', // Peak age for PCOS
    obesity_status: 'Obese (BMI >30)', // Risk factor
    family_history_pcos: 'Yes' // Risk factor
  };
  
  const result = analyzeSymptoms(pcosAnswers, testProfile, '2026-02-16');
  
  const isPCOS = result.rankedConditions[0]?.condition.id === 'pcos_wise';
  const highProbability = (result.rankedConditions[0]?.probability || 0) >= 70;
  
  if (isPCOS && highProbability) {
    console.log('✅ PCOS correctly identified with risk factor adjustments');
    console.log('   Top condition:', result.rankedConditions[0]?.condition.name);
    console.log('   Probability:', result.rankedConditions[0]?.probability + '%');
    console.log('   (Age 22 and obesity should boost probability)');
    return true;
  } else {
    console.error('❌ PCOS NOT detected correctly or probability too low');
    console.error('   Expected: PCOS top condition with high probability');
    console.error('   Got:', {
      topCondition: result.rankedConditions[0]?.condition.id,
      probability: result.rankedConditions[0]?.probability
    });
    return false;
  }
}

/**
 * Test 5: Hemorrhage Detection
 */
export function testHemorrhageDetection(): boolean {
  console.log('\n🧪 TEST 5: Severe Hemorrhage Detection');
  
  const testProfile: UserProfile = {
    id: 'test-user',
    anonymous_id: 'test-anon',
    name: 'Test User',
    age: 35,
    created_at: new Date().toISOString()
  };
  
  const hemorrhageAnswers = {
    menstrual_flow: 'Very heavy (flooding or large clots)',
    pad_changes_hourly: 'Yes - soaking through in less than 1 hour',
    clot_size: 'Larger than golf ball',
    systemic_symptoms: ['Lightheadedness/dizziness', 'Severe weakness'],
    heart_racing: 'Yes - rapid heart rate or palpitations',
    age_selection: '35'
  };
  
  const result = analyzeSymptoms(hemorrhageAnswers, testProfile, '2026-02-16');
  
  const isUrgentOrEmergency = result.triageStatus === 'Urgent' || result.triageStatus === 'Emergency';
  const hasRedFlag = result.redFlagMessages.some(msg => 
    msg.includes('soaking through') || msg.includes('bleeding')
  );
  
  if (isUrgentOrEmergency && hasRedFlag) {
    console.log('✅ Severe hemorrhage correctly flagged');
    console.log('   Triage:', result.triageStatus);
    console.log('   Red flags detected:', result.redFlagMessages.length);
    return true;
  } else {
    console.error('❌ Hemorrhage NOT detected correctly');
    console.error('   Expected: Urgent/Emergency triage with red flags');
    console.error('   Got:', {
      triage: result.triageStatus,
      redFlagCount: result.redFlagMessages.length
    });
    return false;
  }
}

/**
 * Run all tests
 */
export function runAllTests(): boolean {
  console.log('🚀 WISE App - Verification Tests\n');
  console.log('='.repeat(60));
  
  const results = {
    questionCoverage: testQuestionCoverage(),
    ectopic: testEctopicDetection(),
    pid: testPIDDetection(),
    pcos: testPCOSAdjustments(),
    hemorrhage: testHemorrhageDetection()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS SUMMARY:');
  console.log('='.repeat(60));
  console.log('Question Coverage:', results.questionCoverage.passed ? '✅ PASS' : '❌ FAIL');
  console.log('Ectopic Detection:', results.ectopic ? '✅ PASS' : '❌ FAIL');
  console.log('PID Detection:', results.pid ? '✅ PASS' : '❌ FAIL');
  console.log('PCOS Adjustments:', results.pcos ? '✅ PASS' : '❌ FAIL');
  console.log('Hemorrhage Detection:', results.hemorrhage ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = results.questionCoverage.passed && 
                    results.ectopic && 
                    results.pid && 
                    results.pcos && 
                    results.hemorrhage;
  
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Survey questions and analysis engine are working correctly!');
  } else {
    console.log('⚠️ SOME TESTS FAILED');
    console.log('Please review the errors above and fix the issues.');
  }
  console.log('='.repeat(60));
  
  return allPassed;
}

/**
 * Quick diagnostic info
 */
export function printDiagnosticInfo(): void {
  console.log('\n📋 DIAGNOSTIC INFO:');
  console.log('='.repeat(60));
  console.log('Total Survey Questions:', SURVEY_QUESTIONS.length);
  console.log('Total Conditions:', CONDITIONS_DB.length);
  console.log('Emergency Conditions:', CONDITIONS_DB.filter(c => c.severity === 'Emergency').length);
  console.log('Urgent Conditions:', CONDITIONS_DB.filter(c => c.severity === 'Urgent').length);
  console.log('Soon Conditions:', CONDITIONS_DB.filter(c => c.severity === 'Soon').length);
  console.log('Routine Conditions:', CONDITIONS_DB.filter(c => c.severity === 'Routine').length);
  console.log('='.repeat(60));
}

// Export for easy testing
export default {
  runAllTests,
  printDiagnosticInfo,
  testQuestionCoverage,
  testEctopicDetection,
  testPIDDetection,
  testPCOSAdjustments,
  testHemorrhageDetection
};
