import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  bgg: {
    baseUrl: process.env.BGG_API_BASE_URL || 'https://boardgamegeek.com/xmlapi2',
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes default
  },

  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },

  dynamodb: {
    tablePrefix: process.env.DYNAMODB_TABLE_PREFIX || 'bgg-graphql',
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  },

  storage: {
    type: process.env.STORAGE_TYPE || 'dynamodb', // 'dynamodb' or 'keyvalue'
  },
};
