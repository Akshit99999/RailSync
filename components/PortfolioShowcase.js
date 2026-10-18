'use client';

import { useState } from 'react';
import { 
  Code2, 
  Layers, 
  Terminal, 
  Github, 
  Mail, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Database,
  Globe,
  FileCode2,
  Box,
  Compass
} from 'lucide-react';

const TOPICS = [
  {
    id: 'spa-nav',
    module: 'MODULE 1: SPA NAVIGATION & LAYOUT',
    title: 'Multi-Page SPA Design & URL State Routing',
    desc: 'Deep-linked tab navigation without full page reloads. Employs window.history.pushState and popstate event orchestration for browser back/forward buttons, breadcrumbs, and responsive drawers.',
    tags: ['Next.js 14 App Router', 'SPA Routing', 'Breadcrumbs', 'History API'],
    code: `// URL State Synchronization in Multi-page SPA
const navigateTo = (tab, params = {}) => {
  setActiveTab(tab);
  const url = new URL(window.location);
  url.searchParams.set('tab', tab);
  if (params.train) url.searchParams.set('train', params.train);
  window.history.pushState({}, '', url);
};`,
  },
  {
    id: 'context-api',
    module: 'MODULE 2: CONTEXT API & GLOBAL STATE',
    title: 'Global vs Local State Architecture',
    desc: 'Separation of concerns: Local state (form inputs, open dropdowns) managed via useState; Global state (theme, audio, watchlist, toast notifications) managed via React Context API (AppContext).',
    tags: ['createContext', 'useContext', 'State Lifting', 'Toast Notifications'],
    code: `// Global Context Provider Pattern
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [watchlist, setWatchlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  // Shared app-wide state and actions...
  return (
    <AppContext.Provider value={{ watchlist, toasts, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}`,
  },
  {
    id: 'zustand-cart',
    module: 'MODULE 3: ZUSTAND STORE & CART MINI-PROJECT',
    title: 'Zustand Store: Ticket Journey Shopping Cart',
    desc: 'Modern lightweight Redux alternative. Implements Journey Booking Cart with pricing logic, telescopic distance fares, superfast supplements, promotional coupon engine (RAIL10, STUDENT20), and localStorage persistence.',
    tags: ['Zustand', 'Shopping Cart Mini-Project', 'Redux Pattern', 'State Persistence'],
    code: `// Zustand Store with Middleware Persistence
export const useCartStore = create(
  persist((set, get) => ({
    items: [],
    addItem: (item) => set((s) => ({ items: [item, ...s.items], isCartOpen: true })),
    removeItem: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
    getCartTotals: () => {
      /* Dynamic IRCTC fare calculation */
    }
  }), { name: 'railsync_cart_store' })
);`,
  },
  {
    id: 'form-validation',
    module: 'MODULE 4: FORM HANDLING & VALIDATION',
    title: 'Validation Strategies & Reusable Components',
    desc: 'Modular reusable input suite: FormInput (floating labels, regex testing, touched tracking), StationSelect (fuzzy lookup across 7,300+ stations), and custom validation hook useFormValidation.',
    tags: ['Controlled Components', 'Regex Validation', 'Custom Hook', 'Aria Accessibility'],
    code: `// Reusable Form Validation Strategy
const { values, errors, touched, handleChange, handleSubmit } = useFormValidation(
  { trainNumber: '', pnrNumber: '' },
  (vals) => {
    const errs = {};
    if (!/^\\d{5}$/.test(vals.trainNumber)) errs.trainNumber = 'Must be exactly 5 digits';
    return errs;
  }
);`,
  },
  {
    id: 'dom-web-apis',
    module: 'MODULE 5: DOM MANIPULATION & WEB APIS',
    title: 'Native Web Audio API & Speech Synthesis',
    desc: 'Zero external MP3 dependencies. Uses native AudioContext OscillatorNodes to mathematically synthesize the Indian Railways 4-tone chime, paired with bilingual Web Speech API public address announcements.',
    tags: ['Web Audio API', 'OscillatorNode', 'SpeechSynthesis', 'DOM Events'],
    code: `// Pure Browser Mathematical Chime & Bilingual Voice
const notes = [
  { freq: 392.00, time: 0.00 }, // G4
  { freq: 523.25, time: 0.35 }, // C5
  { freq: 587.33, time: 0.70 }, // D5
  { freq: 783.99, time: 1.05 }  // G5
];
// Speech Synthesis Utterance: Hindi & English
const utterance = new SpeechSynthesisUtterance("यात्री कृपया ध्यान दें...");`,
  },
  {
    id: 'dbms-layer',
    module: 'MODULE 6: DBMS & RELATIONAL ARCHITECTURE',
    title: 'Database Schema, 3NF Normalization & SQL Queries',
    desc: 'Relational database schema modeling Indian Railways PRS engine: Stations, Trains, TrainSchedules, Bookings, Passengers, and DelayReviews with primary/foreign keys and ACID compliance.',
    tags: ['PostgreSQL / SQLite', '3NF Schema', 'Foreign Keys', 'ER Diagram'],
    code: `-- Relational SQL Foreign Key Link
CREATE TABLE bookings (
  pnr_number VARCHAR(10) PRIMARY KEY,
  train_number VARCHAR(5) REFERENCES trains(train_number),
  from_station VARCHAR(6) REFERENCES stations(code),
  to_station VARCHAR(6) REFERENCES stations(code),
  status VARCHAR(20) DEFAULT 'CONFIRMED'
);`,
  },
];

export default function PortfolioShowcase() {
  const [activeTopic, setActiveTopic] = useState(TOPICS[0]);

  return (
    <div className="space-y-8 font-mono">
      {/* Portfolio Header & Author Bio */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-900 to-black text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-station-yellow text-xs font-bold uppercase tracking-widest">
              <Sparkles size={16} />
              <span>PE-I PROFESSIONAL ELECTIVE • SYSTEM PORTFOLIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              RailSync — Architecture & Engineering Showcase
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Complete implementation of Modern Frontend Engineering (FEE) & Relational Database Management (DBMS). Built with React 18, Next.js 14, Zustand, Context API, Web Audio API, and Leaflet GIS.
            </p>
          </div>

          {/* Author Card */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-xs self-start md:self-auto shrink-0 min-w-[240px]">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">PROJECT LEAD / AUTHOR</span>
            <p className="text-sm font-bold text-white">Akshit Sharma</p>
            <div className="flex flex-col gap-1 text-zinc-400 text-[11px]">
              <a 
                href="mailto:akshitsharma684@gmail.com" 
                className="flex items-center gap-1.5 hover:text-station-yellow transition-colors"
              >
                <Mail size={12} /> akshitsharma684@gmail.com
              </a>
              <a 
                href="https://github.com/Akshit99999/RailSync" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 text-station-yellow hover:underline"
              >
                <Github size={12} /> Akshit99999/RailSync
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-500 text-[11px] font-bold mr-2">TECH STACK:</span>
          {['Next.js 14 (App Router)', 'React 18', 'JavaScript ES6+', 'Zustand', 'Context API', 'Tailwind CSS', 'Leaflet GIS', 'Web Audio API', 'Web Speech API', 'SQLite / SQL'].map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-700/60">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Curriculum Module Tabs & Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Topic Selector */}
        <div className="lg:col-span-5 space-y-2.5">
          <h2 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider px-1">
            PE-I CURRICULUM TOPIC MODULES
          </h2>
          {TOPICS.map((topic) => {
            const isSelected = activeTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-xs
                  ${isSelected
                    ? 'border-station-yellow bg-amber-500/10 dark:bg-zinc-900 ring-1 ring-station-yellow font-bold shadow-md'
                    : 'border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300'
                  }
                `}
              >
                <span className="text-[10px] text-amber-600 dark:text-station-yellow font-bold uppercase block mb-1">
                  {topic.module}
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{topic.title}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {topic.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation & Code Sandbox Preview */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="space-y-2 border-b border-slate-100 dark:border-zinc-800 pb-4">
            <span className="text-[10px] text-amber-600 dark:text-station-yellow font-bold uppercase tracking-wider">
              {activeTopic.module}
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100">{activeTopic.title}</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{activeTopic.desc}</p>
          </div>

          {/* Interactive Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500">
              <span className="flex items-center gap-1.5 font-bold">
                <FileCode2 size={14} className="text-amber-500" />
                <span>CODE ARCHITECTURE IMPLEMENTATION</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800">JavaScript ES6+</span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs overflow-x-auto border border-zinc-800 leading-relaxed font-mono">
              <code>{activeTopic.code}</code>
            </pre>
          </div>

          {/* Key Engineering Takeaways */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Viva & Technical Evaluation Highlights</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-zinc-400 text-[11px] leading-relaxed">
              <li>Meets standard course guidelines for single-page multi-view architectural patterns.</li>
              <li>Implements controlled input lifecycle with zero memory leaks via useEffect cleanups.</li>
              <li>Combines React Context API for application configuration with Zustand for state transactions.</li>
              <li>Complete DBMS schema normalization with relational foreign key constraints.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
