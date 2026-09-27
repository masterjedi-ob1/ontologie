import type {
  MatchStatus,
  Ontology,
  Program,
  Role,
  RoleSkill,
  Skill,
  TalentSkill,
} from "./types";

const WEIGHT = { core: 2, preferred: 1 } as const;

export const statusFor = (pct: number): MatchStatus =>
  pct >= 75 ? "READY" : pct >= 50 ? "CLOSE" : "STRETCH";

export interface GapItem {
  skill: Skill;
  requirement: RoleSkill;
  /** Current level held (0 = not held). */
  held: number;
  programs: Program[];
}

export interface RoleMatch {
  role: Role;
  pct: number;
  status: MatchStatus;
  met: RoleSkill[];
  gaps: GapItem[];
}

export const indexBy = <T, K extends keyof T>(rows: T[], key: K) =>
  new Map(rows.map((r) => [String(r[key]), r]));

/** Levels held by one talent, keyed by skill id. */
export const heldLevels = (talentSkills: TalentSkill[], talentId: string) => {
  const m = new Map<string, number>();
  for (const ts of talentSkills) {
    if (ts.talent_id === talentId) m.set(ts.skill_id, Math.max(ts.level, m.get(ts.skill_id) ?? 0));
  }
  return m;
};

export const matchRole = (o: Ontology, role: Role, held: Map<string, number>): RoleMatch => {
  const skills = indexBy(o.skills, "id");
  const programs = indexBy(o.programs, "id");
  const reqs = o.roleSkills.filter((rs) => rs.role_id === role.id);
  let total = 0;
  let earned = 0;
  const met: RoleSkill[] = [];
  const gaps: GapItem[] = [];
  for (const req of reqs) {
    const w = WEIGHT[req.importance];
    total += w;
    const level = held.get(req.skill_id) ?? 0;
    if (level >= req.level) {
      earned += w;
      met.push(req);
    } else {
      // Partial credit for partial level, so near-misses rank above nothing.
      earned += w * (level / req.level) * 0.5;
      const skill = skills.get(req.skill_id);
      if (!skill) continue;
      gaps.push({
        skill,
        requirement: req,
        held: level,
        programs: o.programSkills
          .filter((ps) => ps.skill_id === req.skill_id)
          .map((ps) => programs.get(ps.program_id))
          .filter((p): p is Program => !!p),
      });
    }
  }
  gaps.sort((a, b) => WEIGHT[b.requirement.importance] - WEIGHT[a.requirement.importance]);
  const pct = total ? Math.round((earned / total) * 100) : 0;
  return { role, pct, status: statusFor(pct), met, gaps };
};

export const rankRoles = (o: Ontology, held: Map<string, number>) =>
  o.roles.map((r) => matchRole(o, r, held)).sort((a, b) => b.pct - a.pct);

/** Programs that close the most gap skills for a role, best first. */
export const bestPrograms = (m: RoleMatch) => {
  const score = new Map<string, { program: Program; closes: Skill[] }>();
  for (const g of m.gaps) {
    for (const p of g.programs) {
      const e = score.get(p.id) ?? { program: p, closes: [] };
      e.closes.push(g.skill);
      score.set(p.id, e);
    }
  }
  return [...score.values()].sort(
    (a, b) => b.closes.length - a.closes.length || (a.program.cost ?? 0) - (b.program.cost ?? 0),
  );
};

export interface CohortStats {
  talentCount: number;
  medianBestMatch: number;
  readyCount: number;
  topGaps: { skill: Skill; count: number }[];
  /** matrix[roleId] = pct of cohort READY or CLOSE for that role */
  roleReadiness: { role: Role; ready: number; close: number; stretch: number; avg: number }[];
}

export const cohortStats = (o: Ontology): CohortStats => {
  const best: number[] = [];
  const gapCount = new Map<string, number>();
  const perRole = new Map<string, number[]>();
  for (const t of o.talent) {
    const held = heldLevels(o.talentSkills, t.id);
    const ranked = rankRoles(o, held);
    if (!ranked.length) continue;
    best.push(ranked[0].pct);
    for (const m of ranked) {
      const arr = perRole.get(m.role.id) ?? [];
      arr.push(m.pct);
      perRole.set(m.role.id, arr);
    }
    for (const g of ranked[0].gaps) gapCount.set(g.skill.id, (gapCount.get(g.skill.id) ?? 0) + 1);
  }
  const sorted = [...best].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  const skills = indexBy(o.skills, "id");
  return {
    talentCount: o.talent.length,
    medianBestMatch: median,
    readyCount: best.filter((p) => p >= 75).length,
    topGaps: [...gapCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({ skill: skills.get(id)!, count }))
      .filter((g) => g.skill),
    roleReadiness: o.roles.map((role) => {
      const pcts = perRole.get(role.id) ?? [];
      const n = pcts.length || 1;
      return {
        role,
        ready: Math.round((pcts.filter((p) => p >= 75).length / n) * 100),
        close: Math.round((pcts.filter((p) => p >= 50 && p < 75).length / n) * 100),
        stretch: Math.round((pcts.filter((p) => p < 50).length / n) * 100),
        avg: Math.round(pcts.reduce((a, b) => a + b, 0) / n),
      };
    }),
  };
};
