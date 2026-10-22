# RailSync 🚂 — End-to-End System Flow & Workflow Execution Guide (`FLOW.md`)

This document is the master operational flow manual for **RailSync**. It maps every user journey, internal data pipeline, state transition, visual physics loop, audio synthesis sequence, and database interaction across the entire platform.

---

## Table of Contents

1. [Application Boot & Initialization Flow](#1-application-boot--initialization-flow)
2. [SPA Navigation & URL State Synchronization Flow](#2-spa-navigation--url-state-synchronization-flow)
3. [Feature Workflow 1: Live GPS Train Telemetry](#3-feature-workflow-1-live-gps-train-telemetry)
4. [Feature Workflow 2: Train & Corridor Route Search](#4-feature-workflow-2-train--corridor-route-search)
5. [Feature Workflow 3: Platform Electronic Split-Flap Display Board](#5-feature-workflow-3-platform-electronic-split-flap-display-board)
6. [Feature Workflow 4: IRCTC PRS PNR Status & 8-Berth Cutaway Schematics](#6-feature-workflow-4-irctc-prs-pnr-status--8-berth-cutaway-schematics)
7. [Feature Workflow 5: Telescopic Fare Matrix & Journey Shopping Cart](#7-feature-workflow-5-telescopic-fare-matrix--journey-shopping-cart)
8. [Feature Workflow 6: Control Desk Operational Center](#8-feature-workflow-6-control-desk-operational-center)
9. [Feature Workflow 7: Watchlist & Saved PNR Management](#9-feature-workflow-7-watchlist--saved-pnr-management)
10. [Feature Workflow 8: RailMadad 139 Emergency Helpline Desk](#10-feature-workflow-8-railmadad-139-emergency-helpline-desk)
11. [Interactive Motion, Canvas & Physics Flows](#11-interactive-motion-canvas--physics-flows)
    - [Custom Cursor & Magnetic Follower Flow](#custom-cursor--magnetic-follower-flow)
    - [3D Perspective Card Tilt Flow](#3d-perspective-card-tilt-flow)
    - [SignalField HTML5 Canvas Particle Flow](#signalfield-html5-canvas-particle-flow)
    - [Scroll Progress & Scroll-to-Top Flow](#scroll-progress--scroll-to-top-flow)
12. [Hardware Audio & Bilingual Speech Synthesis Flow](#12-hardware-audio--bilingual-speech-synthesis-flow)
13. [Resilience & Fallback Simulation Decision Flow](#13-resilience--fallback-simulation-decision-flow)
14. [DBMS Relational Transaction & Query Pipeline](#14-dbms-relational-transaction--query-pipeline)

---

## 1. Application Boot & Initialization Flow

When a user visits RailSync, the browser executes the following boot sequence:

```mermaid
flowchart TD
    A["User requests URL (e.g., /?tab=live&train=12952)"] --> B["HTML Head parses inline Theme Script"]
    B --> C{"Check URL query or localStorage"}
    C -->|"theme === 'light'"| D["Remove .dark, Add .light to documentElement"]
    C -->|"theme === 'dark' (Default)"| E["Add .dark to documentElement"]
    D --> F["Render RootLayout (app/layout.js)"]
    E --> F
    F --> G["Mount CustomCursor (components/CustomCursor.js)"]
    F --> H["Mount ThemeProvider (components/ThemeProvider.js)"]
    H --> I["Mount AppProvider (context/AppContext.js)"]
    I --> J["Render Page Shell (app/page.js)"]
    J --> K["Hydrate URL query params (?tab, ?train)"]
    J --> L["Start SignalField Canvas Loop (components/SignalField.js)"]
    J --> M["Mount Top Scroll Progress Bar & Floating Top Button"]
```

### Step-by-Step Execution:
1. **Zero-FOUC Theme Resolution**: The inline `<script>` in `app/layout.js` executes synchronously before HTML body rendering. It inspects `?theme=` query parameters, falls back to `localStorage.getItem('railsync_theme')`, and immediately applies `.dark` or `.light` to `<html>`.
2. **Global Wrappers**: `ThemeProvider` and `AppProvider` wrap the application, initializing global toast arrays, saved train watchlists, language state, and audio chimes.
3. **SPA State Hydration**: `app/page.js` runs `useEffect` on mount to extract `tab` and `train` query parameters and set the active view accordingly.

---

## 2. SPA Navigation & URL State Synchronization Flow

RailSync functions as a client-side Single Page Application with deep-linked state synchronization.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Nav as Navbar / HomePage Button
    participant Page as app/page.js (State Orchestrator)
    participant History as window.history / URL bar
    participant View as Active Tab Component

    User->>Nav: Click Navigation Tab (e.g. "Station Board")
    Nav->>Page: handleTabChange('station-board')
    Page->>Page: setActiveTab('station-board')
    Page->>History: window.history.pushState({}, '', '/?tab=station-board')
    Page->>View: Mount <StationBoard />
    Note over User,History: Browser Back/Forward Navigation
    User->>History: Click Browser "Back" Button
    History->>Page: window fires 'popstate' event
    Page->>Page: Read new URLSearchParams(window.location.search)
    Page->>Page: setActiveTab(previousTab)
    Page->>View: Re-render corresponding view instantly
```

---

## 3. Feature Workflow 1: Live GPS Train Telemetry

Tracks 13,000+ trains with live speed, coordinates, signal aspect lamps, and intermediate halt ribbons.

```mermaid
flowchart TD
    Start["User inputs 5-digit Train # (e.g. 12952)"] --> FormCheck{"Validate /^[0-9]{5}$/"}
    FormCheck -->|Invalid| Toast["Emit Error Toast Notification"]
    FormCheck -->|Valid| SetTab["Switch activeTab to 'live' & update URL"]
    SetTab --> FetchRoute["GET /api/live?train=12952&date=today"]
    FetchRoute --> Provider["lib/railkit.js: trackTrainLive()"]
    Provider --> KeyCheck{"Valid RAILKIT_API_KEY?"}
    KeyCheck -->|Yes| LiveAPI["Fetch from RapidAPI / RailKit Live Endpoint"]
    KeyCheck -->|No / Network Failure| Simulator["Generate Realistic Corridor Simulation (Rajdhani/Vande Bharat)"]
    LiveAPI --> Parse["Parse Coordinates, Speed, Halts & Delay Minutes"]
    Simulator --> Parse
    Parse --> Response["Return JSON to LiveTracker.js"]
    Response --> Map["Update Leaflet TrackMap with Directional Locomotive Marker"]
    Response --> SignalEval{"Evaluate Delay Minutes"}
    SignalEval -->|delay <= 5m| Green["Signal: 🟢 GREEN (Line Clear)"]
    SignalEval -->|5m < delay <= 25m| Amber["Signal: 🟡 AMBER (Caution)"]
    SignalEval -->|delay > 25m| Red["Signal: 🔴 RED (Danger / Delayed)"]
    Response --> Ribbon["Render RouteRibbon station halts & current block section"]
    Response --> Rake["Render CoachLayout train rake composition"]
    Response --> Polling["Schedule automated 30s polling refresh"]
```

---

## 4. Feature Workflow 2: Train & Corridor Route Search

Dual-mode engine to find trains between any two stations or look up specific train schedules.

```mermaid
sequenceDiagram
    autonumber
    actor Passenger
    participant UI as SearchSection.js
    participant Select as StationSelect.js (Forms Suite)
    participant API as /api/search
    participant Cart as useCartStore (Zustand)

    Passenger->>Select: Type Origin (e.g., "NDLS" or "Delhi")
    Select->>Select: Fuzzy prefix filter across 7,300+ station index
    Select-->>Passenger: Render Autocomplete Dropdown with Highlighted Matches
    Passenger->>Select: Select Origin and Destination
    Passenger->>UI: Click "Search Trains"
    UI->>API: GET /api/search?from=NDLS&to=MMCT
    API-->>UI: Return list of matching trains with classes (1A, 2A, 3A, SL)
    Passenger->>UI: Click "Book / Add to Journey Cart"
    UI->>Cart: addItem({ trainNumber, name, class, fare, quota })
    Cart->>Cart: Persist to localStorage & open Cart Drawer
```

---

## 5. Feature Workflow 3: Platform Electronic Split-Flap Display Board

Emulates station platform displays with lookahead windows and public address announcements.

```mermaid
flowchart TD
    A["Select Station (e.g. NDLS) & Lookahead Window (2h / 4h / 8h)"] --> B["GET /api/station-board?station=NDLS&hours=4"]
    B --> C["Filter movements: Departures / Arrivals / All"]
    C --> D["Render LED Split-Flap Table: Train #, Name, Platform, ETA, Delay Status"]
    D --> E["Platform Coach Halting Visualizer maps rake to platform shed pillars (1 to 24)"]
    D --> F["User clicks 'Play Announcement'"]
    F --> G["lib/audio-chime.js: Synthesize 4-tone station chime (G4-C5-D5-G5)"]
    G --> H["Web Speech API: Vocalize 'यात्री कृपया ध्यान दें... / May I have your attention please...'"]
```

---

## 6. Feature Workflow 4: IRCTC PRS PNR Status & 8-Berth Cutaway Schematics

Verifies 10-digit PNR ticket numbers and provides visual compartment cutaways.

```mermaid
flowchart TD
    A["User submits 10-digit PNR (e.g. 2458910243)"] --> B{"Regex /^[0-9]{10}$/ & Modulus-11 check"}
    B -->|Invalid| Err["Show validation error message"]
    B -->|Valid| C["GET /api/pnr?pnr=2458910243"]
    C --> D["Return Booking Status: Coach (B2), Berth (27), Status (CNF), Chart Prepared"]
    D --> E["Render IRCTC Perforated Dot-Matrix Ticket Container"]
    D --> F["Pass Berth (27) to components/BerthMap.js"]
    F --> G["Compute: 27 mod 8 = 3 --> Upper Berth (UB)"]
    G --> H["Highlight Berth 27 in 8-berth compartment cutaway bay (LB, MB, UB, SL, SU)"]
    D --> I["Render PlatformCoachVisualizer: Highlight Coach B2 in train rake"]
    D --> J["User clicks 'Print Digital Boarding Pass'"]
    J --> K["Open DigitalTicketModal with monospace pass & scannable QR verification code"]
```

---

## 7. Feature Workflow 5: Telescopic Fare Matrix & Journey Shopping Cart

Dynamic distance-based fare calculation combined with Zustand cart management.

```mermaid
sequenceDiagram
    autonumber
    actor Passenger
    participant Calc as FareCalculator.js
    participant Cart as useCartStore.js (Zustand)
    participant Drawer as CartDrawer.js
    participant Storage as Browser localStorage

    Passenger->>Calc: Adjust Distance Slider (e.g. 1,384 km) & Select Class (3A)
    Calc->>Calc: Apply IRCTC Telescopic Slabs Formula
    Note over Calc: Base Rate drops after 500km & 1000km thresholds
    Calc->>Calc: Add Superfast Charge (₹45) + Tatkal Surcharge + 5% AC GST
    Calc-->>Passenger: Display Itemized Fare Breakdown (₹1,580)
    Passenger->>Calc: Click "Add to Journey Cart"
    Calc->>Cart: addItem({ id, train, class, fare, distance })
    Cart->>Storage: Serialize cart to localStorage ('railsync_cart_store')
    Cart->>Drawer: Open slide-over Cart Drawer
    Passenger->>Drawer: Enter Promo Code "STUDENT20"
    Drawer->>Cart: applyCoupon('STUDENT20')
    Cart->>Cart: Recalculate Total with 20% Concession Discount
    Passenger->>Drawer: Click "Instant Simulated Checkout"
    Drawer->>Cart: Generate Confirmed Simulated PNR & launch Boarding Pass
```

---

## 8. Feature Workflow 6: Control Desk Operational Center

Executive railway telemetry monitoring with asynchronous state modeling.

```mermaid
flowchart TD
    A["User navigates to Control Desk ('?tab=dashboard')"] --> B["useDashboardStore reads active operational state"]
    B --> C["Render Operational KPIs: 13,420 Active Rakes, 91.4% Punctuality, 24 Caution Orders"]
    C --> D["User selects Zonal Filter (e.g. 'NR' - Northern Railway)"]
    D --> E["Filter active rakes and punctuality specifically for Northern Railway"]
    C --> F["User clicks 'Force Telemetry Refresh'"]
    F --> G["Set state: status = 'loading' (spinners active)"]
    G --> H["Simulate asynchronous network polling with realistic latency"]
    H --> I["Set state: status = 'success' & update timestamp"]
    C --> J["Active Caution Orders Feed: Displays TSR (Temporary Speed Restrictions) with dismiss actions"]
```

---

## 9. Feature Workflow 7: Watchlist & Saved PNR Management

Cross-view persistence of pinned trains and ticket reservations via React Context API.

```mermaid
flowchart TD
    A["User clicks Star Icon on Train #12952 (LiveTracker / Navbar / Search)"] --> B["useApp().addToWatchlist(trainObject)"]
    B --> C["AppContext updates watchlist state array"]
    C --> D["Add Toast Notification: 'Train #12952 added to your watchlist'"]
    C --> E["Navbar Watchlist Pill badge count updates dynamically"]
    E --> F["User clicks 'Watchlist' button in Navbar"]
    F --> G["Open WatchlistDrawer slide-over"]
    G --> H["User clicks any pinned train --> Instantly launches Live GPS Tracker"]
    G --> I["User clicks saved PNR --> Instantly re-verifies reservation chart"]
```

---

## 10. Feature Workflow 8: RailMadad 139 Emergency Helpline Desk

Instant passenger safety and security intervention flow.

```mermaid
flowchart TD
    A["User clicks 'Emergency SOS' button in Navbar or Footer"] --> B["useApp().setEmergencyDrawerOpen(true)"]
    B --> C["Slide-over EmergencyDrawer opens with backdrop blur"]
    C --> D["Render Direct Emergency Hotlines:"]
    D --> E["139 — Unified 24x7 Indian Railways Passenger Helpline"]
    D --> F["182 — Railway Protection Force (RPF) Security Desk"]
    D --> G["Operation Meri Saheli — Women Passenger Safety Helpline"]
    D --> H["Medical Emergency Team onboard train"]
    D --> I["One-click Copy and Direct 'tel:' dialer triggers"]
```

---

## 11. Interactive Motion, Canvas & Physics Flows

### Custom Cursor & Magnetic Follower Flow
```mermaid
flowchart TD
    A["Pointer moves over viewport"] --> B["Check: window.matchMedia('(pointer: coarse) and (hover: none)')"]
    B -->|Touchscreen Device| C["Return null (Disable custom cursor completely)"]
    B -->|Mouse / Trackpad| D["Native OS Cursor remains fully visible and responsive"]
    D --> E["gsap.set(dotRef, { x, y }) — Instant 6px dot follow"]
    D --> F["gsap.quickTo(ringRef, { x, y }) — Smooth 32px trailing halo"]
    D --> G["Inspect e.target via target.closest()"]
    G -->|Over input or textarea| H["Shrink halo to 18px and fade to 0.35 opacity"]
    G -->|Over button or link| I["Expand halo to 48px with magnetic pull toward element center"]
    G -->|Over element with data-cursor='TEXT'| J["Morph halo into elongated pill showing contextual TEXT"]
    D --> K["User scrolls page --> onScroll fires document.elementFromPoint to sync hover state"]
```

### 3D Perspective Card Tilt Flow
```mermaid
flowchart TD
    A["Pointer hovers over FeatureCard or PremierTrainCard"] --> B["useTiltCard hook captures mousemove"]
    B --> C["Read card's getBoundingClientRect()"]
    C --> D["Normalize coordinates relative to center: relX = -0.5 to +0.5, relY = -0.5 to +0.5"]
    D --> E["Map to degrees: rotateX = -relY * 9deg, rotateY = relX * 9deg"]
    E --> F["gsap.quickTo applies rotation with transformPerspective: 1000px"]
    G["Pointer leaves card (mouseleave)"] --> H["gsap.quickTo smoothly dampens rotateX and rotateY back to 0deg"]
```

### SignalField HTML5 Canvas Particle Flow
```mermaid
flowchart TD
    A["Canvas mounts in app/page.js"] --> B["Initialize 40 particles with gentle random velocities"]
    B --> C["Register render loop with gsap.ticker.add(render)"]
    C --> D["For each particle: update position (x += vx, y += vy)"]
    D --> E["Bounce off canvas viewport bounds"]
    D --> F["If pointer within 165px --> Apply magnetic attraction force toward cursor"]
    D --> G["Draw yellow node with shadow blur"]
    D --> H["Calculate distances between all particle pairs"]
    H -->|Distance < 130px| I["Draw glowing yellow connecting line with dynamic alpha"]
    J["User switches browser tab"] --> K["document.visibilitychange fires"]
    K -->|document.hidden| L["gsap.ticker.remove(render) — Suspend drawing to save CPU & battery"]
    K -->|Tab active| M["gsap.ticker.add(render) — Resume rendering seamlessly"]
```

### Scroll Progress & Scroll-to-Top Flow
```mermaid
flowchart TD
    A["User scrolls window"] --> B["Passive scroll event fires in ScrollFeatures.js"]
    B --> C["Calculate scroll progress: scrollY / (scrollHeight - clientHeight) * 100"]
    C --> D["Update top railway progress bar width (0% to 100%)"]
    C --> E{"Is scrollY > 250px?"}
    E -->|Yes| F["Fade in floating 'TOP' signal button at bottom-right"]
    E -->|No| G["Hide floating button"]
    F --> H["User clicks floating button --> window.scrollTo({ top: 0, behavior: 'smooth' })"]
```

---

## 12. Hardware Audio & Bilingual Speech Synthesis Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Button as UI Audio Trigger
    participant Audio as lib/audio-chime.js (Web Audio)
    participant Speech as Web Speech API (window.speechSynthesis)

    User->>Button: Click "Play Announcement Chime"
    Button->>Audio: playRailwayChime()
    Audio->>Audio: Check AudioContext state; resume if suspended
    Audio->>Audio: Oscillator 1: Tone G4 (392.00 Hz) at t = 0.00s
    Audio->>Audio: Oscillator 2: Tone C5 (523.25 Hz) at t = 0.35s
    Audio->>Audio: Oscillator 3: Tone D5 (587.33 Hz) at t = 0.70s
    Audio->>Audio: Oscillator 4: Tone G5 (783.99 Hz) at t = 1.05s with bell decay
    Note over Audio: Zero external MP3 files downloaded
    Button->>Speech: triggerTrainAnnouncement("12952", "New Delhi", "1")
    Speech->>Speech: Initialize SpeechSynthesisUtterance
    Speech->>Speech: Set voice to Hindi ('hi-IN') or English ('en-IN')
    Speech-->>User: Broadcast acoustic voice through speaker
```

---

## 13. Resilience & Fallback Simulation Decision Flow

```mermaid
flowchart TD
    A["Incoming API Request (/api/live, /api/pnr, /api/search)"] --> B["lib/railkit.js inspects active API key"]
    B --> C{"Is RAILKIT_API_KEY set and valid?"}
    C -->|Yes| D["Attempt HTTPS fetch to RapidAPI / RailKit upstream endpoint"]
    D --> E{"Did network respond with 200 OK?"}
    E -->|Yes| F["Return live railway telemetry data"]
    E -->|No / Timeout / Rate Limit| G["Circuit Breaker trips: Log warning and switch to Tier 2"]
    C -->|No / Blank Key| G
    G --> H["Activate Internal Realistic Simulation Engine"]
    H --> I["Match train number against flagship corridors (Rajdhani 12952, Vande Bharat 22436, Shatabdi 12002)"]
    I --> J["Generate authentic route polylines, GPS coordinates, delay aspect, and coach layouts"]
    J --> K["Return simulated JSON payload (100% Uptime Guarantee)"]
```

---

## 14. DBMS Relational Transaction & Query Pipeline

How the relational schema in [`db/schema.sql`](file:///Users/akshit/Desktop/coding/fee%20and%20dbms%20project/db/schema.sql) coordinates data across 3NF tables:

```mermaid
sequenceDiagram
    autonumber
    participant App as RailSync Engine
    participant Stations as stations (Table)
    participant Trains as trains (Table)
    participant Halts as train_schedules (Table)
    participant Bookings as bookings (Table)
    participant Passengers as passengers (Table)

    App->>Stations: SELECT * FROM stations WHERE station_code IN ('NDLS', 'MMCT')
    App->>Trains: SELECT * FROM trains WHERE train_number = '12952'
    App->>Halts: SELECT * FROM train_schedules WHERE train_number = '12952' ORDER BY stop_number ASC
    Note over App,Halts: Resolves full permanent way route corridor
    App->>Bookings: INSERT INTO bookings (pnr_number, train_number, from_station, to_station, fare)
    App->>Passengers: INSERT INTO passengers (pnr_number, name, coach, berth, status)
    Note over Bookings,Passengers: Foreign Key constraint enforces referential integrity
```
