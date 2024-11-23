import create from 'zustand';

interface Comment {
  id: string;
  postId: string;
  text: string;
  username: string;
  timestamp: number;
}

interface Post {
  id: string;
  username: string;
  avatar: string;
  message: string;
  likes: number;
  comments: Comment[];
  timestamp: number;
}

interface Store {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp'>) => void;
  addComment: (postId: string, text: string) => void;
  toggleLike: (postId: string) => void;
}

export const useStore = create<Store>((set) => ({
  posts: [
    {
      id: '1',
      username: 'Anonymous User #1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      message: 'Just completed my first week of daily meditation. Feeling more centered already! 🧘‍♀️',
      likes: 24,
      comments: [],
      timestamp: Date.now() - 3600000,
    },
    {
      id: '2',
      username: 'Anonymous User #2',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      message: 'Remember: it\'s okay to take things one day at a time. Small progress is still progress! 💪',
      likes: 42,
      comments: [],
      timestamp: Date.now() - 7200000,
    },
  ],
  addPost: (post) =>
    set((state) => ({
      posts: [
        {
          ...post,
          id: Math.random().toString(36).substr(2, 9),
          likes: 0,
          comments: [],
          timestamp: Date.now(),
        },
        ...state.posts,
      ],
    })),
  addComment: (postId, text) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  postId,
                  text,
                  username: 'Anonymous User',
                  timestamp: Date.now(),
                },
              ],
            }
          : post
      ),
    })),
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ),
    })),
}));