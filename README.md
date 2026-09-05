# RailSync 🚂 — Indian Railways Live Tracker & PNR Status

A high-fidelity Indian Railways tracking interface built with Next.js (App Router), plain JavaScript, CSS, and Leaflet.js. 

Designed specifically around the authentic visual and physical world of Indian Railways: platform signboards, 3-aspect railway signal lights, track tie ribbons, and IRCTC reservation charts.

---

## 📸 Key Features

1. **Station & Train Search (Inquiry Terminal)**
   - Autocomplete station search with station codes (`NDLS`, `MMCT`, `HWH`, `MAS`, `SBC`, etc.).
   - Station swap control.
   - 5-digit direct train number lookup.
   - Instant live running status launch.

2. **Live Train Tracking View (Hero View)**
   - Real-time corridor map powered by **Leaflet.js** with dark high-contrast railway styling.
   - Active locomotive marker with radar-ping telemetry.
   - **Permanent Way Route Ribbon (Timeline):** Vertical rail line with physical sleeper ties, platform numbers, scheduled vs actual arrival/departure, and dynamic signal aspect pips (Green = Line Clear, Amber = Caution/Delay, Red = Severe Delay).
   - Telemetry HUD: speed, last reported station, next stop, progress, and delay metrics.
   - Auto-refresh (30s) and manual sync.

3. **PNR Status Checker (PRS Chart)**
   - 10-digit PNR validator.
   - Styled after the printed dot-matrix reservation charts pasted on train coach doors.
   - Passenger berth allocation table (Coach, Berth Number, Berth Type like `LB`, `MB`, `UB`, `SL`, `SU`).
   - Charting status badge (`CHART PREPARED`).

---

## 🎨 Authentic Indian Railways Design Language

- **IR Navy (`#091730`)**: Ubiquitous enameled yellow-on-blue station nameboards.
- **Station Canary Yellow (`#FFD200`)**: Iconic platform signboard lettering and coach liveries.
- **Signal Green (`#10B981`)**: "Line Clear" / Right Time.
- **Signal Amber (`#F59E0B`)**: "Caution" / Delay < 25 mins.
- **Signal Red (`#EF4444`)**: "Danger" / High Delay > 25 mins / Cancelled.
- **Monospace Typography**: Evoking PRS dot-matrix reservation charts and platform LED departure boards.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** Plain JavaScript (No TypeScript)
- **Styling:** Custom CSS with Indian Railways Design System
- **Mapping:** Leaflet.js with CartoDB Dark Matter tiles
- **API:** `railkit` with Next.js API route proxying (`/api/live`, `/api/pnr`, `/api/search`, `/api/stations`)
- **Persistence:** None (DB-less phase; live state held in React)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create `.env.local` with your RailKit API key from [railkit.rajivdubey.dev](https://railkit.rajivdubey.dev/):
```env
RAILKIT_API_KEY=your_api_key_here
```
*(Note: If no API key is provided, RailSync seamlessly runs on built-in high-fidelity Indian Railways telemetry data for trains like 12952 Tejas Rajdhani, 22436 Vande Bharat, and 12002 Bhopal Shatabdi).*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
