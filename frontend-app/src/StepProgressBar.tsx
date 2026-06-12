import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Lock } from 'lucide-react';
import type { POI } from './api';

interface StepProgressBarProps {
  route: POI[];
  currentStepIndex: number;
  totalSteps: number;
  city?: string;
}

export function StepProgressBar({ route, currentStepIndex, totalSteps, city }: StepProgressBarProps) {
  const progress = totalSteps > 0 ? Math.round(((currentStepIndex) / totalSteps) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Nagłówek paska postępu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {city ? `Trasa: ${city}` : 'Trasa przygody'}
          </span>
        </div>
        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
          {currentStepIndex} / {totalSteps} miejsc
        </span>
      </div>

      {/* Pasek procentowy */}
      <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Miniaturowe punkty trasy (scrollowane) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {route.map((poi, index) => {
          const isVisited = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex-shrink-0 flex flex-col items-center gap-1 cursor-default`}
              title={poi.name}
            >
              {/* Ikona statusu */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                  ${isVisited
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : isCurrent
                    ? 'bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }
                `}
              >
                {isVisited ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isCurrent ? (
                  <MapPin className="w-4 h-4" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
              </div>

              {/* Numer kroku */}
              <span
                className={`
                  text-[9px] font-bold leading-none
                  ${isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}
                `}
              >
                {index + 1}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Aktualna lokalizacja */}
      {route[currentStepIndex] && (
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 p-2.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-900/40"
        >
          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">{currentStepIndex + 1}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary-700 dark:text-primary-300 truncate">
              {route[currentStepIndex].name}
            </p>
            <p className="text-[10px] text-primary-500 dark:text-primary-400 capitalize">
              {route[currentStepIndex].category || 'atrakcja'}
            </p>
          </div>
          {route[currentStepIndex + 1] && (
            <div className="ml-auto text-right flex-shrink-0">
              <p className="text-[10px] text-slate-400">Następne:</p>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 max-w-[80px] truncate text-right">
                {route[currentStepIndex + 1].name}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
