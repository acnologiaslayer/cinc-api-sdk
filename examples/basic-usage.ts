import { CincAPIClient } from '../lib/index.js';

/**
 * Example usage of the CINC API SDK
 * 
 * This file demonstrates how to use the SDK after cloning and building it.
 * Run this with: npx ts-node examples/basic-usage.ts
 * 
 * For projects installing from GitHub Packages:
 * import { CincAPIClient } from '@acnologiaslayer/cinc-api-sdk';
 */

async function main() {
  console.log('🏠 CINC API SDK - Basic Usage Example');
  console.log('=====================================\n');

  // Initialize the client
  const client = new CincAPIClient({
    baseURL: process.env.CINC_API_BASE_URL || 'https://api.cincapi.com/v2',
    timeout: parseInt(process.env.CINC_API_TIMEOUT || '30000'),
    // apiKey: process.env.CINC_API_KEY // Uncomment if using API key auth
  });

  try {
    console.log('1. 🔐 Testing Authentication...');
    
    // Example authentication (use your actual credentials)
    const email = process.env.TEST_EMAIL || 'demo@example.com';
    const password = process.env.TEST_PASSWORD || 'demo-password';
    
    console.log(`   Attempting login with: ${email}`);
    
    // Note: This will fail with demo credentials, but shows the SDK structure
    try {
      const authResponse = await client.auth.login(email, password);
      console.log('   ✅ Authentication successful!');
      console.log(`   Token: ${authResponse.token.substring(0, 20)}...`);
      
      // Set token for subsequent requests
      client.setAuthToken(authResponse.token);
      
      console.log('\n2. 🏢 Testing Asset Management...');
      
      // Get assets
      const assets = await client.assets.getAssets();
      console.log(`   ✅ Retrieved ${assets.length} assets`);
      
      if (assets.length > 0) {
        console.log(`   First asset: ${assets[0].name}`);
      }
      
      console.log('\n3. 📊 Testing Market Data...');
      
      // Get market data
      const marketData = await client.markets.getMarketData();
      console.log('   ✅ Market data retrieved successfully');
      
      console.log('\n4. 💼 Testing Portfolio Management...');
      
      // This would typically require a portfolio ID
      // const portfolio = await client.portfolios.getPortfolio('portfolio-id');
      console.log('   ℹ️  Portfolio operations require valid portfolio IDs');
      
    } catch (authError) {
      console.log('   ⚠️  Authentication failed (expected with demo credentials)');
      console.log(`   Error: ${authError.message}`);
      console.log('   💡 To test with real credentials, set environment variables:');
      console.log('      TEST_EMAIL=your-email@example.com');
      console.log('      TEST_PASSWORD=your-password');
    }
    
    console.log('\n5. 🔧 Testing SDK Configuration...');
    
    // Test configuration
    console.log('   Base URL: Configured from environment or defaults');
    console.log('   Timeout: Configured from environment or defaults');
    console.log('   ✅ Configuration loaded successfully');
    
    console.log('\n6. 🛡️  Testing Error Handling...');
    
    // Test error handling with invalid endpoint
    try {
      await client.assets.getAssetById('invalid-id-12345');
    } catch (error) {
      console.log('   ✅ Error handling working correctly');
      console.log(`   Error type: ${error.constructor.name}`);
      console.log(`   Error message: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('Stack trace:', error.stack);
  }
  
  console.log('\n🎉 Example completed!');
  console.log('\n📖 Next steps:');
  console.log('   - Read the Developer Guide: ./DEVELOPER-GUIDE.md');
  console.log('   - Check out the test files: ./tests/');
  console.log('   - Review the API documentation: ./README.md');
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the example
main().catch(error => {
  console.error('Failed to run example:', error);
  process.exit(1);
});
