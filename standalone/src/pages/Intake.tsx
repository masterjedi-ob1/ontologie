import { Alert, Autocomplete, Box, Button, Checkbox, FormControlLabel, FormLabel, MenuItem, Stack, Step, StepLabel, Stepper, TextField, Typography, FormControl, FormGroup } from "@mui/material";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { indexBy, matchRole } from "@onto/engine";
import type { Evidence, Skill } from "@onto/types";
import { onto } from "@onto/tokens";
import { useOntology } from "../state/OntologyState";
import { PageHeader, Panel } from "../components/Common";
import { SkillChip, StatusChip } from "../components/Chips";

/** Keyword cues for the no-LLM demo extractor. Swap for a real model later. */
const CUES: Record<string, string[]> = {
  "hw-troubleshoot": ["troubleshoot", "hardware", "repair", "fix computers", "imaging"],
  "os-admin": ["windows", "macos", "operating system", "os install"],
  networking: ["network", "tcp", "router", "wifi", "wi-fi", "lan"],
  ticketing: ["ticket", "servicenow", "jira", "help desk", "helpdesk"],
  "active-dir": ["active directory", "password reset", "user accounts"],
  scripting: ["python", "powershell", "script", "bash"],
  sql: ["sql", "query", "database"],
  spreadsheets: ["excel", "spreadsheet", "google sheets", "inventory"],
  "data-viz": ["tableau", "power bi", "dashboard", "chart"],
  "security-basics": ["security", "phishing", "cyber"],
  crm: ["salesforce", "hubspot", "crm"],
  "customer-service": ["customer", "guest", "client", "service"],
  communication: ["communicat", "present", "writing", "explain"],
  "problem-solving": ["problem", "resolve", "solution"],
  teamwork: ["team", "collaborat", "crew"],
  "time-mgmt": ["schedul", "deadline", "shift", "time management"],
  "attention-detail": ["detail", "accuracy", "audit", "quality"],
  "cash-handling": ["cash", "register", "pos", "point of sale"],
  safety: ["safety", "osha"],
  "google-it": ["google it"],
  "comptia-a": ["a+"],
  "comptia-net": ["network+"],
  "comptia-sec": ["security+"],
  "google-da": ["google data analytics"],
  "osha-10": ["osha 10", "osha-10"],
  cnc: ["cnc", "machin"],
  blueprint: ["blueprint", "schematic"],
  plc: ["plc", "automation"],
};

const SAMPLE_RESUME = `Shift Lead, Target (2022–present). Led a crew of 8, handled cash register close-out and POS issues, scheduled shifts, and resolved customer escalations. Kept inventory spreadsheets in Excel.
Google IT Support Certificate (2025). Hands-on labs: troubleshooting hardware, Windows and macOS setup, basic help desk ticket workflow.`;

const extract = (text: string, skills: Skill[]) => {
  const t = text.toLowerCase();
  return skills.filter((s) => (CUES[s.id] ?? [s.name.toLowerCase()]).some((c) => t.includes(c))).map((s) => s.id);
};

type Row = { skill_id: string; level: number; evidence: Evidence };
const STEPS = ["Tell us about you", "Confirm your skills", "Pick targets"];

export const Intake = () => {
  const { ontology, talentName, mySkills, interests, saveProfile, resetDemo } = useOntology();
  const navigate = useNavigate();
  const skills = useMemo(() => indexBy(ontology.skills, "id"), [ontology]);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(talentName);
  const [resume, setResume] = useState("");
  const [rows, setRows] = useState<Row[]>(mySkills.map(({ skill_id, level, evidence }) => ({ skill_id, level, evidence })));
  const [targets, setTargets] = useState<string[]>(interests);
  const [found, setFound] = useState<number | null>(null);

  const runExtract = () => {
    const ids = extract(resume, ontology.skills);
    setRows((prev) => {
      const have = new Set(prev.map((r) => r.skill_id));
      return [...prev, ...ids.filter((id) => !have.has(id)).map((skill_id) => ({ skill_id, level: 2, evidence: "resume" as Evidence }))];
    });
    setFound(ids.length);
  };

  const held = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.skill_id, r.level));
    return m;
  }, [rows]);

  const finish = () => {
    saveProfile({ name: name.trim() || "You", skills: rows, interests: targets });
    navigate(targets[0] ? `/?role=${targets[0]}` : "/");
  };

  return (
    <>
      <PageHeader title="Update your skills" meta="Three short steps. Everything stays in this browser." />
      <Panel sx={{ maxWidth: 880 }}>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((s) => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
        </Stepper>

        {step === 0 && (
          <Stack spacing={2.5}>
            <Typography variant="h3" component="h2">Tell us about you</Typography>
            <TextField label="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" sx={{ maxWidth: 400 }} />
            <TextField
              label="Paste your resume or describe your experience"
              placeholder="e.g. Shift lead at a retail store, handled the register and trained new hires…"
              multiline
              minRows={6}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button variant="contained" startIcon={<AutoAwesomeRounded />} onClick={runExtract} disabled={!resume.trim()}>Find my skills</Button>
              <Button variant="outlined" onClick={() => setResume(SAMPLE_RESUME)}>Use sample resume</Button>
            </Stack>
            {found != null ? (
              <Alert severity={found ? "success" : "info"} role="status">
                {found ? `Found ${found} skill${found === 1 ? "" : "s"}. You'll confirm them next.` : "No skills matched. You can add them by hand next."}
              </Alert>
            ) : null}
          </Stack>
        )}

        {step === 1 && (
          <Stack spacing={2.5}>
            <Typography variant="h3" component="h2">Confirm your skills</Typography>
            <Typography variant="body2">Set a level for each (1 = learning, 4 = could teach it). Remove anything that isn't you.</Typography>
            <Autocomplete
              options={ontology.skills.filter((s) => !held.has(s.id))}
              getOptionLabel={(s) => s.name}
              groupBy={(s) => s.category[0].toUpperCase() + s.category.slice(1)}
              value={null}
              onChange={(_, s) => s && setRows((p) => [...p, { skill_id: s.id, level: 1, evidence: "self" }])}
              renderInput={(p) => <TextField {...p} label="Add a skill" placeholder="e.g. SQL" />}
              sx={{ maxWidth: 400 }}
              blurOnSelect
            />
            <Stack spacing={1}>
              {rows.map((r, i) => {
                const s = skills.get(r.skill_id);
                if (!s) return null;
                return (
                  <Box key={r.skill_id} sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", p: 1, border: `1px solid ${onto.borderSubtle}`, borderRadius: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <SkillChip name={s.name} category={s.category} evidence={r.evidence} onDelete={() => setRows((p) => p.filter((_, j) => j !== i))} />
                    </Box>
                    <TextField
                      select
                      size="small"
                      label="Level"
                      value={r.level}
                      onChange={(e) => setRows((p) => p.map((x, j) => (j === i ? { ...x, level: Number(e.target.value) } : x)))}
                      sx={{ width: 150 }}
                      slotProps={{ htmlInput: { "aria-label": `Level for ${s.name}` } }}
                    >
                      {[1, 2, 3, 4].map((l) => <MenuItem key={l} value={l}>L{l} · {["Learning", "Working", "Strong", "Expert"][l - 1]}</MenuItem>)}
                    </TextField>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={2.5}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ mb: 1.5 }}>
                <Typography variant="h3" component="h2">Pick up to 3 target roles</Typography>
              </FormLabel>
              <FormGroup>
                {ontology.roles.map((role) => {
                  const m = matchRole(ontology, role, held);
                  const checked = targets.includes(role.id);
                  return (
                    <FormControlLabel
                      key={role.id}
                      sx={{ m: 0, py: 0.5, pr: 1, borderRadius: 1, "&:hover": { bgcolor: onto.canvas } }}
                      control={
                        <Checkbox
                          checked={checked}
                          disabled={!checked && targets.length >= 3}
                          onChange={() => setTargets((t) => (checked ? t.filter((x) => x !== role.id) : [...t, role.id]))}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                          <span>{role.title}</span>
                          <StatusChip status={m.status} pct={m.pct} />
                        </Box>
                      }
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          </Stack>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 1, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button startIcon={<ArrowBackRounded />} disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
            <Button color="inherit" onClick={() => { resetDemo(); navigate("/"); }}>Reset to demo persona</Button>
          </Box>
          {step < 2 ? (
            <Button variant="contained" endIcon={<ArrowForwardRounded />} onClick={() => setStep((s) => s + 1)} disabled={step === 1 && rows.length === 0}>Continue</Button>
          ) : (
            <Button variant="contained" size="large" onClick={finish}>See my map</Button>
          )}
        </Box>
      </Panel>
    </>
  );
};
