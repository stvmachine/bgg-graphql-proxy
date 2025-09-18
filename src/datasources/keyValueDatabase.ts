import { existsSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { BaseStorageDataSource } from "./storageInterface";

const DB_FILE = "./keyValueDatabase.json";
let database: { [key: string]: { data: any; ttl?: number; createdAt: string } };

// Initialize database
async function initializeDatabase() {
  try {
    if (existsSync(DB_FILE)) {
      database = JSON.parse(readFileSync(DB_FILE, "utf-8"));
    } else {
      database = {};
      // Create the file if it doesn't exist
      await writeFile(DB_FILE, JSON.stringify(database, null, 2));
      console.log(`📁 Created KeyValue database file: ${DB_FILE}`);
    }
  } catch (e) {
    console.error("Error initializing KeyValue database:", e);
    database = {};
  }
}

// Initialize on module load
initializeDatabase();

/**
 * This is a simple key-value database that is running at your local. It should be used for
 * development only and we should look for a way to migrate to AWS Dynamo before going live.
 *
 * In case you haven't noticed, it was inspired by Dynamo concepts, with records indexed using a
 * partition key and an optional sort key. Think of it as one table in Dynamo if that makes sense.
 *
 * It is embarassing to call this a Dynamo parody, but it should hopefully be enough for you to
 * showcase your creativity and Dynamo understanding. Good luck and have fun.
 */
export class KeyValueDatabase extends BaseStorageDataSource {
  constructor() {
    super();
    console.log(`🏗️ KeyValueDatabase constructor called`);
  }

  // ========================================
  // ORIGINAL DYNAMODB-LIKE METHODS
  // ========================================
  // These methods provide DynamoDB-style operations with partition/sort keys
  
  async get({
    partitionKey,
    sortKey = "",
  }: {
    partitionKey: string;
    sortKey?: string;
  }): Promise<any | undefined> {
    const item = database[partitionKey + ":" + sortKey];
    return item ? item.data : undefined;
  }

  async query({ partitionKey }: { partitionKey: string }): Promise<any[]> {
    return Object.keys(database)
      .filter((key) => key.startsWith(partitionKey + ":"))
      .map((key) => database[key].data);
  }

  async scan(): Promise<any[]> {
    return Object.values(database).map((item) => item.data);
  }

  async put({
    partitionKey,
    sortKey = "",
    item,
  }: {
    partitionKey: string;
    sortKey?: string;
    item: any;
  }) {
    database[partitionKey + ":" + sortKey] = {
      data: item,
      createdAt: new Date().toISOString(),
    };
    await writeFile(DB_FILE, JSON.stringify(database, null, 2));
  }

  async delete({
    partitionKey,
    sortKey = "",
  }: {
    partitionKey: string;
    sortKey?: string;
  }) {
    delete database[partitionKey + ":" + sortKey];
    await writeFile(DB_FILE, JSON.stringify(database, null, 2));
  }

  // ========================================
  // STORAGE INTERFACE METHODS
  // ========================================
  // These methods implement the StorageInterface for GraphQL caching
  
  async store(key: string, data: any, ttlHours: number = 24): Promise<void> {
    try {
      const ttl =
        ttlHours > 0
          ? Math.floor(Date.now() / 1000) + ttlHours * 60 * 60
          : undefined;
      database[key] = {
        data,
        ttl,
        createdAt: new Date().toISOString(),
      };
      await writeFile(DB_FILE, JSON.stringify(database, null, 2));
      console.log(`💾 Stored data for key: ${key}`);
    } catch (error) {
      console.error(`❌ Error storing data for key ${key}:`, error);
    }
  }

  async retrieve(key: string): Promise<any | null> {
    try {
      const item = database[key];
      if (!item) {
        return null;
      }

      // Check TTL
      if (item.ttl && Date.now() / 1000 > item.ttl) {
        delete database[key];
        await writeFile(DB_FILE, JSON.stringify(database, null, 2));
        return null;
      }

      return item.data;
    } catch (error) {
      console.error(`❌ Error retrieving data for key ${key}:`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      delete database[key];
      await writeFile(DB_FILE, JSON.stringify(database, null, 2));
      console.log(`🗑️ Removed data for key: ${key}`);
    } catch (error) {
      console.error(`❌ Error removing data for key ${key}:`, error);
    }
  }
}
