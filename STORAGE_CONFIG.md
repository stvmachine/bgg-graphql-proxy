# Storage Configuration

This project now supports two storage backends that can be configured via environment variables:

## Available Storage Types

### 1. DynamoDB (Default)
- **Type**: `dynamodb`
- **Use case**: Production environments
- **Features**: 
  - Persistent storage
  - Automatic TTL cleanup
  - Scalable
  - AWS managed

### 2. KeyValue Database (Local)
- **Type**: `keyvalue`
- **Use case**: Local development
- **Features**:
  - File-based storage (`keyValueDatabase.json`)
  - TTL support
  - No AWS dependencies
  - Perfect for development

## Configuration

Set the `STORAGE_TYPE` environment variable in your `.env` file:

```bash
# For DynamoDB (production)
STORAGE_TYPE=dynamodb

# For local KeyValue database (development)
STORAGE_TYPE=keyvalue
```

## Environment Variables

### DynamoDB Configuration
```bash
# Required for DynamoDB
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE_PREFIX=bgg-graphql
DYNAMODB_ENDPOINT=  # Leave empty for production
```

### KeyValue Database Configuration
```bash
# No additional configuration needed
# Data is stored in ./keyValueDatabase.json
```

## Usage Examples

### Local Development
```bash
# Set in .env
STORAGE_TYPE=keyvalue

# Run the server
npm run dev
```

### Production Deployment
```bash
# Set in .env
STORAGE_TYPE=dynamodb
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Deploy
serverless deploy
```

## Switching Between Storage Types

The storage backend is automatically selected based on the `STORAGE_TYPE` configuration. No code changes are required - just update your environment variables and restart the server.

## File Structure

When using KeyValue database, data is stored in:
- `./keyValueDatabase.json` - Main database file
- Automatically created on first use
- Human-readable JSON format

## TTL (Time To Live)

Both storage backends support TTL:
- **DynamoDB**: Automatic cleanup via AWS TTL
- **KeyValue**: Manual cleanup on retrieval

TTL values are configured in the cache configuration and vary by data type:
- Things: 7 days
- Users: 1 day
- Collections: 1 hour
- Plays: 30 minutes
- Search results: 1 hour
