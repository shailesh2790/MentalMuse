import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, User } from 'lucide-react';

interface CommunityPost {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  anonymous: boolean;
  username: string;
}

interface Comment {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  username: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  timestamp: string;
  username: string;
}

const AcceptanceTherapy: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [showCommentSection, setShowCommentSection] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const savedPosts = localStorage.getItem('acceptanceTherapyPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  };

  const handlePost = () => {
    if (!newPost.trim()) return;

    setPosts(prevPosts => {
      const newPostObj: CommunityPost = {
        id: Date.now().toString(),
        content: newPost,
        timestamp: new Date().toISOString(),
        likes: 0,
        liked: false,
        comments: [],
        anonymous: isAnonymous,
        username: isAnonymous ? 'Anonymous User' : 'User'
      };
      const updated = [newPostObj, ...prevPosts];
      localStorage.setItem('acceptanceTherapyPosts', JSON.stringify(updated));
      return updated;
    });

    setNewPost('');
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => {
      const updated = prevPosts.map(post => 
        post.id === postId
          ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
          : post
      );
      localStorage.setItem('acceptanceTherapyPosts', JSON.stringify(updated));
      return updated;
    });
  };

  const handleComment = (postId: string) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    setPosts(prevPosts => {
      const updated = prevPosts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: Date.now().toString(),
            content: commentText,
            timestamp: new Date().toISOString(),
            likes: 0,
            liked: false,
            username: isAnonymous ? 'Anonymous User' : 'User',
            replies: []
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      });
      localStorage.setItem('acceptanceTherapyPosts', JSON.stringify(updated));
      return updated;
    });

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleReply = (postId: string, commentId: string) => {
    const replyText = replyInputs[`${postId}-${commentId}`];
    if (!replyText?.trim()) return;

    setPosts(prevPosts => {
      const updated = prevPosts.map(post => {
        if (post.id === postId) {
          const updatedComments = post.comments.map(comment => {
            if (comment.id === commentId) {
              const newReply: Reply = {
                id: Date.now().toString(),
                content: replyText,
                timestamp: new Date().toISOString(),
                username: isAnonymous ? 'Anonymous User' : 'User'
              };
              return { ...comment, replies: [...comment.replies, newReply] };
            }
            return comment;
          });
          return { ...post, comments: updatedComments };
        }
        return post;
      });
      localStorage.setItem('acceptanceTherapyPosts', JSON.stringify(updated));
      return updated;
    });

    setReplyInputs(prev => ({ ...prev, [`${postId}-${commentId}`]: '' }));
  };

  const handleShare = async (post: CommunityPost) => {
    const shareText = `${post.username} shared:\n${post.content}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Shared from Support Group',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Content copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleCommentSection = (postId: string) => {
    setShowCommentSection(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Support Group</h1>
        <p className="text-gray-600 mb-4">
          A safe space to share your thoughts and experiences. Connect with others who understand what you're going through.
        </p>
      </div>

      {/* Post Creation Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts, feelings, or experiences..."
          className="w-full p-4 border rounded-lg mb-4 min-h-[120px]"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="form-checkbox h-5 w-5 text-teal-500"
            />
            <span>Post anonymously</span>
          </label>
          <button
            onClick={handlePost}
            disabled={!newPost.trim()}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg disabled:opacity-50 hover:bg-teal-600"
          >
            Share
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-6 h-6 text-gray-400" />
              <span className="font-medium">{post.username}</span>
              <span className="text-sm text-gray-500">
                {new Date(post.timestamp).toLocaleString()}
              </span>
            </div>
            
            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
            
            <div className="flex gap-4 border-t pt-4">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1 hover:text-teal-600 transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 ${post.liked ? 'fill-teal-500 text-teal-500' : ''}`} 
                />
                <span>{post.likes}</span>
              </button>
              
              <button
                onClick={() => toggleCommentSection(post.id)}
                className="flex items-center gap-1 hover:text-teal-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments.length}</span>
              </button>
              
              <button
                onClick={() => handleShare(post)}
                className="flex items-center gap-1 hover:text-teal-600 transition-colors"
              >
                <Share className="w-5 h-5" />
              </button>
            </div>

            {/* Comments Section */}
            {showCommentSection[post.id] && (
              <div className="mt-4 space-y-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="pl-4 border-l-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-2">{comment.content}</p>
                    
                    {/* Replies */}
                    <div className="space-y-2 ml-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="pl-4 border-l border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{reply.username}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(reply.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-800 text-sm">{reply.content}</p>
                        </div>
                      ))}
                      
                      {/* Reply Input */}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={replyInputs[`${post.id}-${comment.id}`] || ''}
                          onChange={(e) => setReplyInputs(prev => ({
                            ...prev,
                            [`${post.id}-${comment.id}`]: e.target.value
                          }))}
                          placeholder="Reply to this comment..."
                          className="flex-1 p-2 border rounded text-sm"
                        />
                        <button
                          onClick={() => handleReply(post.id, comment.id)}
                          className="px-3 py-1 bg-teal-500 text-white rounded text-sm hover:bg-teal-600"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Comment Input */}
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({
                      ...prev,
                      [post.id]: e.target.value
                    }))}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                  >
                    Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcceptanceTherapy;