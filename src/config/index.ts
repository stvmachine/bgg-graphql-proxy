import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  bgg: {
    baseUrl: process.env.BGG_API_BASE_URL || 'https://boardgamegeek.com/xmlapi2',
  },
};
