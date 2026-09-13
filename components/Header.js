'use client';

import { useState, useEffect } from 'react';
import { Compass, Train, Ticket, Clock, Radio, Activity, LayoutGrid, Key, Volume2, VolumeX } from 'lucide-react';
import { isAudioEnabled, toggleAudio, playRailwayChime } from '@/lib/audio-chime';

export default function Header({ activeTab, setActiveTab, onOpenApiKeyModal }) {
  const [currentTime, setCurrentTime] = useState('');
  const [audioActive, setAudioActive] = useState(true);
  const [apiStatus, setApiStatus] = useState({ configured: false });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(`${timeStr} IST`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Initial audio state
    setAudioActive(isAudioEnabled());

    // Check API config status
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(() => {});

    return () => clearInterval(timer);
  }, []);

  const handleAudioToggle = () => {
    const newState = toggleAudio();
    setAudioActive(newState);
    if (newState) {
      playRailwayChime();
    }
  };

  return (
    <header className="station-signboard border-b border-[#1e3a6d]">
      {/* Top Signal Status & Operational Ribbon */}
      <div className="bg-[#050e1d] px-4 py-1.5 border-b border-[#142646] flex flex-wrap items-center justify-between text-xs text-[#94a3b8]">
        <div className="flex items-center gap-2">
          <span className="signal-lamp green signal-pulse"></span>
          <span className="font-mono text-[#10b981] font-semibold tracking-wide">SYSTEM LINE CLEAR</span>
          <span className="text-[#475569]">•</span>
          <span className="hidden sm:inline text-[#cbd5e1]">RAILWAY CONTROL DESK</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Chime Toggle */}
          <button
            onClick={handleAudioToggle}
            title={audioActive ? 'Mute Station Announcements' : 'Unmute Station Announcements'}
            className="flex items-center gap-1 text-[11px] font-mono text-[#94a3b8] hover:text-white px-2 py-0.5 rounded border border-[#1e3a6d] bg-[#091730]"
          >
            {audioActive ? <Volume2 size={12} className="text-[#10b981]" /> : <VolumeX size={12} className="text-[#ef4444]" />}
            <span className="hidden md:inline">{audioActive ? 'CHIME ON' : 'CHIME OFF'}</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border border-[#1e3a6d] bg-[#091730] hover:bg-[#132c60] transition-colors"
          >
            <Key size={12} className={apiStatus.configured ? 'text-[#10b981]' : 'text-[#ffd200]'} />
            <span className={apiStatus.configured ? 'text-[#10b981] font-bold' : 'text-[#ffd200]'}>
              {apiStatus.configured ? 'RAILKIT LIVE' : 'API KEY'}
            </span>
          </button>

          {/* Live IST Clock */}
          <div className="flex items-center gap-1 font-mono text-[#ffd200] font-semibold">
            <Clock size={13} className="text-[#ffd200]" />
            <span>{currentTime || '15:35:00 IST'}</span>
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded bg-[#ffd200] text-[#050d1c] flex items-center justify-center font-black shadow-md border border-[#eab308]">
              <Train size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-[#ffd200] font-mono">
                  RAILSYNC
                </span>
                <span className="text-xs bg-[#12284c] text-[#ffd200] px-1.5 py-0.5 rounded font-mono border border-[#234b8c]">
                  IR-LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] tracking-widest font-mono">
                INDIAN RAILWAYS LIVE TELEMETRY & PRS
              </p>
            </div>
          </div>

          {/* Quick status on mobile */}
          <div className="md:hidden flex items-center gap-1.5 text-xs text-[#10b981] font-mono">
            <Radio size={14} className="animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#061122] p-1.5 rounded border border-[#1e3a6d] w-full md:w-auto justify-around sm:justify-start overflow-x-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-[#ffd200] text-[#050d1c] shadow font-bold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f2244]'
            }`}
          >
            <Compass size={15} />
            <span>Search Trains</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'live'
                ? 'bg-[#ffd200] text-[#050d1c] shadow font-bold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f2244]'
            }`}
          >
            <Activity size={15} />
            <span>Live Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('station-board')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'station-board'
                ? 'bg-[#ffd200] text-[#050d1c] shadow font-bold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f2244]'
            }`}
          >
            <LayoutGrid size={15} />
            <span>Station Board</span>
          </button>

          <button
            onClick={() => setActiveTab('pnr')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'pnr'
                ? 'bg-[#ffd200] text-[#050d1c] shadow font-bold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f2244]'
            }`}
          >
            <Ticket size={15} />
            <span>PNR Status</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
