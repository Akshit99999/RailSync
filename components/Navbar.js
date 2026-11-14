'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  Calculator,
  Gauge,
  LayoutGrid,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Star,
  Sun,
  Ticket,
  TrainFront,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { isAudioEnabled, playRailwayChime, toggleAudio } from '@/lib/audio-chime';
import { useTheme } from './ThemeProvider';
import { useCartStore } from '@/store/useCartStore';
import { useApp } from '@/context/AppContext';
import WatchlistDrawer from './WatchlistDrawer';

const navItems = [
  { id: 'search', label: 'Find trains', icon: Search },
  { id: 'live', label: 'Running status', icon: Activity },
  { id: 'station-board', label: 'Station board', icon: LayoutGrid },
  { id: 'pnr', label: 'PNR status', icon: Ticket },
  { id: 'fare-calculator', label: 'Fares', icon: Calculator },
  { id: 'dashboard', label: 'Operations', icon: Gauge },
];

export default function Navbar({ activeTab, setActiveTab, onOpenApiKeyModal, onTrackTrain }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { setEmergencyDrawerOpen, watchlist, savedPnrs, language, cycleLanguage } = useApp();
  const { items: cartItems, setCartOpen } = useCartStore();
  const [apiConfigured, setApiConfigured] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(true);

  useEffect(() => {
    setAudioActive(isAudioEnabled());
    const controller = new AbortController();
    fetch('/api/config', { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setApiConfigured(Boolean(data.configured)))
      .catch(() => setApiConfigured(false));
    return () => controller.abort();
  }, []);

  const handleAudioToggle = () => {
    const enabled = toggleAudio();
    setAudioActive(enabled);
    if (enabled) playRailwayChime();
  };

  const navigate = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <button type="button" className="brand-mark" onClick={() => navigate('home')} aria-label="RailSync home">
          <TrainFront size={21} strokeWidth={1.8} />
          <span>RailSync</span>
        </button>

        <nav className="primary-nav" aria-label="Main navigation">
          <button type="button" className={`nav-link ${activeTab === 'home' ? 'is-active' : ''}`} aria-current={activeTab === 'home' ? 'page' : undefined} onClick={() => navigate('home')}>Overview</button>
          <a className="nav-link landing-nav-link" href="/welcome">Welcome</a>
          {navItems.map(({ id, label }) => (
            <button type="button" key={id} className={`nav-link ${activeTab === id ? 'is-active' : ''}`} aria-current={activeTab === id ? 'page' : undefined} onClick={() => navigate(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button type="button" className="source-button" onClick={onOpenApiKeyModal} aria-label={apiConfigured ? 'RailKit provider key is configured. Open data settings.' : 'Sample data is active. Open data settings.'} title="Configure the RailKit data provider">
            <span className={`source-dot ${apiConfigured ? 'is-configured' : ''}`} />
            <span className="source-label-desktop">{apiConfigured ? 'Provider key set' : 'Sample data'}</span>
            <span className="source-label-mobile">{apiConfigured ? 'Key set' : 'Sample'}</span>
          </button>
          <button type="button" className="header-icon-button audio-button" onClick={handleAudioToggle} aria-label={audioActive ? 'Mute railway announcements' : 'Enable railway announcements'} title={audioActive ? 'Mute railway announcements' : 'Enable railway announcements'}>
            {audioActive ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
          <button type="button" className="language-button" onClick={cycleLanguage} aria-label={`Announcement language: ${language}`} title="Change announcement language">
            {language}
          </button>
          <button type="button" className="header-icon-button" onClick={() => setIsWatchlistOpen(true)} aria-label={`Saved items: ${watchlist.length + savedPnrs.length}`} title="Saved trains and PNRs">
            <Star size={17} />
            {(watchlist.length + savedPnrs.length) > 0 && <span className="header-count">{watchlist.length + savedPnrs.length}</span>}
          </button>
          <button type="button" className="header-icon-button" onClick={() => setCartOpen(true)} aria-label={`Journey cart: ${cartItems.length} items`} title="Journey cart">
            <ShoppingBag size={17} />
            {cartItems.length > 0 && <span className="header-count">{cartItems.length}</span>}
          </button>
          <button type="button" className="header-icon-button theme-button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} title="Change color theme">
            {mounted && theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button type="button" className="emergency-button" onClick={() => setEmergencyDrawerOpen(true)} title="RailMadad emergency helpline">
            139 <span>Help</span>
          </button>
          <button type="button" className="mobile-menu-button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <button type="button" className={`nav-link ${activeTab === 'home' ? 'is-active' : ''}`} aria-current={activeTab === 'home' ? 'page' : undefined} onClick={() => navigate('home')}>Overview</button>
          <a className="nav-link landing-nav-link" href="/welcome" onClick={() => setMobileMenuOpen(false)}>Welcome</a>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button type="button" key={id} className={`nav-link ${activeTab === id ? 'is-active' : ''}`} aria-current={activeTab === id ? 'page' : undefined} onClick={() => navigate(id)}>
              <Icon size={16} />{label}
            </button>
          ))}
          <button type="button" className="mobile-control-button" onClick={handleAudioToggle}>
            {audioActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {audioActive ? 'Mute announcements' : 'Enable announcements'}
          </button>
          <button type="button" className="mobile-control-button" onClick={() => setEmergencyDrawerOpen(true)}>
            139 · RailMadad help
          </button>
          <button type="button" className="mobile-language-button" onClick={cycleLanguage}>Announcements: {language}</button>
        </div>
      )}

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        onTrackTrain={onTrackTrain}
        onNavigate={setActiveTab}
      />
    </header>
  );
}
