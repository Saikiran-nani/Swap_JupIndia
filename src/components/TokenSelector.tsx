import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Token } from '../types/jupiter';
import { COMMON_TOKENS } from '../services/jupiterApi';

interface TokenSelectorProps {
  selectedToken: Token | null;
  onTokenSelect: (token: Token) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  placeholder = "Select token",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  // Common tokens to show first
  const commonTokenList = Object.values(COMMON_TOKENS);

  useEffect(() => {
    const loadTokens = async () => {
      setLoading(true);
      try {
        // For demo purposes, we'll use common tokens
        // In a real app, you'd fetch from Jupiter API
        setTokens(commonTokenList);
      } catch (error) {
        console.error('Failed to load tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTokens();
  }, []);

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-2">
          {selectedToken ? (
            <>
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-700">
                  {selectedToken.symbol.charAt(0)}
                </span>
              </div>
              <span className="font-medium">{selectedToken.symbol}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading tokens...</div>
            ) : filteredTokens.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No tokens found</div>
            ) : (
              filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-700">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-500">{token.name}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSelector; 