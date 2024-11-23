import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, User, Heart, MessageCircle } from 'lucide-react';
import BreathingExercise from '../components/BreathingExercise';
import VoiceJournal from '../components/VoiceJournal';

interface ProgressCardProps {
  title: string;
  value: number;
  max: number;
  icon: 'trophy' | 'star';
  color: string;
}

interface CommunityPostProps {
  username: string;
  timeAgo: string;
  message: string;
  likes: number;
  comments: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, max, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {icon === 'trophy' ? 
          <Trophy className={`w-6 h-6 ${color}`} /> : 
          <Star className={`w-6 h-6 ${color}`} />
        }
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      <span className="text-lg font-semibold text-gray-700">{value}/{max}</span>
    </div>
    <div className="mt-4">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color.replace('text', 'bg')} transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  </motion.div>
);

const CommunityPost: React.FC<CommunityPostProps> = ({ username, timeAgo, message, likes, comments }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-center space-x-3">
      <div className="bg-gray-100 rounded-full p-2">
        <User className="w-5 h-5 text-gray-500" />
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{username}</h3>
        <p className="text-sm text-gray-500">{timeAgo}</p>
      </div>
    </div>
    <p className="mt-3 text-gray-600 leading-relaxed">{message}</p>
    <div className="flex space-x-4 mt-4">
      <button className="flex items-center space-x-1.5 text-gray-500 hover:text-teal-500 transition-colors">
        <Heart className="w-5 h-5" />
        <span>{likes}</span>
      </button>
      <button className="flex items-center space-x-1.5 text-gray-500 hover:text-teal-500 transition-colors">
        <MessageCircle className="w-5 h-5" />
        <span>{comments}</span>
      </button>
    </div>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Progress */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Progress</h2>
          <ProgressCard
            title="Daily Streak"
            value={7}
            max={10}
            icon="trophy"
            color="text-yellow-500"
          />
          <ProgressCard
            title="Mindfulness Points"
            value={450}
            max={1000}
            icon="star"
            color="text-purple-500"
          />
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          {/* Voice Journal Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Voice Journal</h2>
            <VoiceJournal />
          </div>

          {/* Breathing Exercise Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Breathing Exercise
            </h2>
            <BreathingExercise />
          </motion.div>
        </div>

        {/* Right Column - Community */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Community Support</h2>
          <CommunityPost
            username="Anonymous User #1"
            timeAgo="5 minutes ago"
            message="Just completed my first week of daily meditation. Feeling more centered already! 🧘‍♀️"
            likes={24}
            comments={8}
          />
          <CommunityPost
            username="Anonymous User #2"
            timeAgo="15 minutes ago"
            message="Remember: it's okay to take things one day at a time. Small progress is still progress! 💪"
            likes={42}
            comments={12}
          />
        </div>
      </div>
    </div>
  );
}