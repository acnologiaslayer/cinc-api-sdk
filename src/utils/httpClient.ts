import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, TIMEOUT, RETRY_ATTEMPTS, RETRY_DELAY, validateConfig } from './config';
import { 
  CincAPIError, 
  NetworkError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ValidationError, 
  RateLimitError, 
  ServerError 
} from './errors';

// Extend AxiosRequestConfig to include metadata
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime?: Date;
  };
}

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    // Validate configuration
    validateConfig(config);
    
    this.config = {
      baseURL: config.baseURL || API_BASE_URL,
      timeout: config.timeout || TIMEOUT,
      retryAttempts: config.retryAttempts || RETRY_ATTEMPTS,
      retryDelay: config.retryDelay || RETRY_DELAY,
      headers: config.headers || {},
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CINC-API-SDK/1.0.0',
        ...this.config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        // Add timestamp to requests for debugging
        config.metadata = { startTime: new Date() };
        return config;
      },
      (error: any) => Promise.reject(this.handleError(error))
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time for debugging
        const endTime = new Date();
        const config = response.config as ExtendedAxiosRequestConfig;
        const duration = endTime.getTime() - (config.metadata?.startTime?.getTime() || 0);
        if (duration > 5000) {
          console.warn(`Slow API response: ${response.config.url} took ${duration}ms`);
        }
        return response;
      },
      (error: any) => Promise.reject(this.handleError(error))
    );
  }

  private handleError(error: AxiosError): CincAPIError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = (data as any)?.message || error.message;

      switch (status) {
        case 400:
          return new ValidationError(message);
        case 401:
          return new AuthenticationError(message);
        case 403:
          return new AuthorizationError(message);
        case 404:
          return new NotFoundError(message);
        case 429:
          return new RateLimitError(message);
        case 500:
        case 502:
        case 503:
        case 504:
          return new ServerError(message);
        default:
          return new CincAPIError(message, status, data);
      }
    } else if (error.request) {
      // Network error
      return new NetworkError('Network request failed - please check your connection');
    } else {
      // Something else happened
      return new CincAPIError(error.message);
    }
  }

  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    attempt: number = 0
  ): Promise<AxiosResponse<T>> {
    try {
      return await requestFn();
    } catch (error) {
      const maxAttempts = this.config.retryAttempts || 0;
      
      if (attempt < maxAttempts && this.shouldRetry(error as CincAPIError)) {
        const delay = this.config.retryDelay! * Math.pow(2, attempt); // Exponential backoff
        await this.sleep(delay);
        return this.retryRequest(requestFn, attempt + 1);
      }
      
      throw error;
    }
  }

  private shouldRetry(error: CincAPIError): boolean {
    // Retry on network errors and certain HTTP status codes
    return (
      error instanceof NetworkError ||
      error instanceof ServerError ||
      (typeof error.statusCode === 'number' && error.statusCode >= 500)
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public setAuthToken(token: string): void {
    if (!token) {
      throw new ValidationError('Auth token cannot be empty');
    }
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  public updateConfig(newConfig: Partial<HttpClientConfig>): void {
    validateConfig(newConfig);
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.baseURL) {
      this.axiosInstance.defaults.baseURL = newConfig.baseURL;
    }
    if (newConfig.timeout) {
      this.axiosInstance.defaults.timeout = newConfig.timeout;
    }
    if (newConfig.headers) {
      Object.assign(this.axiosInstance.defaults.headers, newConfig.headers);
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.get<T>(url, config));
  }

  public async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.post<T>(url, data, config));
  }

  public async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.put<T>(url, data, config));
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.delete<T>(url, config));
  }

  public async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.axiosInstance.patch<T>(url, data, config));
  }
}

export default HttpClient;