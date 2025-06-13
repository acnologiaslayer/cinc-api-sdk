import { AuthService } from '../services/authService';
import AssetService from '../services/assetService';
import MarketService from '../services/marketService';
import PortfolioService from '../services/portfolioService';
import HttpClient from '../utils/httpClient';
import { API_BASE_URL } from '../utils/config';

export interface CincAPIClientConfig {
  apiKey?: string;
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export default class CincAPIClient {
  public auth: AuthService;
  public assets: AssetService;
  public markets: MarketService;
  public portfolios: PortfolioService;
  
  private config: CincAPIClientConfig;
  private httpClient: HttpClient;

  constructor(config: CincAPIClientConfig = {}) {
    this.config = {
      baseURL: API_BASE_URL,
      timeout: 30000,
      ...config
    };
    
    // Create a shared HTTP client with the configuration
    this.httpClient = new HttpClient({
      baseURL: this.config.baseURL!,
      timeout: this.config.timeout,
      headers: this.config.headers
    });
    
    // Initialize services with the shared HTTP client
    this.auth = new AuthService(this.httpClient);
    this.assets = new AssetService(this.httpClient);
    this.markets = new MarketService(this.httpClient);
    this.portfolios = new PortfolioService(this.httpClient);
  }

  // Convenience method for authentication
  public async authenticate(email: string, password: string) {
    return this.auth.login(email, password);
  }

  // Set authentication token for subsequent requests
  public setAuthToken(token: string) {
    this.httpClient.setAuthToken(token);
  }
  // Update base configuration
  public updateConfig(newConfig: Partial<CincAPIClientConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}
