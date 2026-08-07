import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ApnaTrip Backend API', timestamp: new Date() });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 ApnaTrip Server running on port ${config.port} [${config.nodeEnv}]`);
});

export default app;
