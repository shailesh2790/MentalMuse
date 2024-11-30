import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How often do you feel overwhelmed?",
    options: ["Rarely", "Sometimes", "Often", "Very Often"]
  },
  {
    id: 2,
    text: "What triggers your anxiety most?",
    options: ["Work/School", "Social Situations", "Health Concerns", "Future Uncertainty"]
  },
  {
    id: 3,
    text: "How does anxiety affect your sleep?",
    options: ["Not at all", "Slight trouble sleeping", "Moderate insomnia", "Severe sleep issues"]
  }
];

const BreathingCard: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [instruction, setInstruction] = useState("Breathe In");
  
  useEffect(() => {
    const breathingCycle = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(breathingCycle);
          localStorage.setItem('onboardingComplete', 'true');
          window.location.href = '/login';
          return 100;
        }
        return prev + 1;
      });
      
      setInstruction(prev => prev === "Breathe In" ? "Breathe Out" : "Breathe In");
    }, 100);

    return () => clearInterval(breathingCycle);
  }, []);

  return (
    <motion.div
      className="bg-teal-50 p-8 rounded-lg shadow-lg text-center"
      animate={{
        scale: instruction === "Breathe In" ? 1.1 : 0.9,
      }}
      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
    >
      <h2 className="text-2xl font-bold text-teal-700 mb-4">Take a Deep Breath</h2>
      <div className="text-4xl font-bold text-teal-600 mb-4">{instruction}</div>
      <div className="w-full bg-teal-200 rounded-full h-2">
        <div
          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-teal-700">Focus on your breath for a moment...</p>
    </motion.div>
  );
};

export default function Onboarding() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showBreathing, setShowBreathing] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowBreathing(true);
    }
  };

  if (showBreathing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
        <BreathingCard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-lg shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-teal-800 mb-8 text-center">
          Let's Understand Your Needs
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {questions[currentQuestion].text}
          </h2>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left rounded-lg border border-teal-200 hover:bg-teal-50 
                         transition-colors duration-200 text-gray-700 hover:text-teal-800"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full ${
                index === currentQuestion ? 'bg-teal-600' : 
                index < currentQuestion ? 'bg-teal-300' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}