# MASS TV board (mass-tv-board repo)

Member board for the 84" TV at the back of MASS Strength. Runs full screen
on a Fire Stick (Fully Kiosk Browser), served by GitHub Pages from
github.com/KTKB2026/mass-tv-board. Live: https://ktkb2026.github.io/mass-tv-board/

Files: `index.html` (the whole board), `sw.js` (offline cache),
`assets/` (logo, Sebastien Slab font, vendored qrcode-generator 1.4.4),
`sample-data/` (fake CSVs for local testing only).

## Data
Kyle edits a Google Sheet called "MASS TV". Each tab is published to the web
as CSV, and the links live in the `SHEET_CSV` block at the top of the
script in `index.html`. The board pulls every 5 minutes and keeps the last
good copy in localStorage, so a Wi-Fi drop never blanks the screen.

Tabs and columns (headers are matched loosely, so "Athlete" works for
"Name", etc.; see `FIELDS` in the script):
- Events: Name, Date, End date, Location, MASS hosted, Athletes, Start show, End show
- Hours: Day, Open, Close, Note. Day is a weekday ("Monday", "Mon-Fri",
  "Weekends") for normal hours, or a date for a holiday or changed day.
  Open = CLOSED for a closed day.
- PRs: Date, Name, Lift, Weight, Unit, Type (Gym / Comp), Meet, Show
- Standouts: Name, Line, Start show, End show
- Announcements: Text, Start show, End show
- Ads: Business, Image link, Start, End, Active
- Settings (two columns, Setting / Value): Mode (normal / meet), Meet URL,
  Slide seconds, Ad seconds, Ad every, PR days, Event days, Promo link,
  Promo line

Rows starting with EXAMPLE are skipped. Rows past their end date drop off;
rows with a future start date wait.

## Test switches (URL params)
- `?sample` loads `sample-data/*.csv` instead of the sheet
- `?now=2026-11-25T10:00` fakes the clock (holidays, after-hours, expiry)
- `?mode=meet&meet=<url>` forces meet mode

## Rules
- Public repo. Names show as first name + last initial (the board shortens
  them). No contact info, no full names in sample data. Sample data is fake
  and only loads with `?sample`.
- Never invent gym hours, dates, prices, or member numbers. Real data comes
  from Kyle's sheet.
- House promo copy follows the offer rule: the only free thing is the
  blueprint session. Never free training or trials.
- Keep JS and CSS conservative: the Fire Stick WebView can be old. No
  optional chaining, no `??`, no flexbox `gap`, no `clamp()`, no `inset`.
  The stage is a fixed 1920x1080 canvas scaled to the screen.
- Keep content inside 72px side / 56px top padding: older TVs crop edges.

## Workflow (same as Meet Day)
- main is live; Pages serves it. Never build on main.
- Feature branch per version (v1-board, v2-..., fix-...), verify, merge, tag, push tags.
  Branch names must never match a tag name (tag v1, branch v1-board), or pushes fail.
- Bump `CACHE` in `sw.js` on every deploy.
- Pages sometimes skips a build: `gh api --method POST repos/KTKB2026/mass-tv-board/pages/builds`.
  Verify live with a cache-busted curl (`?nocache=`); the CDN caches ~10 min.

Global rules: `~/.claude/CLAUDE.md`.
