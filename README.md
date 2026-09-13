# RailSync 🚂 — Indian Railways Live Tracker & PNR Status

A high-fidelity Indian Railways tracking interface built with Next.js (App Router), plain JavaScript, Tailwind CSS, and Leaflet.js. 

Designed specifically around the authentic visual and physical world of Indian Railways: platform electronic display boards, 3-aspect railway signal lights, track tie ribbons, train rake composition, compartment berth cutaways, and IRCTC reservation charts.

---

## 📸 Core Features

1. **Station & Train Search Terminal**
   - Instant station lookup across major junctions in all 17 Indian Railway zones.
   - Origin / Destination station swap control.
   - Quick Hot Route presets (`NDLS → MMCT`, `NDLS → BSB`, `NDLS → HWH`, `MAS → SBC`).
   - 5-digit direct train number lookup with audio chime feedback.

2. **Hero Live Train Tracking View**
   - Real-time corridor map powered by **Leaflet.js** with dark high-contrast railway styling.
   - **Directional Locomotive Marker:** Rotates according to the train's live geographic bearing towards the destination.
   - **Linear Permanent Way Route Ribbon:** Vertical rail line with physical sleeper ties, platform numbers, halt durations, and dynamic signal aspect pips (Green = Line Clear, Amber = Caution/Delay, Red = Severe Delay).
   - Telemetry HUD: speed, last reported station, next stop, progress counter, and auto-refresh (every 30s) or manual sync.
   - **Train Rake Composition:** Full train coach sequence from WAP-7 locomotive to rear guard van.

3. **Station Live Board (Arrivals & Departures)**
   - Electronic departure/arrival board styled after real platform LED matrix boards.
   - Time window selection: Next 2 Hours, 4 Hours, or 8 Hours.
   - Filter by Departures, Arrivals, or All movements.
   - Direct 1-click "Track" button to jump into live telemetry.

4. **PNR Status Checker & Coach Reservation Chart**
   - 10-digit PNR validator with preloaded sample test button (`2458910243`).
   - Charting status banner (`CHART PREPARED`).
   - Passenger berth allocation table (Coach, Berth Number, Berth Type).
   - **Visual Coach Layout:** Locomotive-to-guard sequence with passenger's coach highlighted in glowing yellow.
   - **Interactive Compartment Bay Schematic:** 8-berth cutaway diagram showing exact seat location (Lower Berth window, Middle, Upper, Side Lower, Side Upper).

5. **Audio & Developer Telemetry**
   - **Iconic Indian Railways Announcement Chime:** Synthesized 4-tone platform chime (`G4 ➔ C5 ➔ D5 ➔ G5`) using browser-native Web Audio API (with on/off mute toggle).
   - **In-App API Key Manager:** Link and test your RailKit API key directly from the UI header without restarting servers.

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
- **Styling:** Tailwind CSS + Custom Railway CSS Variables
- **Mapping:** Leaflet.js with CartoDB Dark Matter tiles
- **Audio:** Browser Web Audio API (0 external audio assets)
- **API:** `railkit` with server-side Next.js API route proxies:
  - `/api/live` — Live train tracking & GPS telemetry
  - `/api/station-board` — Station arrivals & departures
  - `/api/pnr` — PNR reservation status
  - `/api/search` — Direct trains between stations
  - `/api/stations` — 17-zone station autocomplete
  - `/api/config` — Live RailKit key validation & session linking
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
*(You can also link your key directly in the web app via the "API KEY" button in the header).*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
