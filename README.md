# RailSync 🚂 — Indian Railways Live Telemetry, PRS & GIS Engine

An interactive, high-fidelity Indian Railways telemetry, route intelligence, and passenger reservation tracking web application. Built with **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS**, **Leaflet GIS**, **Zustand**, **React Context API**, **Web Audio API**, and **Web Speech API**.

Compliant with full-stack **Front-End Engineering (FEE)** and **Relational Database Management Systems (DBMS)** curriculum specifications.

---

## 📚 Technical Documentation & System Blueprints

| Guide | Description | Target Link |
|---|---|---|
| **System Flow & Workflows** | Master end-to-end operational flow: boot lifecycle, 8 feature workflows, motion physics, audio synthesis, and resilience decision trees. | [`FLOW.md`](file:///Users/akshit/Desktop/coding/fee%20and%20dbms%20project/FLOW.md) |
| **System Architecture** | Multi-tier topology, layer breakdown, sequence diagrams, data flow pipelines, and DBMS 3NF schema. | [`ARCHITECTURE.md`](file:///Users/akshit/Desktop/coding/fee%20and%20dbms%20project/ARCHITECTURE.md) |
| **Architecture Decisions** | 10 formal Architecture Decision Records (ADRs) explaining technical trade-offs and rationale. | [`DECISIONS.md`](file:///Users/akshit/Desktop/coding/fee%20and%20dbms%20project/DECISIONS.md) |
| **Component Reference** | Deep dive into every component, hook, store, and utility: what it does, how it works, functions called, and terminology glossary. | [`COMPONENTS.md`](file:///Users/akshit/Desktop/coding/fee%20and%20dbms%20project/COMPONENTS.md) |
| **Database Schema** | Relational 3NF SQL schema with stations, trains, schedules, bookings, passengers, and reviews. | [`db/schema.sql`](file:///Users/akshit/Desktop/coding/fee%20and%20dbms%20project/db/schema.sql) |

---

## 🌟 Key Features Overview

### 1. 🌐 Landing Page & Operational Overview (`components/HomePage.js`)
- **Quick-Track Hero Terminal**: 5-digit train number search with instant audio chime feedback and sample shortcuts for flagship express trains (Tejas Rajdhani `12952`, Vande Bharat `22436`, Bhopal Shatabdi `12002`).
- **Interactive Quick-Pill Navigation Grid**: Instant 1-click routing to Train Search, Live GPS Tracker, Station Board, PNR Status, Fare Matrix, and Control Desk.
- **Network Telemetry Statistics**: Real-time stats across 7,300+ stations, 13,000+ daily rakes, 17 railway zones, and 68 divisions.
- **Operational Capability Cards**: Interactive cards with spring physics hover transformations (`scale(1.035)`, uplift `-8px`) and dual-theme yellow glow.
- **Indian Railways Operations FAQ**: Answers regarding GPS telemetry, PRS charting, platform conflicts, and coach rake positions.

### 2. 🛰️ Live GPS Telemetry & GIS Route Corridor (`components/LiveTracker.js` & `TrackMap.js`)
- **Leaflet GIS Map**: Renders full railway corridor track polylines with CSS filter inversion for dark-mode mapping without paid map API keys.
- **Directional Locomotive Marker**: Mathematical forward azimuth calculations that dynamically rotate the locomotive marker according to live bearing.
- **Vertical Permanent Way Route Ribbon**: Shows physical rail sleepers, platform assignments, intermediate halt durations, and 3-aspect signal lamps:
  - 🟢 **Green (Line Clear)**: On time (delay ≤ 5 mins)
  - 🟡 **Amber (Caution)**: Minor delay (5–25 mins)
  - 🔴 **Red (Danger)**: Major delay (> 25 mins)
- **Telemetry HUD**: Live speed gauge (km/h), last reported station, next upcoming stop, and automated 30-second interval polling with cleanup.
- **Bilingual Public Address Broadcast**: One-click broadcast of train arrival voice announcements in Hindi and English.
- **Star Watchlist**: 1-click pinning to user's persistent train watchlist.

### 3. 🔍 Train & Route Search Engine (`components/SearchSection.js`)
- Dual-mode search: Direct **Train Number** lookup or **Between Stations** search.
- Powered by reusable **`StationSelect`** fuzzy autocomplete with keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`) and click-outside DOM cleanup.
- **Origin / Destination Station Swap**: Smooth animated reversal of station pairs.
- **Direct Cart Booking**: Quick modal to select class (1A, 2A, 3A, SL), quota (General, Tatkal, Ladies, Senior Citizen), passenger count, and add to the journey reservation cart.

### 4. 🚉 Electronic Platform Split-Flap Board (`components/StationBoard.js`)
- Inspired by mechanical platform display boards at major Indian terminals.
- Autocomplete search across all 7,300+ stations with lookahead filters: **Next 2 Hours, 4 Hours, or 8 Hours**.
- Directional movement filters: **Departures**, **Arrivals**, or **All**.
- **Platform Coach Halting Position Visualizer**: Embedded visual schematic showing exact coach alignment (Engine, EOG, GS, S1–S4, PC, B1–B4, A1–A2, H1) relative to platform markers (Pillars 1 to 24).
- **Public Address Audio Announcement**: Broadcasts authentic platform announcements for any scheduled train.

### 5. 🎫 PNR Status & PRS Reservation Schematics (`components/PnrSection.js`)
- 10-digit PNR validator with preloaded sample test button (`2458910243`).
- Formatted as an authentic **IRCTC PRS Dot-Matrix Chart** with perforated paper styling.
- **Visual Train Rake Composition** (`components/CoachLayout.js`): Highlights the passenger's exact coach in glowing station yellow.
- **8-Berth Compartment Bay Cutaway** (`components/BerthMap.js`): Compartment layout detailing Lower Berth (Window), Middle, Upper, Side Lower, and Side Upper.
- **⭐ Save PNR to Tracker**: Pins the PNR to the user's persistent tracker.
- **🖨️ Print Digital Boarding Pass**: Opens an authentic printable IRCTC Electronic Boarding Pass with scannable QR Code (`components/DigitalTicketModal.js`).

### 6. 💰 Telescopic Fare Matrix & Calculator (`components/FareCalculator.js`)
- Distance slider (50 km to 2,800 km) and station-pair distance auto-calculation.
- Authentic **IRCTC Telescopic Slabs Formula**: Base rates decrease at 500 km and 1,000 km thresholds for economical long-distance travel.
- Class multipliers: **1A, 2A, 3A, 3E, CC, SL, 2S**.
- Detailed itemized receipt: Base Fare + Superfast Supplement + Computerized Reservation Fee + Tatkal/Concession Surcharge + 5% AC GST.
- Instant **"Book / Add to Journey Cart"** integration.

### 7. 📊 Operational Control Desk Dashboard (`components/ControlDashboard.js`)
- Mini-project powered by **Zustand** (`store/useDashboardStore.js`).
- Live operational KPIs: **Network Punctuality (94.8%)**, **Active Rakes (13,420)**, **Average Delay (7.4m)**, **Line Clear Signal Health (98.6%)**, **Daily Commuters (24.2M)**, and **OHE Traction Power (4,890 MW)**.
- Multi-zonal telemetry breakdown with interactive filters: **ALL, NR, WR, CR, SR, ER, SCR**.
- Real-time caution orders feed with dismiss actions.
- Asynchronous telemetry refresh demonstrating standardized lifecycle states: `idle | loading | success | error`.

### 8. 🛒 Journey Reservation Shopping Cart (`store/useCartStore.js` & `components/CartDrawer.js`)
- Mini-project implementing state persistence with Zustand `persist` middleware.
- Slide-over Journey Cart drawer with live badge count in Navbar.
- Promo coupon engine:
  - `RAIL10` (10% flat discount)
  - `STUDENT20` (20% student concession discount)
  - `TATKAL0` (5% early-bird rebate)
- Checkout simulation that generates confirmed PNR allocations and launches the printable Digital Boarding Pass.

### 9. 🔊 Native Web Audio & Web Speech Synthesizers (`lib/audio-chime.js`)
- **4-Tone Indian Railways Station Chime**: Pure mathematical oscillator synthesis using native Web Audio API (zero external MP3 files):
  - Tone 1: **G4** (392.00 Hz)
  - Tone 2: **C5** (523.25 Hz)
  - Tone 3: **D5** (587.33 Hz)
  - Tone 4: **G5** (783.99 Hz, sustained bell decay)
- **Bilingual Text-to-Speech Voice Engine**: Browser-native Web Speech API (`window.speechSynthesis`) speaking authentic Indian Railway announcements in Hindi and English.

### 10. 🆘 RailMadad 139 Emergency Helpline Desk (`components/EmergencyDrawer.js`)
- Slide-over drawer with one-click copy and quick dial for emergency numbers:
  - **139** (Unified Indian Railways 24x7 Helpline)
  - **182** (Railway Protection Force - RPF)
  - Women Passenger Safety Desk (Operation Meri Saheli)
  - Medical Emergency onboard train

### 11. ⭐ Saved Watchlist & PNR Tracker (`components/WatchlistDrawer.js`)
- Slide-over drawer accessible from Navbar displaying starred trains and saved PNR reservations with direct 1-click tracking.

---

## 🏛️ System Architecture & PE-I Curriculum Mapping

This project maps directly against the standard computer science curriculum requirements:

| Module / Topic | Implementation in RailSync | Key Files |
| :--- | :--- | :--- |
| **HTML5 & Semantic Web** | Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<time>`, `<figure>`), strict accessibility labels, ARIA roles. | `app/layout.js`, `app/page.js`, `components/Navbar.js` |
| **CSS3 & Design Tokens** | Dual dark/light theme tokens via CSS variables (`--station-yellow`, `--bg-canvas`, `--surface-card`), Tailwind CSS, Flexbox & CSS Grid. | `app/globals.css`, `tailwind.config.js` |
| **ES6+ Modern JavaScript** | Promises, `async`/`await`, destructuring, spread/rest operators, arrow functions, ES Modules (ESM). | `lib/audio-chime.js`, `lib/railkit.js`, `lib/db.js` |
| **DOM Manipulation & Web APIs** | Synthetic events, DOM outside-click listeners via `useRef`, Web Audio API oscillators, Web Speech API speech synthesis. | `lib/audio-chime.js`, `components/forms/StationSelect.js` |
| **SPA Navigation & Page Structure** | Single Page Application with deep linking, breadcrumbs, `window.history.pushState`, and `popstate` browser back/forward routing. | `app/page.js`, `components/Navbar.js` |
| **Portfolio Site Mini-Project** | Interactive Architecture Hub & Developer Portfolio view showcasing all PE-I concepts and live code sandbox tabs. | `components/PortfolioShowcase.js` |
| **Context API State Architecture** | Global application state management (theme, language, audio, toast notifications, emergency drawer, watchlist) vs local state. | `context/AppContext.js`, `components/ToastContainer.js` |
| **Zustand State Management** | Modern lightweight Redux alternative. Implements Shopping Cart mini-project with pricing math, coupon engine, and local storage persistence. | `store/useCartStore.js`, `components/CartDrawer.js` |
| **Async State Handling** | Standardized asynchronous state modeling (`idle`, `loading`, `success`, `error`) with retry logic and error banners. | `store/useDashboardStore.js`, `components/ControlDashboard.js` |
| **Form Handling & Validation** | Reusable controlled input suite (`FormInput`, `StationSelect`, `SelectDropdown`) with live regex validation and custom `useFormValidation` hook. | `components/forms/*` |
| **Relational DBMS Layer** | 3NF normalized SQL schema modeling stations, trains, schedules, bookings, passengers, and reviews with foreign keys and sample queries. | `db/schema.sql`, `lib/db.js` |

---

## 🗄️ Relational Database Management System (DBMS) Schema

The database layer (`db/schema.sql`) implements a fully normalized 3rd Normal Form (3NF) relational model:

```
  ┌──────────────┐          ┌───────────────────┐          ┌──────────────┐
  │   STATIONS   │◀───┐      │      TRAINS       │◀───┐      │    USERS     │
  ├──────────────┤    │      ├───────────────────┤    │      ├──────────────┤
  │ station_code │    │      │ train_number (PK) │    │      │ user_id (PK) │
  │ station_name │    │      │ train_name        │    │      │ email        │
  │ state, zone  │    │      │ train_type        │    │      │ full_name    │
  │ lat, lng     │    │      │ origin_code (FK)  │    │      └──────┬───────┘
  └──────┬───────┘    │      │ dest_code (FK)    │    │             │
         │            │      └─────────┬─────────┘    │      1:N    │
         │ 1:N        │                │              └────────┐    │
         ▼            │ 1:N            ▼ 1:N                   │    ▼
  ┌──────────────┐    │      ┌───────────────────┐      ┌──────────────┐
  │TRAIN_SCHEDULE│────┘      │     BOOKINGS      │◀─────┤  PASSENGERS  │
  ├──────────────┤           ├───────────────────┤      ├──────────────┤
  │ schedule_id  │           │ pnr_number (PK)   │      │ passenger_id │
  │ train_number │           │ user_id (FK)      │      │ pnr_no (FK)  │
  │ station_code │           │ train_number (FK) │      │ berth_number │
  │ stop_number  │           │ travel_class      │      │ coach_number │
  │ arrival/dept │           │ total_fare, status│      │ berth_type   │
  └──────────────┘           └───────────────────┘      └──────────────┘
```

---

## 📂 Project Structure

```
RailSync/
├── app/
│   ├── api/                          # Serverless backend API route handlers
│   │   ├── config/route.js           # Runtime RailKit key status & update
│   │   ├── live/route.js             # Live GPS telemetry & train running status
│   │   ├── pnr/route.js              # 10-digit PNR ticket inquiry proxy
│   │   ├── search/route.js           # Train search between stations / by number
│   │   ├── station-board/route.js    # Station platform arrival/departure board
│   │   └── stations/route.js         # 7,300+ stations autocomplete search
│   ├── globals.css                   # Custom design tokens, signal lamps, animations
│   ├── layout.js                     # Root layout with ThemeProvider & AppProvider
│   └── page.js                       # SPA orchestrator (URL routing, breadcrumbs, tabs)
├── components/
│   ├── forms/                        # Reusable Form Input Suite
│   │   ├── FormInput.js              # Controlled input with validation & touched state
│   │   ├── SelectDropdown.js         # Reusable dropdown for Class, Quota & Preferences
│   │   ├── StationSelect.js          # Fuzzy debounced station autocomplete & keyboard nav
│   │   └── useFormValidation.js      # Custom form validation hook
│   ├── ApiKeyModal.js                # Modal drawer for custom API key configuration
│   ├── BerthMap.js                   # 8-berth compartment cutaway bay diagram
│   ├── CartDrawer.js                 # Shopping Cart Mini-Project: Journey Booking Drawer
│   ├── CoachLayout.js                # Full train rake coach diagram with highlighted coach
│   ├── ControlDashboard.js           # Dashboard Mini-Project: Executive Operations Center
│   ├── DigitalTicketModal.js         # Printable IRCTC E-Ticket Boarding Pass with QR code
│   ├── EmergencyDrawer.js            # RailMadad 139 Emergency Helpline Desk
│   ├── FareCalculator.js             # Dynamic Telescopic Fare Matrix & Distance Estimator
│   ├── HomePage.js                   # Interactive landing page (hero, quick pills, capabilities)
│   ├── LiveTracker.js                # Live telemetry dashboard (speed, delay, HUD, voice)
│   ├── Navbar.js                     # Nav header, clock, cart badge, saved count, 139 SOS
│   ├── PlatformCoachVisualizer.js     # Platform coach halting layout & pillar alignment
│   ├── PnrSection.js                 # PNR inquiry, dot-matrix chart & boarding pass trigger
│   ├── PortfolioShowcase.js          # PE-I System Architecture & Developer Portfolio Hub
│   ├── RouteRibbon.js                # Vertical permanent way track ribbon
│   ├── SearchSection.js              # Dual-mode station & train search with Cart booking
│   ├── StationBoard.js               # Platform split-flap board with voice broadcast
│   ├── ThemeProvider.js              # Light/Dark mode context with URL param support
│   ├── ToastContainer.js             # Floating railway notification toasts
│   ├── TrackMap.js                   # Leaflet GIS corridor map with train markers
│   └── WatchlistDrawer.js            # Saved Watchlist Trains & PNRs slide-over drawer
├── context/
│   └── AppContext.js                 # Global Context API: Watchlist, Toasts, Lang, Audio
├── db/
│   └── schema.sql                    # Relational DBMS 3NF SQL schema & sample queries
├── lib/
│   ├── audio-chime.js                # Web Audio API 4-tone chime + Web Speech API voice
│   ├── db.js                         # Relational query execution engine & joins
│   ├── railkit.js                    # RailKit SDK adapter & mock data fallbacks
│   └── stations-data.js              # 7,300+ station database & geospatial coordinates
├── store/
│   ├── useCartStore.js               # Zustand store for Journey Shopping Cart
│   └── useDashboardStore.js          # Zustand store for Operational Control Desk
├── .eslintrc.json                    # Next.js ESLint configuration
├── package.json                      # Dependencies (Next.js, React, Zustand, Leaflet)
├── tailwind.config.js                # Tailwind color & font configuration
└── README.md                         # Project documentation
```

---

## 🛠️ Quickstart Guide

### 1. Clone & Install
```bash
git clone https://github.com/Akshit99999/RailSync.git
cd RailSync
npm install
```

### 2. Configure Environment (Optional)
RailSync runs **out-of-the-box with built-in realistic mock data** for offline demonstration. For live RapidAPI Indian Railways data, create `.env.local`:
```env
RAILKIT_API_KEY=your_railkit_api_key_here
```
*(You can also configure the API key at runtime via the "API" button in the navigation header).*

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

### 5. Instant Theme Testing via URL
- Light Mode: `http://localhost:3000/?theme=light`
- Dark Mode: `http://localhost:3000/?theme=dark`

---

## 👤 Author & Credits

- **Project Lead / Developer:** Akshit Sharma
- **Email:** [akshitsharma684@gmail.com](mailto:akshitsharma684@gmail.com)
- **GitHub Repository:** [https://github.com/Akshit99999/RailSync](https://github.com/Akshit99999/RailSync)
