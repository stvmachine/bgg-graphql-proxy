# KeyValueDatabase Usage Guide

The `KeyValueDatabase` class provides two different interfaces for different use cases:

## 🔧 **Original DynamoDB-like Methods**

These methods provide DynamoDB-style operations with partition and sort keys:

### `get(partitionKey, sortKey?)`
```typescript
const db = new KeyValueDatabase();

// Get a single item
const user = await db.get({
  partitionKey: "USER",
  sortKey: "stevmachine"
});
```

### `put(partitionKey, sortKey?, item)`
```typescript
// Store an item
await db.put({
  partitionKey: "USER",
  sortKey: "stevmachine",
  item: {
    id: "1962358",
    username: "stevmachine",
    firstName: "Esteban"
  }
});
```

### `query(partitionKey)`
```typescript
// Get all items with the same partition key
const users = await db.query({
  partitionKey: "USER"
});
```

### `scan()`
```typescript
// Get all items in the database
const allItems = await db.scan();
```

### `delete(partitionKey, sortKey?)`
```typescript
// Delete an item
await db.delete({
  partitionKey: "USER",
  sortKey: "stevmachine"
});
```

## 🗄️ **Storage Interface Methods**

These methods are used by the GraphQL resolvers for caching:

### `store(key, data, ttlHours?)`
```typescript
// Store with TTL (Time To Live)
await db.store("thing:174430", gameData, 24); // 24 hours
```

### `retrieve(key)`
```typescript
// Get cached data
const cachedGame = await db.retrieve("thing:174430");
```

### `remove(key)`
```typescript
// Remove cached data
await db.remove("thing:174430");
```

## 📊 **Data Structure**

The database stores data in this format:

```json
{
  "USER:stevmachine": {
    "data": {
      "id": "1962358",
      "username": "stevmachine",
      "firstName": "Esteban"
    },
    "ttl": 1758213453,
    "createdAt": "2025-09-17T16:37:33.319Z"
  },
  "thing:174430": {
    "data": {
      "id": "174430",
      "name": "Wingspan",
      "yearPublished": 2019
    },
    "ttl": 1758213453,
    "createdAt": "2025-09-17T16:37:33.319Z"
  }
}
```

## 🎯 **When to Use Which Interface**

### Use DynamoDB Methods When:
- Building custom database operations
- Need partition/sort key structure
- Working with hierarchical data
- Implementing custom business logic

### Use Storage Methods When:
- GraphQL resolver caching
- Need TTL support
- Simple key-value operations
- Following the caching architecture

## 🔄 **Key Differences**

| Feature | DynamoDB Methods | Storage Methods |
|---------|------------------|-----------------|
| **Key Structure** | `partitionKey:sortKey` | Simple string key |
| **TTL Support** | No | Yes |
| **Purpose** | General database ops | GraphQL caching |
| **Usage** | Custom logic | Resolver caching |
| **Data Format** | Direct item storage | Wrapped with metadata |

## 📁 **File Location**

The database is stored in: `./keyValueDatabase.json`

This file is automatically created and updated when you use either interface.
