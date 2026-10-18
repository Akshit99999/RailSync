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
  Sparkles,
  ShoppingBag,
  Calculator,
  Gauge,
  Code2,
  PhoneCall,
  Star,
  Languages
} from 'lucide-react';
import { isAudioEnabled, toggleAudio, playRailwayChime } from '@/lib/audio-chime';
import { useTheme } from './ThemeProvider';
import { useCartStore } from '@/store/useCartStore';
import { useApp } from '@/context/AppContext';

export default function Navbar({ activeTab, setActiveTab, onOpenApiKeyModal, onTrackTrain }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { 
    setEmergencyDrawerOpen, 
    watchlist, 
    language, 
    cycleLanguage 
  } = useApp();
  
  const { items: cartItems, setCartOpen } = useCartStore();

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
    { id: 'search', label: 'Search', icon: Compass },
    { id: 'live', label: 'Live Track', icon: Activity, hasPulse: true },
    { id: 'station-board', label: 'Station Board', icon: LayoutGrid },
    { id: 'pnr', label: 'PNR Status', icon: Ticket },
    { id: 'fare-calculator', label: 'Fare Matrix', icon: Calculator },
    { id: 'dashboard', label: 'Control Desk', icon: Gauge },
    { id: 'portfolio', label: 'PE-I Portfolio', icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-colors duration-200 font-mono">
      {/* Top Operational Telemetry Ticker */}
      <div className="bg-slate-100 dark:bg-zinc-950 px-4 py-1 border-b border-slate-200 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Signal Aspect & Zone Info */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="signal-lamp green signal-pulse"></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
              LINE CLEAR
            </span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <span className="hidden sm:inline text-slate-500 dark:text-zinc-400">
              IR CONTROL DESK
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-zinc-700">•</span>
            <span className="hidden md:inline text-slate-500 dark:text-zinc-400">
              17 ZONES • 7,300+ STATIONS
            </span>
          </div>

          {/* Controls: 139 Emergency, Language, Audio, API Key, Clock, Theme */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            {/* RailMadad 139 Quick Helpline */}
            <button
              onClick={() => setEmergencyDrawerOpen(true)}
              title="RailMadad 139 Emergency Helpline"
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 hover:bg-rose-100 transition-colors"
            >
              <PhoneCall size={11} className="text-rose-500" />
              <span className="font-bold">139 SOS</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={cycleLanguage}
              title="Toggle Announcement Language (Hindi / English)"
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow text-slate-700 dark:text-zinc-300 transition-colors"
            >
              <Languages size={11} className="text-amber-500" />
              <span className="font-bold uppercase">{language}</span>
            </button>

            {/* Audio Chime Toggle */}
            <button
              onClick={handleAudioToggle}
              title={audioActive ? 'Mute Station Announcements' : 'Unmute Station Announcements'}
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow text-slate-700 dark:text-zinc-300 transition-colors"
            >
              {audioActive ? (
                <Volume2 size={11} className="text-emerald-500" />
              ) : (
                <VolumeX size={11} className="text-rose-500" />
              )}
              <span className="hidden lg:inline">{audioActive ? 'CHIME' : 'MUTED'}</span>
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={onOpenApiKeyModal}
              title="RailKit API Configuration"
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow transition-colors"
            >
              <Key size={11} className={apiStatus.configured ? 'text-emerald-500' : 'text-amber-500 dark:text-station-yellow'} />
              <span className={apiStatus.configured ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-station-yellow font-semibold'}>
                {apiStatus.configured ? 'LIVE' : 'API'}
              </span>
            </button>

            {/* Live IST Clock */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-station-yellow bg-amber-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-amber-200 dark:border-zinc-800">
              <Clock size={11} className="text-amber-600 dark:text-station-yellow shrink-0" />
              <span>{currentTime || '10:30 IST'}</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1 rounded-full border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:scale-105 transition-all text-slate-800 dark:text-zinc-200"
            >
              {mounted && theme === 'dark' ? (
                <Moon size={12} className="text-station-yellow fill-station-yellow" />
              ) : (
                <Sun size={12} className="text-amber-600 fill-amber-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          title="Return to RailSync Home"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500 dark:bg-station-yellow text-black flex items-center justify-center font-black shadow-md border-2 border-yellow-400 dark:border-yellow-500 transform group-hover:rotate-6 transition-transform">
            <Train size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-wider text-slate-900 dark:text-station-yellow group-hover:text-amber-600 dark:group-hover:text-yellow-300 transition-colors">
                RAILSYNC
              </span>
              <span className="text-[9px] bg-yellow-400 dark:bg-yellow-400/20 text-black dark:text-station-yellow px-1 py-0.2 rounded font-bold border border-yellow-500 dark:border-yellow-400/40">
                PRO
              </span>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-zinc-400 tracking-wider">
              INDIAN RAILWAYS TELEMETRY & PRS
            </p>
          </div>
        </div>

        {/* Desktop View Switcher Navigation */}
        <nav className="hidden xl:flex items-center gap-1 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 dark:bg-station-yellow text-black shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-900'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
                {item.hasPulse && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons: Watchlist, Cart, Quick Track */}
        <div className="flex items-center gap-2">
          {/* Journey Cart Trigger Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow text-slate-700 dark:text-zinc-200 transition-all shadow-sm"
            title="Open Journey Reservation Cart"
          >
            <ShoppingBag size={15} className="text-amber-500 dark:text-station-yellow" />
            <span className="hidden sm:inline text-xs font-bold">CART</span>
            {cartItems.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center animate-bounce">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Quick Nav Train Search */}
          <form onSubmit={handleQuickTrackSubmit} className="hidden lg:flex relative items-center">
            <input
              type="text"
              maxLength={5}
              value={navQuickTrain}
              onChange={(e) => setNavQuickTrain(e.target.value)}
              placeholder="Track Train # (12952)"
              className="w-40 xl:w-44 text-xs font-mono py-1.5 pl-7 pr-7 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-station-yellow"
            />
            <Search size={12} className="absolute left-2 text-slate-400 pointer-events-none" />
            {navQuickTrain && (
              <button
                type="submit"
                className="absolute right-1 p-0.5 rounded bg-amber-500 text-black"
              >
                <ArrowRight size={11} />
              </button>
            )}
          </form>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3 shadow-xl">
          {/* Quick Train Track */}
          <form onSubmit={handleQuickTrackSubmit} className="relative">
            <input
              type="text"
              maxLength={5}
              value={navQuickTrain}
              onChange={(e) => setNavQuickTrain(e.target.value)}
              placeholder="Enter 5-digit Train # (e.g. 12952)"
              className="w-full text-xs py-2 pl-9 pr-16 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-station-yellow"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold rounded bg-amber-500 text-black"
            >
              TRACK
            </button>
          </form>

          {/* Nav Items Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
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
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 dark:bg-station-yellow text-black shadow-sm'
                      : 'border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
