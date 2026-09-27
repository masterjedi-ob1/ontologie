import { Box, Button, Chip, InputAdornment, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Link as MuiLink } from "@mui/material";
import { Link, useSearchParams } from "react-router";
import { useMemo } from "react";
import SearchRounded from "@mui/icons-material/SearchRounded";
import SearchOffRounded from "@mui/icons-material/SearchOffRounded";
import FilterListRounded from "@mui/icons-material/FilterListRounded";
import { heldLevels, rankRoles } from "@onto/engine";
import { money } from "@onto/tokens";
import type { MatchStatus } from "@onto/types";
import { useOntology } from "../state/OntologyState";
import { EmptyState, PageHeader, Panel } from "../components/Common";
import { StatusChip } from "../components/Chips";

const STATUSES: MatchStatus[] = ["READY", "CLOSE", "STRETCH"];

export const Roles = () => {
  const { ontology, talentId } = useOntology();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const status = (params.get("status") as MatchStatus | null) ?? "";
  const held = useMemo(() => heldLevels(ontology.talentSkills, talentId), [ontology, talentId]);
  const ranked = useMemo(() => rankRoles(ontology, held), [ontology, held]);

  const update = (next: Record<string, string>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) (v ? p.set(k, v) : p.delete(k));
    setParams(p, { replace: true });
  };

  const rows = ranked.filter(
    (m) => (!status || m.status === status) && (!q || `${m.role.title} ${m.role.soc_code}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <PageHeader title="Roles" meta={`${ontology.roles.length} entry-level roles in the Northeast Ohio sample, ranked against your skills`} />
      <Panel>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
          <TextField
            size="small"
            label="Search roles"
            placeholder="e.g. analyst"
            value={q}
            onChange={(e) => update({ q: e.target.value })}
            sx={{ width: { xs: "100%", sm: 300 } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRounded aria-hidden fontSize="small" /></InputAdornment> } }}
          />
          <TextField select size="small" label="Match" value={status} onChange={(e) => update({ status: e.target.value })} sx={{ width: { xs: "100%", sm: 180 } }}>
            <MenuItem value="">All</MenuItem>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Stack>
        {status ? (
          <Box sx={{ mb: 1.5, display: "flex", gap: 1, alignItems: "center" }}>
            <Chip size="small" label={`Match: ${status}`} onDelete={() => update({ status: "" })} />
            <Button size="small" onClick={() => update({ status: "" })}>Clear all</Button>
          </Box>
        ) : null}
        <Box aria-live="polite" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
          {rows.length} roles shown
        </Box>
        {rows.length ? (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Match</TableCell>
                  <TableCell align="right">Median wage</TableCell>
                  <TableCell align="right">Openings</TableCell>
                  <TableCell align="right">Gaps</TableCell>
                  <TableCell>Entry education</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((m) => (
                  <TableRow key={m.role.id} hover sx={{ height: 52 }}>
                    <TableCell>
                      <MuiLink component={Link} to={`/roles/${m.role.id}`} sx={{ fontWeight: 600 }}>{m.role.title}</MuiLink>
                      <Typography variant="caption" component="p">SOC {m.role.soc_code ?? "—"}</Typography>
                    </TableCell>
                    <TableCell><StatusChip status={m.status} pct={m.pct} /></TableCell>
                    <TableCell align="right" className="tabular">{money(m.role.median_wage)}</TableCell>
                    <TableCell align="right" className="tabular">{m.role.openings?.toLocaleString("en-US") ?? "—"}</TableCell>
                    <TableCell align="right" className="tabular">{m.gaps.length}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{m.role.entry_education ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : q ? (
          <EmptyState icon={<SearchOffRounded />} title="No roles match that search" action={<Button variant="outlined" onClick={() => update({ q: "" })}>Clear search</Button>} />
        ) : (
          <EmptyState icon={<FilterListRounded />} title="No roles at that match level" action={<Button variant="outlined" onClick={() => update({ status: "" })}>Clear all filters</Button>} />
        )}
      </Panel>
    </>
  );
};
