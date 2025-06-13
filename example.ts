// Example usage of the CINC API SDK
import { CincAPIClient } from './src';

async function example() {
  // Initialize the SDK client
  const client = new CincAPIClient({
    baseURL: 'https://api.cincapi.com/v2'
  });

  try {
    // Authenticate
    console.log('Authenticating...');
    const authResponse = await client.authenticate('user@example.com', 'password');
    console.log('Authenticated successfully');

    // Set the auth token for subsequent requests
    client.setAuthToken(authResponse.token);

    // Fetch assets
    console.log('Fetching assets...');
    const assets = await client.assets.getAssets();
    console.log(`Found ${assets.length} assets`);

    // Fetch market data
    console.log('Fetching market data...');
    const marketData = await client.markets.getMarketData();
    console.log('Market data retrieved');

    // Fetch portfolio for a user
    console.log('Fetching portfolio...');
    const portfolio = await client.portfolios.getPortfolio('user123');
    console.log('Portfolio retrieved');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the example
// example();
