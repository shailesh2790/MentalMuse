// src/components/MindfulQuest.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Heart, Target, Shield } from 'lucide-react';

type QuestType = 'daily' | 'weekly' | 'challenge';
type QuestCategory = 'awareness' | 'regulation' | 'empathy' | 'social';
type QuestDifficulty = 'easy' | 'medium' | 'hard';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  xpReward: number;
  completed: boolean;
  difficulty: QuestDifficulty;
}

interface UserProgress {
  level: number;
  xp: number;
  streak: number;
  completedQuests: number;
  badges: string[];
}

const initialQuests: Quest[] = [
  {
    id: '1',
    title: "Emotional Awareness",
    description: "Take 5 minutes to identify your current emotions. How do they feel in your body?",
    type: 'daily',
    category: 'awareness',
    xpReward: 50,
    completed: false,
    difficulty: 'easy'
  },
  {
    id: '2',
    title: "Stress Management",
    description: "When stressed today, take 3 deep breaths and note the difference in how you feel.",
    type: 'daily',
    category: 'regulation',
    xpReward: 75,
    completed: false,
    difficulty: 'medium'
  },
  {
    id: '3',
    title: "Active Listening",
    description: "In your next conversation, focus entirely on understanding rather than responding.",
    type: 'daily',
    category: 'empathy',
    xpReward: 100,
    completed: false,
    difficulty: 'hard'
  },
  {
    id: '4',
    title: "Gratitude Practice",
    description: "Write down three things you're grateful for and why they matter to you.",
    type: 'daily',
    category: 'awareness',
    xpReward: 50,
    completed: false,
    difficulty: 'easy'
  }
];

export default function MindfulQuest() {
  // Load saved progress from localStorage or use default values
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('userProgress');
    return saved ? JSON.parse(saved) : {
      level: 1,
      xp: 0,
      streak: 0,
      completedQuests: 0,
      badges: []
    };
  });

  const [activeQuests, setActiveQuests] = useState<Quest[]>(initialQuests);
  const [journalEntries, setJournalEntries] = useState<{ [key: string]: string }>({});
  const [showReward, setShowReward] = useState(false);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const handleJournalChange = (questId: string, value: string) => {
    setJournalEntries(prev => ({
      ...prev,
      [questId]: value
    }));
  };

  const getDifficultyColor = (difficulty: QuestDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const completeQuest = (questId: string) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (!quest || !journalEntries[questId]?.trim()) return;

    // Update quest completion status
    setActiveQuests(prevQuests =>
      prevQuests.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      )
    );

    // Calculate XP and level up
    const newXp = userProgress.xp + quest.xpReward;
    const xpNeededForNextLevel = userProgress.level * 100;
    
    if (newXp >= xpNeededForNextLevel) {
      setUserProgress(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: newXp - xpNeededForNextLevel,
        completedQuests: prev.completedQuests + 1,
        streak: prev.streak + 1
      }));
      setShowReward(true);
    } else {
      setUserProgress(prev => ({
        ...prev,
        xp: newXp,
        completedQuests: prev.completedQuests + 1,
        streak: prev.streak + 1
      }));
    }

    // Clear journal entry
    setJournalEntries(prev => {
      const newEntries = { ...prev };
      delete newEntries[questId];
      return newEntries;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Section */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Level {userProgress.level}</h2>
            <p className="text-gray-600">Journey to Emotional Mastery</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Daily Streak</p>
              <p className="text-xl font-bold text-teal-600">{userProgress.streak} days</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Quests Completed</p>
              <p className="text-xl font-bold text-purple-600">{userProgress.completedQuests}</p>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-teal-600">
                XP Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-teal-600">
                {userProgress.xp}/{userProgress.level * 100}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(userProgress.xp / (userProgress.level * 100)) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Quests Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {activeQuests.map(quest => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-xl p-6 shadow-sm ${
              quest.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{quest.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-sm px-2 py-1 rounded-full ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty}
                </span>
                <span className="text-sm text-teal-600">+{quest.xpReward} XP</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{quest.description}</p>
            
            {!quest.completed ? (
              <div className="space-y-4">
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Reflect on your experience..."
                  rows={3}
                  value={journalEntries[quest.id] || ''}
                  onChange={(e) => handleJournalChange(quest.id, e.target.value)}
                />
                <button
                  onClick={() => completeQuest(quest.id)}
                  disabled={!journalEntries[quest.id]?.trim()}
                  className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Complete Quest
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-gray-600">Quest Completed!</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowReward(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-white rounded-xl p-8 text-center"
              onClick={e => e.stopPropagation()}
            >
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Level Up!</h3>
              <p className="text-gray-600 mb-4">
                Congratulations! You've reached Level {userProgress.level}!
              </p>
              <button
                className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200"
                onClick={() => setShowReward(false)}
              >
                Continue Journey
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}