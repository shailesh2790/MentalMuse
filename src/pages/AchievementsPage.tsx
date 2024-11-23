import React from 'react';
import { Trophy, Star, Target, Heart, Brain, Zap } from 'lucide-react';

const achievements = [
  {
    icon: <Trophy className="w-6 h-6" />,
    title: '7-Day Streak',
    description: 'Complete daily exercises for 7 days in a row',
    progress: 70,
    color: 'text-yellow-500',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Mindfulness Master',
    description: 'Complete 50 breathing exercises',
    progress: 45,
    color: 'text-purple-500',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Goal Setter',
    description: 'Set and achieve 5 personal goals',
    progress: 60,
    color: 'text-blue-500',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Community Support',
    description: 'Help 10 community members with encouraging comments',
    progress: 30,
    color: 'text-red-500',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Anxiety Master',
    description: 'Complete all anxiety management exercises',
    progress: 20,
    color: 'text-green-500',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Quick Responder',
    description: 'Use quick-relief exercises 20 times',
    progress: 85,
    color: 'text-orange-500',
  },
];

export default function AchievementsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Achievements</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className={`${achievement.color} bg-gray-100 p-3 rounded-lg`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {achievement.description}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {achievement.progress}% completed
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}