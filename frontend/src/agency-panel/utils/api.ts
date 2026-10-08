// ─── Global Foundation: Backend-Ready API Architecture & Utilities ─────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  code: 'NETWORK_ERROR' | 'SERVER_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'SESSION_EXPIRED' | 'NO_INTERNET' | 'RATE_LIMITED';
  title: string;
  message: string;
}

// In-Memory API Response Cache
const cacheStore = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export const fetchWithCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL_MS
): Promise<T> => {
  const cached = cacheStore.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  const result = await fetcher();
  cacheStore.set(key, { data: result, timestamp: Date.now() });
  return result;
};

export const clearApiCache = (keyPattern?: string) => {
  if (!keyPattern) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.includes(keyPattern)) {
      cacheStore.delete(key);
    }
  }
};


