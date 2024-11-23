// src/services/comments.service.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Reply {
    id: string;
    username: string;
    text: string;
    timeAgo: string;
    likes: number;
}

export interface Comment {
    id: string;
    postId: string;
    username: string;
    text: string;
    timeAgo: string;
    likes: number;
    replies: Reply[];
}

export interface Post {
    id: string;
    username: string;
    message: string;
    mood?: string;
    likes: number;
    timeAgo: string;
    comments: Comment[];
    badges?: string[];
}

class CommentsService {
    async getAllPosts(): Promise<Post[]> {
        try {
            const response = await axios.get(`${API_URL}/posts`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }

    async createPost(message: string, mood?: string): Promise<Post> {
        try {
            const response = await axios.post(`${API_URL}/posts`, { message, mood });
            return response.data.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async addComment(postId: string, text: string): Promise<Comment> {
        try {
            const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { text });
            return response.data.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }

    async addReply(commentId: string, text: string): Promise<Reply> {
        try {
            const response = await axios.post(`${API_URL}/comments/${commentId}/replies`, { text });
            return response.data.data;
        } catch (error) {
            console.error('Error adding reply:', error);
            throw error;
        }
    }

    async likePost(postId: string): Promise<void> {
        try {
            await axios.post(`${API_URL}/posts/${postId}/like`);
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    }
}

export const commentsService = new CommentsService();