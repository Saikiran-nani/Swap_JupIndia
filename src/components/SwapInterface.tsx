import React, { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowLeft, Zap, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { VersionedTransaction, Transaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { QuoteResponse } from '../types/jupiter';
import { JupiterApiService } from '../services/jupiterApi';
import SwapForm from './SwapForm';
import QuoteDetails from './QuoteDetails';

interface SwapInterfaceProps {
  onBackToHome: () => void;
}

const SwapInterface: React.FC<SwapInterfaceProps> = ({ onBackToHome }) => {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [swapStatus, setSwapStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string; txid?: string } | null>(null);

  const handleQuoteReceived = useCallback((newQuote: QuoteResponse) => {
    setQuote(newQuote);
    setSwapStatus(null);
  }, []);

  const handleExecuteSwap = useCallback(async () => {
    if (!quote || !publicKey || !signTransaction) {
      setSwapStatus({ type: 'error', message: 'Wallet not connected or quote not available.' });
      return;
    }

    setLoading(true);
    setSwapStatus({ type: 'info', message: 'Preparing swap...' });

    try {
      // 1. Get the swap transaction from Jupiter API
      const { swapTransaction } = await JupiterApiService.executeSwap({
        quoteResponse: quote,
        userPublicKey: publicKey.toBase58(),
        wrapUnwrapSOL: true,
      });

      // 2. Deserialize the transaction
      let swapTransactionBuf: Uint8Array;
      
      try {
        // Try using Buffer if available
        if (typeof Buffer !== 'undefined') {
          swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        } else {
          // Fallback: decode base64 manually
          const binaryString = atob(swapTransaction);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          swapTransactionBuf = bytes;
        }
      } catch (error) {
        console.error('Error decoding base64 transaction:', error);
        throw new Error('Failed to decode transaction data');
      }
      
      let transaction;
      try {
        transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        console.log("Deserialized as VersionedTransaction");
      } catch (e) {
        transaction = Transaction.from(swapTransactionBuf);
        console.log("Deserialized as Transaction");
      }

      // 3. Sign the transaction with the wallet
      setSwapStatus({ type: 'info', message: 'Please approve the transaction in your wallet...' });
      const signedTransaction = await signTransaction(transaction);

      // 4. Send the signed transaction to the network
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });
      setSwapStatus({ type: 'info', message: 'Swap sent! Waiting for confirmation...', txid });

      // 5. Wait for transaction confirmation
      const confirmation = await connection.confirmTransaction(txid, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      setSwapStatus({ type: 'success', message: 'Swap executed successfully!', txid });

    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred during the swap.';
      setSwapStatus({ type: 'error', message: `Swap failed: ${errorMessage}` });
      console.error('Swap error:', error);
    } finally {
      setLoading(false);
    }
  }, [quote, publicKey, signTransaction, connection]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Wallet Required</h2>
            <p className="text-gray-600 mb-6">
              Please connect your wallet to access the swap interface.
            </p>
            <div className="space-y-4">
              <WalletMultiButton className="!w-full !bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !text-white !font-semibold !py-3 !rounded-lg" />
              <button
                onClick={onBackToHome}
                className="w-full btn-secondary py-3"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (!swapStatus) return '';
    switch (swapStatus.type) {
      case 'success': return 'bg-green-50 border border-green-200 text-green-700';
      case 'error': return 'bg-red-50 border border-red-200 text-red-700';
      case 'info': return 'bg-blue-50 border border-blue-200 text-blue-700';
    }
  };

  const getStatusIcon = () => {
    if (!swapStatus) return null;
    switch (swapStatus.type) {
      case 'success': return <CheckCircle className="w-5 h-5 mr-2" />;
      case 'error': return <XCircle className="w-5 h-5 mr-2" />;
      case 'info': return <Zap className="w-5 h-5 mr-2 animate-pulse" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToHome}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Swap Tokens</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {publicKey && `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`}
            </div>
            <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700 !text-white !font-medium !px-4 !py-2 !rounded-lg" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Swap Form */}
          <div>
            <SwapForm 
              onQuoteReceived={handleQuoteReceived}
              loading={loading}
            />
          </div>

          {/* Quote Details */}
          <div>
            <QuoteDetails
              quote={quote}
              onExecuteSwap={handleExecuteSwap}
              loading={loading}
            />
          </div>
        </div>

        {/* Status Messages */}
        {swapStatus && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className={`p-4 rounded-lg ${getStatusColor()}`}>
              <div className="flex items-center">
                {getStatusIcon()}
                <p className="font-medium flex-1">{swapStatus.message}</p>
                {swapStatus.txid && (
                  <a
                    href={`https://solscan.io/tx/${swapStatus.txid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-sm font-semibold hover:underline"
                  >
                    View on Solscan <ExternalLink className="inline-block w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            Powered by Jupiter API • Connected to Solana Mainnet
          </p>
          <p className="text-xs mt-2">
            This is a demo application. For production use, ensure proper wallet integration and security measures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwapInterface; 