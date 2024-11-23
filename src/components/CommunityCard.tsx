import React from 'react';
import { MessageCircle, Heart } from 'lucide-react';

// Then update the component to use the service
export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await commentsService.getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const createdPost = await commentsService.createPost(newPost, selectedMood);
      setPosts(prevPosts => [createdPost, ...prevPosts]);
      setNewPost('');
      setSelectedMood('');
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      const newComment = await commentsService.addComment(postId, text);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));
      setCommentText({ ...commentText, [postId]: '' });
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    }
  };

  const handleReplySubmit = async (postId: string, commentId: string) => {
    const text = replyText[`${postId}-${commentId}`];
    if (!text?.trim()) return;

    try {
      const newReply = await commentsService.addReply(commentId, text);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply]
                };
              }
              return comment;
            })
          };
        }
        return post;
      }));
      setReplyText({ ...replyText, [`${postId}-${commentId}`]: '' });
    } catch (err) {
      setError('Failed to add reply');
      console.error(err);
    }
  };


interface CommunityCardProps {
  username: string;
  avatar: string;
  message: string;
  likes: number;
  comments: number;
}

export default function CommunityCard({ username, avatar, message, likes, comments }: CommunityCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <img src={avatar} alt={username} className="w-10 h-10 rounded-full object-cover" />
        <span className="font-medium text-gray-800">{username}</span>
      </div>
      <p className="text-gray-600 mb-4">{message}</p>
      <div className="flex items-center space-x-4 text-gray-500">
        <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">
          <Heart className="w-5 h-5" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>{comments}</span>
        </button>
      </div>
    </div>
  );
}