import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useList, type BaseRecord } from "@refinedev/core";
import { DEMO_TALENT_ID, sampleOntology } from "./seed";
import type { Evidence, Ontology, TalentSkill } from "./types";

type Source = "live" | "sample" | "loading";

interface Ctx {
  ontology: Ontology;
  source: Source;
  talentId: string;
  talentName: string;
  mySkills: TalentSkill[];
  setMySkills: (rows: { skill_id: string; level: number; evidence: Evidence }[], name?: string) => void;
  resetDemo: () => void;
}

const OntologyCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "ontologie.mySkills.v1";

// Stable references so Refine query keys never churn (AGENTS.md: stable query inputs).
const PAGE = { currentPage: 1, pageSize: 1000 } as const;
const QUIET = { errorNotification: false as const, queryOptions: { retry: false } };

const useTable = <T extends BaseRecord>(resource: string) => {
  const { result, query } = useList<T>({ resource, pagination: PAGE, ...QUIET });
  return { rows: (result?.data ?? []) as T[], isLoading: query.isLoading, isError: query.isError };
};

interface Stored {
  name: string;
  rows: TalentSkill[];
}

const readStored = (): Stored | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
};

export const OntologyProvider = ({ children }: PropsWithChildren) => {
  const skills = useTable<Ontology["skills"][number] & BaseRecord>("skills");
  const roles = useTable<Ontology["roles"][number] & BaseRecord>("roles");
  const programs = useTable<Ontology["programs"][number] & BaseRecord>("programs");
  const roleSkills = useTable<Ontology["roleSkills"][number] & BaseRecord>("role_skills");
  const programSkills = useTable<Ontology["programSkills"][number] & BaseRecord>("program_skills");
  const skillRelations = useTable<Ontology["skillRelations"][number] & BaseRecord>("skill_relations");
  const talentSkills = useTable<Ontology["talentSkills"][number] & BaseRecord>("talent_skills");
  const talent = useTable<Ontology["talent"][number] & BaseRecord>("talent_profiles");

  const core = [skills, roles, roleSkills];
  const loading = core.some((t) => t.isLoading);
  // Live only when the team's core tables exist AND hold data; otherwise the
  // demo still works end to end on the labelled sample ontology.
  const live = !loading && core.every((t) => !t.isError && t.rows.length > 0);
  const source: Source = loading ? "loading" : live ? "live" : "sample";

  const base: Ontology = useMemo(() => {
    if (!live) return sampleOntology;
    const str = <T extends Record<string, unknown>>(rows: T[], keys: (keyof T)[]) =>
      rows.map((r) => {
        const o = { ...r };
        for (const k of keys) if (o[k] != null) (o as Record<string, unknown>)[k as string] = String(o[k]);
        return o;
      });
    return {
      skills: str(skills.rows, ["id"]),
      roles: str(roles.rows, ["id"]),
      programs: str(programs.rows, ["id"]),
      roleSkills: str(roleSkills.rows, ["role_id", "skill_id"]),
      programSkills: str(programSkills.rows, ["program_id", "skill_id"]),
      skillRelations: str(skillRelations.rows, ["from_skill_id", "to_skill_id"]),
      talent: str(talent.rows, ["id"]),
      talentSkills: str(talentSkills.rows, ["talent_id", "skill_id"]),
    } as Ontology;
  }, [live, skills.rows, roles.rows, programs.rows, roleSkills.rows, programSkills.rows, skillRelations.rows, talent.rows, talentSkills.rows]);

  const [stored, setStored] = useState<Stored | null>(readStored);

  useEffect(() => {
    try {
      if (stored) localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable: keep in memory */
    }
  }, [stored]);

  const talentId = "me";
  const demoRows = useMemo(
    () => sampleOntology.talentSkills.filter((t) => t.talent_id === DEMO_TALENT_ID).map((t) => ({ ...t, talent_id: talentId })),
    [],
  );
  const mySkills = stored?.rows ?? demoRows;
  const talentName = stored?.name ?? "Jordan Reyes";

  const ontology = useMemo<Ontology>(
    () => ({
      ...base,
      talent: [{ id: talentId, name: talentName }, ...base.talent],
      talentSkills: [...mySkills, ...base.talentSkills],
    }),
    [base, mySkills, talentName],
  );

  const setMySkills = useCallback<Ctx["setMySkills"]>((rows, name) => {
    setStored((prev) => ({
      name: name ?? prev?.name ?? "Jordan Reyes",
      rows: rows.map((r) => ({ ...r, talent_id: talentId })),
    }));
  }, []);

  const resetDemo = useCallback(() => setStored(null), []);

  const value = useMemo(
    () => ({ ontology, source, talentId, talentName, mySkills, setMySkills, resetDemo }),
    [ontology, source, talentName, mySkills, setMySkills, resetDemo],
  );
  return <OntologyCtx.Provider value={value}>{children}</OntologyCtx.Provider>;
};

export const useOntology = () => {
  const ctx = useContext(OntologyCtx);
  if (!ctx) throw new Error("useOntology must be used inside <OntologyProvider>");
  return ctx;
};
