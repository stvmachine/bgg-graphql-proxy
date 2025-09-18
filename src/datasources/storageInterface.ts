import { DataSource } from 'apollo-datasource';
import { Thing, User } from '../generated/graphql';

/**
 * Common interface for storage implementations
 * This allows switching between DynamoDB and KeyValueDatabase
 */
export interface StorageInterface {
  // Generic storage operations
  store(key: string, data: any, ttlHours?: number): Promise<void>;
  retrieve(key: string): Promise<any | null>;
  remove(key: string): Promise<void>;

  // BGG-specific cache operations
  cacheThing(id: string, thing: Thing): Promise<void>;
  getCachedThing(id: string): Promise<Thing | null>;
  
  cacheUser(username: string, user: User): Promise<void>;
  getCachedUser(username: string): Promise<User | null>;
  
  cacheCollection(username: string, collection: any, subtype?: string): Promise<void>;
  getCachedCollection(username: string, subtype?: string): Promise<any | null>;
  
  cachePlays(username: string, plays: any, params: Record<string, any>): Promise<void>;
  getCachedPlays(username: string, params: Record<string, any>): Promise<any | null>;
  
  cacheGeeklist(id: string, geeklist: any): Promise<void>;
  getCachedGeeklist(id: string): Promise<any | null>;
  
  cacheGeeklists(username: string, geeklists: any[], page: number): Promise<void>;
  getCachedGeeklists(username: string, page: number): Promise<any | null>;
  
  cacheHotItems(items: any[], type?: string): Promise<void>;
  getCachedHotItems(type?: string): Promise<any | null>;
  
  cacheSearchResults(query: string, results: any[], type?: string, exact?: boolean): Promise<void>;
  getCachedSearchResults(query: string, type?: string, exact?: boolean): Promise<any | null>;
}

/**
 * Abstract base class for storage implementations
 */
export abstract class BaseStorageDataSource extends DataSource implements StorageInterface {
  abstract store(key: string, data: any, ttlHours?: number): Promise<void>;
  abstract retrieve(key: string): Promise<any | null>;
  abstract remove(key: string): Promise<void>;

  // BGG-specific cache operations with default implementations
  async cacheThing(id: string, thing: Thing): Promise<void> {
    await this.store(`thing:${id}`, thing, 24 * 7); // 7 days
  }

  async getCachedThing(id: string): Promise<Thing | null> {
    return await this.retrieve(`thing:${id}`);
  }

  async cacheUser(username: string, user: User): Promise<void> {
    await this.store(`user:${username}`, user, 24); // 1 day
  }

  async getCachedUser(username: string): Promise<User | null> {
    return await this.retrieve(`user:${username}`);
  }

  async cacheCollection(username: string, collection: any, subtype?: string): Promise<void> {
    const key = subtype ? `collection:${username}:${subtype}` : `collection:${username}`;
    await this.store(key, collection, 1); // 1 hour
  }

  async getCachedCollection(username: string, subtype?: string): Promise<any | null> {
    const key = subtype ? `collection:${username}:${subtype}` : `collection:${username}`;
    return await this.retrieve(key);
  }

  async cachePlays(username: string, plays: any, params: Record<string, any>): Promise<void> {
    const paramKey = Buffer.from(JSON.stringify(params)).toString('base64').slice(0, 16);
    const key = `plays:${username}:${paramKey}`;
    await this.store(key, plays, 0.5); // 30 minutes
  }

  async getCachedPlays(username: string, params: Record<string, any>): Promise<any | null> {
    const paramKey = Buffer.from(JSON.stringify(params)).toString('base64').slice(0, 16);
    const key = `plays:${username}:${paramKey}`;
    return await this.retrieve(key);
  }

  async cacheGeeklist(id: string, geeklist: any): Promise<void> {
    await this.store(`geeklist:${id}`, geeklist, 24); // 1 day
  }

  async getCachedGeeklist(id: string): Promise<any | null> {
    return await this.retrieve(`geeklist:${id}`);
  }

  async cacheGeeklists(username: string, geeklists: any[], page: number): Promise<void> {
    const key = `geeklists:${username}:${page}`;
    await this.store(key, geeklists, 1); // 1 hour
  }

  async getCachedGeeklists(username: string, page: number): Promise<any | null> {
    const key = `geeklists:${username}:${page}`;
    return await this.retrieve(key);
  }

  async cacheHotItems(items: any[], type?: string): Promise<void> {
    const key = type ? `hot:${type}` : 'hot:all';
    await this.store(key, items, 1); // 1 hour
  }

  async getCachedHotItems(type?: string): Promise<any | null> {
    const key = type ? `hot:${type}` : 'hot:all';
    return await this.retrieve(key);
  }

  async cacheSearchResults(query: string, results: any[], type?: string, exact?: boolean): Promise<void> {
    const searchKey = `${query}:${type || 'all'}:${exact ? 'exact' : 'fuzzy'}`;
    await this.store(`search:${searchKey}`, results, 1); // 1 hour
  }

  async getCachedSearchResults(query: string, type?: string, exact?: boolean): Promise<any | null> {
    const searchKey = `${query}:${type || 'all'}:${exact ? 'exact' : 'fuzzy'}`;
    return await this.retrieve(`search:${searchKey}`);
  }
}
