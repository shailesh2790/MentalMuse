import React, { useState } from 'react';
import { Send, Heart, MessageCircle } from 'lucide-react';
import VentSpace from '../components/VentSpace';

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      username: 'Anonymous User',
      message: 'Just completed my first mindfulness session. Feeling peaceful! 🧘‍♀️',
      timestamp: '5 minutes ago',
      likes: 5,
      comments: [
        {
          id: '1',
          username: 'Anonymous User',
          text: 'That\'s great! Keep it up! 👏',
          timestamp: '2 minutes ago'
        }
      ]
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      username: 'Anonymous User',
      message: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleSubmitComment = (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now().toString(),
              username: 'Anonymous User',
              text,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return post;
    }));

    setCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Create Post */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts or experience..."
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-teal-500"
            rows={3}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Share Anonymously</span>
          </button>
        </form>
      </div>

      
      <div className="mb-8">
  <VentSpace />
</div>

      {/* Posts List */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm mb-6">
          {/* Post Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gray-100 p-2 rounded-full">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium">{post.username}</p>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-gray-700 mb-4">{post.message}</p>

          {/* Post Actions */}
          <div className="flex space-x-4 mb-4">
            <button 
              onClick={() => handleLike(post.id)}
              className="flex items-center space-x-1.5 text-gray-500 hover:text-teal-500"
            >
              <Heart className="w-5 h-5" />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1.5 text-gray-500 hover:text-teal-500">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments.length}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 ml-8 border-l-2 border-gray-100 pl-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{comment.username}</span>
                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}

            {/* Add Comment */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={commentText[post.id] || ''}
                onChange={(e) => setCommentText(prev => ({
                  ...prev,
                  [post.id]: e.target.value
                }))}
                placeholder="Add a comment..."
                className="flex-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={() => handleSubmitComment(post.id)}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}