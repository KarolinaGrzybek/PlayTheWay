import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, ChevronRight, Moon, Sun, Home, AlertCircle, Map, Package, User, LogOut, Mail, Lock } from 'lucide-react';
import { callAdventureWebhook } from './api';
import type { AdventureResponse, POI } from './api';
import { RouteMapView } from './RouteMapView';
import { SouvenirCamera } from './SouvenirCamera';
import { ChronicleView } from './ChronicleView';
import { BadgesView } from './BadgesView';
import { supabase } from './supabaseClient';
import logo from './assets/logo.png';

type Step = 'onboarding' | 'loading' | 'route' | 'story';
interface StoryData extends AdventureResponse {}

// SVG Icons for quiz options
function WindowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#8b6b4c] dark:text-[#c4b5a2] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10C4 6.7 6.7 4 10 4h4c3.3 0 6 2.7 6 6v10" />
      <path d="M4 20h16" />
      <path d="M12 4v16" />
      <path d="M4 12h16" />
      <path d="M8 8c1.5-1.5 2.5-3 4-4 1.5 1 2.5 2.5 4 4" />
    </svg>
  );
}

function ArchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#8b6b4c] dark:text-[#c4b5a2] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10c0-4.4 3.6-8 8-8s8 3.6 8 8v10" />
      <path d="M2 20h20" />
      <path d="M8 20V11c0-2.2 1.8-4 4-4s4 1.8 4 4v9" />
    </svg>
  );
}

function DomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#8b6b4c] dark:text-[#c4b5a2] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v3M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <path d="M2 12h20M4 12v8h16v-8" />
      <path d="M8 12v8M12 12v8M16 12v8" />
      <circle cx="12" cy="2" r="1" />
    </svg>
  );
}

function TowerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#8b6b4c] dark:text-[#c4b5a2] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l-5 5h10z" />
      <path d="M8 7v13h8V7" />
      <path d="M6 20h12" />
      <path d="M12 7v13" />
    </svg>
  );
}

function DefaultChoiceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#8b6b4c] dark:text-[#c4b5a2] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function getOptionIcon(text: string) {
  const normalized = text.toLowerCase();
  if (normalized.includes('okn') || normalized.includes('witraz') || normalized.includes('witraż') || normalized.includes('gotyck')) {
    return <WindowIcon />;
  }
  if (normalized.includes('arkad') || normalized.includes('łuk') || normalized.includes('luk') || normalized.includes('portal')) {
    return <ArchIcon />;
  }
  if (normalized.includes('kopuł') || normalized.includes('kopul') || normalized.includes('hełm') || normalized.includes('helm') || normalized.includes('kopulasty')) {
    return <DomeIcon />;
  }
  if (normalized.includes('wież') || normalized.includes('wiez') || normalized.includes('baszt') || normalized.includes('iglic')) {
    return <TowerIcon />;
  }
  return <DefaultChoiceIcon />;
}

function GothicSketch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="190" x2="390" y2="190" />
      <path d="M 60 190 L 60 100 L 80 60 L 100 100 L 100 190 Z" />
      <path d="M 80 60 L 80 10 L 80 60" />
      <path d="M 70 100 L 80 80 L 90 100" />
      <circle cx="80" cy="120" r="8" />
      <path d="M 100 190 L 100 110 L 200 110 L 200 190 Z" />
      <path d="M 100 110 L 150 70 L 200 110" />
      <path d="M 120 190 C 120 160 180 160 180 190" />
      <path d="M 150 110 A 25 25 0 0 1 150 160 A 25 25 0 0 1 150 110" />
      <path d="M 145 135 L 155 135 M 150 130 L 150 140" />
      <path d="M 200 190 L 200 80 L 220 40 L 240 80 L 240 190 Z" />
      <path d="M 220 40 L 220 5 L 220 40" />
      <circle cx="220" cy="110" r="10" />
      <path d="M 240 120 C 260 130 270 160 270 190" />
      <path d="M 240 100 C 270 110 280 150 280 190" />
      <line x1="50" y1="190" x2="50" y2="150" />
      <line x1="50" y1="150" x2="60" y2="140" />
      <line x1="240" y1="190" x2="250" y2="190" />
    </svg>
  );
}

function RouteBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="45" fill="#fdfbf7" stroke="#8b6b4c" strokeWidth="2.5" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#8b6b4c" strokeWidth="1" />
      <polygon points="50,20 55,45 50,48" fill="#8b6b4c" />
      <polygon points="50,20 45,45 50,48" fill="#a88b6e" />
      <polygon points="50,80 45,55 50,52" fill="#8b6b4c" />
      <polygon points="50,80 55,55 50,52" fill="#a88b6e" />
      <polygon points="80,50 55,45 52,50" fill="#8b6b4c" />
      <polygon points="80,50 55,55 52,50" fill="#a88b6e" />
      <polygon points="20,50 45,55 48,50" fill="#8b6b4c" />
      <polygon points="20,50 45,45 48,50" fill="#a88b6e" />
      <circle cx="50" cy="50" r="3" fill="#efdfc3" stroke="#8b6b4c" strokeWidth="1" />
      <text x="46" y="16" fontSize="8" fontWeight="bold" fill="#8b6b4c" fontFamily="serif">N</text>
      <text x="46" y="91" fontSize="8" fontWeight="bold" fill="#8b6b4c" fontFamily="serif">S</text>
    </svg>
  );
}

function App() {
  const [logoHovered, setLogoHovered] = useState(false);
  const [step, setStep] = useState<Step>('onboarding');
  const [city, setCity] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<StoryData | null>(null);
  const [plannedRoute, setPlannedRoute] = useState<POI[]>([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // Local state for tracking current step's quiz status
  const [quizSolved, setQuizSolved] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Auth, Tab and Gamification states
  const [user, setUser] = useState<any>(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('🤠');
  const [currentTab, setCurrentTab] = useState<'adventure' | 'chronicle' | 'badges'>('adventure');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'update'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [photoSavedUrl, setPhotoSavedUrl] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [childrenNames, setChildrenNames] = useState<string[]>(['']);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setAuthMode('update');
        setAuthError(null);
        setShowAuthModal(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync avatar state with logged-in user or guest settings
  useEffect(() => {
    if (user) {
      setCurrentAvatar(user.user_metadata?.avatar || '🤠');
    } else {
      const guestAvatar = localStorage.getItem('playtheway_guest_avatar') || '🤠';
      setCurrentAvatar(guestAvatar);
    }
  }, [user]);

  // Reset childrenNames when registration modal opens or switches mode
  useEffect(() => {
    if (authMode !== 'register') {
      setChildrenNames(['']);
    }
  }, [authMode, showAuthModal]);

  // Fetch completed adventure count for header dynamic profile Level/Rank
  useEffect(() => {
    if (!user) {
      setCompletedCount(0);
      return;
    }
    supabase.from('completed_adventures')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count, error }) => {
        if (!error && count !== null) {
          setCompletedCount(count);
        }
      });
  }, [user, photoSavedUrl]);

  // Auth Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === 'login') {
        const { error: authErr } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (authErr) throw authErr;
        setShowAuthModal(false);
      } else if (authMode === 'register') {
        const names = childrenNames.map(n => n.trim()).filter(n => n !== '');
        if (names.length === 0) {
          throw new Error("Wpisz imię przynajmniej jednego dziecka, aby założyć Kartę Odkrywcy.");
        }
        const { error: authErr } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              children: names
            }
          }
        });
        if (authErr) throw authErr;
        alert("Wysłano link weryfikacyjny na Twój adres e-mail! Sprawdź skrzynkę odbiorczą.");
        setShowAuthModal(false);
      } else if (authMode === 'forgot') {
        const { error: authErr } = await supabase.auth.resetPasswordForEmail(authEmail, {
          redirectTo: window.location.origin
        });
        if (authErr) throw authErr;
        alert("Link do resetowania hasła został wysłany na Twój adres e-mail!");
        setAuthMode('login');
        setShowAuthModal(false);
      } else if (authMode === 'update') {
        const { error: authErr } = await supabase.auth.updateUser({
          password: authPassword
        });
        if (authErr) throw authErr;
        alert("Twoje hasło zostało pomyślnie zmienione!");
        setAuthMode('login');
        setShowAuthModal(false);
      }
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      setAuthError(err.message || "Błąd podczas uwierzytelniania.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSelectAvatar = async (avatar: string) => {
    setCurrentAvatar(avatar);
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { ...user.user_metadata, avatar }
        });
      } catch (e) {
        console.error("Błąd aktualizacji awatara:", e);
      }
    } else {
      localStorage.setItem('playtheway_guest_avatar', avatar);
    }
    setShowAvatarModal(false);
  };

  const handleLogout = async () => {
    if (confirm("Czy na pewno chcesz się wylogować?")) {
      await supabase.auth.signOut();
    }
  };

  // Rank name calculation
  const userLevel = Math.floor(completedCount / 3) + 1;
  const getRankName = (level: number) => {
    if (level <= 1) return "Nowicjusz Odkrywca";
    if (level === 2) return "Młody Odkrywca";
    if (level === 3) return "Poszukiwacz Przygód";
    return "Mistrz Odkrywców";
  };
  const userRank = getRankName(userLevel);
  const nextLevelProgress = ((completedCount % 3) / 3) * 100;

  useEffect(() => {
    if (leafletLoaded) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const savedSession = localStorage.getItem('playtheway_session');
    if (savedSession) {
      try {
        const data = JSON.parse(savedSession);
        setStep(data.step); setCity(data.city); setAgeGroup(data.ageGroup);
        setSessionId(data.sessionId); setStory(data.story);
        setPlannedRoute(data.plannedRoute || []); setIsDarkMode(data.isDarkMode ?? false);
      } catch (e) { localStorage.removeItem('playtheway_session'); }
    }
  }, []);

  useEffect(() => {
    if (step !== 'onboarding' || city || ageGroup) {
      localStorage.setItem('playtheway_session', JSON.stringify({ step, city, ageGroup, sessionId, story, plannedRoute, isDarkMode }));
    }
  }, [step, city, ageGroup, sessionId, story, plannedRoute, isDarkMode]);

  useEffect(() => { document.documentElement.classList.toggle('dark', isDarkMode); }, [isDarkMode]);

  // Reset quiz states whenever POI changes or story moves to another step
  useEffect(() => {
    setQuizSolved(false);
    setSelectedQuizOption(null);
    setQuizFeedback(null);
  }, [story?.currentStepIndex]);

  const resetGame = () => {
    localStorage.removeItem('playtheway_session');
    localStorage.removeItem('playtheway_session_id');
    setStep('onboarding');
    setCity('');
    setAgeGroup('');
    setSessionId('');
    setStory(null);
    setPlannedRoute([]);
    setPhotoSavedUrl(null);
    setCurrentTab('adventure');
  };

  const startAdventure = async () => {
    if (!city || !ageGroup) return;
    setError(null); setStep('loading');
    const newSessionId = crypto.randomUUID ? crypto.randomUUID() : `session_${Date.now()}`;
    setSessionId(newSessionId);
    try {
      let coords: { latitude?: number; longitude?: number } = {};
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      } catch (e) {
        console.warn('Brak GPS, uzywamy nazwy miasta.');
      }
      const childrenNamesList = user?.user_metadata?.children || [];
      const childrenStr = childrenNamesList.join(', ');
      const result = await callAdventureWebhook({ 
        sessionId: newSessionId, 
        city, 
        ageGroup, 
        userId: user?.id, 
        children: childrenStr,
        ...coords 
      });
      if (!result || !result.narrative_text) throw new Error('Serwer n8n zwrocil puste dane.');
      setStory(result);
      if (result.plannedRoute && result.plannedRoute.length > 0) { setPlannedRoute(result.plannedRoute); setStep('route'); }
      else setStep('story');
    } catch (err: any) { setError(err.message || 'Blad podczas uruchamiania przygody.'); setStep('onboarding'); }
  };

  const makeChoice = async (choiceIndex: number) => {
    if (!story) return;
    const choice = story.choices[choiceIndex];
    setError(null); setStep('loading');
    try {
      const childrenNamesList = user?.user_metadata?.children || [];
      const childrenStr = childrenNamesList.join(', ');
      const result = await callAdventureWebhook({
        sessionId, city,
        userId: user?.id,
        children: childrenStr,
        userChoice: typeof choice === 'string' ? choice : (choice.target_location || choice.button_text || choice.action_description),
      });
      if (!result || !result.narrative_text) throw new Error('Serwer zwrocil niekompletne dane kroku.');
      setStory(result);
      if (result.plannedRoute && result.plannedRoute.length > 0) setPlannedRoute(result.plannedRoute);
      setStep('story');
    } catch (err: any) { setError(err.message || 'Blad podczas pobierania kolejnego kroku.'); setStep('story'); }
  };

  const currentStepIndex = story?.currentStepIndex ?? 0;
  const totalSteps = story?.totalSteps ?? 8;
  const currentInventory = story?.inventory ?? [];
  const isGameFinished = currentStepIndex >= totalSteps || (currentStepIndex === totalSteps - 1 && quizSolved);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#eae3d2] dark:bg-[#121316] text-slate-800 dark:text-slate-200 flex items-center justify-center p-4 lg:p-6 font-sans transition-colors duration-300">
      {/* Outer Tablet Frame */}
      <div className="w-full max-w-md lg:max-w-[1200px] bg-[#fdfbf7] dark:bg-[#1e2025] rounded-[32px] lg:rounded-[40px] shadow-2xl overflow-hidden relative border-[6px] lg:border-[14px] border-[#1e2024] dark:border-[#0d0e10] transition-all duration-300 flex flex-col min-h-[500px] lg:h-full lg:max-h-[740px]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0b3861] via-[#0f5379] to-[#0c3157] text-white px-5 py-3 flex flex-col gap-3 lg:gap-0 lg:flex-row lg:items-center lg:justify-between border-b border-[#0b2b48] shadow-md z-10">
          
          {/* Left: Player Profile & Level */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAvatarModal(true)}
              className="relative group focus:outline-none cursor-pointer"
              title="Wybierz awatar"
            >
              <div className="w-10 h-10 rounded-full border-2 border-yellow-400 bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-2xl shadow-inner select-none">
                {currentAvatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border border-white text-[10px] font-extrabold text-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                {userLevel}
              </div>
            </button>
            <div>
              <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider leading-none">Ranga</div>
              <div className="text-xs font-extrabold text-yellow-400 leading-normal">{userRank}</div>
              {user && (
                <div className="text-[8px] text-white/50 truncate max-w-[100px] leading-none" title={user.email}>
                  {user.email.split('@')[0]}
                </div>
              )}
            </div>
            <div className="ml-3 hidden sm:block">
              <div className="text-[9px] text-white/50 leading-none mb-1">Postęp poziomu ({completedCount % 3}/3 wypraw)</div>
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${nextLevelProgress}%` }} />
              </div>
            </div>
          </div>


          {/* Right: Steps Tracker & Actions */}
          <div className="flex items-center justify-between lg:justify-end gap-4">
            {/* Steps Progress Icons */}
            {currentTab === 'adventure' && (step === 'story' || step === 'route') && totalSteps > 0 && (
              <div className="flex items-center gap-1.5 relative px-2.5 py-1 bg-black/15 rounded-full border border-white/5">
                {/* Connecting background line */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0" />
                {/* Connecting active line */}
                <div 
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-[2px] bg-yellow-400 z-0 transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, Math.max(0, (currentStepIndex / (totalSteps - 1 || 1)) * 100))}%` 
                  }}
                />
                
                {Array.from({ length: totalSteps }).map((_, idx) => {
                  const isVisited = currentStepIndex > idx || isGameFinished;
                  const isCurrent = currentStepIndex === idx && !isGameFinished;
                  return (
                    <div 
                      key={idx} 
                      title={`Miejsce ${idx + 1}`}
                      className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-300 text-[10px] font-extrabold ${
                        isVisited 
                          ? 'bg-yellow-400 text-[#0b3861] scale-105 shadow shadow-yellow-400/20' 
                          : isCurrent 
                            ? 'bg-white text-[#0f5379] ring-2 ring-yellow-400' 
                            : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {isVisited ? '✓' : idx + 1}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Menu Actions */}
            <div className="flex items-center gap-1.5">
              <button onClick={resetGame} className="p-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors cursor-pointer" title="Resetuj przygodę">
                <Home className="w-4 h-4 text-white" />
              </button>
              
              {currentTab === 'adventure' && (step === 'story' || step === 'route') && currentInventory.length > 0 && (
                <button onClick={() => setShowInventory(!showInventory)} className="p-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors relative cursor-pointer" title="Ekwipunek">
                  <Package className="w-4 h-4 text-white" />
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-slate-900 text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {currentInventory.length}
                  </span>
                </button>
              )}

              {currentTab === 'adventure' && (step === 'story' || step === 'route') && (
                <button onClick={() => setStep(step === 'route' ? 'story' : 'route')} className="p-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors lg:hidden cursor-pointer" title="Przełącz Mapa/Przygoda">
                  {step === 'route' ? <Sparkles className="w-4 h-4 text-white" /> : <Map className="w-4 h-4 text-white" />}
                </button>
              )}

              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-lg transition-colors cursor-pointer" title="Motyw">
                {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
              </button>

              {user ? (
                <button onClick={handleLogout} className="p-2 bg-white/10 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg transition-colors cursor-pointer" title="Wyloguj się">
                  <LogOut className="w-4 h-4 text-white" />
                </button>
              ) : (
                <button onClick={() => { setAuthMode('login'); setAuthError(null); setShowAuthModal(true); }} className="p-2 bg-white/10 hover:bg-yellow-400/20 active:bg-yellow-400/30 rounded-lg transition-colors cursor-pointer" title="Zaloguj się">
                  <User className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#f5efe0] dark:bg-[#16171b] border-b border-[#eadabe] dark:border-[#3c3424] px-4 py-2 gap-1.5 z-10">
          {[
            { id: 'adventure', label: '🧭 Wyprawa' },
            { id: 'chronicle', label: '🗺️ Kronika' },
            { id: 'badges', label: '🏆 Odznaki' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setCurrentTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === t.id
                  ? 'bg-[#0d3b66] dark:bg-[#f4d35e] text-white dark:text-slate-900 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-[#efdfc3]/50 dark:hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Inventory Drawer */}
        <AnimatePresence>
          {showInventory && currentInventory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/40 px-6 py-3.5 z-20"
            >
              <p className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
                Zebrany Ekwipunek ({currentInventory.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {currentInventory.map((item: string, idx: number) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="inline-flex items-center gap-1 bg-[#efdfc3] dark:bg-[#2b271d] text-[#8b6b4c] dark:text-[#c4b5a2] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#eadabe] dark:border-[#3c3424]"
                  >
                    👜 {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#faf6ee] dark:bg-[#1a1b20]">
          <AnimatePresence mode="wait">
            {currentTab === 'chronicle' ? (
              user ? (
                <motion.div key="chronicle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full overflow-hidden">
                  <ChronicleView userId={user.id} />
                </motion.div>
              ) : (
                <motion.div key="chronicle-teaser" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 border border-amber-500/25">
                    <Map className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e] text-base mb-1">
                    Twoja Kronika Odkryć
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    Zaloguj się na swoje bezpłatne konto, aby zapisywać pamiątkowe zdjęcia z wypraw na mapie Polski oraz zbierać odznaki odkrywcy.
                  </p>
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(null); setShowAuthModal(true); }}
                    className="px-6 py-3 bg-[#0d3b66] hover:bg-[#0f5379] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Zaloguj się / Załóż konto
                  </button>
                </motion.div>
              )
            ) : currentTab === 'badges' ? (
              user ? (
                <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col h-full overflow-hidden">
                  <BadgesView userId={user.id} />
                </motion.div>
              ) : (
                <motion.div key="badges-teaser" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 border border-amber-500/25">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e] text-base mb-1">
                    Odznaki Odkrywcy
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    Zgodnie z zasadami gamifikacji zdobywaj odznaki za ukończone wyprawy! Zaloguj się, aby zacząć zbierać nagrody w swoim profilu.
                  </p>
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(null); setShowAuthModal(true); }}
                    className="px-6 py-3 bg-[#0d3b66] hover:bg-[#0f5379] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Zaloguj się / Załóż konto
                  </button>
                </motion.div>
              )
            ) : (
              <>
                {step === 'onboarding' && (
              <motion.div 
                key="onboarding" 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 w-full h-full overflow-y-auto lg:overflow-hidden flex flex-col items-center lg:justify-center p-4 lg:p-6"
              >
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-shrink-0">
                  
                  {/* Left Column: Visual guide & instructions "Jak grać" */}
                  <div className="lg:col-span-5 flex flex-col justify-between bg-[#fdfbf7]/40 dark:bg-[#1e2025]/40 rounded-3xl border border-[#eadabe]/60 dark:border-[#3c3424]/60 p-5 shadow-sm relative overflow-hidden backdrop-blur-sm flex-shrink-0">
                    {/* Compass watermark */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 text-[#8b6b4c]/3 dark:text-white/2 pointer-events-none rotate-12">
                      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.8">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2v20M2 12h20M12 2l3 10-3 2-3-2 3-10z" />
                      </svg>
                    </div>

                    <div className="relative z-10 space-y-5">
                      <div className="flex flex-col items-center text-center gap-4 py-2">
                        <div 
                          className="relative flex items-center justify-center"
                          onMouseEnter={() => setLogoHovered(true)}
                          onMouseLeave={() => setLogoHovered(false)}
                        >
                          {/* Magic Sparkles Particles on Hover */}
                          <AnimatePresence>
                            {logoHovered && (
                              <>
                                {[...Array(6)].map((_, i) => {
                                  const angle = (i * 360) / 6;
                                  const rad = (angle * Math.PI) / 180;
                                  const x = Math.cos(rad) * 75;
                                  const y = Math.sin(rad) * 75;
                                  return (
                                    <motion.span
                                      key={i}
                                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                      animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.3, 1, 0], x, y }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.9, ease: "easeOut", repeat: Infinity, repeatDelay: 0.05, delay: i * 0.06 }}
                                      className="absolute text-yellow-400 dark:text-yellow-300 text-sm pointer-events-none select-none"
                                    >
                                      ✨
                                    </motion.span>
                                  );
                                })}
                              </>
                            )}
                          </AnimatePresence>
                          <img 
                            src={logo} 
                            alt="PlayTheWay Logo" 
                            className="h-28 lg:h-36 w-auto drop-shadow-xl hover:scale-105 hover:rotate-[-15deg] transition-transform duration-500 cursor-pointer" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif font-extrabold text-sm text-slate-700 dark:text-slate-200">
                          📜 Instrukcja Wyprawy
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          To interaktywna gra paragrafowa, która zamienia spacer po mieście w prawdziwe poszukiwanie skarbów dla dzieci!
                        </p>
                      </div>

                      {/* Stepper info */}
                      <div className="space-y-3 pt-1">
                        {[
                          { step: '1', icon: '📍', title: 'Wybierz miasto', text: 'Wpisz nazwę lub kliknij jedno z popularnych miast.' },
                          { step: '2', icon: '🎒', title: 'Wybierz wiek', text: 'Dopasuj poziom zagadek do swojej drużyny.' },
                          { step: '3', icon: '🔍', title: 'Rozwiązuj zagadki', text: 'Podążaj za punktami na mapie i zbieraj przedmioty.' },
                          { step: '4', icon: '📸', title: 'Zrób zdjęcie', text: 'Na koniec zrób zdjęcie w przebraniu i zapisz je na mapie!' }
                        ].map((s, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <div className="w-5 h-5 rounded-full bg-[#efdfc3] dark:bg-[#2b271d] flex items-center justify-center text-[10px] font-extrabold text-[#8b6b4c] dark:text-[#c4b5a2] flex-shrink-0 mt-0.5">
                              {s.step}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                                {s.icon} {s.title}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{s.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Account Indicator CTA */}
                    <div className="relative z-10 mt-6 pt-4 border-t border-[#eadabe]/60 dark:border-[#3c3424]/60">
                      {user ? (
                        <div className="p-3 rounded-xl bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 text-[10px] text-green-700 dark:text-green-400 flex items-start gap-2.5">
                          <span className="text-xs">🔑</span>
                          <div>
                            <p className="font-extrabold uppercase tracking-wide text-[9px] leading-tight">Karta Odkrywcy Aktywna</p>
                            <p className="mt-0.5 leading-snug">
                              Zbierasz punkty i odznaki dla:{' '}
                              <span className="font-bold underline">
                                {user.user_metadata?.children?.join(', ') || 'Twojej drużyny'}
                              </span>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-[#0d3b66]/5 dark:bg-[#f4d35e]/5 border border-[#0d3b66]/10 dark:border-[#f4d35e]/15 text-[10px] text-slate-500 dark:text-slate-400 flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="font-bold text-[#0d3b66] dark:text-[#f4d35e]">Graj z kontem Odkrywcy!</p>
                            <p className="leading-snug text-slate-400">Zapisuj pamiątkowe zdjęcia na mapie Polski i zbieraj odznaki.</p>
                          </div>
                          <button
                            onClick={() => { setAuthMode('login'); setAuthError(null); setShowAuthModal(true); }}
                            className="px-2.5 py-1.5 bg-[#0d3b66] hover:bg-[#0f5379] text-white text-[9px] font-bold rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                          >
                            Zaloguj się
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Setting up form */}
                  <div className="lg:col-span-7 flex flex-col bg-[#fdfbf7] dark:bg-[#1e2025] rounded-3xl border-2 border-[#eadabe] dark:border-[#3c3424] p-5 lg:p-6 shadow-xl relative overflow-hidden justify-between flex-shrink-0 lg:min-h-0">
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 text-[#8b6b4c]/3 pointer-events-none rotate-45">
                      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.8">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2v20M2 12h20" />
                      </svg>
                    </div>

                    <div className="space-y-5 relative z-10">
                      <div>
                        <span className="bg-[#efdfc3] dark:bg-[#2b271d] text-[#8b6b4c] dark:text-[#c4b5a2] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                          Konfiguracja Gry
                        </span>
                        <h3 className="font-serif font-extrabold text-base lg:text-lg text-[#0d3b66] dark:text-[#f4d35e] mt-1">
                          Wybierz parametry trasy
                        </h3>
                      </div>

                      {/* City Selection */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8b6b4c] dark:text-[#c4b5a2] uppercase tracking-wider flex items-center gap-1">
                          📍 Krok 1: Cel Podróży
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6b4c]" />
                          <input
                            type="text"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            placeholder="Wpisz miasto np. Kraków, Warszawa..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#eadabe] dark:border-[#3c3424] bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f5379] transition-all text-xs font-semibold shadow-inner dark:text-white"
                          />
                        </div>

                        {/* Quick cities recommendations */}
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Popularne miasta (kliknij aby wybrać):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {['Katowice', 'Kraków', 'Warszawa', 'Gdańsk', 'Poznań', 'Wrocław'].map(recCity => (
                              <button
                                key={recCity}
                                type="button"
                                onClick={() => setCity(recCity)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                  city.toLowerCase() === recCity.toLowerCase()
                                    ? 'bg-[#0d3b66] border-[#0d3b66] text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-900 border-[#eadabe] dark:border-[#3c3424] text-slate-600 dark:text-slate-300 hover:border-[#8b6b4c] hover:bg-[#efdfc3]/10'
                                }`}
                              >
                                {recCity}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Age group selection */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8b6b4c] dark:text-[#c4b5a2] uppercase tracking-wider flex items-center gap-1">
                          🛡️ Krok 2: Klasa Twojej Drużyny (Poziom Trudności)
                        </label>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                          {[
                            { id: '5-7', label: '5-7 lat', title: 'Mali Odkrywcy', desc: 'Legendy, proste quizy i ciekawe opowieści 🧭' },
                            { id: '7-11', label: '7-11 lat', title: 'Poszukiwacze Przygód', desc: 'Fakty historyczne, łamigłówki i poszukiwanie śladów 🔑' },
                            { id: '11-14', label: '11-14 lat', title: 'Mistrzowie Zagadek', desc: 'Skomplikowane śledztwa, trudne sekrety i rekwizyty 📜' }
                          ].map(ag => (
                            <button
                              key={ag.id}
                              type="button"
                              onClick={() => setAgeGroup(ag.id)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                ageGroup === ag.id
                                  ? 'border-[#0f5379] bg-[#efdfc3]/40 dark:bg-[#efdfc3]/10 shadow-sm ring-1 ring-[#0f5379]'
                                  : 'border-[#eadabe] dark:border-[#3c3424] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-[#8b6b4c]'
                              }`}
                            >
                              <div className="w-full">
                                <div className="font-serif font-extrabold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                  <span className="bg-[#efdfc3] dark:bg-[#2b271d] text-[#8b6b4c] dark:text-[#c4b5a2] text-[8px] px-1.5 py-0.5 rounded font-sans leading-none flex-shrink-0">
                                    {ag.label}
                                  </span>
                                  {ag.title}
                                </div>
                                <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{ag.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Launch Section */}
                    <div className="space-y-3 pt-4 border-t border-[#eadabe] dark:border-[#3c3424] relative z-10 mt-4">
                      <button
                        onClick={startAdventure}
                        disabled={!city || !ageGroup}
                        className="w-full bg-[#0d3b66] hover:bg-[#0f5379] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
                      >
                        🧭 Rozpocznij Misję Odkrywcy
                      </button>

                      {!city || !ageGroup ? (
                        <p className="text-[9px] text-slate-400 text-center">
                          * Wpisz lub wybierz miasto i klasę drużyny powyżej, aby odblokować start przygody.
                        </p>
                      ) : (
                        <p className="text-[9px] text-green-600 dark:text-green-400 font-semibold text-center animate-pulse">
                          ✓ Wszystko gotowe! Kliknij przycisk powyżej, aby ruszyć w drogę.
                        </p>
                      )}

                      {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-2 text-red-700 dark:text-red-400 text-xs">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Wystąpił problem</p>
                            <p>{error}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div 
                key="loading" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="flex-1 flex flex-col items-center justify-center space-y-6 py-12"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} 
                    className="w-16 h-16 rounded-full border-4 border-[#efdfc3] border-t-[#0f5379]" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[#0d3b66] font-bold text-xs">🧭</div>
                </div>
                <div className="text-center">
                  <p className="font-serif font-bold text-slate-800 dark:text-slate-200">
                    Otwieramy stare kroniki dla miasta {city}...
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    AI kreśli unikalną trasę i zagadki dla Waszej drużyny
                  </p>
                </div>
              </motion.div>
            )}

            {/* Desktop: Side-by-side 3-column layout */}
            {/* Mobile: Toggled views (Story or Route) */}
            {(step === 'story' || step === 'route') && story && (
              <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 lg:divide-x lg:divide-[#eadabe] lg:dark:divide-[#3c3424] h-full overflow-hidden">
                
                {/* COLUMN 1: Story / Narrative */}
                {/* Visible on Desktop, or on Mobile only if step === 'story' */}
                <div className={`flex-col p-6 relative bg-[#fdfbf7] dark:bg-[#1e2025] h-full justify-between overflow-hidden transition-all ${
                  step === 'story' ? 'flex' : 'hidden lg:flex'
                }`}>
                  <div className="z-10">
                    <div className="flex justify-between items-start">
                      <span className="inline-flex items-center gap-1 bg-[#efdfc3] dark:bg-[#2b271d] text-[#8b6b4c] dark:text-[#c4b5a2] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                        Opowieść i Ślady
                      </span>
                      {story.currentPOI?.category && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                          {story.currentPOI.category}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-xl lg:text-2xl font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e] leading-tight mb-3">
                      {story.currentPOI?.name || story.city || 'Kolejny Krok'}
                    </h2>
                    
                    {story.item_found && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2.5 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl mb-4"
                      >
                        <span className="text-xl">🔑</span>
                        <div>
                          <p className="text-[9px] font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wide">Znaleziono przedmiot!</p>
                          <p className="text-xs font-bold text-amber-900 dark:text-amber-100">{story.item_found}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="overflow-y-auto max-h-[200px] lg:max-h-[340px] scrollbar-hide text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif pr-1">
                      {story.narrative_text}
                    </div>
                  </div>

                  {/* Corner stamp/wax seal style route badge */}
                  <RouteBadge className="absolute -top-3 -right-3 w-16 h-16 opacity-85 rotate-12 hover:rotate-45 transition-transform duration-700 pointer-events-none hidden lg:block" />

                  {/* Architectural lineart sketch at the bottom */}
                  <div className="relative h-28 w-full mt-4 flex items-end">
                    <GothicSketch className="w-full h-full text-[#8b6b4c] dark:text-[#a0907d] opacity-15 dark:opacity-10" />
                  </div>
                </div>

                {/* COLUMN 2: Interaction (Quiz OR Choices) */}
                {/* Visible on Desktop, or on Mobile only if step === 'story' */}
                <div className={`flex-col p-6 bg-[#faf6ee] dark:bg-[#1a1b20] h-full overflow-y-auto scrollbar-hide transition-all ${
                  step === 'story' ? 'flex' : 'hidden lg:flex'
                }`}>
                  
                  {/* Quiz View (Active & Unsolved) */}
                  {story.quiz && !quizSolved ? (
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                          Zagadka lokacji
                        </span>
                        <h3 className="text-base lg:text-lg font-serif font-bold text-slate-800 dark:text-slate-100 leading-snug mb-4">
                          {story.quiz.question}
                        </h3>
                        
                        <div className="space-y-2.5">
                          {story.quiz.options.map((option, idx) => {
                            const isSelected = selectedQuizOption === idx;
                            const isCorrect = idx === story.quiz?.correct_index;
                            
                            let btnStyle = "border-[#eadabe] dark:border-[#3c3424] bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-[#0d3b66] dark:hover:border-[#f4d35e]";
                            let badgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-500";
                            
                            if (quizFeedback && isSelected) {
                              if (quizFeedback === 'correct') {
                                btnStyle = "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300";
                                badgeStyle = "bg-emerald-500 text-white";
                              } else {
                                btnStyle = "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300";
                                badgeStyle = "bg-rose-500 text-white";
                              }
                            } else if (quizFeedback && isCorrect) {
                              // Reveal correct answer if user got it wrong
                              btnStyle = "border-emerald-500/70 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-300";
                              badgeStyle = "bg-emerald-500/70 text-white";
                            }

                            return (
                              <button
                                key={idx}
                                disabled={quizFeedback !== null}
                                onClick={() => {
                                  setSelectedQuizOption(idx);
                                  if (idx === story.quiz?.correct_index) {
                                    setQuizFeedback('correct');
                                  } else {
                                    setQuizFeedback('wrong');
                                  }
                                }}
                                className={`w-full p-3.5 rounded-xl border text-left transition-all hover:shadow-sm flex items-center justify-between gap-3 text-xs font-semibold cursor-pointer ${btnStyle}`}
                              >
                                <span className="flex-1 pr-1 leading-snug">{option}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${badgeStyle}`}>
                                  {getOptionIcon(option)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quiz Feedback message / solve button */}
                      <div className="mt-4 pt-4 border-t border-[#eadabe] dark:border-[#3c3424]">
                        {quizFeedback === 'correct' && (
                          <div className="space-y-3">
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                              ✨ Doskonale! Wasza odpowiedź jest prawidłowa.
                            </p>
                            <button
                              onClick={() => setQuizSolved(true)}
                              className="w-full py-3 bg-[#0d3b66] hover:bg-[#0f5379] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Pokaż opcje podróży
                            </button>
                          </div>
                        )}
                        {quizFeedback === 'wrong' && (
                          <div className="space-y-3">
                            <p className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                              ❌ To nie to! Zastanówcie się jeszcze raz i spróbujcie ponownie.
                            </p>
                            <button
                              onClick={() => {
                                setSelectedQuizOption(null);
                                setQuizFeedback(null);
                              }}
                              className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Spróbuj jeszcze raz
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Choices View (Normal Choices or Grand Finale) */
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 bg-[#efdfc3] dark:bg-[#2b271d] text-[#8b6b4c] dark:text-[#c4b5a2] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                          Następny Krok
                        </span>
                        
                        {quizSolved && (
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl mb-4 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                            ✅ Zagadka rozwiązana! Wybierzcie kolejny cel podróży.
                          </div>
                        )}

                        <div className="space-y-2.5">
                          {isGameFinished ? (
                            photoSavedUrl ? (
                              <div className="p-5 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-xl shadow-md text-center animate-in face-in zoom-in">
                                <Sparkles className="w-10 h-10 mx-auto mb-2 text-yellow-100 animate-pulse" />
                                <h3 className="text-lg font-bold mb-1">🎉 Zdjęcie Zapisane!</h3>
                                <p className="mb-4 text-xs text-amber-50">Twoja pamiątka została pomyślnie przypięta do mapy Polski w zakładce Kronika!</p>
                                <img src={photoSavedUrl} className="w-32 h-32 object-cover rounded-xl mx-auto border-2 border-white shadow-md mb-4" alt="Pamiątka" />
                                <button onClick={resetGame} className="w-full py-3 bg-white text-[#0d3b66] font-bold rounded-xl hover:bg-yellow-50 transition-colors shadow flex justify-center items-center gap-1.5 text-xs cursor-pointer">
                                  <Map className="w-4 h-4" /> Nowa Przygoda
                                </button>
                              </div>
                            ) : user ? (
                              <SouvenirCamera
                                userId={user.id}
                                city={city || story.city || 'Nieznane Miasto'}
                                lat={story.currentPOI?.lat}
                                lon={story.currentPOI?.lon}
                                onPhotoSaved={(url) => setPhotoSavedUrl(url)}
                              />
                            ) : (
                              <div className="p-5 bg-gradient-to-br from-[#0d3b66] to-[#0f5379] text-white rounded-xl shadow-md text-center animate-in fade-in zoom-in space-y-4">
                                <Sparkles className="w-10 h-10 mx-auto mb-1 text-yellow-100 animate-pulse" />
                                <h3 className="text-lg font-bold">🎉 Ukończyłeś Grę!</h3>
                                <p className="text-xs text-blue-100">
                                  Zaloguj się lub załóż konto, aby zrobić zdjęcie z nakładkami (Puchar, Medal, Indiana Jones) i zapisać je w swojej kronice.
                                </p>
                                <button
                                  onClick={() => { setAuthMode('login'); setAuthError(null); setShowAuthModal(true); }}
                                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl transition-colors shadow flex justify-center items-center gap-1.5 text-xs cursor-pointer"
                                >
                                  Zaloguj się / Rejestracja
                                </button>
                                <button
                                  onClick={resetGame}
                                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                                >
                                  Zakończ bez zapisywania
                                </button>
                              </div>
                            )
                          ) : story.choices && story.choices.length > 0 ? (
                            story.choices.map((choice: any, idx) => {
                              const displayTitle = typeof choice === 'string' ? choice : choice.button_text || 'Opcja ' + (idx + 1);
                              const displayDesc = typeof choice === 'string' ? 'Rozpocznij ten etap' : choice.action_description || 'Przejdź dalej';
                              return (
                                <button
                                  key={idx}
                                  onClick={() => makeChoice(idx)}
                                  className="w-full bg-white dark:bg-slate-900 border border-[#eadabe] dark:border-[#3c3424] hover:border-[#0d3b66] dark:hover:border-[#f4d35e] p-3.5 rounded-xl text-left transition-all hover:shadow-sm flex items-center justify-between gap-3 cursor-pointer group"
                                >
                                  <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-snug group-hover:text-[#0f5379] dark:group-hover:text-[#f4d35e] transition-colors">
                                      {displayTitle}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{displayDesc}</p>
                                  </div>
                                  <div className="bg-slate-100 dark:bg-slate-800 group-hover:bg-[#efdfc3]/40 p-1.5 rounded-lg text-slate-400 group-hover:text-[#0f5379] transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 text-orange-800 dark:text-orange-300 text-xs">
                              Brak kolejnych celów. Spróbuj zresetować przygodę.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* COLUMN 3: Map View */}
                {/* Visible on Desktop, or on Mobile only if step === 'route' */}
                <div className={`flex-col p-6 bg-[#fdfbf7] dark:bg-[#1e2025] h-full justify-between overflow-hidden transition-all ${
                  step === 'route' ? 'flex' : 'hidden lg:flex'
                }`}>
                  <div>
                    <span className="inline-flex items-center gap-1 bg-[#efdfc3] dark:bg-[#2b271d] text-[#8b6b4c] dark:text-[#c4b5a2] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                      Mapa Wędrówki
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#0d3b66] dark:text-[#f4d35e]">
                      {story.city || 'Ścieżka Odkrywców'}
                    </h3>
                    {story.totalDistanceKm && (
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Długość trasy: ~{story.totalDistanceKm} km
                      </p>
                    )}
                  </div>

                  {/* Leaflet map viewport wrapper */}
                  <div className="flex-1 my-4 rounded-2xl overflow-hidden border border-[#eadabe] dark:border-[#3c3424] relative shadow-inner min-h-[260px] lg:min-h-0">
                    <RouteMapView 
                      visitedPOIs={story?.visitedPOIs || []} 
                      currentPOI={story?.currentPOI as any} 
                      choices={story?.choices?.map((c: any) => c.target_location) || []} 
                      availablePOIs={story?.availablePOIs || []} 
                      city={city} 
                    />
                  </div>

                  {/* Centering / Navigation button below the map */}
                  <div className="space-y-2">
                    {/* List of points of interest on route */}
                    <div className="max-h-24 overflow-y-auto scrollbar-hide space-y-1.5 pr-1 text-xs">
                      {story.visitedPOIs?.filter(p => p !== null).slice(-1).map((poi: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span className="truncate">{poi.name}</span>
                        </div>
                      ))}
                      {story.currentPOI && (
                        <div className="flex items-center gap-2 text-[#0f5379] dark:text-[#f4d35e] font-bold">
                          <span className="animate-pulse">📍</span>
                          <span className="truncate">{story.currentPOI.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Mobile toggle button (switches back to Narrative/Story view) */}
                    <button 
                      onClick={() => setStep('story')}
                      className="w-full bg-[#0d3b66] hover:bg-[#0f5379] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer lg:hidden"
                    >
                      <Sparkles className="w-4 h-4" /> Przejdź do historii
                    </button>
                    
                    {/* Desktop information/decorative card */}
                    <div className="hidden lg:block p-3 rounded-xl bg-[#faf6ee] dark:bg-slate-900 border border-[#eadabe] dark:border-[#3c3424] text-[10px] text-slate-500 leading-snug">
                      🌍 Klikaj ikony na mapie, aby dowiedzieć się więcej o krakowskich skarbach.
                    </div>
                  </div>
                </div>

              </div>
            )}
          </>
        )}
          </AnimatePresence>
        </div>

      </div>

      {/* Auth Modal Overlay */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[#fdfbf7] dark:bg-[#1e2025] rounded-3xl border-2 border-[#eadabe] dark:border-[#3c3424] p-6 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Tabs: Login / Register - Hidden in forgot / update mode */}
              {authMode !== 'forgot' && authMode !== 'update' && (
                <div className="flex border-b border-[#eadabe] dark:border-[#3c3424] mb-5">
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'text-[#0d3b66] dark:text-[#f4d35e] border-b-2 border-[#0d3b66] dark:border-[#f4d35e]'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    Logowanie
                  </button>
                  <button
                    onClick={() => { setAuthMode('register'); setAuthError(null); }}
                    className={`flex-1 pb-3 text-sm font-bold transition-all cursor-pointer ${
                      authMode === 'register'
                        ? 'text-[#0d3b66] dark:text-[#f4d35e] border-b-2 border-[#0d3b66] dark:border-[#f4d35e]'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    Rejestracja
                  </button>
                </div>
              )}

              <h3 className="font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e] text-base mb-2">
                {authMode === 'login' && '🔑 Witaj Odkrywco!'}
                {authMode === 'register' && '🧭 Załóż Kartę Odkrywcy'}
                {authMode === 'forgot' && '🔒 Odzyskaj Hasło Odkrywcy'}
                {authMode === 'update' && '🆕 Ustaw Nowe Hasło'}
              </h3>
              <p className="text-[10px] text-slate-400 mb-4 leading-normal">
                {authMode === 'login' && 'Zaloguj się na swoje konto, aby przywrócić zapisaną kronikę i odznaki.'}
                {authMode === 'register' && 'Zarejestruj się, aby zbierać punkty, pamiątki i przypinać zdjęcia do mapy Polski.'}
                {authMode === 'forgot' && 'Wpisz swój email. Wyślemy Ci link do ustawienia nowego hasła.'}
                {authMode === 'update' && 'Wpisz poniżej swoje nowe, silne hasło odkrywcy.'}
              </p>

              {authError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl mb-4 flex items-start gap-2 text-rose-700 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="flex-1 leading-snug">{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode !== 'update' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#8b6b4c] dark:text-[#c4b5a2] uppercase">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        placeholder="odkrywca@email.pl"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#eadabe] dark:border-[#3c3424] bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0f5379] dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {authMode !== 'forgot' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-[#8b6b4c] dark:text-[#c4b5a2] uppercase">Hasło</label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => { setAuthMode('forgot'); setAuthError(null); }}
                          className="text-[10px] font-bold text-[#8b6b4c] dark:text-[#c4b5a2] hover:underline cursor-pointer"
                        >
                          Zapomniałeś hasła?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#eadabe] dark:border-[#3c3424] bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0f5379] dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {authMode === 'register' && (
                  <div className="space-y-2 border-t border-[#eadabe] dark:border-[#3c3424] pt-3 mt-2">
                    <label className="text-[10px] font-bold text-[#8b6b4c] dark:text-[#c4b5a2] uppercase block">
                      👶 Imiona Małych Odkrywców
                    </label>
                    <p className="text-[9px] text-slate-400 mb-1 leading-snug">
                      Podaj imiona dzieci, aby spersonalizować przygodę!
                    </p>
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                      {childrenNames.map((name, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={e => {
                              const newNames = [...childrenNames];
                              newNames[idx] = e.target.value;
                              setChildrenNames(newNames);
                            }}
                            placeholder={`Imię dziecka ${idx + 1}`}
                            className="flex-1 px-3 py-2 rounded-xl border border-[#eadabe] dark:border-[#3c3424] bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0f5379] dark:text-white"
                          />
                          {childrenNames.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newNames = childrenNames.filter((_, i) => i !== idx);
                                setChildrenNames(newNames);
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                              title="Usuń"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setChildrenNames([...childrenNames, ''])}
                      className="text-[10px] font-bold text-[#0d3b66] dark:text-[#f4d35e] hover:underline cursor-pointer flex items-center gap-1 mt-1"
                    >
                      ➕ Dodaj kolejne dziecko
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-[#0d3b66] hover:bg-[#0f5379] disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {authLoading ? 'Ładowanie...' : 
                   authMode === 'login' ? 'Zaloguj się' : 
                   authMode === 'register' ? 'Utwórz konto' : 
                   authMode === 'forgot' ? 'Wyślij link resetujący' : 
                   'Zmień hasło'}
                </button>
              </form>

              {authMode === 'forgot' && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline cursor-pointer"
                  >
                    ← Powrót do logowania
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Modal */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none"
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[#fdfbf7] dark:bg-[#1e2025] rounded-3xl border-2 border-[#eadabe] dark:border-[#3c3424] p-6 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e] text-base mb-2">
                🤠 Wybierz Awatar Odkrywcy
              </h3>
              <p className="text-[10px] text-slate-400 mb-4 leading-normal">
                Wybierz postać, która będzie reprezentować Twoją drużynę w podróży.
              </p>

              <div className="grid grid-cols-5 gap-3.5 mb-2">
                {[
                  '🤠', '🐉', '🧜‍♀️', '🦉', '🦊',
                  '🐼', '🦄', '🦁', '🧑‍🚀', '🧙‍♂️'
                ].map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => handleSelectAvatar(avatar)}
                    className={`w-10 h-10 rounded-full border-2 text-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                      currentAvatar === avatar
                        ? 'border-yellow-500 bg-yellow-500/10 shadow-md ring-1 ring-yellow-500'
                        : 'border-[#eadabe] dark:border-[#3c3424] bg-white dark:bg-slate-900 hover:border-yellow-400'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;