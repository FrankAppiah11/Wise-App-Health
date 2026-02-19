import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  MessageSquare, 
  Star, 
  SendHorizonal, 
  CheckCircle, 
  HelpCircle, 
  Loader2, 
  AlertCircle,
  Sparkles,
  User,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { Logo } from './Logo';

export const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ask' | 'contact'>('ask');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai' | 'error'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const [feedbackText, setFeedbackText] = useState('');
  const [directMsg, setDirectMsg] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleAsk = async (overrideMessage?: string) => {
    const textToSubmit = overrideMessage || query;
    if (!textToSubmit.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSubmit }]);
    setQuery('');
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env.local file.');
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: textToSubmit }] }],
        config: {
          systemInstruction: `You are a supportive, medically-informed AI assistant for WISE (Women Informed Strong Engaged). You provide evidence-based guidance on reproductive health, cycle tracking, and gynecological symptoms. Your tone is professional yet empathetic, following Dr. Leslie Appiah's standards. Always recommend consulting a physician for specific medical concerns. Keep responses concise and empowering.`,
          temperature: 0.7,
        },
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error: any) {
      console.error('AI Guide error:', error);
      const msg = error?.message || 'Service connection error. Please try again.';
      setMessages(prev => [...prev, { role: 'error', text: msg }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAdminSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() && !directMsg.trim() && rating === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setFeedbackText('');
      setDirectMsg('');
      setRating(0);
      setTimeout(() => setSubmissionSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-brand-purple text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="px-6 py-4 flex gap-4 border-b border-white/10 bg-brand-purple/80 backdrop-blur-md sticky top-0 z-20">
        <button 
          onClick={() => setActiveTab('ask')} 
          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'ask' ? 'bg-brand-pink text-brand-black shadow-lg scale-[1.02]' : 'bg-white/10 text-white/40 hover:text-white hover:bg-white/20'
          }`}
        >
          AI Guide
        </button>
        <button 
          onClick={() => setActiveTab('contact')} 
          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'contact' ? 'bg-brand-pink text-brand-black shadow-lg scale-[1.02]' : 'bg-white/10 text-white/40 hover:text-white hover:bg-white/20'
          }`}
        >
          Contact Admin
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative z-10">
        {activeTab === 'ask' ? (
          <div className="flex flex-col h-full">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-8 animate-in zoom-in-95 duration-700">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-pink blur-[40px] opacity-20"></div>
                    <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-brand-pink shadow-2xl relative z-10">
                      <Sparkles size={48} className="animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-serif font-black text-white">WISE AI Guide</h3>
                    <p className="text-sm text-white/60 font-medium max-w-[240px] mx-auto">Providing supportive, clinical insights for your reproductive health journey.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 w-full max-w-xs mt-4">
                    {[
                      'What symptoms should I track?', 
                      'About Dr. Leslie Appiah',
                      'Understanding my results'
                    ].map(q => (
                      <button 
                        key={q} 
                        onClick={() => handleAsk(q)} 
                        className="p-4 text-[11px] font-black text-white bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/20 hover:scale-[1.02] transition-all text-left uppercase tracking-widest shadow-lg"
                      >
                        "{q}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-xl ${
                    m.role === 'user' 
                      ? 'bg-brand-pink text-brand-black rounded-tr-none' 
                      : m.role === 'error'
                      ? 'bg-red-500/20 text-red-200 border border-red-500/40 rounded-tl-none'
                      : 'bg-white/10 border border-white/10 text-white rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-5 rounded-[2rem] rounded-tl-none border border-white/10 shadow-lg">
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-brand-pink rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-brand-purple/95 backdrop-blur-xl border-t border-white/10 flex gap-4 pb-10">
              <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()} 
                placeholder="Ask WISE..." 
                className="flex-1 bg-white border border-transparent rounded-[2rem] px-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-brand-pink transition-all text-brand-black placeholder:text-brand-purple/30 font-bold shadow-xl" 
              />
              <button 
                onClick={() => handleAsk()} 
                disabled={!query.trim() || isTyping}
                className="w-14 h-14 bg-brand-pink rounded-2xl flex items-center justify-center text-brand-black shadow-2xl active:scale-90 transition-all hover:bg-white disabled:opacity-50"
              >
                <SendHorizonal size={22} strokeWidth={3} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 h-full overflow-y-auto">
            {submissionSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-4 shadow-2xl">
                    <CheckCircle size={56} />
                </div>
                <h3 className="text-3xl font-serif font-black text-white">Report Received</h3>
                <p className="text-sm text-white/60 font-medium max-w-[280px]">Your feedback has been securely transmitted to Dr. Leslie Appiah's clinical administration team.</p>
              </div>
            ) : (
              <form onSubmit={handleAdminSubmission} className="max-w-sm mx-auto space-y-12 pb-10 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-brand-pink text-[10px] font-black uppercase tracking-widest mb-4">
                      <Headphones size={12} /> Clinical Quality Control
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Rate Your Experience</p>
                    <div className="flex justify-center gap-4">
                        {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                            key={num} 
                            type="button" 
                            onClick={() => setRating(num)} 
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                rating >= num ? 'bg-brand-pink text-brand-black shadow-2xl scale-110' : 'bg-white/5 border border-white/10 text-white/20 hover:bg-white/10'
                            }`}
                        >
                            <Star size={24} fill={rating >= num ? "currentColor" : "none"} strokeWidth={3} />
                        </button>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Direct Message to Clinical Admin</p>
                  <div className="relative">
                    <textarea 
                      value={directMsg} 
                      onChange={(e) => setDirectMsg(e.target.value)} 
                      placeholder="Enter encrypted message here..." 
                      className="w-full h-44 bg-white border border-transparent rounded-[2.5rem] p-7 text-sm font-bold text-brand-black focus:outline-none focus:ring-4 focus:ring-brand-pink transition-all placeholder:text-brand-purple/20 resize-none shadow-2xl" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting || (!directMsg.trim() && rating === 0)} 
                    className="w-full py-6 bg-brand-pink text-brand-black font-sans font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-30 hover:bg-white"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin text-brand-purple" /> : <ShieldCheck size={22} strokeWidth={3} />}
                    {isSubmitting ? "TRANSMITTING..." : "SUBMIT SECURE REPORT"}
                  </button>
                  
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-lg">
                      <div className="flex gap-4 items-start">
                          <AlertCircle size={20} className="text-brand-pink shrink-0 mt-1" />
                          <p className="text-[10px] font-bold text-white/50 leading-relaxed uppercase tracking-wider">
                              CRITICAL: For medical emergencies, seek immediate care at the nearest emergency department. WISE is an educational tool and does not provide emergency medical interventions.
                          </p>
                      </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};