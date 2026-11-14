---
name: RailSync
description: A clear, paper-grounded railway timetable for finding and following Indian train services.
colors:
  railway-blue: "#203b53"
  railway-blue-dark: "#203b53"
  canvas-paper: "#f3f1eb"
  canvas-night: "#172331"
  surface-paper: "#fffefa"
  surface-night: "#202e3d"
  surface-raised-night: "#2a3948"
  ink-primary: "#1d2935"
  ink-muted: "#4e5964"
  ink-dim: "#68727b"
  ink-primary-night: "#f3f2ed"
  ink-muted-night: "#c2c7ca"
  rule-paper: "#d8d5cc"
  rule-night: "#40505e"
  route-saffron: "#eab638"
  route-saffron-night: "#f1c45b"
  provider-green: "#10b981"
  signal-amber: "#f59e0b"
  signal-red: "#ef4444"
  glass-paper: "rgba(255, 254, 250, 0.58)"
  glass-night: "rgba(31, 47, 62, 0.64)"
  glass-edge: "rgba(255, 255, 255, 0.82)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(34px, 4vw, 46px)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 650
    lineHeight: 1.4
  body:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  action:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1
  nav:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 550
    lineHeight: 1.2
  label:
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
  timetable:
    fontFamily: "ui-monospace, 'SFMono-Regular', Consolas, monospace"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  xs: "4px"
  sm: "6px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "#e8b54a"
    textColor: "#1e2d39"
    typography: "{typography.action}"
    padding: "0 15px"
    height: "54px"
  button-secondary:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  input-lookup:
    backgroundColor: "{colors.surface-paper}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.timetable}"
    padding: "0 14px"
    height: "54px"
  navigation-link:
    backgroundColor: "transparent"
    textColor: "#d4dce1"
    typography: "{typography.nav}"
    height: "68px"
---

# Design System: RailSync

## Overview

**Creative North Star: "The Glass Timetable"**

RailSync treats the timetable as an instrument for finding one service among many, set inside a layered glass interface. A deep railway-blue glass navigation bar and softly frosted work surfaces add depth while warm paper and fine rules keep the routes readable. The central route is read as a sequence of stations, codes, and times; tabular numerals make the information line up at a glance.

The selected route receives a restrained saffron highlight, while green, amber, and red are reserved for actual provider or railway status. The light and night themes keep the same hierarchy and route order across translucent paper and blue-grey glass. Blur is reserved for navigation, the primary work surface, and task panels; route rows stay crisp. Data-source labels remain close to railway results so sample information cannot be mistaken for verified live updates.

**Key Characteristics:**
- Timetable order and thin rules carry structure.
- Frosted paper glass, railway blue, and route saffron anchor the palette.
- Station codes, train numbers, and times use tabular monospaced figures.
- Sample and illustrative results are labeled at the point of use.

## Colors

The palette pairs warm off-white paper and muted railway blue with one saffron route accent; the night theme shifts surfaces to blue-grey while retaining the same roles.

### Primary
- **Railway Blue**: the wordmark shell, page headings, navigation emphasis, and key actions use a dark, legible blue. The header remains a continuous blue band in both themes.
- **Route Saffron**: the selected route, origin and destination markers, and the principal lookup action use saffron. It draws attention to the journey without becoming a general decoration color.

### Secondary
- **Provider Green**: the configured-provider indicator communicates data-source state.
- **Signal Amber**: use for an actual caution or delayed aspect.
- **Signal Red**: use for an actual stop, error, or critical status.

### Neutral
- **Canvas Paper**: the light theme's warm page ground keeps the interface softer than stark white.
- **Surface Paper**: inputs and raised paper surfaces sit slightly brighter than the page ground.
- **Ink Primary**: titles and essential row values use the darkest readable ink.
- **Ink Muted**: descriptions and supporting details remain clearly secondary.
- **Rule Paper**: thin separators organize lists and timetable rows.
- **Canvas Night / Surface Night**: blue-grey backgrounds provide the night theme's layered ground and working surfaces.
- **Ink Primary Night / Ink Muted Night**: light text supports clear hierarchy on dark surfaces.
- **Rule Night**: restrained blue-grey rules preserve row structure without harsh contrast.

### Named Rules
**The Signal Means Something Rule.** Green, amber, and red indicate a real status or provider state; never use them as decorative accents.

**The Source Stays Visible Rule.** Keep sample, illustrative, or provider-source labeling next to the railway information it qualifies.

## Typography

**Display Font:** Inter (with ui-sans-serif, system-ui, and sans-serif fallbacks)

**Body Font:** Inter (with ui-sans-serif, system-ui, and sans-serif fallbacks)

**Label/Mono Font:** ui-monospace (with SFMono-Regular and Consolas fallbacks)

**Character:** The sans-serif is direct and compact, keeping navigation and explanatory copy easy to scan. Monospaced, tabular figures lend train identifiers and times the dependable alignment of a departure board.

### Hierarchy
- **Display** (700, clamp from 34px to 46px, 1.03 line-height): the main page heading establishes the task quickly.
- **Headline** (700, 21px desktop and 19px mobile, 1.2 line-height): route-board and section headings.
- **Title** (650–700, 13–15px, 1.4 line-height): row names, controls, and navigation labels.
- **Body** (400, 15px desktop and 14px mobile, 1.55 line-height): task descriptions and explanatory copy; keep short supporting sentences around 42ch where possible.
- **Label** (600–750, 10–13px, compact line-height): section labels, source badges, and captions; uppercase is reserved for the small illustrative stamp.
- **Timetable** (600–700, 11–17px, tabular figures): train numbers, station codes, and times use the mono stack so columns remain aligned.

### Named Rules
**The Number Alignment Rule.** Use tabular monospaced figures for train numbers, station codes, and times; preserve their alignment as the viewport narrows.

## Layout

The app uses a centered application shell capped at 1440px, with the home workspace capped at 1160px. On desktop, the first working area divides into a train lookup and a route timetable, with a flexible gap; the header holds the wordmark, direct navigation, source state, and utility actions. Sample trains and tools continue below as rule-separated rows rather than a card grid.

At widths below 1120px, navigation moves into a compact menu. Below 760px, the introduction and primary work area stack, route timetable follows the lookup, tool rows become one column, and header controls tighten. Keep the station code, station name, and time readable in each route row. The spacing rhythm is built from compact 8px increments, with larger 24–34px section intervals.

## Elevation & Depth

The surface system pairs frosted panels with crisp, rule-led timetable rows. Blur is used on the navigation, primary work area, and functional tool panels; ordinary rows remain sharp. Thin highlights and low shadows make glass edges legible without neon or glow. Reserve stronger depth for drawers and dialogs. Motion is brief and functional: the route line draws once and stop rows arrive in sequence; hover feedback gives controls a small, clear response. Reduced-motion preferences remove entrance animation.

### Named Rules
**The Clear Glass Rule.** Apply translucency to navigation and meaningful work surfaces. Keep data rows opaque enough to read cleanly and do not blur every element.

**The Route Progress Rule.** Use motion to clarify route order or confirm an action. Keep entrance movement small, run it once, and honor reduced-motion settings.

## Shapes

The interface uses mostly square corners with a small, practical radius on controls (4–6px). Route stops stay circular because they mark stations along a line; status dots and compact count badges are also round. Thin solid rules are the default edge treatment. The illustrative route stamp uses a square keyline, while dashed ticket-paper edges belong to reservation-specific views.

## Components

### Buttons
- **Shape:** restrained corners (4–6px); header controls use the tighter 4px radius.
- **Primary:** the train-status lookup action uses saffron fill with dark blue-grey text, bold sans-serif type, and a 54px desktop control height (50px on narrow screens).
- **Hover / Focus:** the lookup action warms slightly on hover; keyboard focus uses the shared 3px saffron outline with 3px offset.
- **Secondary / Ghost:** bordered surface buttons support secondary controls; text actions use railway-blue text and an arrow with no filled container.

### Cards / Containers
- **Corner Style:** the main home route and train lists are square-edged and flat; compact signboards use a 4px radius.
- **Background:** navigation and primary task panels use tinted translucent surfaces; route and list content retain clear grounds.
- **Shadow Strategy:** soft elevation and a fine inner highlight define glass panels; stronger elevation is reserved for overlays.
- **Border:** translucent edge highlights define glass; thin neutral rules separate content and route columns.
- **Internal Padding:** rows use about 10–14px vertical padding; primary workspace uses 24–34px section padding.

### Inputs / Fields
- **Style:** the train number field is a bright surface inside a 1px outline, with mono numerals and 14px horizontal padding.
- **Focus:** focus within shifts the outline to railway blue and adds a subtle 2px blue halo; the global keyboard focus outline remains visible.
- **Error / Disabled:** errors use a clear red text treatment; keep validation copy directly below its field.

### Navigation
- **Style:** the desktop header is a deep blue band with compact labels and utility controls. The current section is marked by a saffron bottom rule; inactive links use softened light text. Below 1120px, links move into a dark header panel and the current item receives a restrained tonal fill.

### Route Timetable
The route is a four-column reading pattern: station marker, code, name, and right-aligned time. A thin vertical line connects the stops; saffron marks the endpoints and muted steel marks intermediate stops. Keep the “Illustrative” stamp and non-live note visible with sample routes.

### Sample Train Row
Train number leads, service name and endpoint pair follow, and a small arrow signals navigation. Thin horizontal rules separate the rows; hover only adds a faint ground tint and a short arrow shift.

## Do's and Don'ts

### Do:
- **Do** use frosted paper glass and a deep railway-blue shell for the light theme, with blue-grey glass surfaces for dark mode.
- **Do** use saffron to point to the selected route or the primary lookup action.
- **Do** keep timetable values aligned in the mono stack and let thin rules establish row rhythm.
- **Do** keep the source and sample-data qualification close to the information it describes.
- **Do** retain visible keyboard focus and readable mobile route columns.

### Don't:
- **Don't** present simulated data as a verified live update or a confirmed booking result.
- **Don't** use status colors as decoration or add glow effects to the timetable's signal marks.
- **Don't** turn the home workspace into a generic bento-card dashboard or add decorative gradients and paper textures.
- **Don't** blur every surface or place text directly over busy, low-contrast backgrounds.
- **Don't** use neon glow or animated lift on ordinary route and list content.
