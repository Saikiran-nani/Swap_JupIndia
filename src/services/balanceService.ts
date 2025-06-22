import { Connection, PublicKey } from '@solana/web3.js';
import { Token } from '../types/jupiter';

// Get the Helius API key from environment variables
const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY;

// Use Helius RPC if API key is available, otherwise fallback to public RPC
const RPC_ENDPOINT = HELIUS_API_KEY 
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : 'https://api.mainnet-beta.solana.com'; // Public RPC fallback

console.log('Using RPC endpoint:', HELIUS_API_KEY ? 'Helius (with API key)' : 'Public RPC (fallback)');

export class BalanceService {
  private static connection = new Connection(RPC_ENDPOINT, 'confirmed');

  /**
   * Get SOL balance for a wallet
   */
  static async getSolBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / Math.pow(10, 9); // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return 0;
    }
  }

  /**
   * Get token balance for a specific token
   */
  static async getTokenBalance(
    walletAddress: string, 
    tokenMint: string, 
    decimals: number
  ): Promise<number> {
    try {
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenPublicKey = new PublicKey(tokenMint);

      // Get token accounts for this wallet and mint
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        { mint: tokenPublicKey }
      );

      if (tokenAccounts.value.length === 0) {
        return 0;
      }

      // Sum up all token accounts for this mint
      let totalBalance = 0;
      for (const account of tokenAccounts.value) {
        const accountInfo = account.account.data.parsed.info;
        const balance = parseFloat(accountInfo.tokenAmount.uiAmount || '0');
        totalBalance += balance;
      }

      return totalBalance;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  }

  /**
   * Get balances for multiple tokens
   */
  static async getTokenBalances(
    walletAddress: string, 
    tokens: Token[]
  ): Promise<Record<string, number>> {
    const balances: Record<string, number> = {};

    try {
      // Get SOL balance
      const solBalance = await this.getSolBalance(walletAddress);
      balances['So11111111111111111111111111111111111111112'] = solBalance;

      // Get token balances in parallel
      const tokenBalancePromises = tokens
        .filter(token => token.address !== 'So11111111111111111111111111111111111111112') // Skip SOL as we already have it
        .map(async (token) => {
          const balance = await this.getTokenBalance(walletAddress, token.address, token.decimals);
          return { address: token.address, balance };
        });

      const tokenBalances = await Promise.all(tokenBalancePromises);
      
      tokenBalances.forEach(({ address, balance }) => {
        balances[address] = balance;
      });

    } catch (error) {
      console.error('Error fetching token balances:', error);
    }

    return balances;
  }

  /**
   * Format balance with proper decimals
   */
  static formatBalance(balance: number, decimals: number): string {
    if (balance === 0) return '0.00';
    
    // Handle very small numbers
    if (balance < 0.000001) {
      return balance.toExponential(2);
    }
    
    // Handle large numbers
    if (balance >= 1000000) {
      return (balance / 1000000).toFixed(2) + 'M';
    }
    
    if (balance >= 1000) {
      return (balance / 1000).toFixed(2) + 'K';
    }
    
    return balance.toFixed(Math.min(decimals, 6));
  }
} 