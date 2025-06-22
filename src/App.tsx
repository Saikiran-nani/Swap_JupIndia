import React, { useState } from 'react';
import WalletProvider from './components/WalletProvider';
import HomePage from './components/HomePage';
import SwapInterface from './components/SwapInterface';
import ErrorBoundary from './components/ErrorBoundary';

type AppView = 'home' | 'swap';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const handleNavigateToSwap = () => {
    setCurrentView('swap');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <ErrorBoundary>
      <WalletProvider>
        {currentView === 'home' ? (
          <HomePage onNavigateToSwap={handleNavigateToSwap} />
        ) : (
          <SwapInterface onBackToHome={handleBackToHome} />
        )}
      </WalletProvider>
    </ErrorBoundary>
  );
}

export default App; 