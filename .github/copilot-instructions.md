<!--
  Guidance for AI coding agents working on this repo.
  Keep this file concise: focus on patterns, conventions, and exact files to touch.
-->

# Brief guide for AI coding agents

1) Project overview (big picture)
- This repository is a static course web app built with plain HTML, CSS and vanilla JavaScript.
- Data APIs are implemented as static JSON files under `src/*/api/*.json` and lightweight PHP endpoints `src/*/api/index.php` that read/modify those JSON files.
- UI pages and their scripts are colocated: each feature folder (e.g. `src/assignments/`, `src/discussion/`, `src/resources/`, `src/weekly/`) contains `list.html`/`details.html`/`admin.html` and matching `*.js` files.

2) File & naming conventions to follow
- UI pair: `x.html` <-> `x.js`. Example: `src/assignments/details.html` and `src/assignments/details.js`.
- Local API files: `src/<feature>/api/<resource>.json` (authoritative data) and `src/<feature>/api/index.php` (server-like endpoint).
- Admin pages follow the same pattern, e.g. `src/assignments/admin.html` and `src/assignments/admin.js`.

3) Typical data flow & edit guidance
- Frontend scripts fetch data with relative paths (e.g. `fetch('../api/assignments.json')`). Update the JSON file in `src/.../api/` when changing test data.
- Some endpoints are implemented in PHP. If you change an API shape, update both the JSON fixtures and the corresponding PHP logic in `src/*/api/index.php`.
- Example: `src/assignments/details.js` expects an `id` query param and fetches `assignments.json` and `comments.json` to render the page. If you add a new field to assignment objects, update `assignments.json` and all renderers that access that field.

4) Build / run / debug (how maintainers run the app locally)
- There is no build system — the app is static. Quick ways to run locally:
  - Static-only (no PHP): from the repo root run `python3 -m http.server 8000` and open `http://localhost:8000/index.html`.
  - If you need PHP endpoints to work, run PHP's built-in server from the repo root: `php -S localhost:8000` and open `http://localhost:8000/index.html`.
  - Windows helper scripts exist: `start-server.bat` and `start-server.ps1` (do not modify without checking intent).

5) Important coding patterns & small examples
- DOM + fetch pattern: scripts use `defer` and query DOM nodes by IDs. See `src/assignments/details.js` for the common pattern: get `id` from `URLSearchParams`, `fetch` assignments and comments, then render.
- IDs expected by `details.js` (example): `assignment-title`, `assignment-due-date`, `assignment-description`, `assignment-files-list`, `comment-list`, `comment-form`, `new-comment-text`. Preserve these when editing HTML.
- Comments and additions are stored in memory by some pages (front-end only). To persist, the PHP endpoints under `src/*/api/index.php` should be updated accordingly.

6) Safety & non-goals
- Do not invent or call external services. Keep changes local to the repo unless the change expressly requires an external dependency and you document why.
- Avoid large refactors that change API shapes across many files unless the change includes:
  - updated `src/*/api/*.json` fixtures,
  - updated `src/*/api/index.php` where applicable,
  - updated renderers (`*.js`) and example pages (`*.html`).

7) Where to look first (quick map)
- Root landing: `index.html` and `src/common/styles.css`.
- Feature folders: `src/assignments/`, `src/discussion/`, `src/resources/`, `src/weekly/`, `src/auth/`, `src/admin/`.
- API fixtures & endpoints: `src/*/api/*.json`, `src/*/api/index.php`.

8) When you create or change UI elements
- Update the corresponding `.js` render function and ensure the HTML contains the expected IDs used by the script (see `details.js` header comments for required IDs).

If anything here is unclear or you'd like more examples (e.g., the exact fetch paths used by a given page), tell me which feature to expand and I will update this file.
