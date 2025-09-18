import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { config } from '../config';
import { CACHE_CONFIG } from '../config/cache';
import { BaseStorageDataSource } from './storageInterface';
import { KeyValueDatabase } from './keyValueDatabase';

export class StorageDataSource extends BaseStorageDataSource {
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

  /**
   * Factory method to create the appropriate storage implementation
   * based on configuration
   */
  static create(): BaseStorageDataSource {
    console.log(`🔧 Storage type configured as: ${config.storage.type}`);
    if (config.storage.type === 'keyvalue') {
      console.log(`📁 Using KeyValue database for storage`);
      return new KeyValueDatabase();
    }
    console.log(`☁️ Using DynamoDB for storage`);
    return new StorageDataSource();
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

}