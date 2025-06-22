import React from 'react';
import { Info, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { QuoteResponse } from '../types/jupiter';
import { JupiterApiService, COMMON_TOKENS } from '../services/jupiterApi';

interface QuoteDetailsProps {
  quote: QuoteResponse | null;
  onExecuteSwap: () => void;
  loading: boolean;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ quote, onExecuteSwap, loading }) => {
  if (!quote) {
    return (
      <div className="card p-6">
        <div className="text-center text-gray-500">
          <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Enter an amount to get a quote</p>
        </div>
      </div>
    );
  }

  const fromToken = Object.values(COMMON_TOKENS).find(t => t.address === quote.inputMint);
  const toToken = Object.values(COMMON_TOKENS).find(t => t.address === quote.outputMint);

  if (!fromToken || !toToken) {
    return (
      <div className="card p-6">
        <div className="text-center text-red-500">
          <p>Invalid token pair selected</p>
        </div>
      </div>
    );
  }

  const inputAmount = JupiterApiService.fromLamports(quote.inAmount, fromToken.decimals);
  const outputAmount = JupiterApiService.fromLamports(quote.outAmount, toToken.decimals);
  const priceImpact = parseFloat(quote.priceImpactPct);
  const isPositiveImpact = priceImpact < 0.1; // Low impact is good

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Swap Details</h3>
      
      {/* Swap Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">You pay</span>
          <span className="font-medium">
            {inputAmount.toFixed(Math.min(fromToken.decimals, 6))} {fromToken.symbol}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">You receive</span>
          <span className="font-medium">
            {outputAmount.toFixed(Math.min(toToken.decimals, 6))} {toToken.symbol}
          </span>
        </div>
      </div>

      {/* Price Impact */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Price Impact</span>
        <div className="flex items-center space-x-1">
          {isPositiveImpact ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            isPositiveImpact ? 'text-green-600' : 'text-red-600'
          }`}>
            {Math.abs(priceImpact).toFixed(4)}%
          </span>
        </div>
      </div>

      {/* Slippage */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Slippage Tolerance</span>
        <span className="text-sm font-medium">
          {JupiterApiService.bpsToSlippage(quote.slippageBps)}%
        </span>
      </div>

      {/* Route Information */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Route</h4>
        <div className="space-y-2">
          {quote.routePlan.map((route, index) => (
            <div key={index} className="flex items-center text-sm space-x-2">
              <span className="text-gray-900 font-medium">{route.swapInfo.amm?.label || 'Unknown Route'}</span>
              <span className="text-gray-500">({route.percent}%)</span>
              {index < quote.routePlan.length - 1 && <ArrowRight className="w-3 h-3 text-gray-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Execute Swap Button */}
      <button
        onClick={onExecuteSwap}
        disabled={loading}
        className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Executing Swap...' : 'Execute Swap'}
      </button>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 text-center">
        <p>
          By executing this swap, you agree to the terms and acknowledge that 
          cryptocurrency transactions are irreversible.
        </p>
      </div>
    </div>
  );
};

export default QuoteDetails; 