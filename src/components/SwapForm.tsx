import React, { useState, useEffect } from 'react';
import { ArrowDown, RefreshCw } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Token, QuoteResponse } from '../types/jupiter';
import { JupiterApiService, COMMON_TOKENS } from '../services/jupiterApi';
import { BalanceService } from '../services/balanceService';
import TokenSelector from './TokenSelector';

interface SwapFormProps {
  onQuoteReceived: (quote: QuoteResponse) => void;
  loading: boolean;
}

const SwapForm: React.FC<SwapFormProps> = ({ onQuoteReceived, loading }) => {
  const { connected, publicKey } = useWallet();
  const [fromToken, setFromToken] = useState<Token | null>(COMMON_TOKENS.SOL);
  const [toToken, setToToken] = useState<Token | null>(COMMON_TOKENS.USDC);
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(1);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Get quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) {
        return;
      }

      setQuoteLoading(true);
      setError(null);

      try {
        const lamports = JupiterApiService.toLamports(parseFloat(amount), fromToken.decimals);
        const slippageBps = JupiterApiService.slippageToBps(slippage);

        const quote = await JupiterApiService.getQuote({
          inputMint: fromToken.address,
          outputMint: toToken.address,
          amount: lamports,
          slippageBps,
        });

        onQuoteReceived(quote);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to get quote';
        setError(errorMessage);
        console.error('Quote error:', errorMessage);
      } finally {
        setQuoteLoading(false);
      }
    };

    // Debounce quote requests
    const timeoutId = setTimeout(getQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fromToken, toToken, amount, slippage, onQuoteReceived]);

  // Fetch real-time balances when wallet connects
  useEffect(() => {
    const fetchBalances = async () => {
      if (!connected || !publicKey) {
        setBalances({});
        return;
      }

      setBalanceLoading(true);
      try {
        const walletAddress = publicKey.toString();
        const allTokens = Object.values(COMMON_TOKENS);
        const realBalances = await BalanceService.getTokenBalances(walletAddress, allTokens);
        setBalances(realBalances);
      } catch (error) {
        console.error('Error fetching balances:', error);
        setBalances({});
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalances();

    // Refresh balances every 30 seconds
    const intervalId = setInterval(fetchBalances, 30000);
    return () => clearInterval(intervalId);
  }, [connected, publicKey]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const getBalance = (token: Token) => {
    if (!connected) return null;
    if (balanceLoading) return 'Loading...';
    
    const balance = balances[token.address];
    if (balance === undefined) return '0.00';
    
    try {
      return BalanceService.formatBalance(balance, token.decimals);
    } catch (error) {
      console.error('Error formatting balance:', error);
      return '0.00';
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Swap Tokens</h2>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* From Token */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">From</label>
        <div className="flex space-x-2">
          <TokenSelector
            selectedToken={fromToken}
            onTokenSelect={setFromToken}
            placeholder="Select token to swap from"
            disabled={loading}
          />
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.0"
            className="flex-1 input-field"
            disabled={loading}
          />
        </div>
        {fromToken && (
          <div className="text-sm text-gray-500">
            Balance: {getBalance(fromToken)} {fromToken.symbol}
          </div>
        )}
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSwapTokens}
          disabled={loading}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* To Token */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">To</label>
        <div className="flex space-x-2">
          <TokenSelector
            selectedToken={toToken}
            onTokenSelect={setToToken}
            placeholder="Select token to swap to"
            disabled={loading}
          />
          <input
            type="text"
            value=""
            placeholder="0.0"
            className="flex-1 input-field bg-gray-50"
            disabled
          />
        </div>
        {toToken && (
          <div className="text-sm text-gray-500">
            Balance: {getBalance(toToken)} {toToken.symbol}
          </div>
        )}
      </div>

      {/* Slippage Settings */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Slippage Tolerance</label>
        <div className="flex space-x-2">
          {[0.5, 1, 2, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSlippage(value)}
              disabled={loading}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                slippage === value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}%
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {quoteLoading && (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="w-4 h-4 animate-spin text-primary-600" />
          <span className="ml-2 text-sm text-gray-600">Getting quote...</span>
        </div>
      )}
    </div>
  );
};

export default SwapForm; 