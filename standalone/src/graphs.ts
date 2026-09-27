import type { Ontology } from "@onto/types";
import { indexBy, matchRole, type RoleMatch } from "@onto/engine";
import type { GEdge, GNode } from "./components/PathGraph";
import { money } from "@onto/tokens";

/** Role lens: skills you have → gaps → programs that close them → role. */
export const roleGraph = (m: RoleMatch, o: Ontology) => {
  const skills = indexBy(o.skills, "id");
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const roleId = `role:${m.role.id}`;
  for (const r of m.met) {
    const s = skills.get(r.skill_id);
    if (!s) continue;
    nodes.push({ id: `have:${s.id}`, kind: "skill", label: s.name, column: 0, category: s.category, sub: r.importance === "core" ? "Core · met" : "Preferred · met" });
    edges.push({ from: `have:${s.id}`, to: roleId, label: "meets requirement of" });
  }
  const progSeen = new Set<string>();
  for (const g of m.gaps) {
    nodes.push({ id: `gap:${g.skill.id}`, kind: "skill", label: g.skill.name, column: 1, category: g.skill.category, missing: true, sub: `${g.requirement.importance === "core" ? "Core" : "Preferred"} · need L${g.requirement.level}` });
    if (!g.programs.length) edges.push({ from: `gap:${g.skill.id}`, to: roleId, label: "required by (no program yet)", dashed: true });
    for (const p of g.programs) {
      if (!progSeen.has(p.id)) {
        progSeen.add(p.id);
        nodes.push({ id: `prog:${p.id}`, kind: "program", label: p.name, column: 2, sub: `${p.provider} · ${p.duration_weeks}w · ${money(p.cost)}` });
        edges.push({ from: `prog:${p.id}`, to: roleId, label: "prepares for" });
      }
      edges.push({ from: `gap:${g.skill.id}`, to: `prog:${p.id}`, label: "taught by" });
    }
  }
  nodes.push({ id: roleId, kind: "role", label: m.role.title, column: 3, status: m.status, sub: `${m.status} · ${m.pct}% MATCH` });
  return { nodes, edges, columns: ["You have", "Gap", "Programs", "Role"] };
};

/** Skill lens: related skills → the skill → programs → roles that need it. */
export const skillGraph = (skillId: string, o: Ontology, held: Map<string, number>) => {
  const skills = indexBy(o.skills, "id");
  const programs = indexBy(o.programs, "id");
  const focus = skills.get(skillId);
  if (!focus) return { nodes: [], edges: [], columns: [] };
  const nodes: GNode[] = [];
  const edges: GEdge[] = [];
  const id = `skill:${focus.id}`;
  const related = o.skillRelations.filter((r) => r.from_skill_id === focus.id || r.to_skill_id === focus.id);
  for (const r of related) {
    const otherId = r.from_skill_id === focus.id ? r.to_skill_id : r.from_skill_id;
    const s = skills.get(otherId);
    if (!s) continue;
    const label = r.type === "prerequisite" ? (r.from_skill_id === focus.id ? "leads to" : "prerequisite for") : "adjacent to";
    nodes.push({ id: `rel:${s.id}`, kind: "skill", label: s.name, column: 0, category: s.category, missing: !held.get(s.id), sub: label });
    edges.push({ from: `rel:${s.id}`, to: id, label, dashed: r.type === "adjacent" });
  }
  nodes.push({ id, kind: "skill", label: focus.name, column: 1, category: focus.category, missing: !held.get(focus.id), sub: held.get(focus.id) ? `You: L${held.get(focus.id)}` : "Not yet held" });
  for (const ps of o.programSkills.filter((p) => p.skill_id === focus.id)) {
    const p = programs.get(ps.program_id);
    if (!p) continue;
    nodes.push({ id: `prog:${p.id}`, kind: "program", label: p.name, column: 2, sub: `${p.provider} · ${money(p.cost)}` });
    edges.push({ from: id, to: `prog:${p.id}`, label: "taught by" });
  }
  for (const rs of o.roleSkills.filter((r) => r.skill_id === focus.id)) {
    const role = o.roles.find((r) => r.id === rs.role_id);
    if (!role) continue;
    const m = matchRole(o, role, held);
    nodes.push({ id: `role:${role.id}`, kind: "role", label: role.title, column: 3, status: m.status, sub: `${m.status} · ${m.pct}%` });
    edges.push({ from: id, to: `role:${role.id}`, label: `${rs.importance} requirement of` });
  }
  return { nodes, edges, columns: ["Related skills", "Skill", "Programs", "Roles that need it"] };
};
