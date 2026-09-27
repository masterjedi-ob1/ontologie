import { Box, Breadcrumbs, Button, Grid, Link as MuiLink, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import { Link, useParams, useSearchParams } from "react-router";
import { useMemo } from "react";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRounded from "@mui/icons-material/RadioButtonUncheckedRounded";
import SearchOffRounded from "@mui/icons-material/SearchOffRounded";
import { bestPrograms, heldLevels, indexBy, matchRole } from "@onto/engine";
import { money, onto } from "@onto/tokens";
import { useOntology } from "../state/OntologyState";
import { EmptyState, Panel } from "../components/Common";
import { LevelMeter, SkillChip, StatusChip } from "../components/Chips";
import { GraphLegend, PathGraph } from "../components/PathGraph";
import { roleGraph } from "../graphs";

const TABS = ["skills", "programs", "map"] as const;

export const RoleDetail = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const { ontology, talentId } = useOntology();
  const held = useMemo(() => heldLevels(ontology.talentSkills, talentId), [ontology, talentId]);
  const role = ontology.roles.find((r) => r.id === id);
  const skills = useMemo(() => indexBy(ontology.skills, "id"), [ontology]);

  if (!role) {
    return <EmptyState icon={<SearchOffRounded />} title="Role not found" body="It may have been renamed." action={<Button component={Link} to="/roles" variant="contained">Back to roles</Button>} />;
  }

  const m = matchRole(ontology, role, held);
  const reqs = ontology.roleSkills.filter((r) => r.role_id === role.id);
  const plan = bestPrograms(m);
  const tab = (TABS as readonly string[]).includes(params.get("tab") ?? "") ? (params.get("tab") as (typeof TABS)[number]) : "skills";
  const g = roleGraph(m, ontology);

  return (
    <>
      <Breadcrumbs component="nav" aria-label="Breadcrumb" sx={{ mb: 1.5, fontSize: 14 }}>
        <MuiLink component={Link} to="/roles">Roles</MuiLink>
        <Typography aria-current="page" sx={{ fontSize: 14, color: "text.secondary" }}>{role.title}</Typography>
      </Breadcrumbs>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Typography variant="h1" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}>{role.title}</Typography>
        <StatusChip status={m.status} pct={m.pct} />
      </Box>
      <Typography variant="body2" className="tabular" sx={{ color: "text.secondary", mt: 0.5, mb: 1.5 }}>
        SOC {role.soc_code} · {money(role.median_wage)} median · {role.openings?.toLocaleString("en-US")} openings · {role.entry_education}
      </Typography>
      {role.summary ? <Typography variant="body1" sx={{ mb: 3, maxWidth: 720 }}>{role.summary}</Typography> : null}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          {[
            { label: "Match", value: `${m.pct}%` },
            { label: "Requirements met", value: `${m.met.length} / ${reqs.length}` },
            { label: "Gaps to close", value: String(m.gaps.length) },
          ].map((k) => (
            <Panel key={k.label} sx={{ mb: 2 }}>
              <Typography variant="caption" component="p">{k.label}</Typography>
              <Typography component="p" className="tabular" sx={{ fontSize: 28, fontWeight: 700, color: onto.ink, lineHeight: 1.2 }}>{k.value}</Typography>
            </Panel>
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Panel>
            <Tabs value={tab} onChange={(_, v) => setParams({ tab: v }, { replace: true })} aria-label="Role sections" sx={{ borderBottom: `1px solid ${onto.borderSubtle}`, mb: 2 }}>
              <Tab value="skills" label={`Skills (${reqs.length})`} />
              <Tab value="programs" label={`Programs (${plan.length})`} />
              <Tab value="map" label="Explore map" />
            </Tabs>

            {tab === "skills" && (
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Skill</TableCell>
                      <TableCell>Importance</TableCell>
                      <TableCell>Your level</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...reqs].sort((a, b) => (a.importance === b.importance ? 0 : a.importance === "core" ? -1 : 1)).map((r) => {
                      const s = skills.get(r.skill_id);
                      const have = held.get(r.skill_id) ?? 0;
                      const ok = have >= r.level;
                      if (!s) return null;
                      return (
                        <TableRow key={r.skill_id} hover sx={{ height: 52 }}>
                          <TableCell><SkillChip name={s.name} category={s.category} /></TableCell>
                          <TableCell sx={{ textTransform: "capitalize" }}>{r.importance}</TableCell>
                          <TableCell><LevelMeter held={have} required={r.level} /></TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: ok ? "#047857" : onto.muted, fontSize: 14 }}>
                              {ok ? <CheckCircleRounded aria-hidden fontSize="small" /> : <RadioButtonUncheckedRounded aria-hidden fontSize="small" />}
                              <span>{ok ? "Met" : "Gap"}</span>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            )}

            {tab === "programs" && (plan.length ? (
              <Stack spacing={1.5}>
                {plan.map(({ program, closes }) => (
                  <Box key={program.id} sx={{ border: `1px solid ${onto.borderSubtle}`, borderRadius: 2, p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                      <Box>
                        <Typography variant="h4" component="h3">{program.name}</Typography>
                        <Typography variant="caption" component="p" className="tabular">
                          {program.provider} · {program.duration_weeks} weeks · {program.modality} · {program.location}
                        </Typography>
                      </Box>
                      <Typography className="tabular" sx={{ fontWeight: 700, color: onto.ink }}>{money(program.cost)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 1.5 }}>
                      {closes.map((c) => <SkillChip key={c.id} name={c.name} category={c.category} />)}
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState icon={<CheckCircleRounded />} title="No programs needed" body="Every requirement for this role is already met." />
            ))}

            {tab === "map" && (
              <>
                <Box sx={{ mb: 2 }}><GraphLegend /></Box>
                <PathGraph nodes={g.nodes} edges={g.edges} columns={g.columns} ariaLabel={`Path from your skills to ${role.title}`} />
                <MuiLink component={Link} to={`/explore?role=${role.id}`} sx={{ display: "inline-block", mt: 1.5, fontSize: 14 }}>Open in Explore (table view available) →</MuiLink>
              </>
            )}
          </Panel>
        </Grid>
      </Grid>
    </>
  );
};
