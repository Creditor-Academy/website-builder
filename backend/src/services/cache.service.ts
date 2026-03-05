import { getRedisClient } from '../config/redis-client.js';

class CacheService {
    // Lazy initialization of Redis client
    // access using this.client to use the Redis client instance
    get client() {
        return getRedisClient();
    }

    /**
     * Retrieves a cached value by key from Redis.
     * @param {string} key - The cache key to retrieve
     * @return - The cached value, or null if not found or on error
     */
    async get(key : string) {
        try {
            const value = await this.client.get(key);
            return value;
        } catch (error) {
            console.error(`Error getting cache for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Sets a value in the cache with an optional TTL (time to live)
     * @param {string} key - The cache key to set
     * @param {*} value - The value to cache
     * @param {number} ttl - Time to live in seconds (default: 3600)
     */
    async set(key : string, value : any, ttl: number = 3600) {
        try {
            await this.client.set(
                key,
                JSON.stringify(value),
                { ex: ttl }
            );
        }
        catch (error) {
            console.error(`Error setting cache for key ${key}:`, error);
        }
    }

    /**
     * Deletes a cache entry by key from Redis.
     * @param {string} key - The cache key to delete
     */
    async del(key : string) {
        try {
            await this.client.del(key);
        }
        catch (error) {
            console.error(`Error deleting cache for key ${key}:`, error);
        }
    }

    /**
     * Clears cache entries matching a pattern
     * @param {string} pattern - The pattern to match cache keys (e.g., 'user:*')
     */
    async clear(pattern : string) {
        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                // Delete all matching keys in parallel
                await Promise.all(keys.map((key) => this.client.del(key)));
            }
        }
        catch (error) {
            console.error(`Error clearing cache with pattern ${pattern}:`, error);
        }
    }
}

export default new CacheService();