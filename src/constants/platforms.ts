import { PlatformConfig } from '../types';

export const PLATFORMS: Record<string, PlatformConfig> = {
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0077b5',
    maxTextLength: null, // Unlimited
    supportsVideo: true,
    supportsImages: true,
    maxImages: null, // Multiple images supported
    maxVideos: 1, // Only one video
    canCombineMedia: false, // Cannot post video + images together
    requiresThreading: false,
    threadMaxLength: 0,
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    color: '#1DA1F2',
    maxTextLength: 280, // Free tier, can be longer for paid
    supportsVideo: true,
    supportsImages: true,
    maxImages: 4,
    maxVideos: 1,
    canCombineMedia: true,
    requiresThreading: true, // Long content needs threading
    threadMaxLength: 280,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    maxTextLength: null,
    supportsVideo: true,
    supportsImages: true,
    maxImages: null,
    maxVideos: 1,
    canCombineMedia: true,
    requiresThreading: false,
    threadMaxLength: 0,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    maxTextLength: 2200,
    supportsVideo: true,
    supportsImages: true,
    maxImages: 10,
    maxVideos: 1,
    canCombineMedia: false, // Carousel posts are separate
    requiresThreading: false,
    threadMaxLength: 0,
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    maxTextLength: 2200,
    supportsVideo: true,
    supportsImages: false, // TikTok is video-only
    maxImages: 0,
    maxVideos: 1,
    canCombineMedia: false,
    requiresThreading: false,
    threadMaxLength: 0,
  },
};

export const PLATFORM_LIST = Object.values(PLATFORMS);

