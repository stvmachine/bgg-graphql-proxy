import { KeyValueCache } from 'apollo-server-caching';
import { RedisCache } from '../config/redis';

export class MemoryCache implements KeyValueCache<string> {
  private redisCache: RedisCache;

  constructor() {
    this.redisCache = new RedisCache();
    console.log('🔴 MemoryCache: Using Redis for caching');
  }

  async get(key: string): Promise<string | undefined> {
    try {
      const redisValue = await this.redisCache.get(key);
      return redisValue || undefined;
    } catch (error) {
      console.error('Redis get failed:', error);
      return undefined;
    }
  }

  async set(key: string, value: string, options?: { ttl?: number }): Promise<void> {
    const ttl = options?.ttl;
    
    try {
      await this.redisCache.set(key, value, ttl);
    } catch (error) {
      console.error('Redis set failed:', error);
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.redisCache.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete failed:', error);
      return false;
    }
  }

  async clear(): Promise<void> {
    // Redis doesn't have a clear all method, so we'll skip this
    console.log('Redis clear: Not implemented (Redis doesn\'t support clear all)');
  }

  // Utility methods - not applicable for Redis
  size(): number {
    return 0; // Redis doesn't provide size count
  }

  keys(): string[] {
    return []; // Redis doesn't provide keys list
  }

  // Clean up expired entries - Redis handles TTL automatically
  cleanup(): void {
    // Redis handles TTL automatically, no cleanup needed
  }
}