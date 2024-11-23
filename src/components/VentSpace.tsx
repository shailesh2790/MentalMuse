// components/VentSpace.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Trash2, Edit2, Save, X } from 'lucide-react';

interface VentRecording {
  id: string;
  timestamp: string;
  audioUrl: string;
  intensity: number;
  mood: string;
  emotion: string;
  notes?: string;
}

export default function VentSpace() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<VentRecording[]>([]);
  const [volume, setVolume] = useState(0);
  const [selectedMood, setSelectedMood] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const moods = [
    '😤 Angry', '😔 Sad', '😟 Anxious', 
    '😌 Relieved', '😊 Happy', '😐 Neutral'
  ];

  // Simple emotion analysis function
  const analyzeEmotion = (volume: number): string => {
    if (volume > 130) return 'Angry 😠';
    if (volume > 100) return 'Frustrated 😤';
    if (volume > 70) return 'Worried 😟';
    if (volume > 50) return 'Anxious 😰';
    return 'Calm 😌';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newRecording: VentRecording = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          audioUrl: audioUrl,
          intensity: volume,
          mood: selectedMood || 'Not specified',
          emotion: analyzeEmotion(volume)
        };

        setRecordings(prev => [newRecording, ...prev]);
        setSelectedMood('');
        chunksRef.current = [];
      };

      // Set up audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        if (isRecording) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(average);
          requestAnimationFrame(checkVolume);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      checkVolume();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVolume(0);
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Mood Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          How are you feeling?
        </h3>
        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedMood === mood 
                  ? 'bg-teal-100 text-teal-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Recording Button */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-6 rounded-full transition-all ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-teal-500 hover:bg-teal-600'
          } text-white`}
          whileTap={{ scale: 0.95 }}
          animate={isRecording ? { 
            scale: volume > 70 ? 1.1 + (volume / 1000) : 1 
          } : {}}
        >
          {isRecording ? (
            <Square className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </motion.button>
        <p className="text-sm text-gray-600">
          {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
        </p>
      </div>

      {/* Recordings List */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Your Recordings</h3>
        <div className="max-h-96 overflow-y-auto space-y-3">
          <AnimatePresence>
            {recordings.map((recording) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm text-gray-500">
                      {recording.timestamp}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                        {recording.mood}
                      </span>
                      <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {recording.emotion}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteRecording(recording.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <audio 
                  src={recording.audioUrl} 
                  controls 
                  className="w-full mb-2"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {recordings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No recordings yet. Start venting!
        </div>
      )}
    </div>
  );
}