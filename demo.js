const axios = require('axios');

// Jupiter API base URL
const JUPITER_BASE_URL = 'https://quote-api.jup.ag/v6';

// Common token addresses
const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'
};

async function testJupiterAPI() {
  console.log('🚀 Testing Jupiter API...\n');

  try {
    // Test 1: Get tokens
    console.log('1. Fetching supported tokens...');
    const tokensResponse = await axios.get(`${JUPITER_BASE_URL}/tokens`);
    console.log(`✅ Found ${tokensResponse.data.length} supported tokens\n`);

    // Test 2: Get a quote for SOL to USDC
    console.log('2. Getting quote for 1 SOL to USDC...');
    const quoteResponse = await axios.get(`${JUPITER_BASE_URL}/quote`, {
      params: {
        inputMint: TOKENS.SOL,
        outputMint: TOKENS.USDC,
        amount: '1000000000', // 1 SOL in lamports
        slippageBps: 50 // 0.5% slippage
      }
    });
    
    const quote = quoteResponse.data;
    const inputAmount = parseInt(quote.inAmount) / Math.pow(10, 9); // SOL has 9 decimals
    const outputAmount = parseInt(quote.outAmount) / Math.pow(10, 6); // USDC has 6 decimals
    
    console.log(`✅ Quote received:`);
    console.log(`   Input: ${inputAmount} SOL`);
    console.log(`   Output: ${outputAmount} USDC`);
    console.log(`   Price Impact: ${parseFloat(quote.priceImpactPct).toFixed(2)}%`);
    console.log(`   Routes: ${quote.routePlan.length} route(s)\n`);

    // Test 3: Get indexed route map
    console.log('3. Fetching indexed route map...');
    const routeMapResponse = await axios.get(`${JUPITER_BASE_URL}/indexed-route-map`);
    console.log(`✅ Route map fetched successfully\n`);

    console.log('🎉 All API tests passed! Jupiter API is working correctly.');
    console.log('\n📝 Note: This is a demo. In a real application, you would:');
    console.log('   - Implement wallet integration');
    console.log('   - Add proper error handling');
    console.log('   - Include transaction signing');
    console.log('   - Add security measures');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testJupiterAPI(); 