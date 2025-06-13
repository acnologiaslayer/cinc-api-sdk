import { ValidationError } from './errors';

// Configuration interface
export interface Config {
  apiBaseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// Default configuration
const DEFAULT_CONFIG: Config = {
  apiBaseUrl: 'https://api.cincapi.com/v2',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Environment-based configuration
export const API_BASE_URL = process.env.CINC_API_BASE_URL || DEFAULT_CONFIG.apiBaseUrl;
export const TIMEOUT = parseInt(process.env.CINC_API_TIMEOUT || '') || DEFAULT_CONFIG.timeout;
export const RETRY_ATTEMPTS = parseInt(process.env.CINC_API_RETRY_ATTEMPTS || '') || DEFAULT_CONFIG.retryAttempts;
export const RETRY_DELAY = parseInt(process.env.CINC_API_RETRY_DELAY || '') || DEFAULT_CONFIG.retryDelay;

// Validation function
export function validateConfig(config: Partial<Config>): void {
  if (config.apiBaseUrl && !isValidUrl(config.apiBaseUrl)) {
    throw new ValidationError('Invalid API base URL provided');
  }
  
  if (config.timeout && (config.timeout < 1000 || config.timeout > 120000)) {
    throw new ValidationError('Timeout must be between 1000ms and 120000ms');
  }
  
  if (config.retryAttempts && (config.retryAttempts < 0 || config.retryAttempts > 10)) {
    throw new ValidationError('Retry attempts must be between 0 and 10');
  }
}

// Helper function to validate URLs
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Export default config
export const defaultConfig: Config = DEFAULT_CONFIG;

// Legacy exports for backward compatibility (deprecated)
/** @deprecated Use API_BASE_URL instead */
export const API_KEY = process.env.CINC_API_KEY || 'your_api_key_here';

/** @deprecated Use individual endpoint construction instead */
export const ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
    },
    ASSETS: {
        GET_ALL: `${API_BASE_URL}/assets`,
        GET_BY_ID: (id: string) => `${API_BASE_URL}/assets/${id}`,
    },
    MARKETS: {
        GET_ALL: `${API_BASE_URL}/markets`,
        GET_BY_ID: (id: string) => `${API_BASE_URL}/markets/${id}`,
    },
    PORTFOLIOS: {
        GET_ALL: `${API_BASE_URL}/portfolios`,
        GET_BY_ID: (id: string) => `${API_BASE_URL}/portfolios/${id}`,
    },
};