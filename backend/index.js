import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

import clientRoutes from './src/routes/client.routes.js';
import messageRoutes from './src/routes/message.routes.js';

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Rotas
app.get('/health', (req, res) => {
  res.json({ status: 'ImobiFlow AI Backend is running' });
});

app.use('/api/clients', clientRoutes);
app.use('/api/messages', messageRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
