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
import PortfolioShowcase from '@/components/PortfolioShowcase';
import ApiKeyModal from '@/components/ApiKeyModal';
import CartDrawer from '@/components/CartDrawer';
import EmergencyDrawer from '@/components/EmergencyDrawer';
import ToastContainer from '@/components/ToastContainer';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home'); 
  // 'home' | 'search' | 'live' | 'station-board' | 'pnr' | 'fare-calculator' | 'dashboard' | 'portfolio'
  
  const [activeTrainNumber, setActiveTrainNumber] = useState('12952');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Sync URL query params on load and state change (SPA deep linking)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const trainParam = params.get('train');

    if (tabParam && ['home', 'search', 'live', 'station-board', 'pnr', 'fare-calculator', 'dashboard', 'portfolio'].includes(tabParam)) {
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

  // Human-readable labels for breadcrumb
  const TAB_LABELS = {
    home: 'Network Home',
    search: 'Train Search & Route Engine',
    live: `Live Telemetry (Train #${activeTrainNumber})`,
    'station-board': 'Platform Display Board',
    pnr: 'IRCTC PRS PNR Status & Berth Map',
    'fare-calculator': 'Fare Matrix & Distance Calculator',
    dashboard: 'Control Desk Operational Dashboard',
    portfolio: 'PE-I System Architecture & Portfolio Hub',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors duration-200 font-mono">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onTrackTrain={handleTrackTrain}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* SPA Breadcrumbs Indicator */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-500">
          <button
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-station-yellow transition-colors"
          >
            <HomeIcon size={12} />
            <span>RailSync</span>
          </button>
          <ChevronRight size={12} className="text-slate-400 dark:text-zinc-600" />
          <span className="font-bold text-slate-800 dark:text-zinc-300">
            {TAB_LABELS[activeTab] || 'Operational Desk'}
          </span>
        </nav>

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

        {activeTab === 'portfolio' && (
          <PortfolioShowcase />
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

      {/* Railway Platform Bottom Status Bar */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800/80 py-6 text-xs text-slate-500 dark:text-zinc-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="signal-lamp green"></span>
            <span className="font-mono text-slate-700 dark:text-zinc-300 font-medium">
              RAILSYNC TELEMETRY ENGINE • INDIAN RAILWAYS
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
            <span>17 RAILWAY ZONES</span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span>7,300+ STATIONS</span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="text-amber-600 dark:text-station-yellow font-bold">ZUSTAND & CONTEXT API READY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
