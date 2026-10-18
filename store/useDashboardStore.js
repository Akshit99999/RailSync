import { create } from 'zustand';

export const useDashboardStore = create((set, get) => ({
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  error: null,
  lastUpdated: null,
  selectedZone: 'ALL',

  kpis: {
    punctuality: 94.8,
    activeTrains: 13420,
    avgDelayMinutes: 7.4,
    signalsGreen: 98.6,
    dailyPassengersMillion: 24.2,
    tractionPowerMW: 4890,
  },

  zoneStats: [
    { zone: 'NR', name: 'Northern Railway', activeTrains: 2140, punctuality: 93.4, status: 'Normal' },
    { zone: 'WR', name: 'Western Railway', activeTrains: 1890, punctuality: 96.2, status: 'Optimal' },
    { zone: 'CR', name: 'Central Railway', activeTrains: 1980, punctuality: 94.8, status: 'Normal' },
    { zone: 'SR', name: 'Southern Railway', activeTrains: 1650, punctuality: 97.1, status: 'Optimal' },
    { zone: 'ER', name: 'Eastern Railway', activeTrains: 1720, punctuality: 92.8, status: 'Caution' },
    { zone: 'SCR', name: 'South Central Railway', activeTrains: 1510, punctuality: 95.9, status: 'Optimal' },
  ],

  incidents: [
    { id: 'inc-1', time: '19:42 IST', type: 'Speed Restriction', location: 'Vadodara - Surat Section (WR)', impact: '15 km/h restriction due to track maintenance', severity: 'low' },
    { id: 'inc-2', time: '18:15 IST', type: 'Signal Overhaul', location: 'Kanpur Central Outer (NCR)', impact: 'Minor regulation of down trains, ~10 mins delay', severity: 'medium' },
    { id: 'inc-3', time: '17:30 IST', type: 'Weather Precaution', location: 'Palghat Gap (SR)', impact: 'Heavy rain caution order in effect', severity: 'low' },
  ],

  setSelectedZone: (zone) => set({ selectedZone: zone }),

  dismissIncident: (id) => {
    set((state) => ({
      incidents: state.incidents.filter((inc) => inc.id !== id),
    }));
  },

  fetchNetworkStats: async () => {
    set({ status: 'loading', error: null });
    try {
      // Simulate real asynchronous control desk telemetry fetch
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Slightly fluctuate metrics to simulate live operational telemetry
      const randPunct = (94.0 + Math.random() * 2.0).toFixed(1);
      const randTrains = 13400 + Math.floor(Math.random() * 50);

      set({
        status: 'success',
        lastUpdated: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        kpis: {
          ...get().kpis,
          punctuality: parseFloat(randPunct),
          activeTrains: randTrains,
        },
      });
    } catch (err) {
      set({ status: 'error', error: 'Failed to synchronize live control desk feed.' });
    }
  },
}));
