'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Clock3,
  Map,
  Search,
  Ticket,
  TrainFront,
} from 'lucide-react';
import BookingWizard from './BookingWizard';

const sampleTrains = [
  { number: '12952', name: 'Tejas Rajdhani Express', route: 'New Delhi → Mumbai Central' },
  { number: '22436', name: 'Vande Bharat Express', route: 'New Delhi → Varanasi' },
  { number: '12002', name: 'Bhopal Shatabdi Express', route: 'New Delhi → Rani Kamalapati' },
];

const tools = [
  { id: 'search', title: 'Find trains', detail: 'Compare services between two stations', icon: Search },
  { id: 'station-board', title: 'Station board', detail: 'See arrivals and departures by station', icon: Map },
  { id: 'pnr', title: 'PNR status', detail: 'Look up a reservation reference', icon: Ticket },
  { id: 'fare-calculator', title: 'Fare estimate', detail: 'Compare estimated fares by class', icon: Calculator },
  { id: 'dashboard', title: 'Operations desk', detail: 'Explore the sample network dashboard', icon: Clock3 },
];

export default function HomePage({ onNavigate, onTrackTrain }) {
  const [trainNumber, setTrainNumber] = useState('');
  const [dataMode, setDataMode] = useState('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/config', { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => setDataMode(data.configured ? 'provider' : 'sample'))
      .catch(() => setDataMode('sample'));
    return () => controller.abort();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const clean = trainNumber.trim();
    if (!/^\d{5}$/.test(clean)) {
      setError('Enter a 5-digit train number.');
      return;
    }
    setError('');
    onTrackTrain(clean);
  };

  return (
    <div className="home-workspace">
      <section className="home-intro" aria-labelledby="home-title">
        <div>
          <h1 id="home-title">Find your train.</h1>
          <p className="home-description">Check a train by number, search a route, or look up a PNR.</p>
        </div>
        <div className={`data-source data-source-${dataMode}`} aria-live="polite">
          <span className="data-source-mark" aria-hidden="true" />
          <span>
            {dataMode === 'provider' ? 'RailKit key configured' : dataMode === 'checking' ? 'Checking data source' : 'Sample data'}
          </span>
          <button type="button" onClick={() => onNavigate('dashboard')} aria-label="Open operations desk">
            About data <ArrowUpRight size={14} />
          </button>
        </div>
      </section>

      <section className="home-primary" aria-label="Train lookup">
        <div className="train-lookup">
          <div className="section-label"><TrainFront size={16} /> Running status</div>
          <form onSubmit={handleSubmit} className="train-lookup-form" noValidate>
            <label htmlFor="home-train-number">Train number</label>
            <div className="lookup-control">
              <input
                id="home-train-number"
                inputMode="numeric"
                autoComplete="off"
                maxLength={5}
                value={trainNumber}
                onChange={(event) => {
                  setTrainNumber(event.target.value.replace(/\D/g, ''));
                  if (error) setError('');
                }}
                placeholder="e.g. 12952"
                aria-describedby={error ? 'train-number-error' : 'train-number-hint'}
                aria-invalid={Boolean(error)}
              />
              <button type="submit" aria-label="Check running status">
                <span>Check status</span><ArrowRight size={17} />
              </button>
            </div>
            {error ? <p id="train-number-error" className="field-error" role="alert">{error}</p> : <p id="train-number-hint" className="field-hint">Five digits · try one of the sample trains below</p>}
          </form>
          <div className="lookup-shortcuts">
            <button type="button" className="text-action" onClick={() => onNavigate('search')}>
              Search between stations <ArrowRight size={15} />
            </button>
            <button type="button" className="text-action" onClick={() => onNavigate('pnr')}>
              Check PNR status <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="sample-board" aria-label="Illustrative sample route">
          <div className="sample-board-heading">
            <div>
              <h2>One journey, stop by stop.</h2>
            </div>
            <span className="sample-stamp">Illustrative</span>
          </div>
          <div className="route-caption">
            <span>12952 · Tejas Rajdhani Express</span>
            <span>Sample route</span>
          </div>
          <div className="route-line-list">
            {[
              { code: 'NDLS', name: 'New Delhi', time: '16:55', kind: 'origin' },
              { code: 'KOTA', name: 'Kota Junction', time: '21:30', kind: 'stop' },
              { code: 'RTM', name: 'Ratlam Junction', time: '00:35', kind: 'stop' },
              { code: 'MMCT', name: 'Mumbai Central', time: '08:35', kind: 'destination' },
            ].map((station) => (
              <div className={`route-stop route-stop-${station.kind}`} key={station.code}>
                <span className="route-stop-marker" aria-hidden="true" />
                <span className="route-stop-code">{station.code}</span>
                <span className="route-stop-name">{station.name}</span>
                <time className="route-stop-time">{station.time}</time>
              </div>
            ))}
          </div>
          <p className="sample-note">Illustrative data · not a live running update</p>
        </div>
      </section>

      <section className="sample-trains" aria-labelledby="sample-trains-title">
        <div className="section-heading-row">
          <div>
            <h2 id="sample-trains-title">Sample trains</h2>
          </div>
        </div>
        <div className="sample-train-list">
          {sampleTrains.map((train) => (
            <button type="button" className="sample-train-row" key={train.number} onClick={() => onTrackTrain(train.number)}>
              <span className="sample-train-number">{train.number}</span>
              <span className="sample-train-details">
                <strong>{train.name}</strong>
                <span>{train.route}</span>
              </span>
              <ArrowRight className="sample-train-arrow" size={18} />
            </button>
          ))}
        </div>
      </section>

      <section className="tools-section" aria-labelledby="tools-title">
        <div className="section-heading-row">
          <div>
            <h2 id="tools-title">Choose where to go next</h2>
          </div>
        </div>
        <nav className="tool-list" aria-label="RailSync tools">
          {tools.map(({ id, title, detail, icon: Icon }) => (
            <button type="button" className="tool-row" key={id} onClick={() => onNavigate(id)}>
              <span className="tool-icon"><Icon size={17} strokeWidth={1.8} /></span>
              <span className="tool-copy"><strong>{title}</strong><span>{detail}</span></span>
              <ArrowUpRight className="tool-arrow" size={17} />
            </button>
          ))}
        </nav>
      </section>

      <details className="booking-demo">
        <summary>Explore the sample booking flow <span>Demonstration only</span></summary>
        <div className="booking-demo-content"><BookingWizard onComplete={() => onNavigate('search')} /></div>
      </details>
    </div>
  );
}
