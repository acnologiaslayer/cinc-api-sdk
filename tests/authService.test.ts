import { AuthService } from '../src/services/authService';
import HttpClient from '../src/utils/httpClient';

// Mock HttpClient
jest.mock('../src/utils/httpClient');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('AuthService', () => {
  let authService: AuthService;
  let mockHttpClient: jest.Mocked<HttpClient>;
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
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockResponse = createMockResponse({
        token: 'jwt-token-123',
        user: { id: 1, email },
        expiresIn: 3600
      });

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await authService.login(email, password);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', {
        email,
        password
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockHttpClient.post.mockRejectedValue(new Error('Unauthorized'));

      await expect(authService.login(email, password)).rejects.toThrow('Unauthorized');
      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', {
        email,
        password
      });
    });

    it('should handle network errors during login', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockHttpClient.post.mockRejectedValue(new Error('Network Error'));

      await expect(authService.login(email, password)).rejects.toThrow('Network Error');
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      const mockResponse = createMockResponse({});
      mockHttpClient.post.mockResolvedValue(mockResponse);

      await authService.logout();

      expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/logout', {});
    });

    it('should handle logout errors gracefully', async () => {
      mockHttpClient.post.mockRejectedValue(new Error('Server Error'));

      await expect(authService.logout()).rejects.toThrow('Server Error');
    });
  });

  describe('constructor', () => {
    it('should create service with custom HttpClient', () => {
      const customHttpClient = new HttpClient({});
      const service = new AuthService(customHttpClient);
      
      expect(service).toBeInstanceOf(AuthService);
    });

    it('should create service with default HttpClient when none provided', () => {
      const service = new AuthService();
      
      expect(service).toBeInstanceOf(AuthService);
    });
  });
});
