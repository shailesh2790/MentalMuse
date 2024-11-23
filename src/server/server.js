// src/server/server.js
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
import commentsRoutes from './routes/comments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to MentalMuse API' });
});

app.use('/api/auth', authRoutes);
app.use('/api', commentsRoutes);

// Single PORT declaration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the API at:`);
    console.log(`- http://localhost:${PORT}`);
    console.log(`- http://localhost:${PORT}/api/test`);
});

export default app;