import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage (replace with database in production)
let posts = [];
let comments = [];

// Get all posts with comments
router.get('/posts', async (req, res) => {
  try {
    const postsWithComments = posts.map(post => ({
      ...post,
      comments: comments.filter(comment => comment.postId === post.id)
    }));
    res.json({ success: true, data: postsWithComments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new post
router.post('/posts', async (req, res) => {
  try {
    const { message, mood } = req.body;
    const newPost = {
      id: uuidv4(),
      username: 'Anonymous User',
      timeAgo: 'Just now',
      message,
      mood,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    res.json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a comment to a post
router.post('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    
    const newComment = {
      id: uuidv4(),
      postId,
      username: 'Anonymous User',
      text,
      timeAgo: 'Just now',
      likes: 0,
      replies: [],
      createdAt: new Date().toISOString()
    };
    
    comments.push(newComment);
    res.json({ success: true, data: newComment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a reply to a comment
router.post('/comments/:commentId/replies', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    
    const comment = comments.find(c => c.id === commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    const newReply = {
      id: uuidv4(),
      username: 'Anonymous User',
      text,
      timeAgo: 'Just now',
      likes: 0,
      createdAt: new Date().toISOString()
    };
    
    comment.replies = comment.replies || [];
    comment.replies.push(newReply);
    
    res.json({ success: true, data: newReply });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;