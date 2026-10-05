'use client';

import { useState, useEffect } from 'react';
import { 
  Home as HomeIcon,
  Compass, 
  Train, 
  Ticket, 
  Clock, 
  Radio, 
  Activity, 
  LayoutGrid, 
  Key, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Search, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { isAudioEnabled, toggleAudio, playRailwayChime } from '@/lib/audio-chime';
import { useTheme } from './ThemeProvider';

export default function Navbar({ activeTab, setActiveTab, onOpenApiKeyModal, onTrackTrain }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const [currentTime, setCurrentTime] = useState('');
  const [audioActive, setAudioActive] = useState(true);
  const [apiStatus, setApiStatus] = useState({ configured: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navQuickTrain, setNavQuickTrain] = useState('');

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

  const handleQuickTrackSubmit = (e) => {
    e.preventDefault();
    const clean = navQuickTrain.trim();
    if (clean && onTrackTrain) {
      onTrackTrain(clean);
      setNavQuickTrain('');
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'search', label: 'Search Trains', icon: Compass },
    { id: 'live', label: 'Live Tracking', icon: Activity, hasPulse: true },
    { id: 'station-board', label: 'Station Board', icon: LayoutGrid },
    { id: 'pnr', label: 'PNR Status', icon: Ticket },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-colors duration-200">
      {/* Top Operational Telemetry Ticker */}
      <div className="bg-slate-100 dark:bg-zinc-950 px-4 py-1.5 border-b border-slate-200 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Signal Aspect & Zone Info */}
          <div className="flex items-center gap-2">
            <span className="signal-lamp green signal-pulse"></span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
              LINE CLEAR
            </span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-500 dark:text-zinc-400">
              IR CONTROL DESK
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-zinc-700">•</span>
            <span className="hidden md:inline font-mono text-[11px] text-slate-500 dark:text-zinc-400">
              17 ZONES • 7,300+ STATIONS
            </span>
          </div>

          {/* Controls: Audio, API Key, Live IST Clock, Theme Switch */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Audio Chime Toggle */}
            <button
              onClick={handleAudioToggle}
              title={audioActive ? 'Mute Station Announcements' : 'Unmute Station Announcements'}
              className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow text-slate-700 dark:text-zinc-300 transition-colors"
            >
              {audioActive ? (
                <Volume2 size={12} className="text-emerald-500" />
              ) : (
                <VolumeX size={12} className="text-rose-500" />
              )}
              <span className="hidden lg:inline">{audioActive ? 'CHIME ON' : 'MUTED'}</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              title="RailKit API Configuration"
              className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow transition-colors"
            >
              <Key size={12} className={apiStatus.configured ? 'text-emerald-500' : 'text-amber-500 dark:text-station-yellow'} />
              <span className={apiStatus.configured ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-station-yellow font-semibold'}>
                {apiStatus.configured ? 'RAILKIT LIVE' : 'API KEY'}
              </span>
            </button>

            {/* Live IST Clock */}
            <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs font-bold text-amber-600 dark:text-station-yellow bg-amber-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-amber-200 dark:border-zinc-800">
              <Clock size={12} className="text-amber-600 dark:text-station-yellow shrink-0" />
              <span>{currentTime || '10:30:00 IST'}</span>
            </div>

            {/* THEME TOGGLE (Dark: Yellow & Black / Light: Yellow & White) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode (Yellow & White)' : 'Switch to Dark Mode (Yellow & Black)'}
              aria-label="Toggle Color Theme"
              className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-zinc-700 bg-amber-100/60 dark:bg-zinc-900 hover:scale-105 transition-all text-slate-800 dark:text-zinc-200 shadow-sm"
            >
              {mounted && theme === 'dark' ? (
                <>
                  <Moon size={12} className="text-station-yellow fill-station-yellow" />
                  <span className="font-bold text-station-yellow">BLACK & YELLOW</span>
                </>
              ) : (
                <>
                  <Sun size={12} className="text-amber-600 fill-amber-500" />
                  <span className="font-bold text-amber-700">WHITE & YELLOW</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title="Return to RailSync Home"
        >
          <div className="w-10 h-10 rounded-lg bg-station-yellow text-black flex items-center justify-center font-black shadow-md border-2 border-yellow-400 dark:border-yellow-500 transform group-hover:rotate-6 transition-transform">
            <Train size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 dark:text-station-yellow font-mono group-hover:text-amber-600 dark:group-hover:text-yellow-300 transition-colors">
                RAILSYNC
              </span>
              <span className="text-[10px] bg-yellow-400 dark:bg-yellow-400/20 text-black dark:text-station-yellow px-1.5 py-0.5 rounded font-mono font-bold border border-yellow-500 dark:border-yellow-400/40">
                IR-LIVE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400 tracking-wider font-mono">
              INDIAN RAILWAYS TELEMETRY & PRS
            </p>
          </div>
        </div>

        {/* Desktop View Switcher Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-station-yellow text-black font-extrabold shadow-sm border border-yellow-400'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900'
                }`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {item.hasPulse && (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-black animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Nav Train Search (Desktop) */}
        <div className="hidden lg:flex items-center">
          <form onSubmit={handleQuickTrackSubmit} className="relative flex items-center">
            <input
              type="text"
              maxLength={5}
              value={navQuickTrain}
              onChange={(e) => setNavQuickTrain(e.target.value)}
              placeholder="Track Train # (e.g. 12952)"
              className="w-48 xl:w-56 text-xs font-mono py-1.5 pl-8 pr-8 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-station-yellow focus:ring-1 focus:ring-station-yellow transition-all"
            />
            <Search size={13} className="absolute left-2.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
            {navQuickTrain && (
              <button
                type="submit"
                title="Track train now"
                className="absolute right-1.5 p-1 rounded bg-station-yellow text-black hover:bg-yellow-400 transition-colors"
              >
                <ArrowRight size={11} />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3 shadow-xl">
          {/* Mobile Quick Train Search */}
          <form onSubmit={handleQuickTrackSubmit} className="relative">
            <input
              type="text"
              maxLength={5}
              value={navQuickTrain}
              onChange={(e) => setNavQuickTrain(e.target.value)}
              placeholder="Enter 5-digit Train # (e.g. 12952)"
              className="w-full text-xs font-mono py-2 pl-9 pr-16 rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-station-yellow"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold rounded bg-station-yellow text-black"
            >
              TRACK
            </button>
          </form>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-station-yellow text-black font-extrabold shadow-sm'
                      : 'border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Bottom Bar: Theme Switch & Audio */}
          <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 rounded-md bg-amber-100 dark:bg-zinc-900 text-slate-800 dark:text-station-yellow border border-slate-300 dark:border-zinc-800"
            >
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              <span>{theme === 'dark' ? 'DARK (YELLOW & BLACK)' : 'LIGHT (YELLOW & WHITE)'}</span>
            </button>

            <button
              onClick={handleAudioToggle}
              className="flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-md bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800"
            >
              {audioActive ? <Volume2 size={14} className="text-emerald-500" /> : <VolumeX size={14} className="text-rose-500" />}
              <span>{audioActive ? 'CHIME ON' : 'MUTED'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
