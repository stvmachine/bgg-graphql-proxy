import { KeyValueCache } from 'apollo-server-caching';

export class MemoryCache implements KeyValueCache<string> {
  private cache = new Map<string, { value: string; expires: number }>();

  async get(key: string): Promise<string | undefined> {
    const item = this.cache.get(key);
    if (!item) {
      return undefined;
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  async set(key: string, value: string, options?: { ttl?: number }): Promise<void> {
    const ttl = options?.ttl;
    const expires = ttl ? Date.now() + ttl * 1000 : Number.MAX_SAFE_INTEGER;
    this.cache.set(key, { value, expires });
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // Utility methods
  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}