// src/server/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Anonymous Login
router.post('/anonymous', async (req, res) => {
    try {
        const anonymousId = `anon_${Math.random().toString(36).substring(7)}`;
        const token = jwt.sign(
            { id: anonymousId, isAnonymous: true },
            'your_jwt_secret', // In production, use environment variable
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: anonymousId,
                isAnonymous: true
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating anonymous session'
        });
    }
});

// Email Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Add your login logic here
        
        const token = jwt.sign(
            { email, isAnonymous: false },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                email,
                isAnonymous: false
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Registration
router.post('/register', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
        // Add your registration logic here

        const token = jwt.sign(
            { email, isAnonymous: false },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                email,
                nickname,
                isAnonymous: false
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

export default router;