'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import LiveTracker from '@/components/LiveTracker';
import StationBoard from '@/components/StationBoard';
import PnrSection from '@/components/PnrSection';
import ApiKeyModal from '@/components/ApiKeyModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'live' | 'station-board' | 'pnr'
  const [activeTrainNumber, setActiveTrainNumber] = useState('12952');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleTrackTrain = (trainNumber) => {
    setActiveTrainNumber(trainNumber);
    setActiveTab('live');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050d1c] text-[#f1f5f9]">
      {/* Station Master / Signal Box Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
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
      <footer className="bg-[#030814] border-t border-[#142646] py-6 text-xs text-[#64748b]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="signal-lamp green"></span>
            <span className="font-mono text-[#94a3b8]">
              RAILSYNC TELEMETRY ENGINE • INDIAN RAILWAYS (NON-DB PHASE)
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-[#94a3b8]">
            <span>17 RAILWAY ZONES</span>
            <span>•</span>
            <span>7,300+ STATIONS</span>
            <span>•</span>
            <span className="text-[#ffd200]">LEAFLET.JS GPS MAPPING</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
