export type SkillCategory = "technical" | "durable" | "credential";
export type Importance = "core" | "preferred";
export type Evidence = "self" | "resume" | "verified";
export type MatchStatus = "READY" | "CLOSE" | "STRETCH";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  external_code?: string | null;
}

export interface Role {
  id: string;
  title: string;
  soc_code?: string | null;
  median_wage?: number | null;
  openings?: number | null;
  entry_education?: string | null;
  summary?: string | null;
}

export interface Program {
  id: string;
  name: string;
  provider: string;
  duration_weeks?: number | null;
  cost?: number | null;
  modality?: string | null;
  location?: string | null;
}

export interface RoleSkill {
  id?: string;
  role_id: string;
  skill_id: string;
  importance: Importance;
  level: number;
}

export interface ProgramSkill {
  id?: string;
  program_id: string;
  skill_id: string;
}

export interface SkillRelation {
  id?: string;
  from_skill_id: string;
  to_skill_id: string;
  type: "prerequisite" | "adjacent";
}

export interface TalentSkill {
  id?: string;
  talent_id: string;
  skill_id: string;
  level: number;
  evidence: Evidence;
}

export interface Talent {
  id: string;
  name: string;
  headline?: string | null;
}

export interface Ontology {
  skills: Skill[];
  roles: Role[];
  programs: Program[];
  roleSkills: RoleSkill[];
  programSkills: ProgramSkill[];
  skillRelations: SkillRelation[];
  talent: Talent[];
  talentSkills: TalentSkill[];
}
