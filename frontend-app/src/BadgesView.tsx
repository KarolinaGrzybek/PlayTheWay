import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Loader2, Check, Lock } from 'lucide-react';

interface CompletedAdventure {
  id: string;
  city: string;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: (adventures: CompletedAdventure[]) => boolean;
  progress: (adventures: CompletedAdventure[]) => { current: number; total: number };
}

const BADGES: Badge[] = [
  {
    id: 'account_created',
    title: 'Szybki Start 🧭',
    description: 'Załóż konto odkrywcy i wejdź do gry',
    icon: '🧭',
    color: 'from-blue-500 to-indigo-600',
    condition: () => true, // Always unlocked for logged-in user
    progress: () => ({ current: 1, total: 1 })
  },
  {
    id: 'first_adventure',
    title: 'Pierwsza Wyprawa 🏅',
    description: 'Ukończ 1 dowolną wyprawę i zapisz pamiątkowe zdjęcie',
    icon: '🏅',
    color: 'from-amber-400 to-amber-600',
    condition: (advs) => advs.length >= 1,
    progress: (advs) => ({ current: Math.min(1, advs.length), total: 1 })
  },
  {
    id: 'explorer_3',
    title: 'Doświadczony Obieżyświat 🗺️',
    description: 'Ukończ 3 wyprawy w różnych miastach',
    icon: '🗺️',
    color: 'from-emerald-400 to-teal-600',
    condition: (advs) => {
      const uniqueCities = new Set(advs.map(a => a.city.toLowerCase().trim()));
      return uniqueCities.size >= 3;
    },
    progress: (advs) => {
      const uniqueCities = new Set(advs.map(a => a.city.toLowerCase().trim()));
      return { current: Math.min(3, uniqueCities.size), total: 3 };
    }
  },
  {
    id: 'explorer_5',
    title: 'Indiana Jones 🤠',
    description: 'Ukończ 5 wypraw i zostań legendarnym poszukiwaczem przygód',
    icon: '🤠',
    color: 'from-orange-500 to-red-600',
    condition: (advs) => {
      const uniqueCities = new Set(advs.map(a => a.city.toLowerCase().trim()));
      return uniqueCities.size >= 5;
    },
    progress: (advs) => {
      const uniqueCities = new Set(advs.map(a => a.city.toLowerCase().trim()));
      return { current: Math.min(5, uniqueCities.size), total: 5 };
    }
  },
  {
    id: 'katowice_completed',
    title: 'Odkrywca Katowic 🏗️',
    description: 'Ukończ wyprawę w Katowicach i zbadaj ślady industrialne',
    icon: '🏗️',
    color: 'from-zinc-500 to-slate-700',
    condition: (advs) => advs.some(a => a.city.toLowerCase().includes('katowic')),
    progress: (advs) => ({ current: advs.some(a => a.city.toLowerCase().includes('katowic')) ? 1 : 0, total: 1 })
  },
  {
    id: 'krakow_completed',
    title: 'Smoczy Pogromca 🐉',
    description: 'Rozwiąż wszystkie tajemnice dawnej stolicy w Krakowie',
    icon: '🐉',
    color: 'from-red-400 to-amber-600',
    condition: (advs) => advs.some(a => a.city.toLowerCase().includes('kraków') || a.city.toLowerCase().includes('krakow')),
    progress: (advs) => ({ current: advs.some(a => a.city.toLowerCase().includes('kraków') || a.city.toLowerCase().includes('krakow')) ? 1 : 0, total: 1 })
  },
  {
    id: 'warszawa_completed',
    title: 'Syreni Strażnik 🧜‍♀️',
    description: 'Ukończ wyprawę w Warszawie śladami legend stolicy',
    icon: '🧜‍♀️',
    color: 'from-rose-400 to-pink-600',
    condition: (advs) => advs.some(a => a.city.toLowerCase().includes('warszaw')),
    progress: (advs) => ({ current: advs.some(a => a.city.toLowerCase().includes('warszaw')) ? 1 : 0, total: 1 })
  },
  {
    id: 'gdansk_completed',
    title: 'Władca Bałtyku ⚓',
    description: 'Ukończ wyprawę w Gdańsku badając skarby Pomorza',
    icon: '⚓',
    color: 'from-cyan-400 to-blue-600',
    condition: (advs) => advs.some(a => a.city.toLowerCase().includes('gdańsk') || a.city.toLowerCase().includes('gdansk')),
    progress: (advs) => ({ current: advs.some(a => a.city.toLowerCase().includes('gdańsk') || a.city.toLowerCase().includes('gdansk')) ? 1 : 0, total: 1 })
  }
];

interface BadgesViewProps {
  userId: string;
}

export function BadgesView({ userId }: BadgesViewProps) {
  const [adventures, setAdventures] = useState<CompletedAdventure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdventures() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('completed_adventures')
          .select('id, city')
          .eq('user_id', userId);

        if (error) throw error;
        setAdventures(data || []);
      } catch (err) {
        console.error("Błąd pobierania odznak:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchAdventures();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#0d3b66] dark:text-[#f4d35e] mb-3" />
        <p className="text-xs font-semibold">Sprawdzanie Twoich trofeów...</p>
      </div>
    );
  }

  const unlockedCount = BADGES.filter(b => b.condition(adventures)).length;

  return (
    <div className="flex-1 flex flex-col p-6 h-full overflow-y-auto scrollbar-hide">
      {/* Header Summary */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#fdfbf7] dark:bg-slate-900 border border-[#eadabe] dark:border-[#3c3424] p-4 rounded-2xl shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
            🏆 Gabinet Trofeów
          </span>
          <h3 className="text-base font-serif font-extrabold text-[#0d3b66] dark:text-[#f4d35e]">
            Twoje Odznaki i Osiągnięcia
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Zdobywaj odznaki za ukończone miasta i zaangażowanie w podróże!
          </p>
        </div>
        
        {/* Progress Circular/Badge Pill */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md border-2 border-white">
            {unlockedCount}
          </div>
          <div>
            <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold leading-none">Odblokowane</div>
            <div className="text-xs font-extrabold text-[#0d3b66] dark:text-yellow-400 leading-normal">
              {unlockedCount} z {BADGES.length} Odznak
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BADGES.map(badge => {
          const isUnlocked = badge.condition(adventures);
          const prog = badge.progress(adventures);
          const pct = Math.min(100, Math.max(0, (prog.current / prog.total) * 100));

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex gap-3.5 select-none ${
                isUnlocked
                  ? 'bg-white dark:bg-[#1e2025] border-[#eadabe] dark:border-[#3c3424] hover:shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              {/* Left Side: Avatar Icon */}
              <div className="flex flex-col items-center justify-center flex-shrink-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-inner relative bg-gradient-to-br ${badge.color} ${!isUnlocked && 'from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 filter grayscale'}`}>
                  <span>{badge.icon}</span>
                  {/* Status Overlay */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-white flex items-center justify-center text-white shadow-sm ${isUnlocked ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-700'}`}>
                    {isUnlocked ? <Check className="w-3 h-3" /> : <Lock className="w-2.5 h-2.5" />}
                  </div>
                </div>
              </div>

              {/* Right Side: Text & Progress */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${isUnlocked ? 'text-[#0d3b66] dark:text-yellow-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold">
                    <span>Postęp</span>
                    <span>{prog.current} / {prog.total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-700/20">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${badge.color} ${!isUnlocked && 'from-slate-400 to-slate-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
