/**
 * AI Assistant Component
 * 
 * Provides AI-powered insights on assessment results using Gemini
 */

import React, { useState } from 'react';
import { Sparkles, MessageCircle, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import geminiService from '../services/geminiService';
import type { AnalysisResult, UserProfile } from '../types';
import type { SymptomLog } from '../services/symptomTracker';

interface AIAssistantProps {
  analysisResult: AnalysisResult;
  userProfile: UserProfile;
  symptomLogs?: SymptomLog[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  analysisResult,
  userProfile,
  symptomLogs = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'explanation' | 'questions' | 'patterns' | 'chat'>('explanation');
  
  const [explanation, setExplanation] = useState<string>('');
  const [doctorQuestions, setDoctorQuestions] = useState<string[]>([]);
  const [patterns, setPatterns] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set());

  const loadSection = async (section: string) => {
    if (loadedSections.has(section)) return;
    
    setIsLoading(true);
    try {
      switch (section) {
        case 'explanation':
          const exp = await geminiService.explainAssessmentResults(analysisResult, userProfile.age || 28);
          setExplanation(exp);
          break;
        
        case 'questions':
          const qs = await geminiService.generateDoctorQuestions(analysisResult, symptomLogs, userProfile.age || 28);
          setDoctorQuestions(qs);
          break;
        
        case 'patterns':
          if (symptomLogs.length > 0) {
            const pat = await geminiService.analyzeSymptomPatterns(symptomLogs, userProfile.age || 28);
            setPatterns(pat);
          }
          break;
      }
      
      setLoadedSections(prev => new Set([...prev, section]));
    } catch (error) {
      console.error('Error loading AI section:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionChange = (section: typeof activeSection) => {
    setActiveSection(section);
    loadSection(section);
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    
    setIsLoading(true);
    try {
      const response = await geminiService.answerQuestion(userMessage, {
        analysisResult,
        recentSymptoms: symptomLogs,
        userAge: userProfile.age
      });
      
      setChatMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'I apologize, I\'m having trouble responding right now. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => {
          setIsExpanded(true);
          loadSection('explanation');
        }}
        className="w-full p-6 bg-gradient-to-r from-brand-purple to-brand-pink rounded-3xl shadow-xl hover:shadow-2xl transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} className="text-white animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-serif font-black text-white">AI Assistant</h3>
              <p className="text-sm text-white/80 font-medium">Get personalized insights about your results</p>
            </div>
          </div>
          <ChevronDown size={24} className="text-white group-hover:translate-y-1 transition-transform" />
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-purple/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-pink p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-black text-white">AI Assistant</h3>
              <p className="text-sm text-white/80 font-medium">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronUp size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-purple/10 bg-brand-grey/20">
        {[
          { id: 'explanation', label: 'Explain Results', icon: Sparkles },
          { id: 'questions', label: 'Doctor Questions', icon: MessageCircle },
          ...(symptomLogs.length > 0 ? [{ id: 'patterns', label: 'Patterns', icon: Sparkles }] : []),
          { id: 'chat', label: 'Ask Questions', icon: MessageCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleSectionChange(tab.id as typeof activeSection)}
            className={`flex-1 py-4 px-4 text-sm font-bold uppercase tracking-wider transition-all ${
              activeSection === tab.id
                ? 'bg-white text-brand-purple border-b-4 border-brand-pink'
                : 'text-brand-purple/40 hover:text-brand-purple hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {isLoading && !loadedSections.has(activeSection) ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 size={40} className="text-brand-purple animate-spin" />
            <p className="text-brand-purple/60 text-sm font-medium">Analyzing with AI...</p>
          </div>
        ) : (
          <>
            {/* Explanation Section */}
            {activeSection === 'explanation' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles size={20} className="text-brand-pink mt-1 shrink-0" />
                  <div className="prose prose-sm max-w-none">
                    <p className="text-brand-purple/80 leading-relaxed whitespace-pre-wrap">
                      {explanation || 'Click to load explanation...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Doctor Questions Section */}
            {activeSection === 'questions' && (
              <div className="space-y-4">
                {doctorQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {doctorQuestions.map((q, idx) => (
                      <div key={idx} className="flex gap-3 p-4 bg-brand-grey/30 rounded-2xl">
                        <div className="w-6 h-6 bg-brand-purple text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-brand-purple text-sm font-medium leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-purple/60 text-sm">Loading questions...</p>
                )}
              </div>
            )}

            {/* Patterns Section */}
            {activeSection === 'patterns' && symptomLogs.length > 0 && (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-brand-purple/80 leading-relaxed whitespace-pre-wrap">
                    {patterns || 'Loading pattern analysis...'}
                  </p>
                </div>
              </div>
            )}

            {/* Chat Section */}
            {activeSection === 'chat' && (
              <div className="space-y-4">
                {/* Chat messages */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8 text-brand-purple/40 text-sm">
                      Ask me anything about your results, symptoms, or reproductive health!
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                            msg.role === 'user'
                              ? 'bg-brand-pink text-brand-black font-medium rounded-tr-none'
                              : 'bg-brand-purple/10 text-brand-purple rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-brand-purple/10 p-4 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-3 border-2 border-brand-purple/20 rounded-2xl focus:border-brand-pink focus:outline-none text-brand-purple placeholder:text-brand-purple/30 font-medium"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleChat}
                    disabled={!chatInput.trim() || isLoading}
                    className="px-6 py-3 bg-brand-purple text-white rounded-2xl font-bold hover:bg-brand-pink hover:text-brand-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
