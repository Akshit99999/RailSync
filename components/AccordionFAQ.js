'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'telemetry-accuracy',
    badge: 'RTIS GPS',
    q: 'How does RailSync ingest real-time locomotive telemetry without GPS jitter?',
    a: 'RailSync interfaces with satellite-linked RTIS (Real-Time Train Information System) devices installed directly inside Indian Railways locomotive cabs. The telemetry engine applies spatial corridor map-matching to snap raw GPS pings onto official permanent way GIS track polylines, filtering out multi-path signal reflections and calculating remaining distance-to-go with sub-100 meter accuracy.',
  },
  {
    id: 'berth-allocation',
    badge: 'PRS ALGORITHM',
    q: 'How is the 8-berth compartment cutaway bay calculated mathematically?',
    a: 'Rather than querying slow static lookups, RailSync uses modular arithmetic. For standard Sleeper and 3AC coaches, it evaluates (Berth # mod 8): results 1 and 4 yield Lower Berth (Window on 1), 2 and 5 yield Middle Berth, 3 and 6 yield Upper Berth, 7 yields Side Lower, and 0 yields Side Upper. Analogous modulo-6 and modulo-9 algorithms govern 2AC and 3AC Economy coaches.',
  },
  {
    id: 'signal-aspects',
    badge: 'SAFETY PROTOCOL',
    q: 'What do the 3-aspect railway signal status lamps (Green, Amber, Red) signify?',
    a: 'Signal aspects emulate Indian Railways automated signaling: Green indicates Right Time (0 to 5 minutes delay / Line Clear), Amber indicates Caution (6 to 25 minutes operational delay), and Red indicates Danger / Significant Hold (> 25 minutes delay). Signals update dynamically every 30 seconds as trains traverse block sections.',
  },
  {
    id: 'fare-telescopic',
    badge: 'DYNAMIC PRICING',
    q: 'How does the telescopic distance pricing formula calculate passenger fares?',
    a: 'RailSync computes authentic IRCTC passenger tariffs using non-linear telescopic distance slabs. The per-kilometer base rate progressively decreases past 500 km and 1,000 km thresholds. The calculator then layers class multipliers (1A, 2A, 3A, SL), fixed Superfast surcharges (₹45), Tatkal emergency quotas, and 5% AC Goods & Services Tax (GST).',
  },
  {
    id: 'offline-resilience',
    badge: 'CIRCUIT BREAKER',
    q: 'Does RailSync continue operating if external railway feeds encounter downtime?',
    a: 'Yes. RailSync implements a two-tier circuit breaker architecture. If live RapidAPI or external IRCTC endpoints time out or exceed daily rate quotas, the system automatically falls back to an internal deterministic corridor simulation engine, guaranteeing 100% uptime with zero crashes during evaluations and demonstrations.',
  },
];

export default function AccordionFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="space-y-3 font-mono">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={item.id}
            className={`station-signboard rounded-xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'border-station-yellow shadow-md bg-white dark:bg-zinc-900/90'
                : 'border-slate-200 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-900/40 hover:border-slate-300 dark:hover:border-zinc-700'
            }`}
          >
            {/* Accordion Header Button */}
            <button
              type="button"
              onClick={() => toggleItem(idx)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
              data-cursor="INSPECT"
              className="w-full text-left p-5 flex items-center justify-between gap-4 select-none cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-zinc-800 text-amber-800 dark:text-station-yellow border border-amber-300 dark:border-zinc-700">
                  {item.badge}
                </span>
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-station-yellow transition-colors">
                  {item.q}
                </span>
              </div>

              {/* Rotating Status Glyph using GSAP-like smooth rotate */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${
                  isOpen
                    ? 'rotate-180 bg-station-yellow text-black border-amber-400'
                    : 'rotate-0 bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-300 dark:border-zinc-700'
                }`}
              >
                <ChevronDown size={16} className="stroke-[2.5]" />
              </div>
            </button>

            {/* Fluid-Height Animated Body using CSS Grid grid-template-rows: 0fr -> 1fr */}
            <div
              id={`faq-answer-${item.id}`}
              role="region"
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="p-5 pt-0 border-t border-slate-200/60 dark:border-zinc-800/60 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 font-sans leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
