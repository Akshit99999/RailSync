---
version: 1
slug: "app-page-js"
primary_target: "app/page.js"
related_targets: ["app/globals.css","components/HomePage.js","components/Navbar.js"]
---

## Surface contract

SCOPE: RailSync's main web application shell and home screen. Mode: Operate.
AUDIENCE AND JOB: Passengers, railfans, and operations users need quick access to train status, route search, PNR lookup, station boards, fare estimates, and the control desk. The main page prioritizes train lookup while exposing the other jobs as clear, standard navigation.
PROOF AND CONTENT: Use the existing train and station fixtures. Clearly identify simulator output as sample data; use provider status only where the app can verify it. Do not present synthetic punctuality totals, booking outcomes, or coverage claims as facts.
CONSTRAINTS: Preserve all existing workflows, URLs, API calls, saved items, drawers, theme and audio controls. Mobile and desktop web. The product is a demo and has no connected relational database in this repo.

## Direction contract

THESIS: A timetable is an instrument for finding one service among many. Frosted glass gives navigation and task panels depth; crisp timetable rows keep train information easy to scan.
OWN-WORLD: Glass timetable, translated into a usable web app: translucent paper surfaces, deep railway-blue glass navigation, saffron for the selected route, and signal colors only for actual status. Clear sans-serif labels with tabular figures for times and train numbers. Blur is reserved for the navigation and key task surfaces; real rows stay sharp and rule-organized. Motion is brief and functional, with a station-by-station route reveal and restrained control feedback. No neon, generic bento cards, or ambient motion.
STORY: Arrive, choose a familiar task, enter a train number or stations, then read the route or status in an ordered timetable. PNR, station board, fares, and control desk remain one step away. Data source is visible wherever sample or live results appear.
FIRST VIEWPORT: One compact header holds the wordmark, direct navigation, data-source status, and saved/cart access. Below it, a clear page title and train-number lookup sit beside a route/status work area using real app fixtures, visibly marked as demonstration data. Search-by-stations and PNR are adjacent secondary actions. The timetable's column rhythm and route progression are the signature move; the layout remains a standard application shell.
FORM: Candidate 7 of the grounded direction list, with the user's pinned editorial rail timetable direction honored over the assignment where they differ. seed:4b145587e8996431.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
