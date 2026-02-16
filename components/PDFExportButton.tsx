/**
 * PDF Export Button Component
 * 
 * Generates and downloads comprehensive clinical report
 */

import React, { useState } from 'react';
import { Download, FileText, Loader2, Check } from 'lucide-react';
import pdfExport from '../services/pdfExport';
import geminiService from '../services/geminiService';
import { getSymptomLogs, getCycleHistory } from '../services/symptomTracker';
import { getAnonymousId } from '../services/db';
import type { AnalysisResult, UserProfile } from '../types';

interface PDFExportButtonProps {
  analysisResult: AnalysisResult;
  userProfile: UserProfile;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  includeAIInsights?: boolean;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  analysisResult,
  userProfile,
  variant = 'primary',
  fullWidth = false,
  includeAIInsights = true
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    
    try {
      const anonymousId = getAnonymousId();
      
      // Get symptom logs (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const symptomLogs = await getSymptomLogs(anonymousId, startDate);
      
      // Get cycle history
      const cycleHistory = await getCycleHistory(anonymousId, 6);
      
      // Generate AI content if requested
      let doctorQuestions: string[] | undefined;
      let aiInsights: string | undefined;
      
      if (includeAIInsights) {
        try {
          // Generate doctor questions
          doctorQuestions = await geminiService.generateDoctorQuestions(
            analysisResult,
            symptomLogs,
            userProfile.age || 28
          );
          
          // Generate insights if we have symptom data
          if (symptomLogs.length > 0) {
            aiInsights = await geminiService.analyzeSymptomPatterns(
              symptomLogs,
              userProfile.age || 28
            );
          }
        } catch (error) {
          console.warn('Could not generate AI insights:', error);
          // Continue without AI insights
        }
      }
      
      // Generate and download PDF
      await pdfExport.downloadClinicalReport({
        profile: userProfile,
        analysisResult,
        symptomLogs: symptomLogs.length > 0 ? symptomLogs : undefined,
        cycleHistory: cycleHistory.length > 0 ? cycleHistory : undefined,
        doctorQuestions,
        aiInsights,
        includeCharts: true
      });
      
      // Show success
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please make sure you have an internet connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const baseClasses = `
    flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider
    transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = variant === 'primary'
    ? 'bg-brand-purple text-white hover:bg-brand-pink hover:text-brand-black shadow-lg hover:shadow-xl'
    : 'bg-white text-brand-purple border-2 border-brand-purple hover:bg-brand-purple hover:text-white';

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className={`${baseClasses} ${variantClasses}`}
    >
      {isGenerating ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Generating PDF...
        </>
      ) : success ? (
        <>
          <Check size={20} />
          Downloaded!
        </>
      ) : (
        <>
          <Download size={20} />
          Export PDF Report
        </>
      )}
    </button>
  );
};

/**
 * Compact PDF Export Button (for toolbars, etc.)
 */
export const PDFExportIconButton: React.FC<{
  analysisResult: AnalysisResult;
  userProfile: UserProfile;
}> = ({ analysisResult, userProfile }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    
    try {
      const anonymousId = getAnonymousId();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const symptomLogs = await getSymptomLogs(anonymousId, startDate);
      
      await pdfExport.downloadClinicalReport({
        profile: userProfile,
        analysisResult,
        symptomLogs: symptomLogs.length > 0 ? symptomLogs : undefined
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className="p-3 bg-brand-purple text-white rounded-xl hover:bg-brand-pink hover:text-brand-black transition-all disabled:opacity-50"
      title="Export PDF Report"
    >
      {isGenerating ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <FileText size={20} />
      )}
    </button>
  );
};

/**
 * PDF Preview Card Component
 */
export const PDFPreviewCard: React.FC<{
  analysisResult: AnalysisResult;
  userProfile: UserProfile;
}> = ({ analysisResult, userProfile }) => {
  return (
    <div className="bg-gradient-to-br from-brand-purple/5 to-brand-pink/5 p-6 rounded-3xl border border-brand-purple/10">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-brand-purple/10 rounded-2xl flex items-center justify-center shrink-0">
          <FileText size={24} className="text-brand-purple" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-serif font-black text-brand-purple">Clinical Report Ready</h3>
            <p className="text-sm text-brand-purple/60 font-medium mt-1">
              Download a comprehensive PDF report to share with your healthcare provider
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs text-brand-purple/50 font-bold">
            <span className="flex items-center gap-1">
              <Check size={12} />
              Assessment Results
            </span>
            <span className="flex items-center gap-1">
              <Check size={12} />
              Symptom Timeline
            </span>
            <span className="flex items-center gap-1">
              <Check size={12} />
              Provider Questions
            </span>
            <span className="flex items-center gap-1">
              <Check size={12} />
              AI Insights
            </span>
          </div>
          
          <PDFExportButton
            analysisResult={analysisResult}
            userProfile={userProfile}
            variant="primary"
            includeAIInsights={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFExportButton;
