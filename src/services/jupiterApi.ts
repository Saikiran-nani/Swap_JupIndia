import axios from 'axios';
import { Token, QuoteRequest, QuoteResponse, SwapRequest, SwapResponse } from '../types/jupiter';

const JUPITER_BASE_URL = 'https://quote-api.jup.ag/v6';

// Create axios instance with default config
const jupiterApi = axios.create({
  baseURL: JUPITER_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Common tokens for easy access
export const COMMON_TOKENS = {
  SOL: {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    chainId: 101,
  },
  USDC: {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: 101,
  },
  USDT: {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    chainId: 101,
  },
  BONK: {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    chainId: 101,
  },
  JUP: {
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    symbol: 'JUP',
    name: 'Jupiter',
    decimals: 6,
    chainId: 101,
  },
};

export class JupiterApiService {
  /**
   * Get all supported tokens
   */
  static async getTokens(): Promise<Token[]> {
    try {
      const response = await jupiterApi.get('/tokens');
      return response.data;
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw new Error('Failed to fetch tokens');
    }
  }

  /**
   * Get a quote for swapping tokens
   */
  static async getQuote(params: QuoteRequest): Promise<QuoteResponse> {
    try {
      const response = await jupiterApi.get('/quote', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error getting quote:', error);
      if (error.response?.status === 404) {
        throw new Error('No route found for this token pair');
      }
      throw new Error(error.response?.data?.message || 'Failed to get quote');
    }
  }

  /**
   * Execute a swap transaction
   */
  static async executeSwap(params: SwapRequest): Promise<SwapResponse> {
    try {
      const response = await jupiterApi.post('/swap', params);
      return response.data;
    } catch (error: any) {
      console.error('Error executing swap:', error);
      throw new Error(error.response?.data?.message || 'Failed to execute swap');
    }
  }

  /**
   * Get indexed route map for better performance
   */
  static async getIndexedRouteMap() {
    try {
      const response = await jupiterApi.get('/indexed-route-map');
      return response.data;
    } catch (error) {
      console.error('Error fetching route map:', error);
      throw new Error('Failed to fetch route map');
    }
  }

  /**
   * Convert amount to lamports (smallest unit)
   */
  static toLamports(amount: number, decimals: number): string {
    return (amount * Math.pow(10, decimals)).toString();
  }

  /**
   * Convert lamports to human readable amount
   */
  static fromLamports(lamports: string, decimals: number): number {
    return parseInt(lamports) / Math.pow(10, decimals);
  }

  /**
   * Convert slippage percentage to basis points
   */
  static slippageToBps(slippagePercent: number): number {
    return Math.round(slippagePercent * 100);
  }

  /**
   * Convert basis points to slippage percentage
   */
  static bpsToSlippage(bps: number): number {
    return bps / 100;
  }
}

export default JupiterApiService; 