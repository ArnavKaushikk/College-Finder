import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import collegesRouter from './routes/colleges.js';
import authRouter from './routes/auth.js';
import predictorRouter from './routes/predictor.js';
import questionsRouter from './routes/questions.js';
import userRouter from './routes/user.js';

const serverRoot = path.join(path.dirname(fileURLToPath(import.meta.url)));
dotenv.config({ path: path.join(serverRoot, '.env') });
dotenv.config({ path: path.join(serverRoot, '.env.local') });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/colleges', collegesRouter);
app.use('/api/auth', authRouter);
app.use('/api/predictor', predictorRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
