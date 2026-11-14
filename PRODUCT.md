# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Rail passengers, railfans, and railway operations users. The project is intended to give each group access to train, station, route, reservation, and network information.

## Product Purpose

RailSync is a railway information and demonstration app for exploring Indian train services. It includes train search and running status, station boards, PNR lookup, fare estimates, and an operations dashboard. When no RailKit API key is configured, the app serves built-in simulated train data.

## Positioning

The project brings passenger lookup flows and a rail operations dashboard together in one interface. Its current data source may be a simulator; it must not imply live accuracy when it is not using a live provider.

## Operating Context

The app runs in a browser as a Next.js project. Users move between tools through in-app navigation and can share selected train views through URL query parameters.

## Capabilities and Constraints

- Built with Next.js 14, React 18, Tailwind CSS, and JavaScript.
- Provides train search, running status, station boards, PNR status, fare estimation, a control dashboard, saved items, and a booking-flow demonstration.
- Uses the RailKit SDK when an API key is configured and built-in sample/simulated data otherwise.
- `db/schema.sql` describes a relational database model, while the current application uses in-memory sample data; no database driver or connection is configured.
- Do not present simulated values, booking results, or operational metrics as verified live railway information.

## Brand Commitments

The product name is RailSync.

## Evidence on Hand

- Built-in sample train and station data in `lib/railkit.js` and `lib/stations-data.js`.
- A relational schema for stations, trains, schedules, bookings, passengers, and reviews in `db/schema.sql`.
- No verified live performance metrics, real booking integration, or production database connection is present in the repository.

## Product Principles

- Make the source and freshness of railway data clear.
- Put common passenger lookup tasks within easy reach.
- Keep route, station, reservation, and operations tools available without making them appear more connected than they are.
- Treat sample booking and operational data as demonstrations.
