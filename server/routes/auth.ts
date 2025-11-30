import express from 'express';
import axios from 'axios';
import { accountsDb } from '../database';
import { config } from '../config';

const router = express.Router();

// LinkedIn OAuth
router.get('/linkedin', (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${config.linkedin.clientId}&` +
    `redirect_uri=${encodeURIComponent(config.linkedin.callbackUrl)}&` +
    `scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  res.redirect(authUrl);
});

router.get('/linkedin/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${config.frontendUrl}?error=linkedin_auth_failed`);
    }

    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: config.linkedin.callbackUrl,
        client_id: config.linkedin.clientId,
        client_secret: config.linkedin.clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userResponse.data;

    // Save account
    accountsDb.save({
      platform: 'linkedin',
      user_id: user.sub,
      username: user.name || user.email,
      access_token: access_token,
      refresh_token: null,
      token_expires_at: null,
    });

    res.redirect(`${config.frontendUrl}?auth=success&platform=linkedin`);
  } catch (error: any) {
    console.error('LinkedIn auth error:', error);
    res.redirect(`${config.frontendUrl}?error=linkedin_auth_failed`);
  }
});

// Twitter OAuth 2.0
router.get('/twitter', (req, res) => {
  const authUrl = `https://twitter.com/i/oauth2/authorize?` +
    `response_type=code&` +
    `client_id=${config.twitter.consumerKey}&` +
    `redirect_uri=${encodeURIComponent(config.twitter.callbackUrl)}&` +
    `scope=tweet.read%20tweet.write%20users.read%20offline.access&` +
    `state=state&` +
    `code_challenge=challenge&` +
    `code_challenge_method=plain`;
  res.redirect(authUrl);
});

router.get('/twitter/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${config.frontendUrl}?error=twitter_auth_failed`);
    }

    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: config.twitter.callbackUrl,
        code_verifier: 'challenge',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${config.twitter.consumerKey}:${config.twitter.consumerSecret}`).toString('base64')}`,
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userResponse.data.data;

    accountsDb.save({
      platform: 'twitter',
      user_id: user.id,
      username: user.username,
      access_token: access_token,
      refresh_token: null,
      token_expires_at: null,
    });

    res.redirect(`${config.frontendUrl}?auth=success&platform=twitter`);
  } catch (error: any) {
    console.error('Twitter auth error:', error);
    res.redirect(`${config.frontendUrl}?error=twitter_auth_failed`);
  }
});

// Facebook OAuth
router.get('/facebook', (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${config.facebook.appId}&` +
    `redirect_uri=${encodeURIComponent(config.facebook.callbackUrl)}&` +
    `scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish`;
  res.redirect(authUrl);
});

router.get('/facebook/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${config.frontendUrl}?error=facebook_auth_failed`);
    }

    // Exchange code for token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: config.facebook.appId,
        client_secret: config.facebook.appSecret,
        redirect_uri: config.facebook.callbackUrl,
        code: code as string,
      },
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
      params: { access_token },
    });

    const user = userResponse.data;

    accountsDb.save({
      platform: 'facebook',
      user_id: user.id,
      username: user.name,
      access_token: access_token,
      refresh_token: null,
      token_expires_at: null,
    });

    res.redirect(`${config.frontendUrl}?auth=success&platform=facebook`);
  } catch (error: any) {
    console.error('Facebook auth error:', error);
    res.redirect(`${config.frontendUrl}?error=facebook_auth_failed`);
  }
});

// Instagram OAuth (uses Facebook)
router.get('/instagram', (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${config.instagram.appId}&` +
    `redirect_uri=${encodeURIComponent(config.instagram.callbackUrl)}&` +
    `scope=instagram_basic,instagram_content_publish`;
  res.redirect(authUrl);
});

router.get('/instagram/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${config.frontendUrl}?error=instagram_auth_failed`);
    }

    // Exchange code for token
    const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: config.instagram.appId,
        client_secret: config.instagram.appSecret,
        redirect_uri: config.instagram.callbackUrl,
        code: code as string,
      },
    });

    const { access_token } = tokenResponse.data;

    // Get Instagram account info
    const accountsResponse = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: { access_token },
    });

    // For simplicity, use the first Instagram account
    const instagramAccount = accountsResponse.data.data?.[0];

    if (instagramAccount) {
      accountsDb.save({
        platform: 'instagram',
        user_id: instagramAccount.id,
        username: instagramAccount.name,
        access_token: instagramAccount.access_token,
        refresh_token: null,
        token_expires_at: null,
      });
    }

    res.redirect(`${config.frontendUrl}?auth=success&platform=instagram`);
  } catch (error: any) {
    console.error('Instagram auth error:', error);
    res.redirect(`${config.frontendUrl}?error=instagram_auth_failed`);
  }
});

// TikTok OAuth
router.get('/tiktok', (req, res) => {
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${config.tiktok.clientKey}` +
    `&scope=user.info.basic,video.upload` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(config.tiktok.callbackUrl)}` +
    `&state=state`;
  res.redirect(authUrl);
});

router.get('/tiktok/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${config.frontendUrl}?error=tiktok_auth_failed`);
    }

    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        client_key: config.tiktok.clientKey,
        client_secret: config.tiktok.clientSecret,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: config.tiktok.callbackUrl,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { access_token, open_id } = tokenResponse.data.data;

    // Get user info
    const userResponse = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      headers: { Authorization: `Bearer ${access_token}` },
      params: { fields: 'open_id,union_id,avatar_url,display_name' },
    });

    const user = userResponse.data.data.user;

    accountsDb.save({
      platform: 'tiktok',
      user_id: open_id,
      username: user.display_name,
      access_token: access_token,
      refresh_token: null,
      token_expires_at: null,
    });

    res.redirect(`${config.frontendUrl}?auth=success&platform=tiktok`);
  } catch (error: any) {
    console.error('TikTok auth error:', error);
    res.redirect(`${config.frontendUrl}?error=tiktok_auth_failed`);
  }
});

// Get authenticated accounts
router.get('/accounts', (req, res) => {
  const accounts = accountsDb.getAll();
  res.json(accounts.map(acc => ({
    platform: acc.platform,
    username: acc.username,
    isAuthenticated: true,
  })));
});

// Disconnect account
router.delete('/accounts/:platform/:userId', (req, res) => {
  const { platform, userId } = req.params;
  accountsDb.delete(platform, userId);
  res.json({ success: true });
});

export default router;

