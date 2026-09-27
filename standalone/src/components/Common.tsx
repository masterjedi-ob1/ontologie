import { Box, Paper, ToggleButton, ToggleButtonGroup, Typography, type SxProps } from "@mui/material";
import AccountTreeRounded from "@mui/icons-material/AccountTreeRounded";
import TableRowsRounded from "@mui/icons-material/TableRowsRounded";
import type { ReactNode } from "react";

export const PageHeader = ({ title, eyebrow, meta, actions }: { title: ReactNode; eyebrow?: ReactNode; meta?: ReactNode; actions?: ReactNode }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 3 }}>
    <Box sx={{ minWidth: 0 }}>
      {eyebrow ? <Box sx={{ mb: 1 }}>{eyebrow}</Box> : null}
      <Typography variant="h1" sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}>
        {title}
      </Typography>
      {meta ? <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>{meta}</Typography> : null}
    </Box>
    {actions ? <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>{actions}</Box> : null}
  </Box>
);

export const Panel = ({ title, action, children, sx, headingLevel = "h2" }: { title?: ReactNode; action?: ReactNode; children: ReactNode; sx?: SxProps; headingLevel?: "h2" | "h3" }) => (
  <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, boxShadow: "0 1px 3px 0 rgba(15,23,42,0.05), 0 1px 2px -1px rgba(15,23,42,0.05)", minWidth: 0, ...sx }}>
    {title ? (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 2 }}>
        <Typography variant="h3" component={headingLevel} sx={{ fontSize: "1rem" }}>
          {title}
        </Typography>
        {action}
      </Box>
    ) : null}
    {children}
  </Paper>
);

export const Overline = ({ children }: { children: ReactNode }) => (
  <Typography variant="overline" component="p" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
    {children}
  </Typography>
);

export type ViewMode = "graph" | "table";

/** Required on every mapping view (DESIGN.md §6): graph ↔ accessible table. */
export const ViewToggle = ({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) => (
  <ToggleButtonGroup
    size="small"
    exclusive
    value={value}
    onChange={(_, v) => v && onChange(v)}
    aria-label="View as"
    sx={{ "& .MuiToggleButton-root": { textTransform: "none", px: 1.5, gap: 0.75, borderColor: "#CBD5E1" } }}
  >
    <ToggleButton value="graph" aria-label="Graph view">
      <AccountTreeRounded aria-hidden sx={{ fontSize: 18 }} /> Graph
    </ToggleButton>
    <ToggleButton value="table" aria-label="Table view">
      <TableRowsRounded aria-hidden sx={{ fontSize: 18 }} /> Table
    </ToggleButton>
  </ToggleButtonGroup>
);

export const EmptyState = ({ icon, title, body, action }: { icon: ReactNode; title: string; body?: string; action?: ReactNode }) => (
  <Box role="status" sx={{ textAlign: "center", py: 6, px: 2, color: "text.secondary" }}>
    <Box aria-hidden sx={{ "& svg": { fontSize: 36 }, mb: 1, color: "#94A3B8" }}>{icon}</Box>
    <Typography variant="h4" component="p" sx={{ color: "text.primary" }}>{title}</Typography>
    {body ? <Typography variant="body2" sx={{ mt: 0.5, mb: 2 }}>{body}</Typography> : null}
    {action}
  </Box>
);
