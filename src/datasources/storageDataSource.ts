import { DataSource } from 'apollo-datasource';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { config } from '../config';
import { CACHE_CONFIG } from '../config/cache';

export class StorageDataSource extends DataSource {
  private client: DynamoDBDocumentClient;
  private tablePrefix: string;

  constructor() {
    super();
    const dynamoClient = new DynamoDBClient({
      region: config.aws.region,
      endpoint: config.dynamodb.endpoint || undefined,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });

    this.client = DynamoDBDocumentClient.from(dynamoClient);
    this.tablePrefix = config.dynamodb.tablePrefix;
  }

  private getTableName(table: string): string {
    return `${this.tablePrefix}-${table}`;
  }

  private getTTL(ttlHours: number): number {
    return Math.floor(Date.now() / 1000) + (ttlHours * 60 * 60);
  }

  // Generic storage operations
  async store(key: string, data: any, ttlHours: number = 24): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: this.getTableName('cache'),
        Item: {
          key,
          data,
          ttl: this.getTTL(ttlHours),
          createdAt: new Date().toISOString(),
        },
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Storage store error:', error);
      // Don't throw - caching is not critical
    }
  }

  async retrieve(key: string): Promise<any | null> {
    try {
      const command = new GetCommand({
        TableName: this.getTableName('cache'),
        Key: { key },
      });

      const result = await this.client.send(command);
      return result.Item?.data || null;
    } catch (error) {
      console.error('Storage retrieve error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const command = new DeleteCommand({
        TableName: this.getTableName('cache'),
        Key: { key },
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  // BGG-specific cache operations
  async cacheThing(id: string, thing: any): Promise<void> {
    await this.store(`thing:${id}`, thing, CACHE_CONFIG.L2.THING); // 7 days
  }

  async getCachedThing(id: string): Promise<any | null> {
    return await this.retrieve(`thing:${id}`);
  }

  async cacheUser(username: string, user: any): Promise<void> {
    await this.store(`user:${username}`, user, CACHE_CONFIG.L2.USER); // 1 day
  }

  async getCachedUser(username: string): Promise<any | null> {
    return await this.retrieve(`user:${username}`);
  }

  async cacheCollection(username: string, collection: any, subtype?: string): Promise<void> {
    const key = subtype ? `collection:${username}:${subtype}` : `collection:${username}`;
    await this.store(key, collection, CACHE_CONFIG.L2.COLLECTION); // 1 hour
  }

  async getCachedCollection(username: string, subtype?: string): Promise<any | null> {
    const key = subtype ? `collection:${username}:${subtype}` : `collection:${username}`;
    return await this.retrieve(key);
  }

  async cachePlays(username: string, plays: any, params: Record<string, any>): Promise<void> {
    const paramKey = Buffer.from(JSON.stringify(params)).toString('base64').slice(0, 16);
    const key = `plays:${username}:${paramKey}`;
    await this.store(key, plays, CACHE_CONFIG.L2.PLAYS); // 30 minutes
  }

  async getCachedPlays(username: string, params: Record<string, any>): Promise<any | null> {
    const paramKey = Buffer.from(JSON.stringify(params)).toString('base64').slice(0, 16);
    const key = `plays:${username}:${paramKey}`;
    return await this.retrieve(key);
  }

  async cacheGeeklist(id: string, geeklist: any): Promise<void> {
    await this.store(`geeklist:${id}`, geeklist, CACHE_CONFIG.L2.GEEKLIST); // 1 day
  }

  async getCachedGeeklist(id: string): Promise<any | null> {
    return await this.retrieve(`geeklist:${id}`);
  }

  async cacheGeeklists(username: string, geeklists: any[], page: number): Promise<void> {
    const key = `geeklists:${username}:${page}`;
    await this.store(key, geeklists, CACHE_CONFIG.L2.GEEKLISTS); // 1 hour
  }

  async getCachedGeeklists(username: string, page: number): Promise<any | null> {
    const key = `geeklists:${username}:${page}`;
    return await this.retrieve(key);
  }

  async cacheHotItems(items: any[], type?: string): Promise<void> {
    const key = type ? `hot:${type}` : 'hot:all';
    await this.store(key, items, CACHE_CONFIG.L2.HOT_ITEMS); // 1 hour
  }

  async getCachedHotItems(type?: string): Promise<any | null> {
    const key = type ? `hot:${type}` : 'hot:all';
    return await this.retrieve(key);
  }

  async cacheSearchResults(query: string, results: any[], type?: string, exact?: boolean): Promise<void> {
    const searchKey = `${query}:${type || 'all'}:${exact ? 'exact' : 'fuzzy'}`;
    await this.store(`search:${searchKey}`, results, CACHE_CONFIG.L2.SEARCH); // 1 hour
  }

  async getCachedSearchResults(query: string, type?: string, exact?: boolean): Promise<any | null> {
    const searchKey = `${query}:${type || 'all'}:${exact ? 'exact' : 'fuzzy'}`;
    return await this.retrieve(`search:${searchKey}`);
  }
}