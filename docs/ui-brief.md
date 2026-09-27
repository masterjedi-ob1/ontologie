# Ontologie: UI Design Brief (v0, CLE Tech Week Buildathon)

**App:** `ontologie` on `cletechweekteam4.taruvibase.cloud`
**Stack (fixed by platform):** Taruvi `taruvi-refine-vite` template. Refine v5, MUI v7, TaruviBase, and `@taruvi/refine-providers`.
**Status:** Draft. I wrote this from the Taruvi template's rules without seeing the team's live schema. Check the entity names against the real datatables before building on them.

---

## 1. The one-line product

> Show someone entering the workforce **where they stand, what's between them and a real job, and the shortest path across the gap**, using a skills ontology instead of a job board.

The ontology is the engine. **Don't make people learn it to use the app.**

## 2. Core design call: path first, graph second

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **A. Graph-first** (force-directed node map as the home screen) | Demo "wow," shows the ontology directly | Hard to read past about 30 nodes, weak on mobile, bad for accessibility, users get lost | ❌ Not the default |
| **B. Path-first** (Talent → Gap → Program → Role, left to right) | Readable in 5 seconds, gives an action, fits the list/show patterns Taruvi already has | Less visual flash | ✅ **Default view** |
| **C. Hybrid** | Path view is primary. An "Explore the map" tab shows a local graph (1 to 2 hops) around the selected node | One extra dependency | ✅ **Ship this** |

The graph is a **lens**, not the landing page. Every graph view needs a table or list alternative (required by Taruvi UI Guidelines: charts need a data-table alternative, and color can't carry meaning alone).

## 3. Personas → surfaces

| Persona | Job to be done | Primary surface |
|---|---|---|
| **Talent** (student, career-changer, returning worker) | "What am I qualified for, and what's the next step?" | My Map (path view) |
| **Navigator** (workforce coach, case manager) | "Where are my people stuck, and what programs close the gap?" | Cohort list + gap heatmap |
| **Employer / Program** | "Who's close to ready for this role?" | Role show page → "Near-ready talent" tab |

**Hackathon scope:** build the Talent flow end to end. Show Navigator as one dashboard. Leave Employer as a tab stub.

## 4. Data model (ontology → Taruvi datatables)

Nodes:
- `skills`: name, category (technical / durable / credential), optional external code (O*NET / Lightcast)
- `roles`: title, SOC code, median wage (NEO region), openings, entry education
- `programs`: provider, duration, cost, modality, location (CSU, Tri-C, etc.)
- `talent_profiles`: links to the built-in Taruvi user (**never create a custom users table**; the platform forbids it)

Edges, each stored as its own datatable so Refine can list and filter them:
- `talent_skills`: talent → skill, `level` 1–4, `evidence` (self / resume / verified)
- `role_skills`: role → skill, `importance` (core / preferred)
- `program_skills`: program → skill (what it teaches)
- `skill_relations`: skill → skill, `type` (prerequisite / adjacent)

**Gap = `role_skills` − `talent_skills`.** Compute it server-side (Taruvi function or analytics query). The browser shouldn't do the join.

## 5. Screens (demo order)

1. **Intake:** a multi-step form, not one long scroll (guidelines). Step 1: upload a resume or paste text. Step 2: confirm the extracted skills as chips the user can remove or add. Step 3: pick 1 to 3 target interests.
2. **My Map (hero screen):**
   - Left: *You*, a list of skill chips with evidence badges
   - Middle: *Gap*, the missing skills for the selected role, marked core vs preferred
   - Right: *Roles*, cards ranked by match % showing wage and openings
   - Click a gap skill to see the programs that teach it, with cost and time
3. **Role detail (show page):** breadcrumb, title plus match chip, tabs `Skills (n)` · `Programs (n)` · `Explore map`
4. **Explore map:** a local graph 1 to 2 hops from the focused node, with a toggle to switch to a table view
5. **Navigator dashboard:** KPI cards (talent count, median match %, top 5 gap skills across the cohort) and a skills × roles heatmap

## 6. Visual language (inside Taruvi's theme; don't restyle)

- Use `taruviTokens` from `themeOptions.ts`. **No hardcoded hex, no `sx` restyling.** The theme owns type, radius, and spacing.
- Match strength uses **status chips** (`success` / `info` / `warning`) that **always carry text** ("READY", "CLOSE", "STRETCH").
- Skill categories use **tag chips** (`tagBlue`, `tagPurple`…). Hash the category name to a variant so colors stay stable.
- Icons: only the `@mui/icons-material` `*Rounded` variants. Don't use lucide or any other icon package (hard rule).
- Graph node color follows the skill category tag palette. Node shape carries the second channel: circle = skill, rounded rect = role, diamond = program.
- Grid: `import { Grid } from "@mui/material"` with `size={{ xs: 12, md: 4 }}`. There is no `Grid2`.

## 7. Graph library recommendation

The template doesn't include a graph library. Pick **one**:

| Lib | Why | Risk |
|---|---|---|
| **@xyflow/react (React Flow)** ✅ | Deterministic layouts (use it with `dagre` for left-to-right paths), React-native, keyboard focusable, looks great for a path view | ~100 KB |
| cytoscape.js | Strongest ontology/graph semantics | Heavy imperative API, fights React |
| react-force-graph | Instant "wow" | Force layouts are unreadable and unpredictable for demos |

**Recommendation:** React Flow plus dagre with a `LR` layout. The same component renders the path view and the explore map.

## 8. List/show pages the template requires

The platform's AI agent enforces these, so design with them in mind:
- Every list page uses `ListPageShell` with search, at least one server-side filter, active-filter chips, pagination, and **4 empty states**
- Every show page has a breadcrumb, H1, status chip, actions, a meta line, and `Tab (count)`
- Destructive actions go through a confirmation dialog. Filter state lives in Refine `filters[]` with `syncWithLocation`

## 9. Demo script (3 minutes)

1. "Meet Jordan, a 22-year-old with retail and a Google IT cert." → Intake (30 seconds)
2. My Map: IT Support Specialist is 72% READY, with a 3-skill gap (45 seconds)
3. Click "Networking fundamentals" → Tri-C 8-week program, $0 with a grant (30 seconds)
4. Explore map: shows the adjacent path to Cybersecurity Analyst (30 seconds)
5. Navigator view: "Across 40 talent, the #1 gap in NEO is ___." Close on the data (45 seconds)

## 10. Open questions for the team

1. What's the ontology source: O*NET, Lightcast Open Skills, or hand-built? This decides the skill ID strategy.
2. Resume → skills extraction: is it a Taruvi function calling an LLM, or manual chips for the demo?
3. Who is the judge persona: workforce boards (lead with Navigator) or talent (lead with My Map)?
4. Do we need auth for the demo, or a public read-only demo profile?
