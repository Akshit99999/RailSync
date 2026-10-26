'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { isAudioEnabled, toggleAudio as toggleAudioUtil, announceTrain } from '@/lib/audio-chime';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // Preferred announcement language: 'hi' | 'en' | 'both'
  const [language, setLanguage] = useState('both');

  // Audio mute/unmute state
  const [audioActive, setAudioActive] = useState(true);

  // Emergency RailMadad modal/drawer state
  const [emergencyDrawerOpen, setEmergencyDrawerOpen] = useState(false);

  // Global Toast Notifications state: Array of { id, message, type, timestamp }
  const [toasts, setToasts] = useState([]);

  // Watchlist (Saved Favorite Trains) - persisted in localStorage
  const [watchlist, setWatchlist] = useState([]);

  // Saved PNRs - persisted in localStorage
  const [savedPnrs, setSavedPnrs] = useState([]);

  // Active PNR lookup state (for deep-linking from Saved PNRs drawer & cards)
  const [activePnrQuery, setActivePnrQuery] = useState('');

  // Recent searches - persisted in localStorage
  const [recentSearches, setRecentSearches] = useState([]);

  // Apply theme classes to document root
  const applyTheme = (t) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  };

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      // 1. Theme
      const urlTheme = new URLSearchParams(window.location.search).get('theme');
      const storedTheme = (urlTheme === 'light' || urlTheme === 'dark')
        ? urlTheme
        : localStorage.getItem('railsync_theme');
      const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
      setTheme(initialTheme);
      applyTheme(initialTheme);

      // 2. Audio
      setAudioActive(isAudioEnabled());

      // 3. Language
      const storedLang = localStorage.getItem('railsync_language');
      if (storedLang) setLanguage(storedLang);

      // 4. Watchlist
      const storedWatchlist = localStorage.getItem('railsync_watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      } else {
        // Default starter favorites
        setWatchlist([
          { trainNumber: '12952', trainName: 'Tejas Rajdhani Express', origin: 'NDLS', destination: 'MMCT', category: 'Rajdhani' },
          { trainNumber: '22436', trainName: 'Vande Bharat Express', origin: 'NDLS', destination: 'BSB', category: 'Vande Bharat' },
        ]);
      }

      // 5. Saved PNRs
      const storedPnrs = localStorage.getItem('railsync_saved_pnrs');
      if (storedPnrs) setSavedPnrs(JSON.parse(storedPnrs));

      // 6. Recent Searches
      const storedRecent = localStorage.getItem('railsync_recent_searches');
      if (storedRecent) setRecentSearches(JSON.parse(storedRecent));
    } catch (err) {
      console.warn('Storage initialization warning:', err);
    } finally {
      setMounted(true);
    }
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem('railsync_theme', next);
    addToast(`Theme switched to ${next === 'dark' ? 'Dark Signal' : 'Light Canvas'} mode`, 'info');
  };

  // Language toggle
  const cycleLanguage = () => {
    const next = language === 'hi' ? 'en' : language === 'en' ? 'both' : 'hi';
    setLanguage(next);
    localStorage.setItem('railsync_language', next);
    addToast(`Announcement language set to: ${next.toUpperCase()}`, 'info');
  };

  // Audio toggle
  const toggleAudio = () => {
    const next = toggleAudioUtil();
    setAudioActive(next);
    addToast(next ? 'Station audio announcements enabled' : 'Audio announcements muted', next ? 'success' : 'warning');
    return next;
  };

  // Toast Notification System
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type };
    setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5

    setTimeout(() => {
      dismissToast(id);
    }, duration);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Watchlist Actions
  const addToWatchlist = (train) => {
    if (!train?.trainNumber) return;
    setWatchlist((prev) => {
      if (prev.some((t) => t.trainNumber === train.trainNumber)) return prev;
      const updated = [train, ...prev];
      localStorage.setItem('railsync_watchlist', JSON.stringify(updated));
      return updated;
    });
    addToast(`Train ${train.trainNumber} added to Watchlist`, 'success');
  };

  const removeFromWatchlist = (trainNumber) => {
    setWatchlist((prev) => {
      const updated = prev.filter((t) => t.trainNumber !== trainNumber);
      localStorage.setItem('railsync_watchlist', JSON.stringify(updated));
      return updated;
    });
    addToast(`Train ${trainNumber} removed from Watchlist`, 'info');
  };

  const isWatchlisted = (trainNumber) => {
    return watchlist.some((t) => t.trainNumber === trainNumber);
  };

  // Saved PNRs
  const savePnr = (pnrData) => {
    if (!pnrData?.pnrNumber) return;
    setSavedPnrs((prev) => {
      const filtered = prev.filter((p) => p.pnrNumber !== pnrData.pnrNumber);
      const updated = [{ ...pnrData, savedAt: new Date().toISOString() }, ...filtered];
      localStorage.setItem('railsync_saved_pnrs', JSON.stringify(updated));
      return updated;
    });
    addToast(`PNR ${pnrData.pnrNumber} saved to tracker`, 'success');
  };

  const removePnr = (pnrNumber) => {
    setSavedPnrs((prev) => {
      const updated = prev.filter((p) => p.pnrNumber !== pnrNumber);
      localStorage.setItem('railsync_saved_pnrs', JSON.stringify(updated));
      return updated;
    });
    addToast(`PNR ${pnrNumber} removed`, 'info');
  };

  // Recent Searches
  const recordRecentSearch = (item) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.label !== item.label);
      const updated = [item, ...filtered].slice(0, 8);
      localStorage.setItem('railsync_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  // Trigger announcement helper
  const triggerTrainAnnouncement = (params) => {
    announceTrain({
      ...params,
      language: language,
    });
    addToast(`Broadcasting announcement for Train ${params.trainNumber || ''}`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        // Theme & Config
        theme,
        toggleTheme,
        mounted,
        language,
        cycleLanguage,
        audioActive,
        toggleAudio,
        // Drawer
        emergencyDrawerOpen,
        setEmergencyDrawerOpen,
        // Notifications
        toasts,
        addToast,
        dismissToast,
        // Watchlist
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isWatchlisted,
        // PNRs
        savedPnrs,
        savePnr,
        removePnr,
        activePnrQuery,
        setActivePnrQuery,
        // Searches
        recentSearches,
        recordRecentSearch,
        // Audio Announcements
        triggerTrainAnnouncement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
