# PostPilot Setup Guide

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OAuth credentials.

3. **Start Development Server**

   ```bash
   npm run dev
   ```
   This starts both frontend (port 5173) and backend (port 3001).

## OAuth Setup Instructions

### LinkedIn
1. Visit https://www.linkedin.com/developers/
2. Create a new app
3. In "Auth" tab, add redirect URI: `http://localhost:3001/auth/linkedin/callback`
4. Request these permissions:
   - `r_liteprofile` (or `profile`)
   - `r_emailaddress` (or `email`)
   - `w_member_social`
5. Copy Client ID and Client Secret to `.env`

### Twitter/X
1. Visit https://developer.twitter.com/en/portal/dashboard
2. Create a new app
3. Enable OAuth 2.0
4. Set callback URL: `http://localhost:3001/auth/twitter/callback`
5. Request scopes: `tweet.read`, `tweet.write`, `users.read`, `offline.access`
6. Copy API Key and API Secret to `.env` as `TWITTER_CONSUMER_KEY` and `TWITTER_CONSUMER_SECRET`

### Facebook
1. Visit https://developers.facebook.com/
2. Create a new app
3. Add "Facebook Login" product
4. In Settings > Basic, add platform: Website
5. Set Site URL: `http://localhost:3001`
6. In Facebook Login > Settings, add redirect URI: `http://localhost:3001/auth/facebook/callback`
7. Request permissions: `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`
8. Copy App ID and App Secret to `.env`

### Instagram
- Uses the same Facebook app
- Requires Instagram Business Account
- Connect Instagram account to Facebook Page
- Set redirect URI: `http://localhost:3001/auth/instagram/callback`
- Use same App ID and App Secret as Facebook

### TikTok
1. Visit https://developers.tiktok.com/
2. Create a new app
3. Set redirect URI: `http://localhost:3001/auth/tiktok/callback`
4. Request permissions: `user.info.basic`, `video.upload`
5. Copy Client Key and Client Secret to `.env`

## Testing Without OAuth

You can test the UI without OAuth by:
1. The frontend will show "Not connected" for all platforms
2. You can still create posts and validate them
3. Posting will fail without authentication (expected)

## Troubleshooting

### Port Already in Use
- Change `PORT` in `.env` for backend
- Change Vite port in `vite.config.ts` for frontend

### Database Errors
- Ensure `data/` directory exists and is writable
- Delete `data/postpilot.db` to reset database

### OAuth Callback Errors
- Verify redirect URIs match exactly in platform settings
- Check that credentials are correct in `.env`
- Ensure frontend URL matches `FRONTEND_URL` in `.env`

## Production Deployment

1. Set `NODE_ENV=production`
2. Update `FRONTEND_URL` to your production domain
3. Use strong `SESSION_SECRET`
4. Set up HTTPS
5. Update all OAuth callback URLs to production URLs
6. Build: `npm run build && npm run build:server`
7. Start: `npm start`

