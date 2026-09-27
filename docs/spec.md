# Ontologie: Build Spec (draft)

Required by the Taruvi template's AGENTS.md before building. Reconcile with the live schema.

| Resource (table) | Key fields | Relations | Pages |
|---|---|---|---|
| `skills` | name, category, external_code | self via `skill_relations` | list, show |
| `roles` | title, soc_code, median_wage, openings, entry_education | `role_skills` | list, show (tabs: Skills, Programs, Explore) |
| `programs` | name, provider, duration_weeks, cost, modality, location | `program_skills` | list, show |
| `talent_profiles` | user_id (Taruvi user), headline, interests[] | `talent_skills` | My Map (custom), intake wizard |
| `talent_skills` | talent_id, skill_id, level 1–4, evidence | edge | managed on My Map |
| `role_skills` | role_id, skill_id, importance | edge | managed on Role show |
| `program_skills` | program_id, skill_id | edge | managed on Program show |
| `skill_relations` | from_skill_id, to_skill_id, type | edge | Explore map |

Provider meta: default datatable provider. Users come through `dataProviderName: "user"`, `resource: "users"`.
Functions: `compute_gap(talent_id, role_id)` and `rank_roles(talent_id)`. These justify a function because the logic spans 2+ resources at runtime.
Access control: default auth only (Cerbos not needed for the demo).
