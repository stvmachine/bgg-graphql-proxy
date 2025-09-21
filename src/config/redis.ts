import { Redis } from '@upstash/redis';

// Redis configuration - always required
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('❌ Redis is required! Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.');
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

console.log('🔴 Redis enabled');

// Redis cache implementation for Apollo Server
export class RedisCache {
  async get(key: string): Promise<string | null> {
    try {
      console.log(`🔍 Redis GET: ${key}`);
      const result = await redis.get(key);
      console.log(`🔍 Redis GET result: ${result ? 'found' : 'not found'}`);
      return result as string | null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      console.log(`💾 Redis SET: ${key} (TTL: ${ttl || 'none'})`);
      if (ttl) {
        await redis.setex(key, ttl, value);
      } else {
        await redis.set(key, value);
      }
      console.log(`✅ Redis SET completed: ${key}`);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      console.log(`🗑️ Redis DEL: ${key}`);
      await redis.del(key);
      console.log(`✅ Redis DEL completed: ${key}`);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }
}
