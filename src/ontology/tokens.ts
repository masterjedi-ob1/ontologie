/**
 * Ontologie design tokens, from the Stitch design system
 * "Taruvi Enterprise Path" (docs/DESIGN.md). Semantic colors only: status and
 * skill-category pairs are contrast-checked (text on bg >= 4.5:1).
 */
import type { MatchStatus, SkillCategory } from "./types";

export const onto = {
  ink: "#0F172A",
  body: "#334155",
  muted: "#64748B",
  action: "#2563EB",
  canvas: "#F8FAFC",
  card: "#FFFFFF",
  borderSubtle: "#E2E8F0",
  borderStrong: "#CBD5E1",
  elev1: "0 1px 3px 0 rgba(15,23,42,0.05), 0 1px 2px -1px rgba(15,23,42,0.05)",
  elev2: "0 4px 6px -1px rgba(15,23,42,0.07), 0 2px 4px -2px rgba(15,23,42,0.05)",
  elev3: "0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.04)",
} as const;

export const statusTone: Record<MatchStatus, { fg: string; bg: string; border: string }> = {
  READY: { fg: "#047857", bg: "#ECFDF5", border: "#A7F3D0" },
  CLOSE: { fg: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  STRETCH: { fg: "#4338CA", bg: "#EEF2FF", border: "#C7D2FE" },
};

export const skillTone: Record<SkillCategory, { fg: string; bg: string; border: string; label: string }> = {
  technical: { fg: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", label: "Technical" },
  durable: { fg: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", label: "Durable" },
  credential: { fg: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", label: "Credential" },
};

export const money = (n?: number | null) =>
  n == null ? "—" : n === 0 ? "$0" : `$${n.toLocaleString("en-US")}`;
