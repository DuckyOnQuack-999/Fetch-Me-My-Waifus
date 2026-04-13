const CACHE_KEY_PREFIX = 'waifu_image_cache_';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

export function setCachedImage(imageId: string, imageData: string) {
  const cacheItem = {
    data: imageData,
    timestamp: Date.now(),
  };
  localStorage.setItem(`${CACHE_KEY_PREFIX}${imageId}`, JSON.stringify(cacheItem));
}

export function getCachedImage(imageId: string): string | null {
  const cacheItem = localStorage.getItem(`${CACHE_KEY_PREFIX}${imageId}`);
  if (cacheItem) {
    const { data, timestamp } = JSON.parse(cacheItem);
    if (Date.now() - timestamp < CACHE_EXPIRATION) {
      return data;
    } else {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${imageId}`);
    }
  }
  return null;
}

export function clearImageCache() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}
