import { Box, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { cohortStats, heldLevels, indexBy } from "@onto/engine";
import { onto, statusTone } from "@onto/tokens";
import type { MatchStatus } from "@onto/types";
import { useOntology } from "../state/OntologyState";
import { PageHeader, Panel, ViewToggle, type ViewMode } from "../components/Common";
import { SkillChip } from "../components/Chips";

/** Discrete single-hue steps (DESIGN.md: stepped opacity + explicit label in every cell). */
const HEAT = [
  { max: 20, bg: "#EFF6FF", fg: onto.ink },
  { max: 40, bg: "#BFDBFE", fg: onto.ink },
  { max: 60, bg: "#93C5FD", fg: onto.ink },
  { max: 80, bg: "#2563EB", fg: "#fff" },
  { max: 101, bg: "#1E3A8A", fg: "#fff" },
];
const heat = (pct: number) => HEAT.find((h) => pct < h.max)!;

const Kpi = ({ label, value, note }: { label: string; value: string; note?: string }) => (
  <Panel sx={{ height: "100%" }}>
    <Typography variant="caption" component="p">{label}</Typography>
    <Typography component="p" className="tabular" sx={{ fontSize: 32, fontWeight: 700, color: onto.ink, lineHeight: 1.2, mt: 0.5 }}>{value}</Typography>
    {note ? <Typography variant="caption" component="p" sx={{ mt: 0.5 }}>{note}</Typography> : null}
  </Panel>
);

export const Navigator = () => {
  const { ontology } = useOntology();
  const [view, setView] = useState<ViewMode>("graph");
  const stats = useMemo(() => cohortStats(ontology), [ontology]);
  const skills = useMemo(() => indexBy(ontology.skills, "id"), [ontology]);

  // Heatmap: % of cohort below the required level, per (skill, role) requirement.
  const heatmap = useMemo(() => {
    const helds = ontology.talent.map((t) => heldLevels(ontology.talentSkills, t.id));
    const n = helds.length || 1;
    const cell = new Map<string, number>();
    const skillTotals = new Map<string, number>();
    for (const rs of ontology.roleSkills) {
      const missing = helds.filter((h) => (h.get(rs.skill_id) ?? 0) < rs.level).length;
      const pct = Math.round((missing / n) * 100);
      cell.set(`${rs.skill_id}|${rs.role_id}`, pct);
      if (rs.importance === "core") skillTotals.set(rs.skill_id, (skillTotals.get(rs.skill_id) ?? 0) + pct);
    }
    const rows = [...skillTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([id]) => skills.get(id)!).filter(Boolean);
    return { rows, cell };
  }, [ontology, skills]);

  const maxGap = Math.max(1, ...stats.topGaps.map((g) => g.count));
  const top = stats.topGaps[0];

  return (
    <>
      <PageHeader
        title="Navigator"
        meta={`Cohort intelligence across ${stats.talentCount} people in the sample cohort`}
        actions={<ViewToggle value={view} onChange={setView} />}
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}><Kpi label="People mapped" value={String(stats.talentCount)} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><Kpi label="Median best match" value={`${stats.medianBestMatch}%`} note="Each person's top-ranked role" /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><Kpi label="Ready for a role now" value={String(stats.readyCount)} note={`${Math.round((stats.readyCount / Math.max(1, stats.talentCount)) * 100)}% of cohort at READY`} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><Kpi label="#1 gap in the cohort" value={top ? String(top.count) : "—"} note={top ? `people blocked on ${top.skill.name}` : undefined} /></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Panel title="Top gaps blocking best-fit roles">
            {view === "graph" ? (
              <Stack component="ol" spacing={1.5} sx={{ listStyle: "none", p: 0, m: 0 }} aria-label="Top gaps, people blocked per skill">
                {stats.topGaps.map((g) => (
                  <Tooltip key={g.skill.id} title={`${g.count} of ${stats.talentCount} people`} placement="top-start">
                    <Box component="li" tabIndex={0} sx={{ outline: "none", "&:focus-visible": { boxShadow: `0 0 0 2px ${onto.action}`, borderRadius: 1 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, gap: 1 }}>
                        <Typography variant="body2" sx={{ color: onto.ink, fontWeight: 500 }}>{g.skill.name}</Typography>
                        <Typography variant="body2" className="tabular" sx={{ color: onto.ink, fontWeight: 600 }}>{g.count}</Typography>
                      </Box>
                      <Box sx={{ height: 8, bgcolor: "#F1F5F9", borderRadius: 4 }}>
                        <Box sx={{ width: `${(g.count / maxGap) * 100}%`, height: "100%", bgcolor: onto.action, borderRadius: 4 }} />
                      </Box>
                    </Box>
                  </Tooltip>
                ))}
              </Stack>
            ) : (
              <Table size="small">
                <TableHead><TableRow><TableCell>Skill</TableCell><TableCell align="right">People blocked</TableCell></TableRow></TableHead>
                <TableBody>
                  {stats.topGaps.map((g) => (
                    <TableRow key={g.skill.id}><TableCell>{g.skill.name}</TableCell><TableCell align="right" className="tabular">{g.count}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Panel
            title="Readiness by role"
            action={
              <Box component="ul" aria-label="Legend" sx={{ display: "flex", gap: 1.5, listStyle: "none", p: 0, m: 0 }}>
                {(["READY", "CLOSE", "STRETCH"] as MatchStatus[]).map((s) => (
                  <Box component="li" key={s} sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: onto.muted }}>
                    <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: statusTone[s].fg }} /> {s}
                  </Box>
                ))}
              </Box>
            }
          >
            {view === "graph" ? (
              <Stack spacing={1.5}>
                {[...stats.roleReadiness].sort((a, b) => b.avg - a.avg).map((r) => (
                  <Box key={r.role.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: onto.ink, fontWeight: 500 }}>{r.role.title}</Typography>
                      <Typography variant="caption" className="tabular">avg {r.avg}%</Typography>
                    </Box>
                    <Box role="img" aria-label={`${r.role.title}: ${r.ready}% ready, ${r.close}% close, ${r.stretch}% stretch`} sx={{ display: "flex", gap: "2px", height: 20 }}>
                      {(["ready", "close", "stretch"] as const).map((k) => {
                        const v = r[k];
                        if (!v) return null;
                        const s = k.toUpperCase() as MatchStatus;
                        return (
                          <Tooltip key={k} title={`${s}: ${v}% of cohort`}>
                            <Box sx={{ width: `${v}%`, bgcolor: statusTone[s].fg, borderRadius: "4px", color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", px: 0.75, overflow: "hidden", whiteSpace: "nowrap" }} className="tabular">
                              {v >= 12 ? `${v}%` : ""}
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Table size="small">
                <TableHead><TableRow><TableCell>Role</TableCell><TableCell align="right">Ready</TableCell><TableCell align="right">Close</TableCell><TableCell align="right">Stretch</TableCell><TableCell align="right">Avg match</TableCell></TableRow></TableHead>
                <TableBody>
                  {stats.roleReadiness.map((r) => (
                    <TableRow key={r.role.id}>
                      <TableCell>{r.role.title}</TableCell>
                      <TableCell align="right" className="tabular">{r.ready}%</TableCell>
                      <TableCell align="right" className="tabular">{r.close}%</TableCell>
                      <TableCell align="right" className="tabular">{r.stretch}%</TableCell>
                      <TableCell align="right" className="tabular">{r.avg}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Panel>
        </Grid>

        <Grid size={12}>
          <Panel
            title="Skills × roles gap matrix"
            action={<Typography variant="caption">% of cohort below the required level · — = not required</Typography>}
          >
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ "& td, & th": { px: 1 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ position: "sticky", left: 0, zIndex: 1, minWidth: 200 }}>Skill</TableCell>
                    {ontology.roles.map((r) => (
                      <TableCell key={r.id} align="center" sx={{ minWidth: 96, whiteSpace: "normal", lineHeight: 1.3 }}>{r.title}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {heatmap.rows.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell sx={{ position: "sticky", left: 0, bgcolor: "#fff", zIndex: 1 }}>
                        <SkillChip name={s.name} category={s.category} />
                      </TableCell>
                      {ontology.roles.map((r) => {
                        const v = heatmap.cell.get(`${s.id}|${r.id}`);
                        if (v == null) return <TableCell key={r.id} align="center" sx={{ color: "#94A3B8" }}>—</TableCell>;
                        const h = heat(v);
                        return (
                          <TableCell key={r.id} align="center" sx={{ p: "3px !important" }}>
                            <Tooltip title={`${s.name} for ${r.title}: ${v}% of cohort below required level`}>
                              <Box tabIndex={0} className="tabular" sx={{ bgcolor: view === "graph" ? h.bg : "transparent", color: view === "graph" ? h.fg : onto.ink, borderRadius: "4px", py: 1, fontSize: 12, fontWeight: 600, outline: "none", "&:focus-visible": { boxShadow: `0 0 0 2px ${onto.action}` } }}>
                                {v}%
                              </Box>
                            </Tooltip>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            {view === "graph" ? (
              <Box aria-label="Scale" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, fontSize: 12, color: "text.secondary" }}>
                <span>Fewer blocked</span>
                <Box aria-hidden sx={{ display: "flex", gap: "2px" }}>
                  {HEAT.map((h) => <Box key={h.bg} sx={{ width: 24, height: 10, bgcolor: h.bg, borderRadius: "2px" }} />)}
                </Box>
                <span>More blocked</span>
              </Box>
            ) : null}
          </Panel>
        </Grid>
      </Grid>
    </>
  );
};
