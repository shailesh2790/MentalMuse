import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: number;
  max: number;
  icon: 'trophy' | 'star';
}

export default function ProgressCard({ title, value, max, icon }: ProgressCardProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800">{title}</h3>
        {icon === 'trophy' ? (
          <Trophy className="w-5 h-5 text-yellow-500" />
        ) : (
          <Star className="w-5 h-5 text-yellow-500" />
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-teal-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {value} / {max} completed
      </p>
    </div>
  );
}