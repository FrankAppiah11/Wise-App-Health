import React, { useState } from 'react';
import { AnalysisResult, UserProfile } from '../types';
import { jsPDF } from 'jspdf';
import { 
  Download, 
  ChevronRight, 
  AlertCircle, 
  Edit, 
  CheckCircle,
  Activity, 
  AlertTriangle,
  ClipboardList,
  ShieldCheck,
  ChevronDown,
  Clock,
  Sparkles,
  Map,
  Stethoscope,
  Calendar,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface ResultsProps {
  results: AnalysisResult;
  profile: UserProfile;
  onReset: () => void;
  onUpgrade?: () => void;
}

export const Results: React.FC<ResultsProps> = ({ results, profile, onReset, onUpgrade }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('WISE CLINICAL PREPARATION BRIEF', 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient: ${profile.name || "User"}`, 20, 35);
    doc.text(`Triage Status: ${results.triageStatus}`, 20, 45);
    doc.text('Potential Clinical Matches:', 20, 60);
    
    results.rankedConditions.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.condition.name} (${item.probability}% match)`, 30, 70 + (i * 10));
    });

    doc.save(`WISE_Insights_${profile.name || "User"}.pdf`);
  };

  const isEmergency = results.triageStatus === 'Emergency' || results.triageStatus === 'Urgent';

  const triageStyles = {
    'Emergency': 'bg-red-600 border-red-400 text-white',
    'Urgent': 'bg-brand-gold border-amber-300 text-brand-black',
    'Soon': 'bg-brand-sky/20 border-brand-sky/30 text-white',
    'Routine': 'bg-white/5 border-white/10 text-white',
    'Self-care': 'bg-emerald-900/40 border-emerald-500/30 text-white',
  };

  const displayConditions = results.rankedConditions.slice(0, 3);

  return (
    <div className="flex flex-col min-h-full bg-brand-purple text-white animate-in fade-in duration-700 pb-20 overflow-y-auto">
      {/* Header Section */}
      <div className="px-8 pt-16 pb-12 text-center space-y-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-mint/20 border border-brand-mint/30 rounded-full text-brand-mint text-[9px] font-black uppercase tracking-[0.2em] mb-4">
          <ShieldCheck size={12} /> Evidence-Aligned
        </div>

        <div className="space-y-4">
          <h1 className="font-serif font-black uppercase tracking-widest leading-tight flex flex-col items-center">
            <span className="text-5xl text-brand-brightPink">WISE</span>
            <span className="text-xl text-white mt-2">Reproductive Health Assessment</span>
          </h1>
          <p className="text-3xl font-serif font-black text-brand-gold tracking-tight mt-6">
            {profile.name || "Leslie Appiah"}
          </p>
          <div className="w-12 h-1 bg-brand-pink/30 mx-auto rounded-full mt-3"></div>
        </div>
      </div>

      <div className="space-y-8 px-6">
        {/* RED FLAG ALERTS */}
        {results.redFlagMessages.length > 0 && (
          <div className={`p-6 ${isEmergency ? 'bg-red-600' : 'bg-brand-gold text-brand-black'} rounded-[2rem] border-2 border-white/20 shadow-xl animate-in zoom-in-95`}>
            <div className="flex items-start gap-4">
              <AlertTriangle size={24} />
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest">Clinical Alert</h4>
                <ul className="space-y-1">
                  {results.redFlagMessages.map((m, i) => (
                    <li key={i} className="text-sm font-bold leading-tight">{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* LIKELIHOOD ANALYSIS */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] ml-2">Likelihood Analysis</h3>
          <div className="space-y-3">
            {displayConditions.map((item, idx) => {
              const isExpanded = expandedIdx === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-[2rem] shadow-xl text-brand-black transition-all duration-300 overflow-hidden ${isExpanded ? 'ring-4 ring-brand-brightPink/30' : ''}`}
                >
                  <button 
                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    className="w-full p-6 flex items-center justify-between text-left group transition-all outline-none"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-brand-purple rounded-2xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg">
                        <span className="text-lg font-serif font-black">{item.probability}%</span>
                        <span className="text-[7px] font-sans font-black uppercase opacity-60">Match</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-serif font-black text-brand-purple leading-tight">{item.condition.name}</h4>
                        <p className="text-[10px] font-sans font-black text-brand-pink uppercase tracking-widest mt-1">{item.condition.severity} Priority</p>
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown size={24} className="text-brand-purple/20 group-hover:text-brand-purple transition-colors" />
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="h-px bg-brand-purple/5 w-full mb-4" />
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-brand-black/80 leading-relaxed italic border-l-4 border-brand-brightPink pl-4">
                          {item.condition.description}
                        </p>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black uppercase text-brand-purple/40 tracking-widest">Recommended Next Steps</p>
                           <ul className="space-y-2">
                             {item.condition.nextSteps.map((step, sidx) => (
                               <li key={sidx} className="flex gap-2 items-start text-xs font-bold text-brand-black/70">
                                 <CheckCircle size={14} className="text-brand-mint shrink-0 mt-0.5" />
                                 {step}
                               </li>
                             ))}
                           </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {displayConditions.length === 0 && (
              <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center italic text-white/40 text-sm">
                No specific clinical matches identified based on reported data. Try providing more symptom detail.
              </div>
            )}
          </div>
        </div>

        {/* PRIORITY STATUS */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Clinical Priority</h3>
          <div className={`p-8 rounded-[2.5rem] border ${triageStyles[results.triageStatus]} shadow-2xl relative overflow-hidden`}>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="opacity-60" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Priority Classification</span>
              </div>
              <h3 className="text-2xl font-serif font-black leading-tight uppercase tracking-tight">
                {results.triageStatus}
              </h3>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                {results.triageStatus === 'Emergency' || results.triageStatus === 'Urgent' 
                  ? 'High priority screening is recommended due to symptom intensity or patterns.' 
                  : 'Maintain routine clinical tracking and discuss these results at your next visit.'}
              </p>
            </div>
          </div>
        </div>

        {/* WHAT YOU CAN DO RIGHT NOW - Actionable Clinical Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">What you can do right now</h3>
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-inner overflow-hidden relative">
            <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                <ClipboardList size={160} />
            </div>

            <div className="relative z-10 space-y-8">
                {/* 1. Document Symptoms */}
                <div className="flex gap-5">
                    <div className="w-12 h-12 bg-brand-pink/20 rounded-2xl flex items-center justify-center text-brand-pink shrink-0 shadow-lg border border-brand-pink/20">
                        <Calendar size={22} />
                    </div>
                    <div className="space-y-1.5">
                        <h4 className="text-base font-serif font-black text-white tracking-tight">Document your symptoms daily</h4>
                        <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                            Establish a clinical baseline. Use the WISE Journal to record flow, pain levels, and GI symptoms for the next 30 days.
                        </p>
                    </div>
                </div>

                {/* 2. Educational Engagement */}
                <div className="flex gap-5">
                    <div className="w-12 h-12 bg-brand-sky/20 rounded-2xl flex items-center justify-center text-brand-sky shrink-0 shadow-lg border border-brand-sky/20">
                        <BookOpen size={22} />
                    </div>
                    <div className="space-y-1.5">
                        <h4 className="text-base font-serif font-black text-white tracking-tight">Educational Engagement</h4>
                        <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                            Empower yourself with evidence-based insights. Browse our library for articles on symptom differentiation and management strategies.
                        </p>
                    </div>
                </div>

                {/* 3. Appointment Advocacy */}
                <div className="flex gap-5">
                    <div className="w-12 h-12 bg-brand-gold/20 rounded-2xl flex items-center justify-center text-brand-gold shrink-0 shadow-lg border border-brand-gold/20">
                        <MessageSquare size={22} />
                    </div>
                    <div className="space-y-1.5">
                        <h4 className="text-base font-serif font-black text-white tracking-tight">Appointment Advocacy</h4>
                        <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                            Walk into your visit prepared. Review our 'Provider Questions' to ensure your concerns are addressed with specialized care.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* UPGRADE SECTION */}
        <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-pink/20 to-white/5 border border-white/20 shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
            <Sparkles size={120} className="text-brand-brightPink" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-xl font-serif font-black text-white leading-tight">
              Unlock Your <span className="text-brand-brightPink">WISE Roadmap</span>
            </h3>

            <ul className="space-y-4">
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 flex items-center justify-center text-brand-brightPink shrink-0">
                  <Map size={20} />
                </div>
                <span className="text-xs font-bold text-white/90">Personalized Reproductive Roadmap</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 flex items-center justify-center text-brand-gold shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-xs font-bold text-white/90">Evidence-based guidelines</span>
              </li>
            </ul>

            <button 
              onClick={onUpgrade}
              className="w-full py-4 bg-white text-brand-black font-sans font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-brand-pink"
            >
              UPGRADE NOW <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-4 pt-4">
          <button 
            onClick={handleGeneratePDF}
            className="w-full py-5 bg-white text-brand-black font-sans font-black rounded-3xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:bg-brand-gold"
          >
            <Download size={20} /> Export Clinical Briefing
          </button>
          <button 
            onClick={onReset}
            className="w-full py-5 bg-white/10 border border-white/20 text-white font-sans font-black rounded-3xl flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] transition-all active:scale-95 hover:bg-white/20"
          >
            <Edit size={20} /> Update Health Data
          </button>
        </div>
      </div>
    </div>
  );
};