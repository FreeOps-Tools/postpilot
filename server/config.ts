import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  sessionSecret: process.env.SESSION_SECRET || 'postpilot-secret-change-in-production',
  
  // LinkedIn OAuth
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    callbackUrl: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3001/auth/linkedin/callback',
  },

  // Twitter OAuth
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || '',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || '',
    callbackUrl: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3001/auth/twitter/callback',
  },

  // Facebook OAuth
  facebook: {
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
    callbackUrl: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3001/auth/facebook/callback',
  },

  // Instagram OAuth (uses Facebook API)
  instagram: {
    appId: process.env.INSTAGRAM_APP_ID || process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.INSTAGRAM_APP_SECRET || process.env.FACEBOOK_APP_SECRET || '',
    callbackUrl: process.env.INSTAGRAM_CALLBACK_URL || 'http://localhost:3001/auth/instagram/callback',
  },

  // TikTok OAuth
  tiktok: {
    clientKey: process.env.TIKTOK_CLIENT_KEY || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    callbackUrl: process.env.TIKTOK_CALLBACK_URL || 'http://localhost:3001/auth/tiktok/callback',
  },
};

