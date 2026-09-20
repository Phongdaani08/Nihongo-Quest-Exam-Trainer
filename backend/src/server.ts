import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/api.js';
import { testDbConnection } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await testDbConnection();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'nihongo-quest-backend',
    database: dbStatus ? 'connected' : 'connecting/disconnected',
  });
});

// API Routes
app.use('/api', router);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Exception]:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`🚀 Nihongo Quest API running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API base: http://localhost:${PORT}/api`);
  console.log(`=========================================`);
  await testDbConnection();
});
