# RailSync 🚂 — Comprehensive Project Notes & Technical Documentation

---

## 1. Project Overview & Vision

**RailSync** is an interactive Indian Railways telemetry, route intelligence, and passenger reservation tracking web application. Built with **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, **Leaflet GIS**, and the **Web Audio API**, it delivers an authentic railway station operations experience directly in the browser.

### Key Objectives:
- **Operational Fidelity**: Emulates the high-contrast aesthetic of Indian Railways (IR) station display boards, 3-aspect signal lamps, and PRS reservation charts.
- **Dual-Mode Theme**:
  - **Dark Mode**: Electric Canary Yellow (`#FFD200`) on Pitch Black (`#000000` / `#0A0A0C`).
  - **Light Mode**: Station Signboard Yellow (`#FFD200`) on Crisp Slate White (`#FFFFFF` / `#F8FAFC`).
- **Zero Heavy Dependencies**: Built in plain JavaScript (ES6+), utilizing browser-native Web Audio API for station announcements without external audio files, and Leaflet for maps without Google Maps API keys.
- **Offline & Fallback Resilience**: Designed to work smoothly both with live RailKit API keys and with built-in realistic mock data for all major Indian corridors (Rajdhani, Vande Bharat, Shatabdi).

---

## 2. Technology Stack & Architectural Principles

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14.2 (App Router)** | Client-side state orchestration with serverless route handlers (`app/api/`). |
| **Language** | **JavaScript (ES6+)** | Pure JS (no TypeScript compilation overhead) for fast dev iteration. |
| **Styling** | **Tailwind CSS + Vanilla CSS** | CSS variables in `globals.css` with dark/light class toggles. |
| **Mapping** | **Leaflet.js** | Client-side dynamically imported (`ssr: false`) with OpenStreetMap tiles. |
| **Audio** | **Web Audio API** | Pure mathematical oscillator synthesis of Indian Railways 4-tone chime. |
| **Icons** | **Lucide React** | Feather-derived vector icons (`Train`, `Gauge`, `Compass`, `MapPin`, etc.). |
| **Data Engine** | **RailKit SDK + Internal Fallback** | Hybrid data provider (`lib/railkit.js`) with live RapidAPI & offline simulation. |

---

## 3. Design System & Theme Engine

### 3.1 Color Palette
- **Station Yellow (`--station-yellow`)**: `#FFD200` — Used for primary buttons, active tabs, hovered cards, and highlighted coaches.
- **Canvas Black (`--bg-canvas` Dark)**: `#000000` / Surface: `#0A0A0C` / Elevated: `#121215`.
- **Canvas White (`--bg-canvas` Light)**: `#F8FAFC` / Surface: `#FFFFFF` / Elevated: `#F1F5F9`.
- **Railway Signal Lamps**:
  - 🟢 **Green (Line Clear)**: `#10B981` (On time / delay < 5 mins).
  - 🟡 **Amber (Caution)**: `#F59E0B` (Minor delay: 5–25 mins).
  - 🔴 **Red (Danger / Delayed)**: `#EF4444` (Major delay > 25 mins).

### 3.2 Typography
- **UI & Headings**: `Plus Jakarta Sans` — Clean, legible modern sans-serif.
- **Telemetry & Station Codes**: `JetBrains Mono` — Monospaced font evoking PRS dot-matrix reservation charts and station LED displays.

### 3.3 Dynamic Micro-Interactions
- **System Capability Cards Hover**:
  - Scaled up by `scale(1.035)` and uplifted by `translateY(-8px)`.
  - Driven by a spring physics curve: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - Elevated to `z-index: 20` to prevent clipping over neighboring grid items.
  - Yellow ambient box-shadow: `0 24px 52px -6px rgba(255, 210, 0, 0.26)`.
  - Hardware accelerated with `will-change: transform;` and `backface-visibility: hidden;`.

---

## 4. Codebase Directory Structure

```
RailSync-main-2/
├── app/
│   ├── api/                     # Serverless backend API routes
│   │   ├── config/route.js      # Runtime RailKit API key status & update
│   │   ├── live/route.js        # Live GPS telemetry & train running status
│   │   ├── pnr/route.js         # 10-digit PNR ticket verification
│   │   ├── search/route.js      # Train search between stations / by number
│   │   ├── station-board/route.js# Station platform arrival/departure board
│   │   └── stations/route.js    # 7,300+ stations autocomplete search
│   ├── globals.css              # Design tokens, signal lamps, animations
│   ├── layout.js                # Root layout with fonts & ThemeProvider
│   └── page.js                  # Main orchestrator (tab state & active train)
├── components/
│   ├── ApiKeyModal.js           # Modal drawer for custom API key configuration
│   ├── BerthMap.js              # 8-berth compartment cutaway bay diagram
│   ├── CoachLayout.js           # Full train rake coach diagram with highlighted coach
│   ├── HomePage.js              # Landing page (hero, stats, capabilities, FAQ)
│   ├── LiveTracker.js           # Live telemetry dashboard (speed, delay, HUD)
│   ├── Navbar.js                # Navigation header, clock, chime toggle, theme switch
│   ├── PnrSection.js            # PNR status inquiry & dot-matrix chart
│   ├── RouteRibbon.js           # Vertical permanent way track ribbon
│   ├── SearchSection.js         # Dual-mode station & train search
│   ├── StationBoard.js          # Platform split-flap electronic board
│   ├── ThemeProvider.js         # Light/Dark mode context with URL param support
│   └── TrackMap.js              # Leaflet GIS corridor map with train markers
├── lib/
│   ├── audio-chime.js           # Web Audio API 4-tone station chime synthesizer
│   ├── railkit.js               # RailKit SDK adapter & mock data fallbacks
│   └── stations-data.js         # 7,300+ station database & geospatial coordinates
├── package.json                 # Project dependencies & scripts
├── tailwind.config.js           # Tailwind color & font configuration
└── README.md                    # Project readme
```

---

## 5. Core Modules & Component Breakdown

### 5.1 Main Orchestrator (`app/page.js`)
- Holds top-level state:
  - `activeTab`: `'home'` | `'search'` | `'live'` | `'station-board'` | `'pnr'`.
  - `activeTrainNumber`: Defaults to `'12952'` (New Delhi – Mumbai Central Tejas Rajdhani).
  - `isApiKeyModalOpen`: Controls the API key settings drawer.
- Implements `handleTrackTrain(trainNumber)`: Updates the active train, flips `activeTab` to `'live'`, and smoothly scrolls to top.

### 5.2 Home Dashboard (`components/HomePage.js`)
- **Quick Track Form**: Prominent search input with train icon and 22px clear padding gap. Quick-pick buttons for Rajdhani (12952), Vande Bharat (22436), and Shatabdi (12002).
- **Network Counters**: Highlights 7,300+ stations, 13,000+ daily passenger trains, 17 zones, and 68 divisions.
- **System Capabilities**: 4 interactive cards detailing Train Search, Live GPS Telemetry, Station Board, and PNR Status with hover scale (`1.035x`) and uplift (`-8px`).
- **Premier Corridors**: One-click shortcuts to instantly launch live tracking for flagship trains.
- **Railway Operational FAQ**: Answers questions regarding GPS tracking, PNR charting, and platform allocations.

### 5.3 Live GPS Telemetry Tracker (`components/LiveTracker.js`)
- **Telemetry HUD**: Displays current speed gauge (km/h), distance covered, bearing heading, and last reported station.
- **Signal Aspect Indicator**: Automatically categorizes delay into Green (On Time), Amber (Minor Delay), or Red (Severe Delay).
- **Auto-Refresh**: Background interval polls `/api/live` every 30 seconds.
- **Sound Trigger**: Fires `playRailwayChime()` on fresh telemetry receipt.

### 5.4 Leaflet Track Map (`components/TrackMap.js`)
- Dynamically imported with SSR disabled to prevent Leaflet `window` reference errors.
- Renders an interactive OpenStreetMap view. In Dark Mode, applies CSS filter inversion (`brightness(0.65) invert(1) contrast(2.6)`) to create a dark theme without paid map keys.
- Plots station nodes:
  - **Departed Stations**: Green circles.
  - **Current Station**: Large pulsating Yellow marker (`#FFD200`).
  - **Next Station**: Sky blue circle (`#0284C7`).
- Connects stations with a bold railway corridor polyline.

### 5.5 PNR Status & Coach Reservation Schematics
- **`components/PnrSection.js`**:
  - Validates 10-digit PNR input.
  - Formats results as an **IRCTC PRS Dot-Matrix Chart** with perforated paper styling.
- **`components/CoachLayout.js`**:
  - Illustrates the complete train rake from WAP-7 locomotive to rear EOG power car.
  - Distinguishes coach classes by color (1AC Maroon, 2AC Blue, 3AC Teal, Sleeper Indigo, Pantry Car Amber).
  - Highlights the passenger's exact coach in glowing station yellow.
- **`components/BerthMap.js`**:
  - Generates an interactive 8-berth compartment bay cutaway (LB, MB, UB, SL, SU).
  - Labels window seats and pinpoints the passenger's reserved berth with an animated seat badge.

### 5.6 Platform Display Board (`components/StationBoard.js`)
- Inspired by mechanical split-flap railway platform display boards.
- Features autocomplete lookup for any Indian station.
- Allows filtering by lookahead time window (2h, 4h, 8h) and direction (Arrivals, Departures, or Both).
- Directly embeds platform allocation numbers and live right-time vs. delayed status.

### 5.7 Authentic Railway Chime (`lib/audio-chime.js`)
- Recreates the iconic 4-tone announcement chime heard across Indian railway stations:
  - Tone 1: **G4** (392.00 Hz)
  - Tone 2: **C5** (523.25 Hz)
  - Tone 3: **D5** (587.33 Hz)
  - Tone 4: **G5** (783.99 Hz, sustained)
- Employs sine oscillators with an exponential gain decay curve to emulate an authentic physical chime bar.

---

## 6. Backend API Specifications

| Endpoint | Query Parameters | Description |
| :--- | :--- | :--- |
| `GET /api/live` | `train` (e.g. `12952`), `date` (`today`/`yesterday`) | Returns live train location, speed, delay, and station stop list. |
| `GET /api/pnr` | `pnr` (10 digits) | Returns passenger reservation details, coach/berth, and charting status. |
| `GET /api/search` | `from`, `to`, `date` OR `train` | Returns list of trains between stations or single train schedule. |
| `GET /api/station-board` | `station` (code), `hours` (`2`, `4`, `8`) | Returns live arrivals and departures at the given station. |
| `GET /api/stations` | `q` (query string) | Autocomplete search across 7,300+ stations. |
| `GET /api/config` | `key` (optional for update) | Checks active API key status or updates key at runtime. |

---

## 7. Developer Cheat Sheet & Setup

### Running Locally:
```bash
# Install dependencies
npm install

# Start development server on port 3005
npm run dev -- -p 3005

# Build production bundle
npm run build

# Start production server
npm run start
```

### Direct Theme Testing via URL:
- Light Mode: `http://localhost:3005/?theme=light`
- Dark Mode: `http://localhost:3005/?theme=dark`

---

*Authored for RailSync — Indian Railways Telemetry & PRS Engine.*
