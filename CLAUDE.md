# Good/Bad Calendar

## Project Overview
A simple Next.js web app for daily habit tracking. Users toggle categories as "yes" or "no"
each day. History is displayed in a scrollable calendar grid. Keep it simple — no over-engineering.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: JSON files via an abstracted DAL (swappable for a relational DB later)

## Architecture

### Data Access Layer (DAL)
All data reads/writes go through a DAL interface — never touch the file system directly
from a component or API route. This is the seam for a future DB swap.

- Interface types: `src/lib/dal/types.ts`
- JSON file implementation: `src/lib/dal/json/`
- Single import point: `src/lib/dal/index.ts`

### Data Files (JSON storage)
Located at project root under `data/`:
- `data/categories.json` — ordered list of category names
- `data/days/YYYY-MM-DD.json` — one file per day that has any recorded values

### Core Types
```typescript
type CategoryName = string; // e.g. "Diet"

type DayEntry = {
  date: string;                              // ISO date: "YYYY-MM-DD"
  values: Record<CategoryName, boolean | null>; // null = not yet recorded
};
```

## Categories
Default list stored in `data/categories.json` (order matters for display):
God, Diet, Exercise, Code, Social, Drinking

## UI Specification

### Category Control (inside a day card)
Three states — determined by the recorded value:

| State       | Background | Left      | Center        | Right     |
|-------------|-----------|-----------|---------------|-----------|
| Unrecorded  | Grey      | "No" btn  | Category name | "Yes" btn |
| Recorded Yes| Green     | —         | Category name | —         |
| Recorded No | Red       | —         | Category name | —         |

- Once recorded, the control is locked (no edits).

### Day Card
- Fixed width (`w-32` / 128px) — never grows or shrinks
- Date header at top
- Category controls stacked vertically below

### Calendar Grid
- Always exactly 2 calendar weeks (14 days, 2 rows of 7)
- Each row has a **week label** on the left edge showing the Sunday date (e.g., "Jun 8")
- Rows ordered oldest (top) → newest (bottom); current day always in bottom row
- **Which 2 weeks to show**: the calendar weeks containing active days (today + prior 5).
  If all active days fall within a single week, also show the prior week.
- **Active window**: current day + prior 5 days (6 editable days total)

### Active vs. Inactive Cards
- **Active** (current day + prior 5): full opacity, buttons functional
- **Inactive** (all other cards in the 2-week view): same colored category backgrounds,
  opacity overlay applied to the entire card — buttons rendered but non-interactive (pointer-events disabled)

## Mobile
Desktop-first. The calendar grid has a fixed card width and the grid container scrolls
horizontally (`overflow-x: auto`) on narrow screens. No responsive layout changes.

## Development Rules
- Simple is the goal — no complex state management, no unnecessary abstractions
- Next.js API routes handle all data operations (components never touch the DAL directly)
- Async/await everywhere; never `.Result` or `.Wait()`
- Strongly typed — no `any`, `object`, or `dynamic`
- No hardcoded file paths — use a single config constant
- No authentication required
