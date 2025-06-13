import MarketService from '../src/services/marketService';
import HttpClient from '../src/utils/httpClient';
import { Market, MarketResponse } from '../src/types/market';

// Mock HttpClient
jest.mock('../src/utils/httpClient');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('MarketService', () => {
  let marketService: MarketService;
  let mockHttpClient: jest.Mocked<HttpClient>;
  const mockMarket: Market = {
    id: '1',
    name: 'Test Market',
    symbol: 'TEST',
    lastPrice: 100.50,
    change: 2.5,
    changePercent: 2.54,
    volume: 1000000,
    marketCap: 50000000
  };
  const createMockResponse = (data: any) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      headers: {}
    } as any
  });

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
    marketService = new MarketService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMarketData', () => {
    it('should fetch market data successfully', async () => {      const mockMarketResponse: MarketResponse = {
        markets: [mockMarket],
        totalMarkets: 1,
        totalVolume: 1000000
      };
      const mockResponse = createMockResponse(mockMarketResponse);

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await marketService.getMarketData();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/market/data');
      expect(result).toEqual(mockMarketResponse);
    });

    it('should handle errors when fetching market data', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Server Error'));

      await expect(marketService.getMarketData()).rejects.toThrow('Server Error');
    });
  });

  describe('getMarketTrends', () => {
    it('should fetch market trends successfully', async () => {
      const mockMarkets = [mockMarket, { ...mockMarket, id: '2', name: 'Market 2' }];
      const mockResponse = createMockResponse(mockMarkets);

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await marketService.getMarketTrends();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/market/trends');
      expect(result).toEqual(mockMarkets);
    });

    it('should handle errors when fetching market trends', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Network Error'));

      await expect(marketService.getMarketTrends()).rejects.toThrow('Network Error');
    });
  });

  describe('getMarketById', () => {
    it('should fetch market by ID successfully', async () => {
      const marketId = '1';
      const mockResponse = createMockResponse(mockMarket);

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await marketService.getMarketById(marketId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/market/${marketId}`);
      expect(result).toEqual(mockMarket);
    });

    it('should handle market not found error', async () => {
      const marketId = 'nonexistent';
      
      mockHttpClient.get.mockRejectedValue(new Error('Not Found'));

      await expect(marketService.getMarketById(marketId)).rejects.toThrow('Not Found');
    });
  });

  describe('searchMarkets', () => {
    it('should search markets successfully', async () => {
      const query = 'TEST';
      const mockMarkets = [mockMarket];
      const mockResponse = createMockResponse(mockMarkets);

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await marketService.searchMarkets(query);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/market/search?query=${query}`);
      expect(result).toEqual(mockMarkets);
    });

    it('should handle search errors', async () => {
      const query = 'invalid';
      
      mockHttpClient.get.mockRejectedValue(new Error('Bad Request'));

      await expect(marketService.searchMarkets(query)).rejects.toThrow('Bad Request');
    });
  });

  describe('constructor', () => {
    it('should create service with custom HttpClient', () => {
      const customHttpClient = new HttpClient({});
      const service = new MarketService(customHttpClient);
      
      expect(service).toBeInstanceOf(MarketService);
    });

    it('should create service with default HttpClient when none provided', () => {
      const service = new MarketService();
      
      expect(service).toBeInstanceOf(MarketService);
    });
  });
});
