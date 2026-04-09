import express from 'express';
import apiRoutes from './modules/api.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initRedis } from './config/redis-client.js';
import { errorHandler } from './middlewares/error.middleware.js';
import path from 'path';

const app = express();

await initRedis();

const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:8080,http://localhost:8081')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

app.use(cors({
  origin: (origin, callback) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (!origin) {
      callback(null, true);
      return;
    }

    const isConfiguredOrigin = allowedOrigins.includes(origin);
    const isLocalDevelopmentOrigin = isDevelopment && localhostOriginPattern.test(origin);

    if (isConfiguredOrigin || isLocalDevelopmentOrigin || isDevelopment) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'storage', 'assets', 'files')));

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening at Port: ${PORT}`);
});