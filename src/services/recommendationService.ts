// src/services/recommendationService.ts
import api from './api';

interface RecommendationResponse {
  activities: string[];
  message: string;
  resources: Array<{
    title: string;
    contact?: string;
    url?: string;
    description?: string;
    available?: string;
  }>;
}

// src/services/recommendationService.ts
export const getRecommendations = async (mood: string): Promise<RecommendationResponse> => {
    const recommendations = {
      '😊 Happy': {
        activities: ['Journal your positive experiences', 'Share your joy with others', 'Plan future goals', 'Try a new hobby'],
        message: 'Great mood! Here are some ways to maintain your positive energy:'
      },
      '😔 Sad': {
        activities: ['Gentle exercise', 'Talk to a friend', 'Practice self-care', 'Listen to uplifting music'],
        message: 'It\'s okay to feel this way. Here are some activities that might help:'
      },
      '😤 Angry': {
        activities: ['Deep breathing exercises', 'Physical exercise', 'Progressive muscle relaxation', 'Write out your feelings'],
        message: 'Let\'s channel that energy constructively:'
      },
      '😟 Anxious': {
        activities: ['Grounding exercises', 'Meditation', 'Take a nature walk', 'Practice mindfulness'],
        message: 'Here are some calming activities to try:'
      },
      '😌 Peaceful': {
        activities: ['Light yoga', 'Gratitude journaling', 'Creative activities', 'Mindful walking'],
        message: 'Maintain your calm state with these activities:'
      }
    };
  
    return {
      activities: recommendations[mood]?.activities || ['Take a break', 'Practice self-care'],
      message: recommendations[mood]?.message || 'Here are some helpful activities:',
      resources: [
        {
          title: 'Crisis Helpline',
          contact: '1-800-273-8255',
          available: '24/7'
        }
      ]
    };
  };