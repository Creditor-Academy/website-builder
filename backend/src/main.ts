import express from 'express';
import apiRoutes from './modules/api.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initRedis } from './config/redis-client.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

await initRedis();

app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:8081"], // allow both ports
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use('/api/v1', apiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening at Port: ${PORT}`);
});