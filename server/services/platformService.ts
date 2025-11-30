import axios from 'axios';
import FormData from 'form-data';
import { Account } from '../database';
import { config } from '../config';

export interface PostResult {
  success: boolean;
  platform: string;
  postId?: string;
  error?: string;
  url?: string;
}

export class PlatformService {
  static async postToLinkedIn(account: Account, content: { text: string; images?: File[]; videos?: File[] }): Promise<PostResult> {
    try {
      // LinkedIn API v2 - Create a UGC Post
      const headers = {
        'Authorization': `Bearer ${account.access_token}`,
        'Content-Type': 'application/json',
      };

      // For LinkedIn, we need to create a share first
      // Note: LinkedIn API requires specific permissions and setup
      const shareData = {
        author: `urn:li:person:${account.user_id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content.text,
            },
            shareMediaCategory: content.images && content.images.length > 0 ? 'IMAGE' : 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        shareData,
        { headers }
      );

      return {
        success: true,
        platform: 'linkedin',
        postId: response.data.id,
      };
    } catch (error: any) {
      return {
        success: false,
        platform: 'linkedin',
        error: error.response?.data?.message || error.message,
      };
    }
  }

  static async postToTwitter(account: Account, content: { text: string; images?: File[]; videos?: File[] }): Promise<PostResult> {
    try {
      // Twitter API v2 - Create Tweet
      const headers = {
        'Authorization': `Bearer ${account.access_token}`,
        'Content-Type': 'application/json',
      };

      // For Twitter, if content is too long, we'd need to create a thread
      // For now, we'll post a single tweet
      const tweetData: any = {
        text: content.text.substring(0, 280), // Twitter character limit
      };

      // If there are images, we'd need to upload media first
      // This is simplified - full implementation would handle media uploads
      const response = await axios.post(
        'https://api.twitter.com/2/tweets',
        tweetData,
        { headers }
      );

      return {
        success: true,
        platform: 'twitter',
        postId: response.data.data.id,
        url: `https://twitter.com/i/web/status/${response.data.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        platform: 'twitter',
        error: error.response?.data?.detail || error.message,
      };
    }
  }

  static async postToFacebook(account: Account, content: { text: string; images?: File[]; videos?: File[] }): Promise<PostResult> {
    try {
      // Facebook Graph API - Create Post
      const formData = new FormData();
      formData.append('message', content.text);
      formData.append('access_token', account.access_token);

      // Note: Media uploads require separate API calls
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${account.user_id}/feed`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return {
        success: true,
        platform: 'facebook',
        postId: response.data.id,
        url: `https://facebook.com/${response.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        platform: 'facebook',
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  static async postToInstagram(account: Account, content: { text: string; images?: File[]; videos?: File[] }): Promise<PostResult> {
    try {
      // Instagram Graph API - Create Media Container then Publish
      // Instagram requires a business account and specific permissions
      const mediaData: any = {
        access_token: account.access_token,
        caption: content.text,
      };

      // For images
      if (content.images && content.images.length > 0) {
        // First create media container
        const containerResponse = await axios.post(
          `https://graph.facebook.com/v18.0/${account.user_id}/media`,
          {
            ...mediaData,
            image_url: content.images[0], // Simplified - would need to upload to a CDN first
          }
        );

        // Then publish
        const publishResponse = await axios.post(
          `https://graph.facebook.com/v18.0/${account.user_id}/media_publish`,
          {
            access_token: account.access_token,
            creation_id: containerResponse.data.id,
          }
        );

        return {
          success: true,
          platform: 'instagram',
          postId: publishResponse.data.id,
        };
      }

      return {
        success: false,
        platform: 'instagram',
        error: 'Instagram requires at least one image',
      };
    } catch (error: any) {
      return {
        success: false,
        platform: 'instagram',
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  static async postToTikTok(account: Account, content: { text: string; images?: File[]; videos?: File[] }): Promise<PostResult> {
    try {
      // TikTok API - Upload Video
      // TikTok requires video content
      if (!content.videos || content.videos.length === 0) {
        return {
          success: false,
          platform: 'tiktok',
          error: 'TikTok requires video content',
        };
      }

      // TikTok API implementation would go here
      // This is a placeholder as TikTok API requires specific setup
      return {
        success: false,
        platform: 'tiktok',
        error: 'TikTok API integration requires additional setup',
      };
    } catch (error: any) {
      return {
        success: false,
        platform: 'tiktok',
        error: error.message,
      };
    }
  }

  static async postToPlatform(
    platform: string,
    account: Account,
    content: { text: string; images?: File[]; videos?: File[] }
  ): Promise<PostResult> {
    switch (platform) {
      case 'linkedin':
        return this.postToLinkedIn(account, content);
      case 'twitter':
        return this.postToTwitter(account, content);
      case 'facebook':
        return this.postToFacebook(account, content);
      case 'instagram':
        return this.postToInstagram(account, content);
      case 'tiktok':
        return this.postToTikTok(account, content);
      default:
        return {
          success: false,
          platform,
          error: `Unsupported platform: ${platform}`,
        };
    }
  }
}

