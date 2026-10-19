'use client';

import { useState } from 'react';
import { 
  Train, 
  Compass, 
  Activity, 
  LayoutGrid, 
  Ticket, 
  Radio, 
  Clock, 
  MapPin, 
  Gauge, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  ArrowRight, 
  ChevronRight, 
  Search, 
  Layers, 
  Sliders, 
  HelpCircle,
  Sparkles,
  Info,
  Calculator,
  Code2
} from 'lucide-react';
import { playRailwayChime } from '@/lib/audio-chime';
import { useTiltCard } from '@/hooks/useTiltCard';

export default function HomePage({ onNavigate, onTrackTrain }) {
  const [heroTrainInput, setHeroTrainInput] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    const clean = heroTrainInput.trim();
    if (clean && clean.length === 5 && !isNaN(clean)) {
      playRailwayChime();
      onTrackTrain(clean);
    }
  };

  const premierTrains = [
    { number: '22436', name: 'Vande Bharat Express', route: 'NDLS ➔ BSB', speed: '130 km/h', type: 'Semi-High Speed' },
    { number: '12952', name: 'Tejas Rajdhani Express', route: 'NDLS ➔ MMCT', speed: '124 km/h', type: 'Premier AC' },
    { number: '12002', name: 'Bhopal Shatabdi Express', route: 'NDLS ➔ RKMP', speed: '130 km/h', type: 'Superfast Chair' },
    { number: '12301', name: 'Howrah Rajdhani Express', route: 'HWH ➔ NDLS', speed: '120 km/h', type: 'Premier AC' },
  ];

  const features = [
    {
      id: 'search',
      title: 'Train & Route Search',
      badge: 'STATION CORRIDORS',
      icon: Compass,
      desc: 'Dual-mode search engine to lookup running trains between any two Indian Railways stations or search directly by train number with instant autocomplete.',
      highlights: ['7,300+ stations lookup', 'Hot corridor shortcuts', 'Live schedule & departure times', 'Multi-class breakdown'],
      actionText: 'Search Trains',
    },
    {
      id: 'live',
      title: 'Live GPS Satellite Telemetry',
      badge: 'PERMANENT WAY TRACK',
      icon: Activity,
      desc: 'Real-time telemetry tracking with interactive corridor Leaflet map, speedometer gauge, delay aspects (Right Time vs Delayed), and active block section alerts.',
      highlights: ['Interactive GPS track map', 'Live speed & bearing heading', 'Next station countdown', 'Signal aspect status lamps'],
      actionText: 'Launch Live Tracker',
    },
    {
      id: 'station-board',
      title: 'Station Platform Display Board',
      badge: 'ELECTRONIC SIGNAGE',
      icon: LayoutGrid,
      desc: 'Split-flap inspired electronic arrival and departure platform board for major terminals and junctions with 2-hour, 4-hour, and 8-hour lookahead filters.',
      highlights: ['Platform allocation numbers', 'Scheduled vs expected times', 'Movement filters (Arr / Dep)', 'Major terminal quick presets'],
      actionText: 'View Station Board',
    },
    {
      id: 'pnr',
      title: 'Passenger PRS Status & Berths',
      badge: 'RESERVATION CHART',
      icon: Ticket,
      desc: 'Verify 10-digit PNR ticket numbers with authentic IRCTC dot-matrix chart styling, charting status, confirmed coach/berth details, and interactive 8-berth schematics.',
      highlights: ['Confirmation & charting status', 'Passenger berth matrix', 'Platform rake coach visualizer', 'Printable digital boarding pass'],
      actionText: 'Check PNR Status',
    },
    {
      id: 'fare-calculator',
      title: 'IRCTC Fare Matrix & Estimator',
      badge: 'DYNAMIC PRICING',
      icon: Calculator,
      desc: 'Interactive distance-based fare calculator applying authentic IRCTC telescopic distance slabs, Superfast supplements, Tatkal quotas, and 5% AC GST.',
      highlights: ['Telescopic distance formulas', 'Class breakdown (1A, 2A, 3A, SL)', 'Tatkal & Senior concession quotas', 'Instant add-to-cart booking'],
      actionText: 'Calculate Ticket Fare',
    },
    {
      id: 'dashboard',
      title: 'Control Desk Operations Center',
      badge: 'EXECUTIVE TELEMETRY',
      icon: Gauge,
      desc: 'Multi-zonal operational analytics dashboard tracking 13,000+ active rakes, network punctuality ratings, and real-time caution orders with asynchronous polling.',
      highlights: ['Live punctuality percentage', 'Zonal performance filters (NR, WR, CR)', 'Active caution orders feed', 'Asynchronous state polling'],
      actionText: 'Launch Control Desk',
    },
    {
      id: 'portfolio',
      title: 'PE-I Architecture & Portfolio Hub',
      badge: 'TECHNICAL SHOWCASE',
      icon: Code2,
      desc: 'Comprehensive engineering portfolio documenting PE-I frontend & DBMS requirements, interactive code sandboxes, state management architecture, and SQL schemas.',
      highlights: ['React 18 & SPA routing', 'Zustand shopping cart store', 'Global Context API architecture', 'Relational 3NF SQL database'],
      actionText: 'Explore Architecture',
    },
  ];

  const faqs = [
    {
      q: 'How does RailSync track trains in real time?',
      a: 'RailSync connects to live Indian Railways telemetry feeds via RailKit. It computes station arrival/departure timestamps, corridor speed, and distance covered, and visualizes the train along permanent-way GPS coordinates on Leaflet maps.',
    },
    {
      q: 'Can I use RailSync without entering an API key?',
      a: 'Yes! RailSync includes a built-in realistic Indian Railways telemetry simulator mode that powers live train movements, stations, and PNR enquiries out of the box. You can optionally link a free RailKit API key via the top navigation bar for production live feeds.',
    },
    {
      q: 'What do the signal aspect lamps (Green, Amber, Red) indicate?',
      a: 'Signal aspects represent the real-time operational punctuality of the train: Green indicates Right Time (0-5 min delay), Amber indicates moderate delay (6-25 min delay), and Red indicates significant operational delay (25+ min delay).',
    },
    {
      q: 'How do the coach rake position and berth map work?',
      a: 'The coach rake visualizer plots the exact carriage arrangement from locomotive engine (WAP-7) to power car (EOG). The compartment schematic visually maps your allocated berth inside an authentic 8-berth Indian Railways coach bay (LB, MB, UB, SL, SU).',
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-300">
      {/* HERO SECTION */}
      <section className="station-signboard p-6 sm:p-10 rounded-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-yellow-400/10 dark:bg-yellow-400/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          {/* Version badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-xs font-mono font-bold text-amber-800 dark:text-station-yellow shadow-sm">
            <span className="signal-lamp green signal-pulse"></span>
            <span>RAILSYNC TELEMETRY v2.4 • INDIAN RAILWAYS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Real-Time Railway Intelligence & <span className="text-amber-600 dark:text-station-yellow">Live Telemetry Engine</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
            RailSync is a high-precision railway intelligence suite engineered for passengers, railfans, and controllers. 
            Track 13,000+ passenger trains across 68,000+ km of Indian Railways permanent way with live GPS coordinate mapping, 
            electronic platform boards, coach rake layouts, and instant PRS PNR verification.
          </p>

          {/* Quick Track Input Bar */}
          <form onSubmit={handleQuickSubmit} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={5}
                value={heroTrainInput}
                onChange={(e) => setHeroTrainInput(e.target.value)}
                placeholder="Enter 5-digit Train # (e.g. 12952)"
                className="rail-input has-icon-left font-mono font-bold text-base tracking-widest !pr-4 !py-3.5 shadow-sm"
                style={{ paddingLeft: '3.75rem' }}
              />
              <Train size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 dark:text-station-yellow pointer-events-none z-10" />
            </div>

            <button type="submit" className="rail-btn-primary py-3 px-6 text-sm whitespace-nowrap">
              <Activity size={16} />
              <span>Track Train Now</span>
            </button>
          </form>

          {/* Sample quick picks */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 flex-wrap pt-1">
            <span className="font-bold text-slate-700 dark:text-zinc-300">Quick Track:</span>
            {['12952 (Rajdhani)', '22436 (Vande Bharat)', '12002 (Shatabdi)'].map((sample) => {
              const num = sample.split(' ')[0];
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setHeroTrainInput(num);
                    onTrackTrain(num);
                  }}
                  className="hover:text-amber-600 dark:hover:text-station-yellow underline underline-offset-2"
                >
                  {sample}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick navigation action pill buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('search')}
            className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-yellow-400 dark:hover:border-station-yellow hover:scale-[1.02] transition-all text-left group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Compass size={18} className="text-amber-600 dark:text-station-yellow" />
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Train Search</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">Between stations</div>
          </button>

          <button
            onClick={() => onNavigate('live')}
            className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-yellow-400 dark:hover:border-station-yellow hover:scale-[1.02] transition-all text-left group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Activity size={18} className="text-emerald-500" />
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Live GPS Tracker</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">Corridor track map</div>
          </button>

          <button
            onClick={() => onNavigate('station-board')}
            className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-yellow-400 dark:hover:border-station-yellow hover:scale-[1.02] transition-all text-left group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <LayoutGrid size={18} className="text-sky-500" />
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Station Board</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">Platform departures</div>
          </button>

          <button
            onClick={() => onNavigate('pnr')}
            className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-yellow-400 dark:hover:border-station-yellow hover:scale-[1.02] transition-all text-left group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Ticket size={18} className="text-amber-500" />
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">PNR Status</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">Chart & berth layout</div>
          </button>

          <button
            onClick={() => onNavigate('fare-calculator')}
            className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-yellow-400 dark:hover:border-station-yellow hover:scale-[1.02] transition-all text-left group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Calculator size={18} className="text-cyan-500" />
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Fare Matrix</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">Telescopic estimator</div>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-yellow-400 dark:hover:border-station-yellow hover:scale-[1.02] transition-all text-left group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Gauge size={18} className="text-purple-500" />
              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Control Desk</div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">Zonal telemetry KPIs</div>
          </button>
        </div>
      </section>

      {/* NETWORK TELEMETRY STATS TICKER */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="station-signboard p-4 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-amber-700 dark:text-station-yellow flex items-center justify-center font-bold">
            <MapPin size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">7,300+</div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase">Active Stations</div>
          </div>
        </div>

        <div className="station-signboard p-4 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-amber-700 dark:text-station-yellow flex items-center justify-center font-bold">
            <Train size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">13,000+</div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase">Daily Passenger Trains</div>
          </div>
        </div>

        <div className="station-signboard p-4 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-amber-700 dark:text-station-yellow flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">17 ZONES</div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase">68 Divisions</div>
          </div>
        </div>

        <div className="station-signboard p-4 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">REAL-TIME</div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase">Non-DB Telemetry</div>
          </div>
        </div>
      </section>

      {/* CORE OPERATIONAL CAPABILITIES SHOWCASE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="station-code-pill text-xs">SYSTEM CAPABILITIES</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
              Engineered for Speed, Precision & High Contrast
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
          {features.map((feat) => (
            <FeatureCard key={feat.id} feat={feat} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* FEATURED PREMIER EXPRESS CORRIDORS */}
      <section className="station-signboard p-6 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <span className="station-code-pill text-xs">PREMIER CORRIDORS</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white pt-1">
              High-Speed Expresses & Rajdhani Corridors
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
            CLICK TO LAUNCH LIVE TRACKER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {premierTrains.map((t) => (
            <PremierTrainCard key={t.number} t={t} onTrackTrain={onTrackTrain} />
          ))}
        </div>
      </section>

      {/* ARCHITECTURE & TECHNOLOGY SHOWCASE */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="station-signboard p-5 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-station-yellow font-bold font-mono text-xs">
            <Radio size={15} />
            <span>NON-DB ARCHITECTURE</span>
          </div>
          <h4 className="font-black text-slate-900 dark:text-white text-base">
            Real-Time Telemetry Pipeline
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Direct upstream communication with Indian Railways PRS and NTES telemetry data via RailKit API, 
            providing live train delay updates and timetable synchronizations with zero database caching latency.
          </p>
        </div>

        <div className="station-signboard p-5 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-station-yellow font-bold font-mono text-xs">
            <Volume2 size={15} />
            <span>STATION AUDIO ACOUSTICS</span>
          </div>
          <h4 className="font-black text-slate-900 dark:text-white text-base">
            Synthesized Railway Chimes
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Built-in Web Audio API station chime system reproducing the iconic Indian Railways 4-tone platform announcement chime 
            for live search queries, tracking updates, and PNR status checks.
          </p>
        </div>

        <div className="station-signboard p-5 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-station-yellow font-bold font-mono text-xs">
            <Sliders size={15} />
            <span>ERGONOMIC VISION MODES</span>
          </div>
          <h4 className="font-black text-slate-900 dark:text-white text-base">
            Yellow & Black / Yellow & White
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Custom-tailored dual color schemes honoring Indian Railways signboards: high-visibility Yellow & Black for night controller shifts 
            and crisp Yellow & White for daylight passenger travel.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="station-signboard p-6 rounded-lg space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-zinc-800">
          <HelpCircle size={18} className="text-amber-600 dark:text-station-yellow" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Frequently Asked Questions (FAQ)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-sm">
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-mono flex items-start gap-2">
                <span className="text-amber-600 dark:text-station-yellow font-black">Q{idx + 1}:</span>
                <span>{faq.q}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ feat, onNavigate }) {
  const { ref, onMouseMove, onMouseLeave } = useTiltCard({ maxTilt: 9, speed: 0.35 });
  const Icon = feat.icon;

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-cursor="EXPLORE"
      onClick={() => onNavigate(feat.id)}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className="capability-card station-signboard p-6 rounded-xl flex flex-col justify-between space-y-4 group transition-all duration-300 relative overflow-hidden cursor-pointer"
    >
      {/* Dynamic ambient hover lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/[0.08] via-transparent to-transparent dark:from-yellow-400/[0.06] dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Luminous yellow track line on top when hovered */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-400/15 dark:from-yellow-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="space-y-3 relative z-10 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="capability-icon-box w-11 h-11 rounded-lg bg-station-yellow text-black flex items-center justify-center font-bold shadow-md transition-all duration-300">
            <Icon size={22} className="transition-all" />
          </div>
          <span className="font-mono text-[10px] font-bold text-amber-800 dark:text-station-yellow bg-amber-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-amber-300 dark:border-zinc-800 transition-colors">
            {feat.badge}
          </span>
        </div>

        <h3 className="capability-title text-lg font-black text-slate-900 dark:text-white transition-colors duration-200">
          {feat.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed transition-colors duration-200">
          {feat.desc}
        </p>

        <ul className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono text-slate-700 dark:text-zinc-300">
          {feat.highlights.map((h, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <span className="capability-check text-amber-600 dark:text-station-yellow font-bold transition-transform duration-200 inline-block">✓</span>
              <span className="transition-colors duration-200">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 relative z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(feat.id);
          }}
          className="capability-action-btn rail-btn-secondary w-full justify-between text-xs py-2.5 px-4 font-bold transition-all duration-200 shadow-sm"
        >
          <span>{feat.actionText}</span>
          <ChevronRight size={15} className="transition-transform duration-200 text-slate-400" />
        </button>
      </div>
    </div>
  );
}

function PremierTrainCard({ t, onTrackTrain }) {
  const { ref, onMouseMove, onMouseLeave } = useTiltCard({ maxTilt: 8, speed: 0.35 });

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-cursor="TRACK"
      onClick={() => onTrackTrain(t.number)}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className="p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 hover:border-station-yellow cursor-pointer transition-all space-y-2 shadow-sm group"
    >
      <div className="flex items-center justify-between">
        <span className="train-number-badge text-xs">{t.number}</span>
        <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">{t.type}</span>
      </div>

      <div className="font-bold text-sm text-slate-900 dark:text-white">
        {t.name}
      </div>

      <div className="text-xs font-mono text-amber-700 dark:text-station-yellow font-bold">
        {t.route}
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400">
        <div className="flex items-center gap-1">
          <Gauge size={12} className="text-emerald-500" />
          <span>Max {t.speed}</span>
        </div>
        <span className="text-amber-600 dark:text-station-yellow font-bold group-hover:underline flex items-center gap-0.5">
          Track <ArrowRight size={11} />
        </span>
      </div>
    </div>
  );
}

