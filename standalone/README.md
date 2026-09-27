# Ontologie: standalone demo

A self-contained build of the Ontologie screens (from the Stitch project "Ontologie Workforce Skills Navigator," design system `docs/DESIGN.md`).

- **No backend, no network calls, no Taruvi.** It runs on the illustrative Northeast Ohio sample in `../src/ontology/seed.ts`. A visitor's intake answers stay in their own browser (localStorage).
- It shares the pure ontology modules (`engine`, `seed`, `types`, `tokens`) with the Taruvi app in the repo root, so the match logic is identical.

```bash
cd standalone
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (any static host; SPA fallback to index.html)
```

| Route | Screen |
|---|---|
| `/` | My Map: You → Gap → Roles, fastest path |
| `/intake` | 3-step intake: resume → confirm skills → pick targets |
| `/explore` | Ontology lens (graph ↔ table), centered on a role or skill |
| `/roles`, `/roles/:id` | Ranked roles; role detail with Skills / Programs / Explore tabs |
| `/navigator` | Cohort KPIs, top gaps, readiness by role, skills × roles gap matrix |
