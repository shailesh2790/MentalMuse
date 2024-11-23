// src/components/MindfulQuest.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Heart, Target, Shield, Gift, Award } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  duration: string;
  completed: boolean;
  type: 'breathing' | 'mindfulness' | 'gratitude' | 'movement';
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export default function MindfulQuest() {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [lastCompletedChallenge, setLastCompletedChallenge] = useState<Challenge | null>(null);

  const dailyChallenges: Challenge[] = [
    {
      id: 1,
      title: "Breath of Calm",
      description: "Complete 5 deep breaths when feeling anxious",
      points: 50,
      duration: "1 minute",
      completed: false,
      type: 'breathing'
    },
    {
      id: 2,
      title: "Mindful Moment",
      description: "Name 3 things you can see, hear, and feel right now",
      points: 30,
      duration: "2 minutes",
      completed: false,
      type: 'mindfulness'
    },
    {
      id: 3,
      title: "Gratitude Journey",
      description: "Write down one thing you're grateful for today",
      points: 40,
      duration: "1 minute",
      completed: false,
      type: 'gratitude'
    },
    {
      id: 4,
      title: "Anxiety Release",
      description: "Do a quick stretch or shake out tension",
      points: 35,
      duration: "1 minute",
      completed: false,
      type: 'movement'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first challenge",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      unlocked: false
    },
    {
      id: 2,
      title: "Consistency Champion",
      description: "Maintain a 3-day streak",
      icon: <Trophy className="w-6 h-6 text-orange-500" />,
      unlocked: false
    },
    {
      id: 3,
      title: "Mindfulness Master",
      description: "Complete all daily challenges",
      icon: <Award className="w-6 h-6 text-purple-500" />,
      unlocked: false
    }
  ];

  const [challenges, setChallenges] = useState(dailyChallenges);
  const [userAchievements, setUserAchievements] = useState(achievements);

  const calculateNextLevelExp = () => level * 100;

  const completeChallenge = (challengeId: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;

    setChallenges(challenges.map(c => 
      c.id === challengeId ? { ...c, completed: true } : c
    ));

    // Add experience points
    const newExp = exp + challenge.points;
    setExp(newExp);
    setLastCompletedChallenge(challenge);
    setShowReward(true);

    // Level up if enough exp
    if (newExp >= calculateNextLevelExp()) {
      setLevel(level + 1);
      setExp(newExp - calculateNextLevelExp());
    }

    // Update achievements
    const newAchievements = [...userAchievements];
    if (!newAchievements[0].unlocked) {
      newAchievements[0].unlocked = true;
    }
    if (challenges.every(c => c.completed) && !newAchievements[2].unlocked) {
      newAchievements[2].unlocked = true;
    }
    setUserAchievements(newAchievements);
  };

  const RewardPopup = () => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={() => setShowReward(false)}
    >
      <div className="bg-white rounded-xl p-6 text-center">
        <Gift className="w-12 h-12 text-teal-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Challenge Complete!</h3>
        <p className="text-gray-600 mb-4">
          {lastCompletedChallenge?.title}<br />
          +{lastCompletedChallenge?.points} XP
        </p>
        <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
          Claim Reward
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Level {level}</h2>
            <p className="text-gray-600">Journey to Inner Peace</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Daily Streak</p>
            <p className="text-xl font-bold text-teal-600">{streakDays} days</p>
          </div>
        </div>

        {/* Experience Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-teal-600">
                XP Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-teal-600">
                {exp}/{calculateNextLevelExp()}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(exp / calculateNextLevelExp()) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {challenges.map(challenge => (
          <motion.div
            key={challenge.id}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-xl p-6 shadow-sm ${
              challenge.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{challenge.title}</h3>
              <span className="text-sm text-teal-600">+{challenge.points} XP</span>
            </div>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{challenge.duration}</span>
              <button
                onClick={() => completeChallenge(challenge.id)}
                disabled={challenge.completed}
                className={`px-4 py-2 rounded-lg ${
                  challenge.completed
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >
                {challenge.completed ? 'Completed' : 'Start Challenge'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {userAchievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked
                  ? 'border-teal-200 bg-teal-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {achievement.icon}
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showReward && <RewardPopup />}
      </AnimatePresence>
    </div>
  );
}