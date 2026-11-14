import { ArrowRight, ArrowUpRight, CalendarDays, Map, Ticket, TrainFront } from 'lucide-react';

export const metadata = {
  title: 'RailSync — Plan your journey',
  description: 'Find train information, compare routes, check a PNR, and explore railway tools.',
};

const routes = [
  { code: 'NDLS', name: 'New Delhi', time: '16:55', edge: 'start' },
  { code: 'KOTA', name: 'Kota Junction', time: '21:30' },
  { code: 'RTM', name: 'Ratlam Junction', time: '00:35' },
  { code: 'MMCT', name: 'Mumbai Central', time: '08:35', edge: 'end' },
];

const tasks = [
  { href: '/?tab=search', icon: Map, title: 'Compare routes', description: 'Search services between two stations.' },
  { href: '/?tab=pnr', icon: Ticket, title: 'Check a PNR', description: 'Look up a reservation reference.' },
  { href: '/?tab=station-board', icon: CalendarDays, title: 'Station board', description: 'Browse arrivals and departures.' },
];

export default function WelcomePage() {
  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <a className="landing-brand" href="/" aria-label="RailSync home">
          <TrainFront size={23} strokeWidth={1.8} />
          <span>RailSync</span>
        </a>
        <nav aria-label="Landing page navigation">
          <a href="/?tab=search">Train search</a>
          <a href="/?tab=pnr">PNR status</a>
          <a className="landing-nav-cta" href="/?tab=search">Open RailSync <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-copy">
          <p className="landing-eyebrow"><span /> Indian rail journey tools</p>
          <h1 id="landing-title">The journey starts with a better timetable.</h1>
          <p className="landing-description">Find a train, follow its route, or check a reservation reference. Your essential journey information, in one place.</p>

          <form className="landing-search" action="/" method="get">
            <input type="hidden" name="tab" value="live" />
            <label htmlFor="landing-train-number">Train number</label>
            <div className="landing-search-field">
              <input id="landing-train-number" name="train" type="text" inputMode="numeric" autoComplete="off" maxLength={5} pattern="[0-9]{5}" placeholder="e.g. 12952" required aria-describedby="landing-search-note" />
              <button type="submit">Check status <ArrowRight size={17} /></button>
            </div>
            <p id="landing-search-note">Five digits · try 12952, 22436, or 12002</p>
          </form>

          <div className="landing-secondary-links">
            <a href="/?tab=search">Search between stations <ArrowRight size={15} /></a>
            <a href="/?tab=pnr">Check PNR status <ArrowRight size={15} /></a>
          </div>
        </div>

        <aside className="landing-route glass-panel" aria-label="Illustrative sample route for train 12952">
          <div className="landing-route-head">
            <div><span className="landing-overline">A route at a glance</span><h2>New Delhi to Mumbai</h2></div>
            <span className="landing-sample-mark">Sample</span>
          </div>
          <div className="landing-train-line"><strong>12952</strong><span>Tejas Rajdhani Express</span></div>
          <ol className="landing-stops">
            {routes.map((stop) => (
              <li className={`landing-stop ${stop.edge || ''}`} key={stop.code}>
                <span className="landing-stop-marker" aria-hidden="true" />
                <strong>{stop.code}</strong><span>{stop.name}</span><time>{stop.time}</time>
              </li>
            ))}
          </ol>
          <p className="landing-disclaimer">Illustrative timetable · not a live update</p>
          <a className="landing-route-link" href="/?tab=live&train=12952">View train details <ArrowUpRight size={15} /></a>
        </aside>
      </section>

      <section className="landing-tasks" aria-labelledby="landing-tasks-title">
        <div className="landing-section-heading"><div><span className="landing-overline">Useful, from the first search</span><h2 id="landing-tasks-title">What do you need to check?</h2></div><a href="/?tab=search">See all tools <ArrowRight size={15} /></a></div>
        <div className="landing-task-grid">
          {tasks.map(({ href, icon: Icon, title, description }) => (
            <a className="landing-task glass-panel" href={href} key={title}>
              <span className="landing-task-icon"><Icon size={19} strokeWidth={1.8} /></span>
              <span className="landing-task-copy"><strong>{title}</strong><small>{description}</small></span>
              <ArrowUpRight className="landing-task-arrow" size={17} />
            </a>
          ))}
        </div>
      </section>

      <footer className="landing-footer"><span>RailSync</span><span>Journey information and demonstration tools</span><span>Check travel details with the official railway source.</span></footer>
    </main>
  );
}
