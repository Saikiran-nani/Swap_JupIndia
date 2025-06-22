import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowRight, Zap, Shield, TrendingUp, Users } from 'lucide-react';

interface HomePageProps {
  onNavigateToSwap: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToSwap }) => {
  const { connected, publicKey } = useWallet();

  const formatPublicKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Jupiter Swap</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {connected && (
                <div className="text-sm text-gray-600">
                  {publicKey && formatPublicKey(publicKey.toString())}
                </div>
              )}
              <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700 !text-white !font-medium !px-4 !py-2 !rounded-lg" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            The Best Way to Swap Tokens on{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Solana
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the best rates across all Solana DEXs with Jupiter's powerful aggregation engine. 
            Swap tokens instantly with minimal slippage and maximum efficiency.
          </p>
          
          {connected ? (
            <button
              onClick={onNavigateToSwap}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Swapping
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Connect your wallet to start swapping</p>
              <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !text-white !font-semibold !px-8 !py-4 !rounded-xl !text-lg" />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Jupiter?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Best Rates</h4>
              <p className="text-gray-600">
                Automatically finds the best swap routes across all major Solana DEXs
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure</h4>
              <p className="text-gray-600">
                Built on Solana's secure blockchain with advanced transaction validation
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h4>
              <p className="text-gray-600">
                Trusted by thousands of users and continuously improved by the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Wallets */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Supported Wallets
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">P</span>
              </div>
              <h4 className="font-semibold text-gray-900">Phantom</h4>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold text-lg">S</span>
              </div>
              <h4 className="font-semibold text-gray-900">Solflare</h4>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">M</span>
              </div>
              <h4 className="font-semibold text-gray-900">MetaMask</h4>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">+</span>
              </div>
              <h4 className="font-semibold text-gray-900">More</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Jupiter Swap</h3>
          </div>
          
          <p className="text-gray-400 mb-6">
            The best way to swap tokens on Solana. Built with ❤️ for the DeFi community.
          </p>
          
          <div className="text-sm text-gray-500">
            <p>Powered by Jupiter API • Built with React & TypeScript</p>
            <p className="mt-2">This is a demo application. For production use, ensure proper security measures.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 