// src/utils/audioAnalyzer.ts
// src/utils/audioAnalyzer.ts
export const analyzeEmotion = async (audioBlob: Blob): Promise<string> => {
  try {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const data = audioBuffer.getChannelData(0);
    let sum = 0;
    let max = 0;
    
    for (let i = 0; i < data.length; i++) {
      sum += Math.abs(data[i]);
      max = Math.max(max, Math.abs(data[i]));
    }
    
    const average = sum / data.length;
    
    if (max > 0.8) return 'Angry 😠';
    if (max > 0.6) return 'Frustrated 😤';
    if (max > 0.4) return 'Worried 😟';
    if (average > 0.2) return 'Anxious 😰';
    return 'Calm 😌';
  } catch (error) {
    console.error('Error analyzing audio:', error);
    return 'Unknown 🤔';
  }
};