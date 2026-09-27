import { Box } from "@mui/material";
import { useMemo, useState, type KeyboardEvent } from "react";
import type { MatchStatus, SkillCategory } from "@onto/types";
import { onto, skillTone, statusTone } from "@onto/tokens";

export type NodeKind = "skill" | "role" | "program";

export interface GNode {
  id: string;
  kind: NodeKind;
  label: string;
  column: number;
  category?: SkillCategory;
  status?: MatchStatus;
  /** Visually de-emphasised (e.g. a skill you don't have yet). */
  missing?: boolean;
  sub?: string;
}

export interface GEdge {
  from: string;
  to: string;
  label: string;
  dashed?: boolean;
}

const COL_W = 300;
/** Space reserved right of a skill/program shape for its label; edges start after it. */
const LABEL_W = 214;
const ROW_H = 60;
const PAD_Y = 56;
const PAD_X = 40;

const trunc = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/**
 * Deterministic layered (left→right) ontology graph. Shape encodes entity type
 * (circle = skill, rounded rect = role, diamond = program) so type never rides
 * on color alone. Every node is a focusable button; the page pairs this with a
 * 1:1 table view.
 */
export const PathGraph = ({
  nodes,
  edges,
  columns,
  onSelect,
  ariaLabel,
}: {
  nodes: GNode[];
  edges: GEdge[];
  columns: string[];
  onSelect?: (n: GNode) => void;
  ariaLabel: string;
}) => {
  const [hover, setHover] = useState<string | null>(null);

  const pos = useMemo(() => {
    const byCol = new Map<number, GNode[]>();
    for (const n of nodes) byCol.set(n.column, [...(byCol.get(n.column) ?? []), n]);
    const maxRows = Math.max(1, ...[...byCol.values()].map((c) => c.length));
    const height = PAD_Y + maxRows * ROW_H + 16;
    const p = new Map<string, { x: number; y: number }>();
    for (const [col, list] of byCol) {
      const offset = ((maxRows - list.length) * ROW_H) / 2;
      list.forEach((n, i) => p.set(n.id, { x: PAD_X + col * COL_W, y: PAD_Y + offset + i * ROW_H + ROW_H / 2 }));
    }
    return { p, height, width: PAD_X * 2 + (columns.length - 1) * COL_W + 220 };
  }, [nodes, columns.length]);

  const linked = useMemo(() => {
    if (!hover) return null;
    const s = new Set([hover]);
    for (const e of edges) {
      if (e.from === hover) s.add(e.to);
      if (e.to === hover) s.add(e.from);
    }
    return s;
  }, [hover, edges]);

  const activate = (n: GNode) => onSelect?.(n);
  const onKey = (e: KeyboardEvent, n: GNode) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(n);
    }
  };

  return (
    <Box sx={{ overflowX: "auto", overscrollBehaviorX: "contain" }}>
      <svg
        role="group"
        aria-label={ariaLabel}
        viewBox={`0 0 ${pos.width} ${pos.height}`}
        width={pos.width}
        height={pos.height}
        style={{ display: "block", maxWidth: "none", fontFamily: "inherit" }}
      >
        {columns.map((c, i) => (
          <text key={c} x={PAD_X + i * COL_W - 12} y={24} fontSize={11} fontWeight={600} letterSpacing="0.05em" fill={onto.muted}>
            {c.toUpperCase()}
          </text>
        ))}
        <g aria-hidden>
          {edges.map((e) => {
            const a = pos.p.get(e.from);
            const b = pos.p.get(e.to);
            if (!a || !b) return null;
            const dim = linked && !(linked.has(e.from) && linked.has(e.to));
            const src = nodes.find((n) => n.id === e.from);
            const x1 = src?.kind === "role" ? a.x + 188 : a.x + LABEL_W;
            const x2 = b.x - 16;
            const mx = (x1 + x2) / 2;
            return (
              <path
                key={`${e.from}-${e.to}`}
                d={`M${x1},${a.y} C${mx},${a.y} ${mx},${b.y} ${x2},${b.y}`}
                fill="none"
                stroke={dim ? "#E2E8F0" : e.dashed ? "#94A3B8" : "#CBD5E1"}
                strokeWidth={linked && !dim ? 2 : 1.5}
                strokeDasharray={e.dashed ? "5 4" : undefined}
              />
            );
          })}
        </g>
        {nodes.map((n) => {
          const p = pos.p.get(n.id)!;
          const dim = linked && !linked.has(n.id);
          const tone = n.category ? skillTone[n.category] : null;
          const st = n.status ? statusTone[n.status] : null;
          const name = `${n.kind === "skill" ? "Skill" : n.kind === "role" ? "Role" : "Program"}: ${n.label}${n.missing ? " (gap)" : ""}${n.status ? `, ${n.status}` : ""}${n.sub ? `, ${n.sub}` : ""}`;
          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-label={name}
              onClick={() => activate(n)}
              onKeyDown={(e) => onKey(e, n)}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              style={{ cursor: onSelect ? "pointer" : "default", opacity: dim ? 0.35 : 1, outline: "none" }}
              className="gnode"
            >
              <title>{name}</title>
              {n.kind === "skill" && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={11}
                  fill={n.missing ? "#fff" : tone?.bg}
                  stroke={tone?.fg ?? onto.ink}
                  strokeWidth={2}
                  strokeDasharray={n.missing ? "3 2.5" : undefined}
                />
              )}
              {n.kind === "program" && (
                <rect x={p.x - 9} y={p.y - 9} width={18} height={18} rx={2} transform={`rotate(45 ${p.x} ${p.y})`} fill="#fff" stroke={onto.ink} strokeWidth={2} />
              )}
              {n.kind === "role" && (
                <rect x={p.x - 12} y={p.y - 20} width={196} height={40} rx={8} fill={st?.bg ?? "#fff"} stroke={st?.border ?? onto.borderStrong} strokeWidth={1.5} />
              )}
              {/* focus ring, shown via CSS on :focus-visible */}
              <rect className="ring" x={p.x - 18} y={p.y - 24} width={n.kind === "role" ? 208 : 210} height={48} rx={10} fill="none" stroke={onto.action} strokeWidth={2} opacity={0} />
              {n.kind === "role" ? (
                <>
                  <text x={p.x} y={p.y - 3} fontSize={13} fontWeight={600} fill={onto.ink}>{trunc(n.label, 24)}</text>
                  {n.sub ? <text x={p.x} y={p.y + 12} fontSize={11} fill={st?.fg ?? onto.muted} fontWeight={600} letterSpacing="0.04em">{n.sub}</text> : null}
                </>
              ) : (
                <>
                  <text x={p.x + 18} y={p.y + (n.sub ? -2 : 4)} fontSize={13} stroke="#fff" strokeWidth={4} paintOrder="stroke" fontWeight={500} fill={n.missing ? onto.muted : onto.ink}>{trunc(n.label, 26)}</text>
                  {n.sub ? <text x={p.x + 18} y={p.y + 13} fontSize={11} stroke="#fff" strokeWidth={3} paintOrder="stroke" fill={onto.muted}>{trunc(n.sub, 30)}</text> : null}
                </>
              )}
            </g>
          );
        })}
      </svg>
      <style>{`.gnode:focus-visible .ring{opacity:1}`}</style>
    </Box>
  );
};

export const GraphLegend = () => (
  <Box component="ul" aria-label="Graph legend" sx={{ display: "flex", flexWrap: "wrap", gap: 2, listStyle: "none", p: 0, m: 0, fontSize: 12, color: "text.secondary" }}>
    <Box component="li" sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <svg width="16" height="16" aria-hidden><circle cx="8" cy="8" r="6" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" /></svg> Skill you have
    </Box>
    <Box component="li" sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <svg width="16" height="16" aria-hidden><circle cx="8" cy="8" r="6" fill="#fff" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 2.5" /></svg> Skill gap
    </Box>
    <Box component="li" sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <svg width="16" height="16" aria-hidden><rect x="3" y="3" width="10" height="10" rx="1.5" transform="rotate(45 8 8)" fill="#fff" stroke="#0F172A" strokeWidth="2" /></svg> Program
    </Box>
    <Box component="li" sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <svg width="22" height="16" aria-hidden><rect x="1" y="2" width="20" height="12" rx="3" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" /></svg> Role
    </Box>
    <Box component="li" sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <svg width="22" height="16" aria-hidden><path d="M1 8h20" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="5 4" /></svg> No program yet
    </Box>
  </Box>
);
