import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SURVEY_QUESTIONS } from '../constants';
import { UserProfile } from '../types';
import { Logo } from './Logo';
import { Tagline } from '../App';
import { 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronDown,
  CheckCircle
} from 'lucide-react';

interface SurveyProps {
  profile: UserProfile;
  initialAnswers: Record<string, any>;
  initialStep: number;
  onComplete: (answers: Record<string, any>, selectedDate: string) => void;
  onIneligible: () => void;
  onBack: () => void;
}

export const Survey: React.FC<SurveyProps> = ({ 
  profile, 
  initialAnswers, 
  initialStep, 
  onComplete, 
  onIneligible, 
  onBack 
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [reachedFurthestStep, setReachedFurthestStep] = useState(initialStep);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isStopped = answers['period_typicality'] === 'Previous had cycles but they have stopped';
  const stoppedGroupIds = ['cycle_length', 'period_duration', 'flow_description'];

  const activeQuestions = useMemo(() => {
    let filtered = SURVEY_QUESTIONS.filter(q => !q.condition || q.condition(answers, profile));
    if (isStopped) {
      filtered = filtered.filter(q => q.id !== 'period_duration' && q.id !== 'flow_description');
    }
    return filtered;
  }, [answers, profile, isStopped]);

  useEffect(() => {
    if (currentStep > reachedFurthestStep) {
      setReachedFurthestStep(currentStep);
    }
    // Scroll to top whenever the step changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  // Dynamic context calculation
  const getDynamicText = (text: string) => {
    const isParentContext = answers['user_persona'] === 'I am a parent/guardian using this for my child (Ages 12-14)';

    const context = {
      subject: isParentContext ? 'your child' : 'you',
      reflective: isParentContext ? 'your child' : 'yourself',
      possessive: isParentContext ? "your child's" : 'your',
      verb_do: isParentContext ? 'does' : 'do',
      verb_are: isParentContext ? 'is' : 'are',
      verb_have: isParentContext ? 'has' : 'have',
      verb_were: isParentContext ? 'was' : 'were',
      // Capitalized versions for sentence starts
      Verb_do: isParentContext ? 'Does' : 'Do',
      Verb_are: isParentContext ? 'Is' : 'Are',
      Verb_have: isParentContext ? 'Has' : 'Have',
      Verb_were: isParentContext ? 'Was' : 'Were',
      // Dynamic questions
      age_question: isParentContext ? 'What is the age of the person being assessed?' : 'What is your age?',
    };

    return text.replace(/{{(\w+)}}/g, (_, key) => (context as any)[key] || `{{${key}}}`);
  };

  const renderQuestionTitle = (text: string) => {
    const dynamicText = getDynamicText(text);
    const parts = dynamicText.split(/(WISE)/g);
    return parts.map((part, i) => 
      part === 'WISE' ? <span key={i} className="text-brand-brightPink">WISE</span> : part
    );
  };

  const currentQ = activeQuestions[currentStep];
  const progress = Math.round(((currentStep + 1) / activeQuestions.length) * 100);
  const isCurrentGrouped = isStopped && currentQ?.id === 'cycle_length';
  
  // Theme check for section-based color branding
  const isPersonaScreen = currentQ?.id === 'user_persona';
  const isAboutYou = currentQ?.section === 'About You';
  const isLifestyle = currentQ?.section === 'Lifestyle';
  const isMedicalHistory = currentQ?.section === 'Medical History';
  const isPreventiveHealth = currentQ?.section === 'Preventive Health';
  const isMenstrualHistory = currentQ?.section === 'Menstrual History';
  const isAssociatedSymptoms = currentQ?.section === 'Associated Symptoms';
  const isSupport = currentQ?.section === 'Support';
  const isFertility = currentQ?.section === 'Fertility and Family Planning';
  const isMenstrualPain = currentQ?.section === 'Menstrual and Pain';
  
  // Entire survey intake should stay in the dark/purple branding
  const isDarkStep = isPersonaScreen || isAboutYou || isLifestyle || isMedicalHistory || isPreventiveHealth || isMenstrualHistory || isAssociatedSymptoms || isSupport || isFertility || isMenstrualPain;

  const findNextLogicalStep = (currentIdx: number, updatedAnswers: Record<string, any>) => {
    const isStillStopped = updatedAnswers['period_typicality'] === 'Previous had cycles but they have stopped';
    const newPath = SURVEY_QUESTIONS.filter(q => !q.condition || q.condition(updatedAnswers, profile));
    const path = isStillStopped ? newPath.filter(q => q.id !== 'period_duration' && q.id !== 'flow_description') : newPath;

    for (let i = currentIdx + 1; i < path.length; i++) {
        const qId = path[i].id;
        if (isStillStopped && qId === 'cycle_length') {
            const allGroupFilled = stoppedGroupIds.every(id => !!updatedAnswers[id]);
            if (!allGroupFilled) return i;
            continue;
        }
        if (!updatedAnswers[qId]) return i;
    }
    return path.length;
  };

  const advance = (updatedAnswers: Record<string, any>) => {
    const nextIdx = findNextLogicalStep(currentStep, updatedAnswers);
    if (nextIdx >= activeQuestions.length) {
        onComplete(updatedAnswers, new Date().toLocaleDateString());
    } else {
        setCurrentStep(nextIdx);
    }
  };

  const handleAnswer = (id: string, val: string | string[], autoAdvance = true) => {
    const newAnswers = { ...answers, [id]: val };
    setAnswers(newAnswers);

    if (id === 'born_with_uterus') {
      const identity = newAnswers['gender_identity'];
      if (val === 'No' || identity === 'Transmale' || identity === 'Transfemale') {
        onIneligible();
        return;
      }
    }
    
    const q = SURVEY_QUESTIONS.find(sq => sq.id === id);
    if (autoAdvance && (q?.type === 'single' || q?.type === 'dropdown') && !isCurrentGrouped) {
        advance(newAnswers);
    }
  };

  const handleNext = () => {
    if (isCurrentGrouped) {
      const allAnswered = stoppedGroupIds.every(id => !!answers[id]);
      if (!allAnswered) return;
    }
    advance(answers);
  };

  const toggleMultiSelect = (id: string, val: string) => {
    const current = (answers[id] as string[]) || [];
    const noneOptions = ['None', 'None of these', 'None of the above', 'No prior evaluation'];
    let updated;
    
    if (noneOptions.includes(val)) {
      updated = current.includes(val) ? [] : [val];
    } else {
      updated = current.filter(v => !noneOptions.includes(v));
      updated = updated.includes(val) ? updated.filter(v => v !== val) : [...updated, val];
    }
    setAnswers({ ...answers, [id]: updated });
  };

  const renderInput = (q: typeof SURVEY_QUESTIONS[0], showLabel = false) => {
    const questionText = getDynamicText(q.text);

    if (q.type === 'dropdown') {
      let availableOptions = q.options || [];
      
      // Clinical logic: Filter age based on persona selection
      if (q.id === 'age_selection') {
        const persona = answers['user_persona'];
        if (persona === 'I am a parent/guardian using this for my child (Ages 12-14)') {
          availableOptions = availableOptions.filter(opt => ['12', '13', '14'].includes(opt));
        } else if (persona === 'I am using this for myself (Age 15+)') {
          availableOptions = availableOptions.filter(opt => parseInt(opt) >= 15);
        }
      }

      return (
        <div className="relative group mb-6">
          {showLabel && <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ml-1 ${isDarkStep ? 'text-white/60' : 'text-brand-purple/40'}`}>{renderQuestionTitle(q.text)}</label>}
          <div className="relative">
            <select 
              onChange={(e) => handleAnswer(q.id, e.target.value, !showLabel)}
              value={answers[q.id] || ''}
              className="w-full bg-white border border-brand-purple/10 rounded-2xl p-5 text-sm font-black text-brand-black appearance-none focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all pr-12 shadow-sm"
            >
              <option value="" disabled className="text-brand-purple/40">Select an option</option>
              {availableOptions.map(opt => (
                <option key={opt} value={opt} className="bg-white text-base font-bold text-brand-black">{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-purple pointer-events-none" size={18} />
          </div>
        </div>
      );
    }

    if (q.type === 'multiple') {
      return (
        <div className="space-y-3">
          {q.options?.map(opt => {
            if (opt.startsWith('HEADER:')) {
              const headerText = opt.replace('HEADER:', '');
              const isRequestedWhite = ['Postpartum Support', 'Other Areas', 'Menstrual Concerns', 'Gynecologic & Reproductive', 'Systemic & Other Conditions', 'Pelvic & Reproductive', 'Skin & Hair', 'Mood & Energy', 'General Body', 'Metabolic & Endocrine', 'Autoimmune & Inflammatory', 'Cancer History', 'Other'].includes(headerText);
              
              return (
                <div key={opt} className="pt-4 pb-2">
                  <h4 className={`text-[10px] font-black uppercase tracking-widest border-b pb-2 ml-1 ${
                    (isDarkStep || isRequestedWhite) 
                      ? 'text-white border-white/20' 
                      : 'text-brand-purple/40 border-brand-purple/10'
                  }`}>
                    {headerText}
                  </h4>
                </div>
              );
            }
            const isSelected = (answers[q.id] || []).includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleMultiSelect(q.id, opt)}
                className={`w-full p-5 text-left rounded-[1.5rem] border-4 transition-all flex items-center justify-between group bg-white shadow-xl ${
                  isSelected 
                    ? 'border-brand-pink scale-[1.01]' 
                    : 'border-white/20'
                }`}
              >
                <span className="font-black text-[12px] leading-tight pr-4 text-brand-black">
                  {getDynamicText(opt)}
                </span>
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                  isSelected ? 'bg-brand-pink border-transparent text-brand-black' : 'border-brand-purple/20'
                }`}>
                  {isSelected && <CheckCircle size={12} />}
                </div>
              </button>
            );
          })}
          <div className="pt-6">
            <button 
              onClick={handleNext}
              disabled={!(answers[q.id] || []).length}
              className={`w-full py-5 font-black rounded-3xl shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                isDarkStep 
                  ? 'bg-brand-pink text-brand-black hover:bg-white' 
                  : 'bg-brand-pink text-brand-black hover:bg-brand-purple hover:text-white'
              }`}
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      );
    }

    if (q.type === 'text') {
      return (
        <div className="space-y-6">
          <div className="relative group">
            <textarea
              autoFocus={!showLabel}
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              placeholder="Type response here..."
              className={`w-full border rounded-2xl p-6 text-base font-bold min-h-[150px] focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all resize-none shadow-inner ${
                isDarkStep
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20'
                  : 'bg-brand-grey/30 border-brand-purple/10 text-brand-black placeholder:text-brand-purple/30'
              }`}
            />
          </div>
          {!showLabel && (
            <button 
              onClick={handleNext}
              disabled={!answers[q.id]?.trim()}
              className={`w-full py-5 font-black rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-95 ${
                isDarkStep
                  ? 'bg-brand-pink text-brand-black hover:bg-white'
                  : 'bg-brand-pink text-brand-black hover:bg-brand-purple hover:text-white'
              }`}
            >
              Continue <ChevronRight size={20} />
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {q.options?.map(opt => {
          const isSelected = answers[q.id] === opt;
          const isGenderIdentity = q.id === 'gender_identity';
          
          return (
            <button
              key={opt}
              onClick={() => handleAnswer(q.id, opt, !showLabel)}
              className={`w-full text-left border-4 transition-all flex items-center justify-between group bg-white shadow-xl ${
                isGenderIdentity 
                  ? 'p-3 min-h-[58px] rounded-[1.4rem]' 
                  : 'p-4 min-h-[72px] rounded-[1.8rem]'
              } ${
                isSelected ? 'scale-[1.02] border-white' : 'border-white/20'
              }`}
            >
              <span className={`font-black leading-tight pr-6 text-brand-black ${isGenderIdentity ? 'text-[12px]' : 'text-[13px]'}`}>
                {getDynamicText(opt)}
              </span>
              <div className={`rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                isGenderIdentity ? 'w-5 h-5' : 'w-6 h-6'
              } ${
                isSelected 
                  ? 'bg-brand-pink border-transparent' 
                  : 'border-brand-pink'
              }`}>
                {isSelected && <CheckCircle2 className="text-brand-black" size={isGenderIdentity ? 12 : 14} />}
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full transition-colors duration-500 ${isDarkStep ? 'bg-brand-purple text-white' : 'bg-white text-brand-black'}`}>
      {/* Header with Logo */}
      <header className={`px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl border-b transition-colors duration-500 ${
        isDarkStep ? 'bg-brand-purple/90 border-brand-purple' : 'bg-white/90 border-brand-purple/10'
      }`}>
        <Logo 
          variant="full" 
          size={isPersonaScreen ? "md" : "sm"} 
          color={isPersonaScreen ? "pink" : (isDarkStep ? "white" : "purple")} 
        />
        <button 
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onBack()} 
          className={`transition-colors p-2 rounded-full border ${
            isDarkStep ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' : 'bg-brand-purple/5 text-brand-purple border-brand-purple/10 hover:bg-brand-purple/10'
          }`}
        >
          <ArrowLeft size={18} />
        </button>
      </header>

      {/* Progress Section */}
      <div className={`px-6 py-6 space-y-6 border-b ${
        isDarkStep ? 'bg-brand-purple border-brand-purple/60' : 'bg-brand-grey/20 border-brand-purple/5'
      }`}>
        <div className="flex flex-col items-center gap-6">
          <div className={`px-4 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-widest ${
            isDarkStep ? 'bg-white/10 border-white/20 text-white' : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple'
          }`}>
             {currentQ.section}
          </div>
          <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkStep ? 'text-white' : 'text-brand-purple/40'}`}>
            Progress {progress}%
          </div>
        </div>
        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkStep ? 'bg-white/10' : 'bg-brand-purple/10'}`}>
            <div 
              className={`h-full transition-all duration-700 ease-out ${isDarkStep ? 'bg-white' : 'bg-brand-purple'}`} 
              style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 px-6 pb-64 pt-8 space-y-8 overflow-y-auto">
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          {!isCurrentGrouped && (
            <h2 className={`text-3xl font-serif font-black leading-tight mb-8 whitespace-pre-line transition-colors ${
              isDarkStep ? 'text-white' : 'text-brand-purple'
            }`}>
              {renderQuestionTitle(currentQ.text)}
            </h2>
          )}
          {isCurrentGrouped ? (
            <div className="space-y-10">
              <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-pink/20 border border-brand-pink/30 rounded-full text-brand-pink text-[9px] font-black uppercase tracking-widest">
                  Historical Pattern
                </div>
                <h2 className={`text-3xl font-serif font-black leading-tight transition-colors ${
                  isDarkStep ? 'text-white' : 'text-brand-purple'
                }`}>
                    {parseInt(answers['age_selection']) < 15 ? "Prior to your child's menses stopping:" : "Prior to your menses stopping:"}
                </h2>
              </header>
              <div className="space-y-10">
                {stoppedGroupIds.map(id => {
                  const q = SURVEY_QUESTIONS.find(sq => sq.id === id);
                  return q ? <div key={id}>{renderInput(q, true)}</div> : null;
                })}
              </div>
              <div className="pt-6">
                <button 
                  onClick={handleNext}
                  disabled={!stoppedGroupIds.every(id => !!answers[id])}
                  className="w-full py-5 bg-brand-pink text-brand-black font-black rounded-3xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 hover:bg-brand-purple hover:text-white"
                >
                  Continue Assessment <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <>
              {renderInput(currentQ)}
            </>
          )}
          
          <div className="pt-20 pb-8">
            <Tagline />
          </div>
        </div>
      </div>
    </div>
  );
};