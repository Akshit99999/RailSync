'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import SearchSection from '@/components/SearchSection';
import LiveTracker from '@/components/LiveTracker';
import StationBoard from '@/components/StationBoard';
import PnrSection from '@/components/PnrSection';
import ApiKeyModal from '@/components/ApiKeyModal';

export default function Home({ searchParams }) {
  const initialTab = searchParams?.tab || 'home';
  const [activeTab, setActiveTab] = useState(initialTab); // 'home' | 'search' | 'live' | 'station-board' | 'pnr'
  const [activeTrainNumber, setActiveTrainNumber] = useState('12952');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleTrackTrain = (trainNumber) => {
    setActiveTrainNumber(trainNumber);
    setActiveTab('live');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onTrackTrain={handleTrackTrain}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={setActiveTab}
            onTrackTrain={handleTrackTrain}
          />
        )}

        {activeTab === 'search' && (
          <SearchSection onTrackTrain={handleTrackTrain} />
        )}

        {activeTab === 'live' && (
          <LiveTracker
            initialTrainNumber={activeTrainNumber}
            onSwitchToSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'station-board' && (
          <StationBoard onTrackTrain={handleTrackTrain} />
        )}

        {activeTab === 'pnr' && (
          <PnrSection />
        )}
      </main>

      {/* API Key Modal Drawer */}
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
            <span className="text-amber-600 dark:text-station-yellow font-bold">GPS TRACK VIEW</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
