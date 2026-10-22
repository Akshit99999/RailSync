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
  Sparkles,
  Info,
  Calculator,
  Code2,
  CheckCircle2,
  Cpu,
  Milestone,
  ArrowUpRight
} from 'lucide-react';
import { playRailwayChime } from '@/lib/audio-chime';
import { useTiltCard } from '@/hooks/useTiltCard';
import KineticHeadline from './KineticHeadline';
import MagneticButton from './MagneticButton';
import AccordionFAQ from './AccordionFAQ';
import BookingWizard from './BookingWizard';

export default function HomePage({ onNavigate, onTrackTrain }) {
  const [heroTrainInput, setHeroTrainInput] = useState('');
  const { ref: statusCardRef, onMouseMove: onStatusCardMove, onMouseLeave: onStatusCardLeave } = useTiltCard({ maxTilt: 12, speed: 0.4 });

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
      id: 'live',
      title: 'Real-Time GPS Satellite Telemetry',
      badge: 'PERMANENT WAY GIS',
      icon: Activity,
      desc: 'Sub-second locomotive tracking mapped directly onto 68,000+ km of Indian Railways permanent way tracks with dynamic heading, speedometer, and next-halt countdown.',
      highlights: ['Interactive Leaflet GIS corridor map', '3-Aspect signal status lamps', 'Directional locomotive rotation', 'Automated 30s polling loop'],
      actionText: 'Launch Live Tracker',
    },
    {
      id: 'pnr',
      title: 'PRS PNR Status & 8-Berth Cutaways',
      badge: 'RESERVATION CHART',
      icon: Ticket,
      desc: 'Authentic IRCTC dot-matrix reservation slips, charting confirmation indicators, coach rake highlights, and modular mathematical 8-berth compartment schematics.',
      highlights: ['Modulus-11 checksum validation', 'Modulo-8 berth mapping formula', 'Printable digital boarding pass', 'Waitlist probability gauge'],
      actionText: 'Verify PNR Status',
    },
    {
      id: 'station-board',
      title: 'Station Platform Split-Flap Display',
      badge: 'ELECTRONIC SIGNAGE',
      icon: LayoutGrid,
      desc: 'Mechanical split-flap inspired arrival/departure board for 7,300+ stations with 2h, 4h, and 8h lookahead windows and platform coach halting visualizer.',
      highlights: ['2h / 4h / 8h rolling lookaheads', 'Platform allocation numbers', 'Platform shed coach alignment', 'Bilingual audio announcements'],
      actionText: 'View Platform Board',
    },
    {
      id: 'search',
      title: 'Corridor Route & Schedule Engine',
      badge: 'STATION MATRIX',
      icon: Compass,
      desc: 'High-speed search across 7,300+ stations with prefix trie autocomplete, instant origin/destination swap, and multi-class booking shortcuts.',
      highlights: ['7,300+ stations master index', 'Hot corridor shortcuts', 'Live timetable intermediate halts', 'Instant add to journey cart'],
      actionText: 'Search Corridors',
    },
    {
      id: 'fare-calculator',
      title: 'Dynamic Telescopic Fare Estimator',
      badge: 'IRCTC TARIFF FORMULA',
      icon: Calculator,
      desc: 'Distance-based tariff matrix applying authentic IRCTC non-linear telescopic slabs, Superfast supplements, Tatkal surcharges, and 5% AC GST.',
      highlights: ['Telescopic distance formulas', 'Class breakdown (1A, 2A, 3A, SL)', 'Tatkal & Senior quotas', 'Instant add-to-cart booking'],
      actionText: 'Calculate Ticket Fare',
    },
    {
      id: 'dashboard',
      title: 'Control Desk Operations Center',
      badge: 'EXECUTIVE TELEMETRY',
      icon: Gauge,
      desc: 'Nationwide network analytics dashboard tracking 13,000+ active rakes, 91.4% network punctuality ratings, and active caution order feeds.',
      highlights: ['Live punctuality percentage', '17 Railway Zonal filters', 'Active TSR caution orders', 'Zustand state store integration'],
      actionText: 'Launch Control Desk',
    },
  ];

  const quotaTiers = [
    {
      code: 'GN',
      title: 'General Quota',
      subtitle: 'Standard PRS Allotment',
      desc: 'Primary booking allocation across all coach classes with standard advance reservation period (120 days).',
      badge: 'MAX ALLOCATION',
      perks: ['Full refund on cancellation', 'RAC & Waitlist priority', 'Bedroll included in AC'],
    },
    {
      code: 'CK',
      title: 'Tatkal Emergency',
      subtitle: '24-Hour Last-Minute',
      desc: 'Guaranteed emergency quotas opening 10:00 AM for AC classes and 11:00 AM for Non-AC classes prior to departure.',
      badge: 'PRIORITY SURCHARGE',
      perks: ['Opens 24h prior to origin run', 'Dynamic Tatkal surcharge', 'Instant PNR confirmation'],
    },
    {
      code: 'PT',
      title: 'Premium Tatkal',
      subtitle: 'Dynamic Pricing Tier',
      desc: 'Demand-based dynamic fare quota adjusting in real-time according to remaining berth availability.',
      badge: 'DYNAMIC PRICING',
      perks: ['Real-time algorithmic pricing', 'Instantaneous clearance', 'No agent booking allowed'],
    },
    {
      code: 'SS',
      title: 'Senior & Ladies',
      subtitle: 'Concession & Safety',
      desc: 'Special dedicated lower berth allotments for senior citizens (60+) and women traveling solo or with children.',
      badge: 'RESERVED LOWER BERTH',
      perks: ['Automated Lower Berth choice', 'Wheelchair accessibility assistance', 'Direct RailMadad desk link'],
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Locomotive RTIS Handshake',
      desc: 'High-frequency GPS telemetry packets stream directly from locomotive cab hardware to ground RTIS receivers.',
      badge: 'HARDWARE LINK',
    },
    {
      step: '02',
      title: 'Spatial Corridor Matching',
      desc: 'Jittery GPS pings are algorithmically projected onto 68,000+ km of GIS permanent way track polylines.',
      badge: 'POSTGIS / JTS',
    },
    {
      step: '03',
      title: '3-Aspect Signal Evaluation',
      desc: 'Delay delta calculates authentic signal aspects: Green (≤5m), Amber (5-25m), Red (>25m or hold).',
      badge: 'SAFETY PROTOCOL',
    },
    {
      step: '04',
      title: 'Terminal Platform Allocation',
      desc: 'Split-flap electronic displays calculate platform allocation and station shed coach halting positions.',
      badge: 'SPLIT-FLAP LED',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300">
      
      {/* =========================================================================
          SECTION 1: HERO SECTION WITH KINETIC SPLIT-LETTER HEADLINE & 3D TILT CARD
          ========================================================================= */}
      <section className="station-signboard p-6 sm:p-10 rounded-2xl relative overflow-hidden ticket-notch-container">
        {/* Ticket punch notch cutouts on sides */}
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />

        {/* Ambient background glow */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-yellow-400/10 dark:bg-yellow-400/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-5">
            {/* Live Telemetry System Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-xs font-mono font-bold text-amber-800 dark:text-station-yellow shadow-sm">
              <span className="signal-lamp green signal-pulse" />
              <span>RAILSYNC TELEMETRY v2.5 • 13,420 ACTIVE RAKES • 91.4% PUNCTUALITY</span>
            </div>

            {/* Giant Overprint Kinetic Display Headline */}
            <div className="text-hero-clamp font-black">
              <KineticHeadline
                text="REAL-TIME RAILWAY TELEMETRY & PRS ENGINE"
                highlightWord="TELEMETRY"
              />
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-sans max-w-2xl">
              High-precision railway intelligence suite engineered for passengers, railfans, and controllers. 
              Track 13,000+ passenger trains across 68,000+ km of Indian Railways permanent way with live GPS coordinate mapping, 
              electronic platform boards, coach rake layouts, and instant PRS PNR verification.
            </p>

            {/* Quick Track Input Bar with Magnetic Button */}
            <form onSubmit={handleQuickSubmit} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={5}
                  inputMode="numeric"
                  value={heroTrainInput}
                  onChange={(e) => setHeroTrainInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 5-digit Train # (e.g. 12952)"
                  className="rail-input has-icon-left font-mono font-bold text-base tracking-widest !pr-4 !py-3.5 shadow-sm"
                  style={{ paddingLeft: '3.75rem' }}
                />
                <Train size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 dark:text-station-yellow pointer-events-none z-10" />
              </div>

              <MagneticButton
                type="submit"
                strength={0.4}
                dataCursor="TRACK"
                className="rail-btn-primary py-3 px-6 text-sm whitespace-nowrap font-black gap-2"
              >
                <Activity size={16} />
                <span>Track Train Now</span>
              </MagneticButton>
            </form>

            {/* Quick-track shortcuts for premier trains */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 flex-wrap pt-1">
              <span className="font-bold text-slate-700 dark:text-zinc-300">Flagship Corridors:</span>
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
                    data-cursor="TRACK"
                    className="hover:text-amber-600 dark:hover:text-station-yellow underline underline-offset-2 font-bold transition-colors"
                  >
                    {sample}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive 3D Perspective Date / Status Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div
              ref={statusCardRef}
              onMouseMove={onStatusCardMove}
              onMouseLeave={onStatusCardLeave}
              data-cursor="INSPECT"
              style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
              className="w-full max-w-sm p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-black border-2 border-station-yellow/70 shadow-2xl space-y-4 text-white relative overflow-hidden select-none"
            >
              <div className="flex items-center justify-between">
                <span className="tech-meta-badge bg-station-yellow text-black">
                  LIVE TELEMETRY HUD
                </span>
                <span className="signal-lamp green signal-pulse" />
              </div>

              <div>
                <div className="text-3xl font-mono font-black text-station-yellow">12952</div>
                <div className="text-sm font-bold text-white">Tejas Rajdhani Express</div>
                <div className="text-xs font-mono text-zinc-400">NDLS (New Delhi) ➔ MMCT (Mumbai)</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">CURRENT SPEED</span>
                  <span className="font-bold text-emerald-400 text-base">124 km/h</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">SIGNAL ASPECT</span>
                  <span className="font-bold text-station-yellow text-base">🟢 Line Clear</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>NEXT: Kota Jn (KOTA)</span>
                <span className="text-emerald-400 font-bold">Right Time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-Pill Navigation Actions */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'search', label: 'Train Search', sub: 'Between stations', icon: Compass, color: 'text-amber-600 dark:text-station-yellow' },
            { id: 'live', label: 'Live GPS Tracker', sub: 'Corridor track map', icon: Activity, color: 'text-emerald-500' },
            { id: 'station-board', label: 'Station Board', sub: 'Platform departures', icon: LayoutGrid, color: 'text-sky-500' },
            { id: 'pnr', label: 'PNR Status', sub: 'Chart & berth layout', icon: Ticket, color: 'text-amber-500' },
            { id: 'fare-calculator', label: 'Fare Matrix', sub: 'Telescopic estimator', icon: Calculator, color: 'text-cyan-500' },
            { id: 'dashboard', label: 'Control Desk', sub: 'Zonal telemetry KPIs', icon: Gauge, color: 'text-purple-500' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <MagneticButton
                key={item.id}
                onClick={() => onNavigate(item.id)}
                strength={0.25}
                dataCursor="EXPLORE"
                className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-yellow-400 dark:hover:border-station-yellow transition-all text-left group shadow-sm flex flex-col justify-between w-full"
              >
                <div className="flex items-center justify-between w-full">
                  <Icon size={18} className={item.color} />
                  <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-2.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans">{item.sub}</div>
                </div>
              </MagneticButton>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: NETWORK TELEMETRY STATS TICKER
          ========================================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="station-signboard p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-amber-700 dark:text-station-yellow flex items-center justify-center font-bold">
            <MapPin size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">7,300+</div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-bold">Active Stations</div>
          </div>
        </div>

        <div className="station-signboard p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-amber-700 dark:text-station-yellow flex items-center justify-center font-bold">
            <Train size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">13,420</div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-bold">Daily Passenger Trains</div>
          </div>
        </div>

        <div className="station-signboard p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-amber-700 dark:text-station-yellow flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">17 ZONES</div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-bold">68 Divisions</div>
          </div>
        </div>

        <div className="station-signboard p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-zinc-900 border border-amber-300 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">91.4%</div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 uppercase font-bold">Network Punctuality</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: BENTO GRID OPERATIONAL CAPABILITIES (3D TILT CARDS)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="station-code-pill text-xs">SYSTEM CAPABILITIES</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
              Bento Grid of Operational Capabilities
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
          {features.map((feat) => (
            <FeatureCard key={feat.id} feat={feat} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: TIERS / RAILWAY QUOTA VALUE GRID (HIGH-CONTRAST BENTO)
          ========================================================================= */}
      <section className="station-signboard p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <span className="station-code-pill text-xs">QUOTA MATRIX</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white pt-1">
              PRS Passenger Reservation Quotas & Value Tiers
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
            COMPLIANT WITH CRIS PRS RULES
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quotaTiers.map((tier) => (
            <div
              key={tier.code}
              data-cursor="INSPECT"
              className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-station-yellow transition-all duration-200 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-lg text-amber-600 dark:text-station-yellow">
                    {tier.code}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                    {tier.badge}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{tier.title}</h4>
                <div className="text-xs text-amber-700 dark:text-amber-400 font-mono">{tier.subtitle}</div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans leading-relaxed">{tier.desc}</p>
              </div>

              <ul className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-zinc-800 text-[11px] font-mono text-slate-700 dark:text-zinc-300">
                {tier.perks.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: INTERACTIVE PROOF / STEPPED CORRIDOR TIMELINE
          ========================================================================= */}
      <section className="station-signboard p-6 sm:p-8 rounded-2xl space-y-6">
        <div>
          <span className="station-code-pill text-xs">PROCESS TIMELINE</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white pt-1">
            End-to-End Locomotive Telemetry Lifecycle
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((st) => (
            <div
              key={st.step}
              className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-mono font-black text-slate-300 dark:text-zinc-800">
                  {st.step}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-zinc-800 text-amber-800 dark:text-station-yellow">
                  {st.badge}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{st.title}</h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400 font-sans leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: INTERACTIVE MULTI-STEP CONVERSION FLOW (BOOKING WIZARD)
          ========================================================================= */}
      <section className="space-y-4">
        <BookingWizard onComplete={() => onNavigate('search')} />
      </section>

      {/* =========================================================================
          SECTION 7: FEATURED PREMIER EXPRESS CORRIDORS (3D TILT CARDS)
          ========================================================================= */}
      <section className="station-signboard p-6 rounded-2xl space-y-4">
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

      {/* =========================================================================
          SECTION 8: ACCESSIBLE FLUID-HEIGHT ACCORDION FAQ
          ========================================================================= */}
      <section className="space-y-4">
        <div>
          <span className="station-code-pill text-xs">OPERATIONAL PROTOCOLS</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white pt-1">
            Frequently Asked Technical Questions (FAQ)
          </h3>
        </div>
        <AccordionFAQ />
      </section>

    </div>
  );
}

/**
 * FeatureCard Subcomponent with 3D perspective tilt
 */
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
      className="capability-card station-signboard p-6 rounded-2xl flex flex-col justify-between space-y-4 group transition-all duration-300 relative overflow-hidden cursor-pointer"
    >
      {/* Ambient hover lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/[0.08] via-transparent to-transparent dark:from-yellow-400/[0.06] dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Luminous yellow track line on top when hovered */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="space-y-3 relative z-10 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="capability-icon-box w-11 h-11 rounded-xl bg-station-yellow text-black flex items-center justify-center font-bold shadow-md transition-all duration-300">
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
              <span className="transition-colors duration-200 text-[11px]">{h}</span>
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

/**
 * PremierTrainCard Subcomponent with 3D perspective tilt
 */
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
      className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/80 hover:border-station-yellow cursor-pointer transition-all space-y-2 shadow-sm group"
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
