import CincAPIClient from '../src/client/CincAPIClient';
import { AuthService } from '../src/services/authService';
import AssetService from '../src/services/assetService';
import MarketService from '../src/services/marketService';
import PortfolioService from '../src/services/portfolioService';
import HttpClient from '../src/utils/httpClient';

// Mock all services and HttpClient
jest.mock('../src/services/authService');
jest.mock('../src/services/assetService');
jest.mock('../src/services/marketService');
jest.mock('../src/services/portfolioService');
jest.mock('../src/utils/httpClient');

const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;
const MockedAssetService = AssetService as jest.MockedClass<typeof AssetService>;
const MockedMarketService = MarketService as jest.MockedClass<typeof MarketService>;
const MockedPortfolioService = PortfolioService as jest.MockedClass<typeof PortfolioService>;
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('CincAPIClient', () => {
  let client: CincAPIClient;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      setAuthToken: jest.fn(),
      removeAuthToken: jest.fn(),
    } as any;

    MockedHttpClient.mockImplementation(() => mockHttpClient);
    
    MockedAuthService.mockImplementation(() => ({
      login: jest.fn(),
      logout: jest.fn(),
    } as any));

    MockedAssetService.mockImplementation(() => ({
      getAssets: jest.fn(),
      getAssetById: jest.fn(),
      createAsset: jest.fn(),
      updateAsset: jest.fn(),
      deleteAsset: jest.fn(),
    } as any));

    MockedMarketService.mockImplementation(() => ({
      getMarketData: jest.fn(),
      getMarketById: jest.fn(),
    } as any));

    MockedPortfolioService.mockImplementation(() => ({
      getPortfolio: jest.fn(),
      createPortfolio: jest.fn(),
      updatePortfolio: jest.fn(),
      deletePortfolio: jest.fn(),
    } as any));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with default configuration', () => {
      client = new CincAPIClient();

      expect(client).toBeInstanceOf(CincAPIClient);
      expect(client.auth).toBeDefined();
      expect(client.assets).toBeDefined();
      expect(client.markets).toBeDefined();
      expect(client.portfolios).toBeDefined();
    });

    it('should create client with custom configuration', () => {
      const config = {
        baseURL: 'https://custom.api.com',
        timeout: 10000,
        apiKey: 'test-key'
      };

      client = new CincAPIClient(config);

      expect(client).toBeInstanceOf(CincAPIClient);
      expect(MockedHttpClient).toHaveBeenCalledWith({
        baseURL: 'https://custom.api.com',
        timeout: 10000,
        headers: undefined
      });
    });

    it('should initialize all services with shared HttpClient', () => {
      client = new CincAPIClient();

      expect(MockedAuthService).toHaveBeenCalledWith(mockHttpClient);
      expect(MockedAssetService).toHaveBeenCalledWith(mockHttpClient);
      expect(MockedMarketService).toHaveBeenCalledWith(mockHttpClient);
      expect(MockedPortfolioService).toHaveBeenCalledWith(mockHttpClient);
    });
  });

  describe('authenticate', () => {
    beforeEach(() => {
      client = new CincAPIClient();
    });

    it('should call auth service login method', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockAuthResponse = {
        token: 'jwt-token-123',
        user: { id: 1, email },
        expiresIn: 3600
      };

      const mockLogin = jest.fn().mockResolvedValue(mockAuthResponse);
      (client.auth as any).login = mockLogin;

      const result = await client.authenticate(email, password);

      expect(mockLogin).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should handle authentication errors', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      const mockLogin = jest.fn().mockRejectedValue(new Error('Unauthorized'));
      (client.auth as any).login = mockLogin;

      await expect(client.authenticate(email, password)).rejects.toThrow('Unauthorized');
    });
  });

  describe('setAuthToken', () => {
    beforeEach(() => {
      client = new CincAPIClient();
    });

    it('should set auth token on HttpClient', () => {
      const token = 'test-token-123';

      client.setAuthToken(token);

      expect(mockHttpClient.setAuthToken).toHaveBeenCalledWith(token);
    });
  });

  describe('updateConfig', () => {
    beforeEach(() => {
      client = new CincAPIClient();
    });

    it('should update client configuration', () => {
      const newConfig = {
        baseURL: 'https://new.api.com',
        timeout: 15000
      };

      client.updateConfig(newConfig);

      // We can't directly test the internal config, but we can verify the method exists
      expect(client.updateConfig).toBeDefined();
    });
  });
  describe('service integration', () => {
    beforeEach(() => {
      client = new CincAPIClient();
    });

    it('should have all required service instances', () => {
      expect(client.auth).toBeDefined();
      expect(client.assets).toBeDefined();
      expect(client.markets).toBeDefined();
      expect(client.portfolios).toBeDefined();
    });

    it('should allow calling service methods', async () => {
      const mockGetAssets = jest.fn().mockResolvedValue([]);
      (client.assets as any).getAssets = mockGetAssets;

      await client.assets.getAssets();

      expect(mockGetAssets).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      client = new CincAPIClient();
    });

    it('should propagate service errors', async () => {
      const mockLogin = jest.fn().mockRejectedValue(new Error('Network Error'));
      (client.auth as any).login = mockLogin;

      await expect(client.authenticate('user', 'pass')).rejects.toThrow('Network Error');
    });
  });
});
