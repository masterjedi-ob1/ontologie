import { Box, Button, ButtonBase, Chip, Grid, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router";
import { useMemo } from "react";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import HubRounded from "@mui/icons-material/HubRounded";
import { bestPrograms, heldLevels, indexBy, rankRoles } from "@onto/engine";
import { money, onto, skillTone, statusTone } from "@onto/tokens";
import type { SkillCategory } from "@onto/types";
import { useOntology } from "../state/OntologyState";
import { CategoryLegend, LevelMeter, SkillChip, StatusChip } from "../components/Chips";
import { Overline, PageHeader, Panel } from "../components/Common";

const CAT_ORDER: SkillCategory[] = ["technical", "durable", "credential"];

export const MyMap = () => {
  const { ontology, talentId, talentName, mySkills } = useOntology();
  const [params, setParams] = useSearchParams();
  const held = useMemo(() => heldLevels(ontology.talentSkills, talentId), [ontology, talentId]);
  const ranked = useMemo(() => rankRoles(ontology, held), [ontology, held]);
  const skills = useMemo(() => indexBy(ontology.skills, "id"), [ontology]);
  const selectedId = params.get("role") ?? ranked[0]?.role.id;
  const selected = ranked.find((m) => m.role.id === selectedId) ?? ranked[0];
  const plan = selected ? bestPrograms(selected) : [];
  const ready = ranked.filter((m) => m.status === "READY").length;

  return (
    <>
      <PageHeader
        title="My Map"
        meta={`${talentName} · ${mySkills.length} skills mapped · ${ready} role${ready === 1 ? "" : "s"} ready now`}
        actions={
          <>
            <Button component={Link} to="/intake" variant="outlined" startIcon={<EditRounded />}>Update skills</Button>
            {selected ? (
              <Button component={Link} to={`/explore?role=${selected.role.id}`} variant="contained" startIcon={<HubRounded />}>Explore map</Button>
            ) : null}
          </>
        }
      />

      <Grid container spacing={3} alignItems="flex-start">
        {/* Column 1: You */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Panel title="You" action={<Typography variant="caption">Where you stand</Typography>}>
            <Stack spacing={2.5}>
              {CAT_ORDER.map((c) => {
                const rows = mySkills.filter((s) => skills.get(s.skill_id)?.category === c);
                if (!rows.length) return null;
                return (
                  <Box key={c}>
                    <Overline>{skillTone[c].label} ({rows.length})</Overline>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {rows.map((r) => (
                        <SkillChip key={r.skill_id} name={skills.get(r.skill_id)!.name} category={c} evidence={r.evidence} />
                      ))}
                    </Box>
                  </Box>
                );
              })}
              <CategoryLegend />
            </Stack>
          </Panel>
        </Grid>

        {/* Column 2: Gap */}
        <Grid size={{ xs: 12, lg: 5 }}>
          {selected ? (
            <Stack spacing={3}>
              <Panel
                title={<>Gap to {selected.role.title}</>}
                action={<StatusChip status={selected.status} pct={selected.pct} />}
              >
                <Box sx={{ mb: 2 }}>
                  <Box
                    role="img"
                    aria-label={`${selected.met.length} of ${selected.met.length + selected.gaps.length} requirements met`}
                    sx={{ display: "flex", gap: "2px", height: 8, borderRadius: 4, overflow: "hidden", mb: 1 }}
                  >
                    {[...selected.met.map(() => true), ...selected.gaps.map(() => false)].map((ok, i) => (
                      <Box key={i} sx={{ flex: 1, bgcolor: ok ? onto.ink : "#E2E8F0" }} />
                    ))}
                  </Box>
                  <Typography variant="body2" className="tabular">
                    <strong>{selected.met.length}</strong> of {selected.met.length + selected.gaps.length} requirements met.{" "}
                    {selected.gaps.length === 0 ? "You're ready to apply." : `${selected.gaps.length} to close.`}
                  </Typography>
                </Box>

                {selected.gaps.length === 0 ? (
                  <Box role="status" sx={{ display: "flex", gap: 1, alignItems: "center", p: 2, borderRadius: 2, bgcolor: statusTone.READY.bg, color: statusTone.READY.fg }}>
                    <CheckRounded aria-hidden /> Every requirement is met.
                  </Box>
                ) : (
                  <Stack component="ol" spacing={1.5} sx={{ listStyle: "none", p: 0, m: 0 }}>
                    {selected.gaps.map((g) => (
                      <Box component="li" key={g.skill.id} sx={{ border: `1px solid ${onto.borderSubtle}`, borderRadius: 2, p: 1.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                            <SkillChip name={g.skill.name} category={g.skill.category} />
                            <Chip
                              size="small"
                              label={g.requirement.importance === "core" ? "CORE" : "PREFERRED"}
                              variant="outlined"
                              sx={{ height: 20, fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", borderColor: onto.borderStrong, color: onto.muted }}
                            />
                          </Box>
                          <LevelMeter held={g.held} required={g.requirement.level} />
                        </Box>
                        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                          <SchoolRounded aria-hidden sx={{ fontSize: 16, color: onto.muted }} />
                          {g.programs.length ? (
                            g.programs.slice(0, 3).map((p, i) => (
                              <Typography key={p.id} variant="caption" sx={{ color: "#334155" }}>
                                {p.name} <Box component="span" sx={{ color: onto.muted }}>({p.provider}, {money(p.cost)})</Box>
                                {i < Math.min(g.programs.length, 3) - 1 ? " ·" : ""}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="caption">No mapped program yet. Ask a navigator.</Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Panel>

              {plan.length ? (
                <Panel title="Fastest path" action={<Typography variant="caption">Fewest programs to close the most gaps</Typography>}>
                  <Stack spacing={1.25}>
                    {plan.slice(0, 3).map(({ program, closes }, i) => (
                      <Box key={program.id} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                        <Box
                          aria-hidden
                          sx={{ width: 24, height: 24, flexShrink: 0, borderRadius: "50%", bgcolor: i === 0 ? onto.ink : "#F1F5F9", color: i === 0 ? "#fff" : onto.ink, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}
                        >
                          {i + 1}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: onto.ink }}>
                            {program.name}
                          </Typography>
                          <Typography variant="caption" component="p" className="tabular">
                            {program.provider} · {program.duration_weeks} weeks · {money(program.cost)} · {program.modality}
                          </Typography>
                          <Typography variant="caption" component="p">
                            Closes {closes.length}: {closes.map((c) => c.name).join(", ")}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Panel>
              ) : null}
            </Stack>
          ) : null}
        </Grid>

        {/* Column 3: Roles */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Panel title="Roles for you" action={<Typography variant="caption">Ranked by match</Typography>}>
            <Stack component="ul" spacing={1} sx={{ listStyle: "none", p: 0, m: 0 }}>
              {ranked.map((m) => {
                const active = m.role.id === selected?.role.id;
                return (
                  <li key={m.role.id}>
                    <ButtonBase
                      onClick={() => setParams({ role: m.role.id }, { replace: true })}
                      aria-pressed={active}
                      sx={{
                        width: "100%",
                        textAlign: "left",
                        display: "block",
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${active ? onto.action : onto.borderSubtle}`,
                        boxShadow: active ? `inset 0 0 0 1px ${onto.action}` : "none",
                        transition: "box-shadow .15s, border-color .15s",
                        "&:hover": { boxShadow: active ? `inset 0 0 0 1px ${onto.action}` : onto.elev2 },
                        "&.Mui-focusVisible": { outline: `2px solid ${onto.action}`, outlineOffset: 2 },
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "flex-start" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: onto.ink }}>{m.role.title}</Typography>
                        <StatusChip status={m.status} pct={m.pct} />
                      </Box>
                      <Typography variant="caption" component="p" className="tabular" sx={{ mt: 0.5 }}>
                        {money(m.role.median_wage)} median · {m.role.openings?.toLocaleString("en-US")} openings · {m.gaps.length} gap{m.gaps.length === 1 ? "" : "s"}
                      </Typography>
                    </ButtonBase>
                  </li>
                );
              })}
            </Stack>
            {selected ? (
              <MuiLink component={Link} to={`/roles/${selected.role.id}`} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mt: 2, fontSize: 14, fontWeight: 500 }}>
                {selected.role.title} details <ArrowForwardRounded aria-hidden sx={{ fontSize: 16 }} />
              </MuiLink>
            ) : null}
          </Panel>
        </Grid>
      </Grid>
    </>
  );
};
