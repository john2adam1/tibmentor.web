import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts various YouTube URL formats to the correct embed URL
 */
export function getYoutubeEmbedUrl(url: string = ''): string {
  if (!url) return '';

  // If it's already an embed URL, return as is
  if (url.includes('/embed/')) return url;

  let videoId = '';

  try {
    if (url.includes('youtu.be/')) {
      // format: https://youtu.be/VIDEO_ID
      videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
    } else if (url.includes('youtube.com/watch')) {
      // format: https://www.youtube.com/watch?v=VIDEO_ID
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    } else if (url.includes('youtube.com/shorts/')) {
      // format: https://www.youtube.com/shorts/VIDEO_ID
      videoId = url.split('shorts/')[1].split(/[?#]/)[0];
    } else if (url.includes('m.youtube.com/watch')) {
      // format: https://m.youtube.com/watch?v=VIDEO_ID
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    }
  } catch (e) {
    console.error('Error parsing YouTube URL:', e);
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0` : url;
}

/**
 * Formats media URLs to include base URL if needed
 */
export function getMediaUrl(url: string | undefined | null): string {
  if (!url) return '';

  if (url.startsWith('http')) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dev.imedteam.uz';

  // Handle case where path starts with /media
  if (url.startsWith('/media')) {
    return `${baseUrl}${url}`;
  }

  // Handle case where it's a storage ID like "uuid:path" or just a path
  if (url.includes(':') && !url.includes('://')) {
    const path = url.split(':').pop();
    return `${baseUrl}/media/${path}`;
  }

  // Fallback for relative paths
  if (!url.startsWith('/')) {
    return `${baseUrl}/media/${url}`;
  }

  return `${baseUrl}${url}`;
}

/**
 * Checks if a URL points to a video file
 */
export function isVideoUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
}

