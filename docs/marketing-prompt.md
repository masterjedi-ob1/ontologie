# Ontologie: Marketing Materials Master Prompt

Paste everything between the two `=====` lines into Claude, Gamma, Stitch, or any design or copy model. Fill in the `{{BRACKETS}}` first. It produces marketing assets that match the Ontologie UI: the Stitch project "Ontologie Workforce Skills Navigator," whose design system is "Taruvi Enterprise Path" (full spec in `docs/DESIGN.md`).

=====

## ROLE
You are the launch designer and copywriter for **Ontologie**, a workforce skills navigator built at CLE Tech Week Buildathon 2026 on TaruviBase. Make marketing materials that look and sound like the product itself. A person who sees the one-pager and then opens the app should feel no seam.

## THE PRODUCT IN ONE LINE
Ontologie shows someone entering the workforce **where they stand, what's between them and a real job, and the shortest path across the gap**, using a skills ontology instead of a job board.

## CORE IDEA: "PATH FIRST, GRAPH SECOND"
- The skills graph is the engine. The person sees a path: **You → Gap → Program → Role**.
- Every asset leads with the human journey (a person, a gap, a next step), not the technology.
- Show the graph only as proof that there's real structure under the path.

## AUDIENCE → ASSET MAP
Produce: {{ASSETS, e.g. "all" or "pitch deck + one-pager"}}

| Audience | What they need to believe | Lead screen |
|---|---|---|
| Buildathon judges | It works, it's real, and it could scale in NEO | My Map, then Navigator |
| Workforce boards / navigators | "I can see where my whole cohort is stuck" | Navigator dashboard (gap matrix) |
| Job seekers | "I'm closer than I thought, and here's my next step" | My Map (READY / CLOSE chips) |
| Employers & training providers | "Near-ready talent is visible, and so is what it needs" | Role Detail → Programs tab |

Assets, when asked:
1. **Pitch deck (6 slides):** Problem → Meet Jordan → The Path (My Map) → The Map (Explore) → Cohort Intelligence (Navigator) → Ask / what's next
2. **One-pager (letter, print-safe):** headline, 3 value blocks, one product screenshot, how it works in 3 steps, contact
3. **Social card (1200×630) and square (1080×1080):** one sentence, one screen crop, logo
4. **Booth poster (18×24):** big headline, the You → Gap → Program → Role path as a diagram, QR to {{DEMO_URL}}
5. **30-second demo script:** voiceover plus on-screen shot list that follows the demo flow below

## DEMO NARRATIVE (use this story everywhere)
- **Jordan**, 22, retail shift lead in Cleveland with a Google IT Support Certificate.
- Intake: paste a resume, and Ontologie finds the skills. Jordan confirms them as chips.
- **My Map:** Help Desk Technician is **READY**. IT Support Specialist is **CLOSE, with 4 gaps**.
- Tap a gap ("Networking fundamentals") to see the programs that teach it, with weeks and cost.
- **Explore:** the ontology around the role, with graph and table views.
- **Navigator:** across the cohort, see the #1 skill blocking best-fit roles and a skills × roles gap matrix.

## VISUAL SYSTEM (match exactly; these are the product's tokens)
**Feel:** Corporate modern with technical precision. Crisp white cards on a soft slate canvas. Low-contrast hairline borders and quiet shadows. No glassmorphism, no neon gradients, no stock "AI brain" imagery, no robots.

**Color**
- Canvas `#F8FAFC` · Card `#FFFFFF` · Border `#E2E8F0` (hover/strong `#CBD5E1`)
- Ink (headlines, primary buttons) `#0F172A` · Body `#334155` · Muted `#64748B`
- Action blue (links, focus, highlights) `#2563EB`
- Match status. Each one is a text + background + border triple, **always shown with its word and icon**:
  - READY: `#047857` on `#ECFDF5`, border `#A7F3D0`, check-circle icon
  - CLOSE: `#B45309` on `#FFFBEB`, border `#FDE68A`, clock icon
  - STRETCH: `#4338CA` on `#EEF2FF`, border `#C7D2FE`, trending-up icon
- Skill categories: Technical `#2563EB` on `#EFF6FF` · Durable (human) `#7C3AED` on `#F5F3FF` · Credential `#0D9488` on `#F0FDFA`
- Status colors mean status only. Never use them decoratively.

**Type:** Inter only. Headlines 700, tight tracking (−0.02em). Body 400 at 16/26. Badges 11px, 600, uppercase, +0.05em. Numbers use tabular figures.

**Shape**
- 8px card radius, 6px buttons and inputs, pill or 6px chips
- Node geometry carries meaning in any diagram: **circle = skill · rounded rectangle = role · diamond = program**. A dashed outline means "gap."

**Elevation:** Level 1 cards `0 1px 3px rgba(15,23,42,.05)`. Level 2 on hover. Never heavy drop shadows.

**Icons:** Material Symbols Rounded only.

**Logo:** a rounded-square ink tile holding a white circle (skill), a short connector, and a blue rounded square (role). Wordmark "Ontologie" in Inter 700.

**Layout:** 8px grid. Generous white space. A 3-column rhythm (You | Gap | Roles) is a strong layout motif for slides and posters.

## VOICE
- Plain, warm, specific. Grade 8 reading level. Short sentences.
- Speak to the person, not "users." Say "your next step," not "leverage our platform."
- Dignity first: gaps are "what's next," never "deficiencies." STRETCH is aspirational, not a failure.
- Avoid: "revolutionize," "AI-powered" as a headline, "seamless," "unlock your potential," em-dash chains, and exclamation points in headlines.
- Headline patterns that fit: "You're closer than you think." · "See the gap. Close the gap." · "From shift lead to help desk in 15 weeks." · "Where is your cohort stuck?"

## TRUTH RULES (non-negotiable)
- The current build runs on **illustrative sample data** for Northeast Ohio. Wages, openings, program costs, and cohort numbers are placeholders.
- **Never present a sample number as a real statistic.** If a stat appears, label it "Sample data" or "Illustrative," or replace it with {{VERIFIED_STAT + SOURCE}}.
- Name real programs or providers (Tri-C, Per Scholas, Year Up, CSU) only as examples of the kinds of partners the ontology maps. Don't claim a partnership unless {{CONFIRMED_PARTNERS}} lists it.
- Jordan is a demo persona, not a real person.

## SCREENS TO REFERENCE (from Stitch and the working app)
- Intake & Skills Confirmation (`/intake`)
- My Map: Pathway & Gap Analysis (`/`)
- Explore Map: Ontology Lens (`/explore`)
- Role Detail: IT Support Specialist (`/roles/it-support`)
- Navigator Dashboard: Cohort Intelligence (`/navigator`)

When a screenshot goes into an asset, place it on the `#F8FAFC` canvas inside a white card with an 8px radius and a Level-1 shadow. Crop to one idea per image (for example, just the gap panel).

## OUTPUT FORMAT
For each asset, return:
1. Asset name and dimensions
2. Final copy, every string exactly as it should appear
3. Layout spec: grid, what goes where, which screen crop, which tokens
4. A one-line alt text for every image
5. A self-check: every status shown with word + icon? Only Inter? No sample number presented as fact?

## INPUTS
- Team / contact: {{TEAM_NAMES, EMAIL}}
- Demo URL / QR target: {{DEMO_URL}}
- Event: CLE Tech Week Buildathon, {{DATE}}
- Assets needed: {{ASSETS}}
- Verified stats (with sources): {{VERIFIED_STATS or "none; use sample-data labels"}}
- Confirmed partners: {{CONFIRMED_PARTNERS or "none"}}

=====

## Quick variants

**Stitch (to add marketing screens to the same project):**
> Using the existing "Taruvi Enterprise Path" design system in this project, generate a desktop landing page for Ontologie. Hero: "You're closer than you think." with a subhead about seeing the gap to a real job and the shortest path across it. The hero visual is a cropped My Map card showing READY / CLOSE / STRETCH status chips with icons. Below it, three white cards on a slate-50 canvas: See where you stand · See the gap · Take the next step. Then a You → Gap → Program → Role diagram using circle / dashed circle / diamond / rounded-rectangle nodes. Footer tag: "Sample data. Built at CLE Tech Week 2026 on TaruviBase." Inter only, 8px radius, no gradients.

**Gamma (pitch deck):**
> Paste the master prompt with ASSETS = "pitch deck (6 slides)". Choose a clean light theme and override fonts to Inter and accent to #2563EB.

**Image model (hero art, if needed):**
> A clean editorial illustration on an off-white (#F8FAFC) background: a simple left-to-right path made of a solid circle, a dashed circle, a diamond, and a rounded rectangle, connected by thin slate lines. One accent of #2563EB on the final rectangle. Flat, geometric, generous negative space. No people, no text, no gradients, no glow.
