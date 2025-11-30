import { AuthenticatedAccount, PostContent, SocialPlatform } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  async getAccounts(): Promise<AuthenticatedAccount[]> {
    const response = await fetch(`${API_BASE}/auth/accounts`);
    const accounts = await response.json();
    return accounts.map((acc: any) => ({
      platform: acc.platform as SocialPlatform,
      username: acc.username || 'User',
      isAuthenticated: acc.isAuthenticated,
    }));
  },

  async authenticate(platform: SocialPlatform): Promise<void> {
    window.location.href = `${API_BASE}/auth/${platform}`;
  },

  async disconnectAccount(platform: SocialPlatform, userId: string): Promise<void> {
    await fetch(`${API_BASE}/auth/accounts/${platform}/${userId}`, {
      method: 'DELETE',
    });
  },

  async postToPlatforms(
    platforms: SocialPlatform[],
    content: PostContent
  ): Promise<Array<{ success: boolean; platform: string; error?: string; postId?: string; url?: string }>> {
    const formData = new FormData();
    formData.append('text', content.text);
    formData.append('platforms', JSON.stringify(platforms));

    content.images.forEach((image) => {
      formData.append('images', image);
    });

    content.videos.forEach((video) => {
      formData.append('videos', video);
    });

    const response = await fetch(`${API_BASE}/api/post`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to post');
    }

    const data = await response.json();
    return data.results;
  },
};

