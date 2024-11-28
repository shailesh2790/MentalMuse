// src/pages/CommunityPage.tsx
import { useRef } from 'react';
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, User, Mic, Square, Download } from 'lucide-react';
import { getRecommendations } from '../services/recommendationService';

interface MoodEntry {
  mood: string;
  timestamp: string;
  type: 'voice' | 'text';
  content?: string;
  audioUrl?: string;
}

interface Post {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  mood?: string;
}

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

interface MoodRecommendationData {
  activities: string[];
  message: string;
  resources: any[];
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [recommendations, setRecommendations] = useState<MoodRecommendationData | null>(null);

  const moods = [
    '😊 Happy',
    '😔 Sad',
    '😤 Angry',
    '😟 Anxious',
    '😌 Peaceful'
    
  ];

  useEffect(() => {
    loadPosts();
    loadMoodEntries();
  }, []);

  useEffect(() => {
    if (selectedMood) { // Change from moodEntries.length check
      fetchRecommendations();
    }
  }, [selectedMood]); // Change dependency to selectedMood

  const fetchRecommendations = async () => {
    if (!selectedMood) return;
    try {
      const data = await getRecommendations(selectedMood);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };


  const loadPosts = () => {
    const savedPosts = localStorage.getItem('communityPosts');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  };

  const loadMoodEntries = () => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) setMoodEntries(JSON.parse(savedEntries));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveMoodEntry = (type: 'voice' | 'text') => {
    const newEntry: MoodEntry = {
      mood: selectedMood,
      timestamp: new Date().toISOString(),
      type,
      content: type === 'text' ? newPost : undefined,
      audioUrl: type === 'voice' ? audioUrl || undefined : undefined
    };

    setMoodEntries(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('moodEntries', JSON.stringify(updated));
      return updated;
    });

    if (type === 'text') {
      setPosts(prevPosts => {
        const newPostObj: Post = {
          id: Date.now().toString(),
          username: 'Anonymous User',
          message: newPost,
          timestamp: new Date().toISOString(),
          likes: 0,
          liked: false,
          comments: [],
          mood: selectedMood
        };
        const updated = [newPostObj, ...prevPosts];
        localStorage.setItem('communityPosts', JSON.stringify(updated));
        return updated;
      });
    }

    setNewPost('');
    setAudioUrl(null);
    setSelectedMood('');
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => {
      const updated = prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
          : post
      );
      localStorage.setItem('communityPosts', JSON.stringify(updated));
      return updated;
    });
  };

  const handleComment = (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    setPosts(prevPosts => {
      const updated = prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              id: Date.now().toString(),
              username: 'Anonymous User',
              text,
              timestamp: new Date().toISOString(),
              likes: 0,
              liked: false,
              replies: []
            }]
          };
        }
        return post;
      });
      localStorage.setItem('communityPosts', JSON.stringify(updated));
      return updated;
    });

    setCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const handleReply = (postId: string, commentId: string) => {
    const text = replyText[`${postId}-${commentId}`];
    if (!text?.trim()) return;

    setPosts(prevPosts => {
      const updated = prevPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...comment.replies, {
                  id: Date.now().toString(),
                  username: 'Anonymous User',
                  text,
                  timestamp: new Date().toISOString(),
                  likes: 0,
                  liked: false
                }]
              };
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      });
      localStorage.setItem('communityPosts', JSON.stringify(updated));
      return updated;
    });

    setReplyText(prev => ({ ...prev, [`${postId}-${commentId}`]: '' }));
  };

  const downloadAudio = (audioUrl: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `mood-recording-${Date.now()}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Mood Tracking Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Share Your Mood</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-4 py-2 rounded-full ${
                selectedMood === mood 
                  ? 'bg-teal-100 text-teal-700' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Voice Recording */}
        <div className="mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-4 rounded-full ${
              isRecording ? 'bg-red-500' : 'bg-teal-500'
            } text-white`}
          >
            {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          {audioUrl && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <audio src={audioUrl} controls className="flex-1" />
                <button
                  onClick={() => downloadAudio(audioUrl)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Download className="w-5 h-5 text-teal-600" />
                </button>
              </div>
              <button
                onClick={() => handleSaveMoodEntry('voice')}
                className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg"
              >
                Save Voice Entry
              </button>
            </div>
          )}
        </div>

        {/* Text Entry */}
        <div className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 border rounded-lg"
            rows={3}
          />
          <button
            onClick={() => handleSaveMoodEntry('text')}
            disabled={!newPost.trim() || !selectedMood}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg disabled:opacity-50"
          >
            Share
          </button>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Personalized Recommendations</h3>
          <p className="text-gray-700 mb-4">{recommendations.message}</p>
          <div className="space-y-2">
            {recommendations.activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood History */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Your Mood History</h3>
        <div className="space-y-4">
          {moodEntries.map((entry, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg">{entry.mood}</span>
                <span className="text-sm text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              {entry.type === 'voice' && entry.audioUrl && (
                <div className="flex items-center gap-2">
                  <audio src={entry.audioUrl} controls className="flex-1" />
                  <button
                    onClick={() => downloadAudio(entry.audioUrl!)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Download className="w-5 h-5 text-teal-600" />
                  </button>
                </div>
              )}
              {entry.type === 'text' && entry.content && (
                <p className="text-gray-700">{entry.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Community Posts */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-6 h-6" />
              <span className="font-medium">{post.username}</span>
              <span className="text-gray-500">{post.mood}</span>
            </div>
            <p className="mb-4">{post.message}</p>
            <div className="flex gap-4">
              <button onClick={() => handleLike(post.id)} className="flex items-center gap-1">
                <Heart className={`w-5 h-5 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                {post.likes}
              </button>
              <button className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5" />
                {post.comments.length}
              </button>
              <button className="flex items-center gap-1">
                <Share className="w-5 h-5" />
              </button>
            </div>
            
            {/* Comments section */}
            <div className="mt-4 space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="pl-4 border-l-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.text}</p>

                  {/* Replies */}
                  <div className="pl-4 mt-2 space-y-2">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="border-l pl-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{reply.username}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{reply.text}</p>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText[`${post.id}-${comment.id}`] || ''}
                        onChange={(e) => setReplyText(prev => ({ 
                          ...prev, 
                          [`${post.id}-${comment.id}`]: e.target.value 
                        }))}
                        placeholder="Reply to this comment..."
                        className="flex-1 p-2 border rounded text-sm"
                      />
                      <button
                        onClick={() => handleReply(post.id, comment.id)}
                        className="px-3 py-1 bg-teal-500 text-white rounded text-sm"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText[post.id] || ''}
                  onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="px-4 py-2 bg-teal-500 text-white rounded"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

