import { Redis } from '@upstash/redis';
import { InternalServerError } from '../utils/error.utils.js';

import dotenv from 'dotenv';
dotenv.config({ quiet: true });

let redisClient: Redis;

export const initRedis = async () => {
    try {
        redisClient = new Redis({
            url: process.env.REDIS_URL,
            token: process.env.REDIS_TOKEN,
        });

        console.log('Redis client initialized successfully');
    } catch (error: any) {
        console.error('Redis connection failed. Features requiring Redis (like login sessions) will not work:', error.message);
        // Do not exit, allow the app to start for other features (like signup)
    }
};

export const getRedisClient = () => {
    if (!redisClient) {
        throw new InternalServerError('Redis client not initialized.');
    }

    return redisClient;
};