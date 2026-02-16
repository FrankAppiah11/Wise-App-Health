/**
 * WISE PDF Export Service
 * 
 * Generates professional clinical reports including:
 * - Assessment results
 * - Symptom timeline
 * - Provider questions
 * - Red flags and recommendations
 * 
 * INSTALLATION REQUIRED:
 * npm install jspdf jspdf-autotable
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { AnalysisResult, UserProfile } from '../types';
import type { SymptomLog, CycleTracking } from './symptomTracker';

// Brand colors
const COLORS = {
  purple: '#6B54A7',
  pink: '#E89FC4',
  grey: '#F3F4F6',
  black: '#000000',
  white: '#FFFFFF',
  red: '#EF4444'
};

// ============================================================================
// MAIN PDF GENERATION FUNCTION
// ============================================================================

/**
 * Generate complete clinical report PDF
 */
export async function generateClinicalReport(data: {
  profile: UserProfile;
  analysisResult: AnalysisResult;
  symptomLogs?: SymptomLog[];
  cycleHistory?: CycleTracking[];
  doctorQuestions?: string[];
  aiInsights?: string;
  includeCharts?: boolean;
}): Promise<Blob> {
  
  const doc = new jsPDF();
  let yPos = 20;
  
  // Add header
  yPos = addHeader(doc, yPos);
  
  // Add patient information
  yPos = addPatientInfo(doc, data.profile, yPos);
  
  // Add assessment results
  yPos = addAssessmentResults(doc, data.analysisResult, yPos);
  
  // Add red flags if any
  if (data.analysisResult.redFlagMessages.length > 0) {
    yPos = addRedFlags(doc, data.analysisResult.redFlagMessages, yPos);
  }
  
  // Add symptom summary if available
  if (data.symptomLogs && data.symptomLogs.length > 0) {
    yPos = addSymptomSummary(doc, data.symptomLogs, yPos);
  }
  
  // Add doctor questions if provided
  if (data.doctorQuestions && data.doctorQuestions.length > 0) {
    yPos = addDoctorQuestions(doc, data.doctorQuestions, yPos);
  }
  
  // Add AI insights if provided
  if (data.aiInsights) {
    yPos = addAIInsights(doc, data.aiInsights, yPos);
  }
  
  // Add recommended tests
  yPos = addRecommendedTests(doc, data.analysisResult, yPos);
  
  // Add footer
  addFooter(doc);
  
  // Return as blob
  return doc.output('blob');
}

// ============================================================================
// SECTION BUILDERS
// ============================================================================

/**
 * Add header with WISE branding
 */
function addHeader(doc: jsPDF, yPos: number): number {
  // Logo/Title area
  doc.setFillColor(COLORS.purple);
  doc.rect(0, 0, 210, 40, 'F');
  
  // WISE Title
  doc.setTextColor(COLORS.white);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('WISE', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Women Informed Strong Engaged', 20, 27);
  
  // Report type
  doc.setFontSize(12);
  doc.text('Clinical Assessment Report', 20, 35);
  
  // Date
  doc.setFontSize(9);
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated: ${today}`, 150, 35);
  
  return 50; // New Y position
}

/**
 * Add patient information
 */
function addPatientInfo(doc: jsPDF, profile: UserProfile, yPos: number): number {
  doc.setTextColor(COLORS.black);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 20, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const info = [
    `Name: ${profile.name || 'Not provided'}`,
    `Age: ${profile.age || 'Not provided'}`,
    `Date of Assessment: ${new Date().toLocaleDateString()}`
  ];
  
  info.forEach(line => {
    doc.text(line, 25, yPos);
    yPos += 6;
  });
  
  yPos += 5;
  return yPos;
}

/**
 * Add assessment results section
 */
function addAssessmentResults(doc: jsPDF, result: AnalysisResult, yPos: number): number {
  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  // Section title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Assessment Results', 20, yPos);
  yPos += 7;
  
  // Triage status box
  doc.setFillColor(getTriageColor(result.triageStatus));
  doc.roundedRect(20, yPos, 170, 12, 2, 2, 'F');
  doc.setTextColor(COLORS.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Triage Status: ${result.triageStatus.toUpperCase()}`, 25, yPos + 8);
  
  yPos += 18;
  doc.setTextColor(COLORS.black);
  
  // Summary
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(result.summary, 170);
  doc.text(summaryLines, 20, yPos);
  yPos += (summaryLines.length * 6) + 8;
  
  // Ranked conditions
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Differential Diagnosis:', 20, yPos);
  yPos += 7;
  
  // Table of conditions
  const tableData = result.rankedConditions.map((rc, idx) => [
    `${idx + 1}.`,
    rc.condition.name,
    `${rc.probability}%`,
    rc.condition.severity
  ]);
  
  (doc as any).autoTable({
    startY: yPos,
    head: [['#', 'Condition', 'Match', 'Urgency']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: COLORS.purple,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 90 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 }
    },
    margin: { left: 20, right: 20 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  return yPos;
}

/**
 * Add red flags section
 */
function addRedFlags(doc: jsPDF, redFlags: string[], yPos: number): number {
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }
  
  // Warning box
  doc.setFillColor('#FEE2E2'); // Light red
  doc.setDrawColor(COLORS.red);
  doc.setLineWidth(1);
  doc.roundedRect(20, yPos, 170, 8 + (redFlags.length * 6), 2, 2, 'FD');
  
  yPos += 6;
  doc.setTextColor(COLORS.red);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠ Clinical Alerts', 25, yPos);
  
  yPos += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  redFlags.forEach(flag => {
    const lines = doc.splitTextToSize(flag, 160);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5;
  });
  
  doc.setTextColor(COLORS.black);
  yPos += 10;
  return yPos;
}

/**
 * Add symptom summary
 */
function addSymptomSummary(doc: jsPDF, logs: SymptomLog[], yPos: number): number {
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Symptom Tracking Summary (Last 30 Days)', 20, yPos);
  yPos += 7;
  
  // Calculate statistics
  const avgPain = logs.reduce((sum, log) => sum + (log.pain_level || 0), 0) / Math.max(logs.length, 1);
  const daysWithPain = logs.filter(l => l.pain_level && l.pain_level >= 5).length;
  const daysWithHeavyFlow = logs.filter(l => l.flow_level === 'heavy' || l.flow_level === 'very_heavy').length;
  
  // Most common symptoms
  const symptomCounts = new Map<string, number>();
  logs.forEach(log => {
    if (log.symptoms) {
      log.symptoms.forEach(symptom => {
        symptomCounts.set(symptom, (symptomCounts.get(symptom) || 0) + 1);
      });
    }
  });
  
  const topSymptoms = Array.from(symptomCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const stats = [
    `Total Days Tracked: ${logs.length}`,
    `Average Pain Level: ${avgPain.toFixed(1)}/10`,
    `Days with Significant Pain (≥5/10): ${daysWithPain}`,
    `Days with Heavy Flow: ${daysWithHeavyFlow}`,
    '',
    'Most Common Symptoms:',
    ...topSymptoms.map(([symptom, count]) => `  • ${symptom} (${count} occurrences)`)
  ];
  
  stats.forEach(line => {
    doc.text(line, 25, yPos);
    yPos += 6;
  });
  
  yPos += 5;
  return yPos;
}

/**
 * Add doctor questions section
 */
function addDoctorQuestions(doc: jsPDF, questions: string[], yPos: number): number {
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Questions to Ask Your Provider', 20, yPos);
  yPos += 7;
  
  doc.setFillColor(COLORS.grey);
  doc.roundedRect(20, yPos, 170, 8 + (questions.length * 7), 2, 2, 'F');
  
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  questions.forEach((q, idx) => {
    const questionText = `${idx + 1}. ${q}`;
    const lines = doc.splitTextToSize(questionText, 160);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 6 + 2;
  });
  
  yPos += 8;
  return yPos;
}

/**
 * Add AI insights section
 */
function addAIInsights(doc: jsPDF, insights: string, yPos: number): number {
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('AI-Generated Insights', 20, yPos);
  yPos += 7;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  
  const lines = doc.splitTextToSize(insights, 170);
  doc.text(lines, 20, yPos);
  
  doc.setTextColor(COLORS.black);
  yPos += (lines.length * 5) + 10;
  return yPos;
}

/**
 * Add recommended tests section
 */
function addRecommendedTests(doc: jsPDF, result: AnalysisResult, yPos: number): number {
  if (yPos > 230) {
    doc.addPage();
    yPos = 20;
  }
  
  const topCondition = result.rankedConditions[0]?.condition;
  if (!topCondition) return yPos;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Clinical Evaluation', 20, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Get recommended tests from condition
  const tests = getRecommendedTests(topCondition.name);
  
  tests.forEach(test => {
    doc.text(`• ${test}`, 25, yPos);
    yPos += 6;
  });
  
  yPos += 5;
  return yPos;
}

/**
 * Add footer with disclaimer
 */
function addFooter(doc: jsPDF): void {
  const pageCount = doc.internal.pages.length - 1;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(COLORS.purple);
    doc.setLineWidth(0.5);
    doc.line(20, 280, 190, 280);
    
    // Disclaimer
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    
    const disclaimer = 'This report is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare provider.';
    const lines = doc.splitTextToSize(disclaimer, 170);
    doc.text(lines, 20, 285);
    
    // Page number
    doc.text(`Page ${i} of ${pageCount}`, 180, 285);
    
    // WISE branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(COLORS.purple);
    doc.text('WISE', 20, 290);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color for triage status
 */
function getTriageColor(status: string): number[] {
  switch (status) {
    case 'Emergency':
      return [239, 68, 68]; // Red
    case 'Urgent':
      return [245, 158, 11]; // Orange
    case 'Soon':
      return [234, 179, 8]; // Yellow
    case 'Routine':
      return [107, 84, 167]; // Purple
    default:
      return [156, 163, 175]; // Gray
  }
}

/**
 * Get recommended tests for a condition
 */
function getRecommendedTests(conditionName: string): string[] {
  const testMap: Record<string, string[]> = {
    'Endometriosis': [
      'Pelvic ultrasound (transvaginal)',
      'MRI pelvis (if ultrasound inconclusive)',
      'CA-125 blood test (adjunctive)',
      'Laparoscopy with biopsy (gold standard for diagnosis)'
    ],
    'PCOS': [
      'Pelvic ultrasound',
      'Testosterone (total and free)',
      'DHEA-S',
      'LH and FSH levels',
      'Fasting glucose and insulin',
      'Lipid panel'
    ],
    'Adenomyosis': [
      'Transvaginal ultrasound',
      'MRI pelvis',
      'CA-125 (if considering endometriosis)',
      'CBC (to assess for anemia)'
    ],
    'Pelvic Inflammatory Disease': [
      'Pelvic exam',
      'Cervical cultures (gonorrhea, chlamydia)',
      'Vaginal wet mount',
      'CBC with differential',
      'ESR or CRP',
      'Pregnancy test',
      'Pelvic ultrasound (if tubo-ovarian abscess suspected)'
    ],
    'Uterine Fibroids': [
      'Pelvic ultrasound',
      'MRI pelvis (for surgical planning)',
      'CBC (to check for anemia)',
      'Hysteroscopy (for submucosal fibroids)'
    ]
  };
  
  // Find matching condition
  for (const [key, tests] of Object.entries(testMap)) {
    if (conditionName.includes(key)) {
      return tests;
    }
  }
  
  // Default tests
  return [
    'Comprehensive pelvic examination',
    'Pelvic ultrasound',
    'Complete blood count (CBC)',
    'Hormone panel if indicated'
  ];
}

// ============================================================================
// QUICK EXPORT FUNCTIONS
// ============================================================================

/**
 * Generate and download PDF
 */
export async function downloadClinicalReport(
  data: Parameters<typeof generateClinicalReport>[0],
  filename?: string
): Promise<void> {
  const blob = await generateClinicalReport(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `WISE_Clinical_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF for email/sharing
 */
export async function generatePDFForSharing(
  data: Parameters<typeof generateClinicalReport>[0]
): Promise<{ blob: Blob; base64: string }> {
  const blob = await generateClinicalReport(data);
  
  // Convert to base64 for email attachments
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve) => {
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
  
  const base64 = await base64Promise;
  
  return { blob, base64 };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generateClinicalReport,
  downloadClinicalReport,
  generatePDFForSharing
};
