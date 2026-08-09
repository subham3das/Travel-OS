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

/**
 * Simulates backend API request with configurable delay, pagination, sorting & error handling.
 */
export const mockApiRequest = async <T>(
  data: T,
  delayMs: number = 300,
  shouldFail: boolean = false,
  errorType: ApiError['code'] = 'SERVER_ERROR'
): Promise<ApiResponse<T>> => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (shouldFail) {
    throw {
      code: errorType,
      title: getErrorTitle(errorType),
      message: getErrorMessage(errorType),
    } as ApiError;
  }

  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
};

const getErrorTitle = (code: ApiError['code']): string => {
  switch (code) {
    case 'NETWORK_ERROR': return 'Network Connection Failed';
    case 'UNAUTHORIZED': return 'Authentication Required';
    case 'FORBIDDEN': return 'Access Denied';
    case 'NOT_FOUND': return 'Resource Not Found';
    case 'SESSION_EXPIRED': return 'Session Expired';
    case 'NO_INTERNET': return 'No Internet Connection';
    case 'RATE_LIMITED': return 'Too Many Requests';
    case 'SERVER_ERROR':
    default:
      return 'Server Error Occurred';
  }
};

const getErrorMessage = (code: ApiError['code']): string => {
  switch (code) {
    case 'NETWORK_ERROR': return 'Unable to connect to Travel OS servers. Please check your network connection.';
    case 'UNAUTHORIZED': return 'Your session is unauthenticated. Please log in to your agency account.';
    case 'FORBIDDEN': return 'You do not have administrative permission to perform this action.';
    case 'NOT_FOUND': return 'The requested record or resource could not be found.';
    case 'SESSION_EXPIRED': return 'Your login token has expired. Please re-authenticate.';
    case 'NO_INTERNET': return 'You are currently offline. Check your Wi-Fi or cellular network.';
    case 'RATE_LIMITED': return 'Request rate limit exceeded. Please wait a moment before trying again.';
    case 'SERVER_ERROR':
    default:
      return 'An unexpected server failure occurred. Our engineering team has been notified.';
  }
};
