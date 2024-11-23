import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type PhaseType = 'inhale' | 'hold' | 'exhale';

export default function BreathingExercise() {
  const [phase, setPhase] = useState<PhaseType>('inhale');
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return 0;
              case 'hold':
                setPhase('exhale');
                return 0;
              case 'exhale':
                setPhase('inhale');
                setCompletedCycles(prev => prev + 1);
                return 0;
              default:
                return 0;
            }
          }
          return prev + 1;
        });
      }, 50);
    }

    return () => clearInterval(timer);
  }, [phase, isActive]);

  const circleVariants = {
    inhale: { scale: 2, transition: { duration: 4 } },
    hold: { scale: 2, transition: { duration: 4 } },
    exhale: { scale: 1, transition: { duration: 4 } },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Breathing Exercise</h2>
      <motion.div
        className="w-16 h-16 bg-teal-500 rounded-full"
        animate={phase}
        variants={circleVariants}
      />
      <p className="text-lg font-medium text-teal-700 capitalize">{phase}</p>
      <button
        onClick={() => setIsActive(!isActive)}
        className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
      >
        {isActive ? 'Pause' : 'Start'}
      </button>
      <div className="text-gray-600">
        Completed cycles: {completedCycles}
      </div>
    </div>
  );
}