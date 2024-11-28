import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../services/recommendationService';
import { Activity, Phone, Link } from 'lucide-react';

interface RecommendationProps {
  currentMood: string;
}

const MoodRecommendations: React.FC<RecommendationProps> = ({ currentMood }) => {
  const [recommendations, setRecommendations] = useState<{
    activities: string[];
    message: string;
    resources: Array<{
      title: string;
      contact?: string;
      url?: string;
      description?: string;
      available?: string;
    }>;
  } | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations(currentMood);
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };

    if (currentMood) {
      fetchRecommendations();
    }
  }, [currentMood]);

  if (!recommendations) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Personalized Recommendations</h2>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-4">{recommendations.message}</p>
        
        <div className="space-y-3">
          {recommendations.activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <Activity className="w-5 h-5 text-teal-500" />
              <span>{activity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Helpful Resources</h3>
        <div className="space-y-4">
          {recommendations.resources.map((resource, index) => (
            <div key={index} className="flex items-start gap-3">
              {resource.contact ? (
                <Phone className="w-5 h-5 text-teal-500" />
              ) : (
                <Link className="w-5 h-5 text-teal-500" />
              )}
              <div>
                <h4 className="font-medium">{resource.title}</h4>
                {resource.contact && (
                  <a href={`tel:${resource.contact}`} className="text-teal-600 hover:underline">
                    {resource.contact}
                  </a>
                )}
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" 
                     className="text-teal-600 hover:underline block">
                    {resource.description}
                  </a>
                )}
                {resource.available && (
                  <span className="text-sm text-gray-500">{resource.available}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodRecommendations;