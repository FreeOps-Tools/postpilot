import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api', postRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 PostPilot server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend URL: ${config.frontendUrl}`);
});

