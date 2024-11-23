// src/types/ventTypes.ts
export interface VentRecording {
    id: string;
    timestamp: string;
    audioUrl: string;
    intensity: number;
    mood: string;
    tags: string[];
    emotion: string;
    notes?: string;
  }
  
  export type EmotionType = 'Angry 😠' | 'Frustrated 😤' | 'Worried 😟' | 'Anxious 😰' | 'Calm 😌' | 'Unknown 🤔';
  
  export interface AudioAnalysis {
    emotion: EmotionType;
    intensity: number;
    stressLevel: string;
  }
  