import HttpClient from '../src/utils/httpClient';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let mockAxiosInstance: any;

  beforeEach(() => {    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      defaults: {
        headers: {
          common: {}
        }
      },
      interceptors: {
        request: {
          use: jest.fn()
        },
        response: {
          use: jest.fn()
        }
      }
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    httpClient = new HttpClient({ baseURL: 'https://api.test.com' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with provided baseURL', () => {
      new HttpClient({ baseURL: 'https://custom.api.com' });
        expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://custom.api.com',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'CINC-API-SDK/1.0.0',
        },
      });
    });

    it('should create instance with default baseURL when none provided', () => {
      new HttpClient({});
      
      expect(mockedAxios.create).toHaveBeenCalled();
    });
  });

  describe('authentication', () => {
    it('should set authorization header', () => {
      const token = 'test-token-123';
      httpClient.setAuthToken(token);
      
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
    });

    it('should remove authorization header', () => {
      httpClient.setAuthToken('token');
      httpClient.removeAuthToken();
      
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('HTTP methods', () => {
    it('should make GET request', async () => {
      const responseData = { id: 1, name: 'test' };
      mockAxiosInstance.get.mockResolvedValue({ data: responseData });

      const response = await httpClient.get('/test');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
      expect(response.data).toEqual(responseData);
    });

    it('should make POST request', async () => {
      const requestData = { name: 'test' };
      const responseData = { id: 1, ...requestData };
      mockAxiosInstance.post.mockResolvedValue({ data: responseData });

      const response = await httpClient.post('/test', requestData);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', requestData, undefined);
      expect(response.data).toEqual(responseData);
    });

    it('should make PUT request', async () => {
      const requestData = { id: 1, name: 'updated' };
      mockAxiosInstance.put.mockResolvedValue({ data: requestData });

      const response = await httpClient.put('/test/1', requestData);
      
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', requestData, undefined);
      expect(response.data).toEqual(requestData);
    });

    it('should make DELETE request', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ status: 204 });

      const response = await httpClient.delete('/test/1');
      
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
      expect(response.status).toBe(204);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(httpClient.get('/test')).rejects.toThrow('Network Error');
    });

    it('should handle HTTP error responses', async () => {
      const error = new Error('Request failed with status code 404');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(httpClient.get('/test')).rejects.toThrow();
    });
  });
});
