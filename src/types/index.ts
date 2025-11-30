export type SocialPlatform = 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'tiktok';

export interface PlatformConfig {
  id: SocialPlatform;
  name: string;
  icon: string;
  color: string;
  maxTextLength: number | null; // null means unlimited
  supportsVideo: boolean;
  supportsImages: boolean;
  maxImages: number | null;
  maxVideos: number | null;
  canCombineMedia: boolean; // Can post video + images together
  requiresThreading: boolean; // For long content (like Twitter)
  threadMaxLength: number; // Max length per thread
}

export interface AuthenticatedAccount {
  platform: SocialPlatform;
  username: string;
  isAuthenticated: boolean;
  accessToken?: string;
}

export interface PostContent {
  text: string;
  images: File[];
  videos: File[];
}

export interface PlatformValidation {
  platform: SocialPlatform;
  isValid: boolean;
  warnings: string[];
  errors: string[];
  adaptedContent?: {
    text?: string;
    threads?: string[];
    images?: File[];
    videos?: File[];
  };
}

