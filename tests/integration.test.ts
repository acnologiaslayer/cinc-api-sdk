import { CincAPIClient } from '../src/index';

// This is an integration test that tests the main SDK exports
describe('SDK Integration', () => {
  describe('exports', () => {
    it('should export CincAPIClient', () => {
      expect(CincAPIClient).toBeDefined();
      expect(typeof CincAPIClient).toBe('function');
    });

    it('should create client instance successfully', () => {
      const client = new CincAPIClient({
        baseURL: 'https://test.api.com'
      });

      expect(client).toBeInstanceOf(CincAPIClient);
      expect(client.auth).toBeDefined();
      expect(client.assets).toBeDefined();
      expect(client.markets).toBeDefined();
      expect(client.portfolios).toBeDefined();
    });

    it('should have all service methods available', () => {
      const client = new CincAPIClient();

      // Check auth service methods
      expect(typeof client.auth.login).toBe('function');
      expect(typeof client.auth.logout).toBe('function');

      // Check asset service methods
      expect(typeof client.assets.getAssets).toBe('function');
      expect(typeof client.assets.getAssetById).toBe('function');
      expect(typeof client.assets.createAsset).toBe('function');
      expect(typeof client.assets.updateAsset).toBe('function');
      expect(typeof client.assets.deleteAsset).toBe('function');

      // Check client methods
      expect(typeof client.authenticate).toBe('function');
      expect(typeof client.setAuthToken).toBe('function');
      expect(typeof client.updateConfig).toBe('function');
    });
  });

  describe('configuration', () => {
    it('should accept custom configuration', () => {
      const config = {
        baseURL: 'https://custom.api.com',
        timeout: 15000,
        apiKey: 'test-key-123'
      };

      const client = new CincAPIClient(config);
      
      expect(client).toBeInstanceOf(CincAPIClient);
    });

    it('should work with minimal configuration', () => {
      const client = new CincAPIClient();
      
      expect(client).toBeInstanceOf(CincAPIClient);
    });
  });

  describe('method chaining', () => {
    it('should allow method chaining for configuration', () => {
      const client = new CincAPIClient();
      
      client.setAuthToken('test-token');
      client.updateConfig({ timeout: 10000 });
      
      // Should not throw any errors
      expect(client).toBeInstanceOf(CincAPIClient);
    });
  });
});
