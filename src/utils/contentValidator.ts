import { PostContent, PlatformConfig, PlatformValidation, SocialPlatform } from '../types';
import { PLATFORMS } from '../constants/platforms';

export function validateContentForPlatform(
  content: PostContent,
  platformId: SocialPlatform
): PlatformValidation {
  const platform = PLATFORMS[platformId];
  const validation: PlatformValidation = {
    platform: platformId,
    isValid: true,
    warnings: [],
    errors: [],
  };

  // Check text length
  if (platform.maxTextLength && content.text.length > platform.maxTextLength) {
    if (platform.requiresThreading) {
      validation.warnings.push(
        `Content exceeds ${platform.maxTextLength} characters. Will be split into threads.`
      );
      validation.adaptedContent = {
        ...validation.adaptedContent,
        threads: splitIntoThreads(content.text, platform.threadMaxLength),
      };
    } else {
      validation.errors.push(
        `Text exceeds maximum length of ${platform.maxTextLength} characters for ${platform.name}`
      );
      validation.isValid = false;
    }
  }

  // Check video support
  if (content.videos.length > 0 && !platform.supportsVideo) {
    validation.errors.push(`${platform.name} does not support video posts`);
    validation.isValid = false;
  }

  // Check image support
  if (content.images.length > 0 && !platform.supportsImages) {
    validation.errors.push(`${platform.name} does not support image posts`);
    validation.isValid = false;
  }

  // Check video count
  if (platform.maxVideos !== null && content.videos.length > platform.maxVideos) {
    validation.errors.push(
      `${platform.name} supports maximum ${platform.maxVideos} video(s)`
    );
    validation.isValid = false;
  }

  // Check image count
  if (platform.maxImages !== null && content.images.length > platform.maxImages) {
    validation.warnings.push(
      `${platform.name} supports maximum ${platform.maxImages} image(s). Only the first ${platform.maxImages} will be posted.`
    );
    validation.adaptedContent = {
      ...validation.adaptedContent,
      images: content.images.slice(0, platform.maxImages),
    };
  }

  // Check media combination rules (e.g., LinkedIn: video OR images, not both)
  if (!platform.canCombineMedia) {
    if (content.videos.length > 0 && content.images.length > 0) {
      validation.warnings.push(
        `${platform.name} cannot post videos and images together. Please choose one.`
      );
      // Suggest keeping videos if both exist
      if (content.videos.length > 0) {
        validation.adaptedContent = {
          ...validation.adaptedContent,
          videos: content.videos,
          images: [],
        };
        validation.warnings.push('Videos will be used, images will be excluded.');
      }
    }
  }

  return validation;
}

function splitIntoThreads(text: string, maxLength: number): string[] {
  const threads: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentThread = '';
  let threadNumber = 1;

  for (const sentence of sentences) {
    if ((currentThread + sentence).length <= maxLength - 20) {
      // -20 to account for " (1/3)" suffix
      currentThread += sentence;
    } else {
      if (currentThread) {
        threads.push(currentThread.trim());
      }
      currentThread = sentence;
    }
  }

  if (currentThread) {
    threads.push(currentThread.trim());
  }

  // Add thread numbers
  return threads.map((thread, index) => {
    if (threads.length > 1) {
      return `${thread} (${index + 1}/${threads.length})`;
    }
    return thread;
  });
}

