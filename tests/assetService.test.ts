import AssetService from '../src/services/assetService';
import HttpClient from '../src/utils/httpClient';
import { Asset } from '../src/types/asset';

// Mock HttpClient
jest.mock('../src/utils/httpClient');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('AssetService', () => {
  let assetService: AssetService;
  let mockHttpClient: jest.Mocked<HttpClient>;
  const mockAsset: Asset = {
    id: '1',
    name: 'Test Asset',
    type: 'stock',
    value: 100.50,
    currency: 'USD',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
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
    assetService = new AssetService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getAssets', () => {
    it('should fetch all assets successfully', async () => {
      const mockAssets = [mockAsset, { ...mockAsset, id: '2', name: 'Asset 2' }];
      const mockResponse = createMockResponse(mockAssets);

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await assetService.getAssets();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/assets');
      expect(result).toEqual(mockAssets);
    });

    it('should handle errors when fetching assets', async () => {
      mockHttpClient.get.mockRejectedValue(new Error('Server Error'));

      await expect(assetService.getAssets()).rejects.toThrow('Server Error');
    });
  });

  describe('getAssetById', () => {
    it('should fetch asset by ID successfully', async () => {
      const assetId = '1';
      const mockResponse = createMockResponse(mockAsset);

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await assetService.getAssetById(assetId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/assets/${assetId}`);
      expect(result).toEqual(mockAsset);
    });

    it('should handle asset not found error', async () => {
      const assetId = 'nonexistent';
      
      mockHttpClient.get.mockRejectedValue(new Error('Not Found'));

      await expect(assetService.getAssetById(assetId)).rejects.toThrow('Not Found');
    });
  });

  describe('createAsset', () => {
    it('should create asset successfully', async () => {
      const newAsset = { 
        name: 'New Asset',
        type: 'bond',
        value: 50.25,
        currency: 'EUR',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      const mockResponse = createMockResponse(mockAsset);

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await assetService.createAsset(newAsset as Asset);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/assets', newAsset);
      expect(result).toEqual(mockAsset);
    });

    it('should handle creation errors', async () => {
      const newAsset = { ...mockAsset };
      
      mockHttpClient.post.mockRejectedValue(new Error('Bad Request'));

      await expect(assetService.createAsset(newAsset)).rejects.toThrow('Bad Request');
    });
  });

  describe('updateAsset', () => {
    it('should update asset successfully', async () => {
      const assetId = '1';
      const updatedAsset = { ...mockAsset, name: 'Updated Asset' };
      const mockResponse = createMockResponse(updatedAsset);

      mockHttpClient.put.mockResolvedValue(mockResponse);

      const result = await assetService.updateAsset(assetId, updatedAsset);

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/assets/${assetId}`, updatedAsset);
      expect(result).toEqual(updatedAsset);
    });

    it('should handle update errors', async () => {
      const assetId = '1';
      const updatedAsset = { ...mockAsset, name: 'Updated Asset' };
      
      mockHttpClient.put.mockRejectedValue(new Error('Forbidden'));

      await expect(assetService.updateAsset(assetId, updatedAsset)).rejects.toThrow('Forbidden');
    });
  });

  describe('deleteAsset', () => {
    it('should delete asset successfully', async () => {
      const assetId = '1';
      const mockResponse = createMockResponse({});

      mockHttpClient.delete.mockResolvedValue(mockResponse);

      await assetService.deleteAsset(assetId);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/assets/${assetId}`);
    });

    it('should handle delete errors', async () => {
      const assetId = '1';
      
      mockHttpClient.delete.mockRejectedValue(new Error('Not Found'));

      await expect(assetService.deleteAsset(assetId)).rejects.toThrow('Not Found');
    });
  });

  describe('constructor', () => {
    it('should create service with custom HttpClient', () => {
      const customHttpClient = new HttpClient({});
      const service = new AssetService(customHttpClient);
      
      expect(service).toBeInstanceOf(AssetService);
    });

    it('should create service with default HttpClient when none provided', () => {
      const service = new AssetService();
      
      expect(service).toBeInstanceOf(AssetService);
    });
  });
});
