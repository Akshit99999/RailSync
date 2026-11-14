'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import SearchSection from '@/components/SearchSection';
import LiveTracker from '@/components/LiveTracker';
import StationBoard from '@/components/StationBoard';
import PnrSection from '@/components/PnrSection';
import FareCalculator from '@/components/FareCalculator';
import ControlDashboard from '@/components/ControlDashboard';
import ApiKeyModal from '@/components/ApiKeyModal';
import CartDrawer from '@/components/CartDrawer';
import EmergencyDrawer from '@/components/EmergencyDrawer';
import ToastContainer from '@/components/ToastContainer';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home'); 
  // 'home' | 'search' | 'live' | 'station-board' | 'pnr' | 'fare-calculator' | 'dashboard'
  
  const [activeTrainNumber, setActiveTrainNumber] = useState('12952');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Sync URL query params on load and state change (SPA deep linking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const trainParam = params.get('train');

    if (tabParam && ['home', 'search', 'live', 'station-board', 'pnr', 'fare-calculator', 'dashboard'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    if (trainParam && /^\d{5}$/.test(trainParam)) {
      setActiveTrainNumber(trainParam);
    }

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const t = p.get('tab');
      if (t) setActiveTab(t);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab, trainNum) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.searchParams.set('tab', tab);
      if (trainNum) url.searchParams.set('train', trainNum);
      else if (tab !== 'live') url.searchParams.delete('train');
      window.history.pushState({}, '', url);
    }
  };

  const handleTrackTrain = (trainNumber) => {
    setActiveTrainNumber(trainNumber);
    handleTabChange('live', trainNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell min-h-screen flex flex-col text-slate-900 dark:text-zinc-100 relative">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onTrackTrain={handleTrackTrain}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-7 sm:px-6 sm:py-10">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={handleTabChange}
            onTrackTrain={handleTrackTrain}
          />
        )}

        {activeTab === 'search' && (
          <SearchSection onTrackTrain={handleTrackTrain} />
        )}

        {activeTab === 'live' && (
          <LiveTracker
            initialTrainNumber={activeTrainNumber}
            onSwitchToSearch={() => handleTabChange('search')}
          />
        )}

        {activeTab === 'station-board' && (
          <StationBoard onTrackTrain={handleTrackTrain} />
        )}

        {activeTab === 'pnr' && (
          <PnrSection />
        )}

        {activeTab === 'fare-calculator' && (
          <FareCalculator onBookTicket={handleTrackTrain} />
        )}

        {activeTab === 'dashboard' && (
          <ControlDashboard />
        )}
      </main>

      {/* Global Interactive Slide-over Drawers & Modals */}
      <CartDrawer />
      <EmergencyDrawer />
      <ToastContainer />
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <footer className="app-footer">
        <div className="app-footer-inner">
          <span>RailSync</span>
          <span>Railway information and journey tools</span>
          <span>Demonstration project · verify journey details with the official source</span>
          <a href="/welcome">About RailSync</a>
        </div>
      </footer>
    </div>
  );
}
