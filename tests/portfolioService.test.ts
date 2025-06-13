import PortfolioService from '../src/services/portfolioService';
import HttpClient from '../src/utils/httpClient';
import { Portfolio, PortfolioResponse, PortfolioAsset } from '../src/types/portfolio';

// Mock HttpClient
jest.mock('../src/utils/httpClient');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('PortfolioService', () => {
  let portfolioService: PortfolioService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockPortfolioAsset: PortfolioAsset = {
    id: '1',
    name: 'Test Asset',
    quantity: 10,
    value: 100.50
  };

  const mockPortfolio: Portfolio = {
    id: '1',
    userId: 'user123',
    assets: [mockPortfolioAsset],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
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
    portfolioService = new PortfolioService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPortfolio', () => {
    it('should fetch portfolio successfully', async () => {
      const userId = 'user123';
      const mockPortfolioResponse: PortfolioResponse = {
        portfolio: mockPortfolio,
        message: 'Portfolio retrieved successfully'
      };
      const mockResponse = createMockResponse(mockPortfolioResponse);

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await portfolioService.getPortfolio(userId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/portfolios/${userId}`);
      expect(result).toEqual(mockPortfolioResponse);
    });

    it('should handle errors when fetching portfolio', async () => {
      const userId = 'user123';
      
      mockHttpClient.get.mockRejectedValue(new Error('Not Found'));

      await expect(portfolioService.getPortfolio(userId)).rejects.toThrow('Not Found');
    });
  });

  describe('createPortfolio', () => {
    it('should create portfolio successfully', async () => {
      const userId = 'user123';
      const mockPortfolioResponse: PortfolioResponse = {
        portfolio: mockPortfolio,
        message: 'Portfolio created successfully'
      };
      const mockResponse = createMockResponse(mockPortfolioResponse);

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await portfolioService.createPortfolio(userId, mockPortfolio);

      expect(mockHttpClient.post).toHaveBeenCalledWith(`/portfolios/${userId}`, mockPortfolio);
      expect(result).toEqual(mockPortfolioResponse);
    });

    it('should handle creation errors', async () => {
      const userId = 'user123';
      
      mockHttpClient.post.mockRejectedValue(new Error('Bad Request'));

      await expect(portfolioService.createPortfolio(userId, mockPortfolio)).rejects.toThrow('Bad Request');
    });
  });

  describe('updatePortfolio', () => {
    it('should update portfolio successfully', async () => {
      const userId = 'user123';
      const portfolioId = 'portfolio1';
      const updatedPortfolio = { ...mockPortfolio, assets: [] };
      const mockPortfolioResponse: PortfolioResponse = {
        portfolio: updatedPortfolio,
        message: 'Portfolio updated successfully'
      };
      const mockResponse = createMockResponse(mockPortfolioResponse);

      mockHttpClient.put.mockResolvedValue(mockResponse);

      const result = await portfolioService.updatePortfolio(userId, portfolioId, updatedPortfolio);

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/portfolios/${userId}/${portfolioId}`, updatedPortfolio);
      expect(result).toEqual(mockPortfolioResponse);
    });

    it('should handle update errors', async () => {
      const userId = 'user123';
      const portfolioId = 'portfolio1';
      
      mockHttpClient.put.mockRejectedValue(new Error('Forbidden'));

      await expect(portfolioService.updatePortfolio(userId, portfolioId, mockPortfolio)).rejects.toThrow('Forbidden');
    });
  });

  describe('deletePortfolio', () => {
    it('should delete portfolio successfully', async () => {
      const userId = 'user123';
      const portfolioId = 'portfolio1';
      const mockResponse = createMockResponse({});

      mockHttpClient.delete.mockResolvedValue(mockResponse);

      await portfolioService.deletePortfolio(userId, portfolioId);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/portfolios/${userId}/${portfolioId}`);
    });

    it('should handle delete errors', async () => {
      const userId = 'user123';
      const portfolioId = 'portfolio1';
      
      mockHttpClient.delete.mockRejectedValue(new Error('Not Found'));

      await expect(portfolioService.deletePortfolio(userId, portfolioId)).rejects.toThrow('Not Found');
    });
  });

  describe('constructor', () => {
    it('should create service with custom HttpClient', () => {
      const customHttpClient = new HttpClient({});
      const service = new PortfolioService(customHttpClient);
      
      expect(service).toBeInstanceOf(PortfolioService);
    });

    it('should create service with default HttpClient when none provided', () => {
      const service = new PortfolioService();
      
      expect(service).toBeInstanceOf(PortfolioService);
    });
  });
});
