// src/components/Onboarding.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Heart } from 'lucide-react';

interface OnboardingQuestion {
  id: number;
  question: string;
  options: string[];
}

const questions: OnboardingQuestion[] = [
  {
    id: 1,
    question: "How often do you experience anxiety?",
    options: ["Rarely", "Sometimes", "Often", "Almost daily"]
  },
  {
    id: 2,
    question: "What usually triggers your stress?",
    options: ["Work", "Relationships", "Health", "Future uncertainty", "Other"]
  },
  {
    id: 3,
    question: "What's your goal for using this app?",
    options: ["Reduce anxiety", "Improve emotional awareness", "Better stress management", "All of the above"]
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: breathing, 1-3: questions, 4: complete
  const [breathCount, setBreathCount] = useState(10);
  const [isBreathing, setIsBreathing] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isBreathing && breathCount > 0) {
      const timer = setTimeout(() => {
        setBreathCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (breathCount === 0) {
      setTimeout(() => setStep(1), 1000);
    }
  }, [breathCount, isBreathing]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (questionId < questions.length) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        {step === 0 && (
          <div className="text-center space-y-6">
            {!isBreathing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome to MentalMuse
                </h1>
                <p className="text-gray-600">
                  Let's start with a quick breathing exercise to center ourselves.
                </p>
                <button
                  onClick={() => setIsBreathing(true)}
                  className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  Begin
                </button>
              </motion.div>
            ) : (
              <motion.div className="space-y-8">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 4, repeat: Infinity }
                  }}
                >
                  <Wind className="w-20 h-20 text-teal-500 mx-auto" />
                </motion.div>
                <div className="text-4xl font-bold text-teal-600">
                  {breathCount}
                </div>
                <p className="text-gray-600">
                  {breathCount % 2 === 0 ? "Breathe in..." : "Breathe out..."}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {step > 0 && step <= questions.length && (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {questions[step - 1].question}
            </h2>
            <div className="space-y-3">
              {questions[step - 1].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(step, option)}
                  className="w-full p-4 text-left bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step > questions.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <Heart className="w-16 h-16 text-teal-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">
              You're all set!
            </h2>
            <p className="text-gray-600">
              Let's begin your wellness journey.
            </p>
            <button
              onClick={completeOnboarding}
              className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Continue to Login
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}