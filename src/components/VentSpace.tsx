// src/components/VentSpace.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Volume2, Save, Trash2, Lock, MessageSquare, Music } from 'lucide-react';

interface VentEntry {
  id: string;
  type: 'voice' | 'text';
  content: string;
  audioUrl?: string;
  timestamp: string;
  mood?: string;
  isPrivate: boolean;
}

export default function VentSpace() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ventText, setVentText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [volume, setVolume] = useState(0);
  const [ventEntries, setVentEntries] = useState<VentEntry[]>(() => {
    const saved = localStorage.getItem('ventEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const moods = [
    '😤 Angry',
    '😔 Sad',
    '😟 Anxious',
    '😌 Relieved',
    '😊 Happy',
    '😐 Neutral'
  ];

  useEffect(() => {
    localStorage.setItem('ventEntries', JSON.stringify(ventEntries));
  }, [ventEntries]);

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
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
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

  const saveEntry = (type: 'voice' | 'text') => {
    const newEntry: VentEntry = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? ventText : '',
      audioUrl: type === 'voice' ? audioUrl || '' : undefined,
      timestamp: new Date().toISOString(),
      mood: selectedMood,
      isPrivate
    };

    setVentEntries(prev => [newEntry, ...prev]);
    setVentText('');
    setAudioUrl(null);
    setSelectedMood('');
  };

  const deleteEntry = (id: string) => {
    setVentEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Mood Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">How are you feeling?</h3>
        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
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

      {/* Voice Recording Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Voice Journal</h3>
        <div className="flex flex-col items-center space-y-4">
          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-6 rounded-full transition-all ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
            } text-white`}
            whileHover={{ scale: 1.05 }}
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

          {audioUrl && (
            <div className="w-full space-y-4">
              <audio src={audioUrl} controls className="w-full" />
              <div className="flex justify-between">
                <button
                  onClick={() => saveEntry('voice')}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Recording</span>
                </button>
                <button
                  onClick={() => setAudioUrl(null)}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Text Venting Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Written Vent</h3>
        <div className="space-y-4">
          <textarea
            value={ventText}
            onChange={(e) => setVentText(e.target.value)}
            placeholder="Type your thoughts here... This is a safe space to express yourself."
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
            rows={4}
          />
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                isPrivate ? 'text-teal-600 bg-teal-50' : 'text-gray-600 bg-gray-50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isPrivate ? 'Private Entry' : 'Public Entry'}</span>
            </button>
            <button
              onClick={() => saveEntry('text')}
              disabled={!ventText.trim()}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>

      {/* Saved Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Your Journal Entries</h3>
        <div className="space-y-4">
          {ventEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    {entry.type === 'voice' ? (
                      <Music className="w-5 h-5 text-teal-500" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                    )}
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  {entry.mood && (
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                      {entry.mood}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {entry.isPrivate && (
                    <Lock className="w-4 h-4 text-teal-500" />
                  )}
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {entry.type === 'voice' && entry.audioUrl && (
                <audio src={entry.audioUrl} controls className="w-full mb-2" />
              )}

              {entry.type === 'text' && (
                <p className="text-gray-700">{entry.content}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}