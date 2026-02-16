import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Profile } from './components/Profile';
import { Survey } from './components/Survey';
import { Results } from './components/Results';
import { Tracker } from './components/Tracker';
import { Support } from './components/Support';
import { AdminDashboard } from './components/AdminDashboard';
import { SignUp } from './components/SignUp';
import { EmailVerification } from './components/EmailVerification';
import { Membership } from './components/Membership';
import { Logo } from './components/Logo';
import { AppScreen, UserProfile, AnalysisResult } from './types';
import { analyzeSymptoms } from './services/analysisEngine';
import { 
  ShieldCheck, 
  ChevronRight, 
  Loader2, 
  Heart, 
  Activity, 
  Compass, 
  Map, 
  Zap, 
  CheckCircle, 
  Home, 
  ClipboardList, 
  Sparkles,
  Shield
} from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  age: 28,
  userPersona: 'Self',
  isPregnant: false,
  isPostpartum: false,
  contraception: 'Pill',
  knownConditions: ['PCOS'],
  medications: [],
  isUpgraded: false,
};

export const Tagline = ({ className = "" }: { className?: string }) => (
  <p className={`text-[10px] font-bold text-brand-brightPink uppercase tracking-[0.15em] text-center leading-relaxed whitespace-nowrap ${className}`}>
    Strong Women • Smart Choices • Better Health
  </p>
);

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.ONBOARDING);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, any>>({});
  const [surveyStep, setSurveyStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const generateCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setVerificationCode(code);
    
    setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 8000);
    }, 1500);
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleSignUp = (name: string, email: string, phone: string) => {
    setProfile(prev => ({ ...prev, name, email, phone }));
    generateCode();
    setScreen(AppScreen.VERIFY_EMAIL);
  };

  const handleVerified = () => {
    setScreen(AppScreen.PROFILE);
    setShowNotification(false);
  };

  const resendCode = () => {
    generateCode();
  };

  const handleSurveyComplete = (answers: Record<string, any>, selectedDate: string) => {
    setSurveyAnswers(answers);
    const result = analyzeSymptoms(answers, profile, selectedDate);
    setAnalysis(result);
    setScreen(AppScreen.RESULTS);
  };

  const handleMembershipSelection = (planId: string) => {
    setProfile(prev => ({ ...prev, isUpgraded: true }));
    setScreen(AppScreen.RESULTS);
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-brand-purple flex flex-col items-center justify-center p-8 text-white">
        <Logo variant="full" size="md" className="mb-12 animate-pulse" />
        <Loader2 className="text-white animate-spin" size={32} />
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.HOW_IT_WORKS:
        return (
          <div className="relative min-h-[900px] bg-brand-purple flex flex-col overflow-hidden p-8">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-brand-pink opacity-20 blur-[100px] rounded-[100%] rotate-[-10deg]"></div>
            <div className="flex-1 flex flex-col justify-center space-y-10 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-col items-center text-center space-y-6">
                <Logo variant="full" size="md" />
                <div className="space-y-1">
                  <h1 className="text-4xl font-serif font-black text-white leading-tight">How <span className="text-brand-brightPink">WISE</span> Works</h1>
                  <p className="text-xs text-white font-bold uppercase tracking-widest">Simplifying your Health Journey</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: ClipboardList, step: "1. Take the Assessment", desc: "Answer questions about symptoms, cycle, and history. Takes 5-10 minutes.", highlight: "white" },
                  { icon: CheckCircle, step: "2. Get Your Results", desc: "Receive your free WISE Reproductive Health Assessment listing the most likely conditions to discuss with your provider.", highlight: "brand-sky" },
                  { icon: Map, step: "3. Unlock Your Roadmap", desc: "Evidence-Based WISE Personalized Reproductive Roadmap, Symptom Tracker, and Visit Preparation Tool.", highlight: "brand-gold" },
                  { icon: Zap, step: "4. Take Action", desc: "Track • Trend • Share: Use WISE to monitor symptoms and walk into your visit prepared.", highlight: "brand-mint" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] flex gap-5 group transition-all border-l-4" style={{ borderColor: i === 2 ? '#E9B96F' : (i === 1 ? '#ACC2F4' : (i === 3 ? '#BFD9CC' : '#FFFFFF')) }}>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0">
                      <item.icon size={22} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-sans font-black text-white text-sm uppercase">{item.step}</h3>
                      <p className="text-[13px] text-white leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setScreen(AppScreen.WHAT_IS_WISE)}
                className="w-full py-5 bg-white text-brand-black font-sans font-black rounded-3xl shadow-lg flex items-center justify-center gap-2 group transition-all active:scale-95 hover:bg-brand-pink hover:text-white"
              >
                Continue <ChevronRight size={20} />
              </button>
              <div className="pt-4">
                <Tagline />
              </div>
            </div>
          </div>
        );
      case AppScreen.WHAT_IS_WISE:
        return (
          <div className="relative min-h-[900px] bg-brand-purple flex flex-col overflow-hidden p-8">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-white/10 opacity-5 blur-[100px] rounded-[100%] rotate-[-10deg]"></div>
            <div className="flex-1 flex-col flex justify-center space-y-12 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="space-y-6 text-center flex flex-col items-center">
                <Logo variant="full" size="md" />
                <h1 className="text-4xl font-serif font-black text-white leading-tight mt-6">What makes <span className="text-brand-brightPink">WISE</span> <span className="text-white">different?</span></h1>
              </div>
              <div className="space-y-6">
                {[
                  { icon: Heart, title: "Physician-Led Guidance", desc: "Evidence-based guidance created by Dr. Leslie Appiah, a nationally recognized expert." },
                  { icon: Compass, title: "Personalized Roadmap", desc: "A customized pathway for self-care, primary care, or specialist evaluation." },
                  { icon: Activity, title: "Empowerment Tools", desc: "Intuitive tracking, trend insights, and visit prep tools built for confidence." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-7 rounded-[2.5rem] flex items-start gap-6 group hover:bg-brand-pink transition-all shadow-xl">
                    <div className={`w-14 h-14 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple shrink-0 transition-transform group-hover:scale-110 group-hover:bg-brand-purple group-hover:text-white`}>
                      <item.icon size={28} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-sans font-black text-brand-purple text-base group-hover:text-brand-black">{item.title}</h3>
                      <p className="text-sm text-brand-black leading-relaxed font-bold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setScreen(AppScreen.SURVEY)}
                className="w-full py-5 bg-white text-brand-black font-sans font-black rounded-3xl shadow-xl flex items-center justify-center gap-2 group transition-all active:scale-95 hover:bg-brand-pink hover:text-white"
              >
                Begin Assessment <ChevronRight size={20} />
              </button>
              <div className="pt-4">
                <Tagline />
              </div>
            </div>
          </div>
        );
      case AppScreen.ONBOARDING:
        return (
          <div className="relative min-h-[900px] bg-brand-purple flex flex-col overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[60%] bg-brand-pink opacity-30 blur-[120px] rounded-[100%] rotate-[-15deg]"></div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 z-10">
                <div className="w-full bg-brand-purple/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] px-8 py-20 shadow-xl space-y-14 animate-in zoom-in-95 duration-700">
                    <div className="text-center space-y-10 flex flex-col items-center">
                        <Logo variant="full" size="lg" />
                        <div className="space-y-6">
                          <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-white">
                            Women. Informed. Strong. Engaged
                          </p>
                          <div className="space-y-4">
                            <h2 className="text-xl font-serif font-black text-white leading-tight px-2">
                              Your trusted reproductive health companion—created by physicians, for women.
                            </h2>
                          </div>
                        </div>
                    </div>
                    
                    <div className="space-y-8 flex flex-col items-center">
                        <button 
                            onClick={() => setScreen(AppScreen.SIGNUP)}
                            className="w-full py-5 bg-white text-brand-black font-sans font-black rounded-3xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-brand-pink hover:text-white"
                        >
                            Get Started <ChevronRight size={20} />
                        </button>
                        
                        <button 
                            onClick={() => {
                              const result = analyzeSymptoms({
                                'age_selection': '28',
                                'primary_concerns': ['Heavy periods', 'Endometriosis symptoms'],
                                'menstrual_flow': 'Heavy (changing products every 1-2 hours)',
                                'pain_scale_0_10': '7–10: severe pain'
                              }, profile, 'Oct 25, 2024');
                              setAnalysis(result);
                              setScreen(AppScreen.RESULTS);
                            }}
                            className="text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-all underline underline-offset-4"
                        >
                            Quick Preview: Results Screen
                        </button>

                        <div className="space-y-6 text-center pt-4">
                          <p className="text-xs font-sans text-white">
                            Already have an account? <button className="text-white font-black hover:underline transition-all">Sign In</button>
                          </p>
                          <Tagline />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );
      case AppScreen.SIGNUP:
        return <SignUp onSignUp={handleSignUp} />;
      case AppScreen.VERIFY_EMAIL:
        return <EmailVerification email={profile.email} correctCode={verificationCode} onVerified={handleVerified} onResend={resendCode} />;
      case AppScreen.PROFILE:
        return (
          <Profile 
            profile={profile} 
            updateProfile={handleUpdateProfile} 
            onComplete={() => setScreen(AppScreen.HOW_IT_WORKS)} 
            onAdminLogin={() => setScreen(AppScreen.ADMIN)}
          />
        );
      case AppScreen.SURVEY:
        return (
          <Survey 
            profile={profile}
            initialAnswers={surveyAnswers}
            initialStep={surveyStep}
            onComplete={handleSurveyComplete}
            onIneligible={() => setScreen(AppScreen.INELIGIBLE)}
            onBack={() => setScreen(AppScreen.PROFILE)}
          />
        );
      case AppScreen.RESULTS:
        return analysis ? (
          <Results 
            results={analysis} 
            profile={profile} 
            onReset={() => {
                setScreen(AppScreen.SURVEY);
            }} 
            onUpgrade={() => setScreen(AppScreen.MEMBERSHIP)} 
          />
        ) : (
          <div className="p-10 text-center text-white font-bold">No results yet.</div>
        );
      case AppScreen.MEMBERSHIP:
        return <Membership onBack={() => setScreen(AppScreen.RESULTS)} onSelect={handleMembershipSelection} />;
      case AppScreen.INELIGIBLE:
        return (
          <div className="relative min-h-[900px] bg-brand-purple flex flex-col overflow-hidden p-10 justify-center">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-brand-pink opacity-30 blur-[100px] rounded-[100%] rotate-[-10deg]"></div>
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-12 z-10 animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-white/10 border border-white/20 rounded-[2rem] flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={48} />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-black text-white leading-tight uppercase tracking-tight">Clinical Guidance</h2>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[3rem] text-sm text-white/90 leading-loose text-center font-medium">
                  Welcome to WISE. This app is intended for persons born with a uterus who are not using gender-affirming hormones to navigate their reproductive health. We anticipate being able to serve the needs of all reproductive-aged persons in the future. Please contact a physician with expertise in gender-affirming care for assistance.
                </div>
              </div>
              <button 
                onClick={() => setScreen(AppScreen.ONBOARDING)}
                className="w-full py-5 bg-white text-brand-black font-sans font-black rounded-3xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-brand-pink hover:text-white"
              >
                <Home size={20} /> Return to Home
              </button>
              <Tagline />
            </div>
          </div>
        );
      case AppScreen.TRACKER:
        return <Tracker />;
      case AppScreen.SUPPORT:
        return <Support />;
      case AppScreen.ADMIN:
        return <AdminDashboard onBack={() => setScreen(AppScreen.PROFILE)} />;
      default:
        return <div>Screen not found</div>;
    }
  };

  const noLayoutScreens = [
    AppScreen.ONBOARDING, 
    AppScreen.SIGNUP, 
    AppScreen.VERIFY_EMAIL, 
    AppScreen.HOW_IT_WORKS, 
    AppScreen.WHAT_IS_WISE, 
    AppScreen.ADMIN, 
    AppScreen.MEMBERSHIP, 
    AppScreen.INELIGIBLE,
    AppScreen.SURVEY
  ];
  
  const isDarkScreen = noLayoutScreens.includes(screen) || screen === AppScreen.PROFILE;

  return (
    <div className={`relative min-h-[900px] h-auto ${isDarkScreen ? 'bg-brand-purple' : 'bg-white'} max-w-md mx-auto overflow-hidden shadow-2xl transition-colors duration-500`}>
      {showNotification && (
        <div className="absolute top-6 left-6 right-6 z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-white/95 backdrop-blur-3xl border border-brand-purple/10 p-6 rounded-[2rem] shadow-2xl flex items-center gap-5">
            <div className="w-14 h-14 bg-brand-purple rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
              <Logo variant="icon" size="sm" className="w-8 h-8" />
            </div>
            <div className="flex-1 overflow-hidden ml-2">
              <p className="text-base font-sans font-black uppercase tracking-[0.25em] text-brand-purple/60">System Notification</p>
              <p className="text-lg font-sans font-bold text-brand-purple leading-tight">WISE code: <span className="text-black font-black text-xl ml-2 tracking-widest">{verificationCode}</span></p>
            </div>
            <button onClick={() => setShowNotification(false)} className="p-2 text-brand-purple/40 hover:text-brand-purple transition-colors">
              <ChevronRight size={26} className="rotate-90" />
            </button>
          </div>
        </div>
      )}
      {noLayoutScreens.includes(screen) ? renderScreen() : (
        <Layout currentScreen={screen} setScreen={setScreen}>
          {renderScreen()}
        </Layout>
      )}
    </div>
  );
};

export default App;