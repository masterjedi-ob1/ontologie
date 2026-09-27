import { Autocomplete, Box, Stack, TextField, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { heldLevels, matchRole } from "@onto/engine";
import { useOntology } from "../state/OntologyState";
import { PageHeader, Panel, ViewToggle, type ViewMode } from "../components/Common";
import { GraphLegend, PathGraph, type GNode } from "../components/PathGraph";
import { roleGraph, skillGraph } from "../graphs";
import { EdgeTable } from "./EdgeTable";

type Opt = { key: string; label: string; group: string };

export const Explore = () => {
  const { ontology, talentId } = useOntology();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("graph");
  const held = useMemo(() => heldLevels(ontology.talentSkills, talentId), [ontology, talentId]);

  const roleId = params.get("role");
  const skillId = params.get("skill");
  const focus = skillId ? `skill:${skillId}` : `role:${roleId ?? "it-support"}`;

  const options = useMemo<Opt[]>(
    () => [
      ...ontology.roles.map((r) => ({ key: `role:${r.id}`, label: r.title, group: "Roles" })),
      ...[...ontology.skills].sort((a, b) => a.name.localeCompare(b.name)).map((s) => ({ key: `skill:${s.id}`, label: s.name, group: "Skills" })),
    ],
    [ontology],
  );

  const graph = useMemo(() => {
    if (focus.startsWith("skill:")) return skillGraph(focus.slice(6), ontology, held);
    const role = ontology.roles.find((r) => r.id === focus.slice(5)) ?? ontology.roles[0];
    return roleGraph(matchRole(ontology, role, held), ontology);
  }, [focus, ontology, held]);

  const current = options.find((o) => o.key === focus) ?? null;
  const setFocus = (key: string) => {
    const [kind, id] = key.split(":");
    setParams(kind === "role" ? { role: id } : { skill: id });
  };

  const onSelect = (n: GNode) => {
    const [kind, id] = n.id.split(":");
    if (kind === "role") setFocus(`role:${id}`);
    else if (kind === "prog") return;
    else setFocus(`skill:${id}`);
  };

  return (
    <>
      <PageHeader
        title="Explore map"
        meta="The ontology behind your path, one or two hops at a time. Select any skill or role to re-center."
        actions={<ViewToggle value={view} onChange={setView} />}
      />
      <Panel>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between" sx={{ mb: 2 }}>
          <Autocomplete
            options={options}
            groupBy={(o) => o.group}
            value={current}
            onChange={(_, v) => v && setFocus(v.key)}
            isOptionEqualToValue={(a, b) => a.key === b.key}
            sx={{ width: { xs: "100%", md: 360 } }}
            renderInput={(p) => <TextField {...p} label="Center on" size="small" />}
          />
          <GraphLegend />
        </Stack>
        {graph.nodes.length ? (
          view === "graph" ? (
            <PathGraph
              nodes={graph.nodes}
              edges={graph.edges}
              columns={graph.columns}
              onSelect={onSelect}
              ariaLabel={`Ontology map centered on ${current?.label ?? "selection"}. ${graph.nodes.length} nodes. Use Tab to move between nodes and Enter to re-center.`}
            />
          ) : (
            <EdgeTable nodes={graph.nodes} edges={graph.edges} caption={`Relationships around ${current?.label ?? "selection"}`} />
          )
        ) : (
          <Typography variant="body2">Nothing mapped for this selection yet.</Typography>
        )}
        {focus.startsWith("role:") ? (
          <Box sx={{ mt: 2 }}>
            <Typography
              component="button"
              onClick={() => navigate(`/roles/${focus.slice(5)}`)}
              sx={{ all: "unset", cursor: "pointer", color: "#2563EB", fontSize: 14, fontWeight: 500, "&:hover": { textDecoration: "underline" }, "&:focus-visible": { outline: "2px solid #2563EB", outlineOffset: 2 } }}
            >
              Open role details →
            </Typography>
          </Box>
        ) : null}
      </Panel>
    </>
  );
};
