import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { DEMO_TALENT_ID, sampleOntology } from "@onto/seed";
import type { Evidence, Ontology, TalentSkill } from "@onto/types";

/**
 * Local-only state. The standalone app never makes a network call: the
 * ontology is the bundled sample, and a visitor's intake answers live in their
 * own browser (localStorage), nowhere else.
 */
interface Ctx {
  ontology: Ontology;
  talentId: string;
  talentName: string;
  mySkills: TalentSkill[];
  interests: string[];
  saveProfile: (p: { name: string; skills: { skill_id: string; level: number; evidence: Evidence }[]; interests: string[] }) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = "ontologie.standalone.profile.v1";
const ME = "me";

interface Stored {
  name: string;
  skills: TalentSkill[];
  interests: string[];
}

const read = (): Stored | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
};

const demoSkills = sampleOntology.talentSkills
  .filter((t) => t.talent_id === DEMO_TALENT_ID)
  .map((t) => ({ ...t, talent_id: ME }));

const OntologyCtx = createContext<Ctx | null>(null);

export const OntologyState = ({ children }: PropsWithChildren) => {
  const [stored, setStored] = useState<Stored | null>(read);

  useEffect(() => {
    try {
      if (stored) localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode: keep it in memory */
    }
  }, [stored]);

  const mySkills = stored?.skills ?? demoSkills;
  const talentName = stored?.name ?? "Jordan Reyes";
  const interests = stored?.interests ?? ["it-support", "soc-analyst"];

  const ontology = useMemo<Ontology>(
    () => ({
      ...sampleOntology,
      // The demo persona is replaced by "me" so the cohort isn't double-counted.
      talent: [{ id: ME, name: talentName }, ...sampleOntology.talent.filter((t) => t.id !== DEMO_TALENT_ID)],
      talentSkills: [...mySkills, ...sampleOntology.talentSkills.filter((t) => t.talent_id !== DEMO_TALENT_ID)],
    }),
    [mySkills, talentName],
  );

  const saveProfile = useCallback<Ctx["saveProfile"]>(({ name, skills, interests }) => {
    setStored({ name, interests, skills: skills.map((s) => ({ ...s, talent_id: ME })) });
  }, []);
  const resetDemo = useCallback(() => setStored(null), []);

  const value = useMemo(
    () => ({ ontology, talentId: ME, talentName, mySkills, interests, saveProfile, resetDemo }),
    [ontology, talentName, mySkills, interests, saveProfile, resetDemo],
  );
  return <OntologyCtx.Provider value={value}>{children}</OntologyCtx.Provider>;
};

export const useOntology = () => {
  const ctx = useContext(OntologyCtx);
  if (!ctx) throw new Error("useOntology must be used inside <OntologyState>");
  return ctx;
};
