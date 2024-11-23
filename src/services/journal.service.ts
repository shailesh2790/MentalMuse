// src/services/journal.service.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface JournalAnalysis {
  transcript: string;
  mood: string;
  suggestions: Array<{
    type: 'book' | 'game' | 'activity';
    title: string;
    description: string;
  }>;
}

export const journalService = {
  async analyzeAudio(audioBlob: Blob): Promise<JournalAnalysis> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await axios.post(`${API_URL}/journal/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
};