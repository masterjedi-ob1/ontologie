import { Box, Chip, Tooltip } from "@mui/material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import DescriptionRounded from "@mui/icons-material/DescriptionRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import type { Evidence, MatchStatus, SkillCategory } from "@onto/types";
import { skillTone, statusTone } from "@onto/tokens";

const STATUS_ICON = { READY: CheckCircleRounded, CLOSE: AccessTimeRounded, STRETCH: TrendingUpRounded } as const;

/** READY / CLOSE / STRETCH. Always icon + text, never color alone. */
export const StatusChip = ({ status, pct }: { status: MatchStatus; pct?: number }) => {
  const t = statusTone[status];
  const Icon = STATUS_ICON[status];
  return (
    <Chip
      size="small"
      icon={<Icon aria-hidden sx={{ fontSize: 14, color: `${t.fg} !important` }} />}
      label={pct == null ? status : `${status} · ${pct}%`}
      sx={{
        height: 24,
        borderRadius: "6px",
        bgcolor: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.05em",
        fontVariantNumeric: "tabular-nums",
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
};

const EVIDENCE: Record<Evidence, { Icon: typeof VerifiedRounded; label: string }> = {
  verified: { Icon: VerifiedRounded, label: "Verified" },
  resume: { Icon: DescriptionRounded, label: "From resume" },
  self: { Icon: PersonRounded, label: "Self-reported" },
};

export const SkillChip = ({
  name,
  category,
  evidence,
  onDelete,
  onClick,
  selected,
}: {
  name: string;
  category: SkillCategory;
  evidence?: Evidence;
  onDelete?: () => void;
  onClick?: () => void;
  selected?: boolean;
}) => {
  const t = skillTone[category];
  const ev = evidence ? EVIDENCE[evidence] : null;
  const chip = (
    <Chip
      size="small"
      label={name}
      onDelete={onDelete}
      onClick={onClick}
      icon={ev ? <ev.Icon aria-hidden sx={{ fontSize: 14, color: `${t.fg} !important` }} /> : undefined}
      aria-label={`${name}, ${t.label.toLowerCase()} skill${ev ? `, ${ev.label.toLowerCase()}` : ""}`}
      sx={{
        height: 26,
        borderRadius: "6px",
        bgcolor: t.bg,
        color: t.fg,
        border: `1px solid ${selected ? t.fg : t.border}`,
        boxShadow: selected ? `inset 0 0 0 1px ${t.fg}` : "none",
        fontWeight: 500,
        maxWidth: "100%",
        "& .MuiChip-deleteIcon": { color: t.fg, opacity: 0.7, "&:hover": { color: t.fg, opacity: 1 } },
      }}
    />
  );
  return ev ? <Tooltip title={ev.label}>{chip}</Tooltip> : chip;
};

export const CategoryLegend = () => (
  <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }} aria-label="Skill categories">
    {(Object.keys(skillTone) as SkillCategory[]).map((c) => (
      <Box key={c} sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 12, color: "text.secondary" }}>
        <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: skillTone[c].bg, border: `2px solid ${skillTone[c].fg}` }} />
        {skillTone[c].label}
      </Box>
    ))}
  </Box>
);

/** 4-step level meter. Text label carries the value; blocks are reinforcement. */
export const LevelMeter = ({ held, required }: { held: number; required?: number }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} aria-label={required ? `Level ${held} of ${required} required` : `Level ${held} of 4`}>
    <Box aria-hidden sx={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4].map((i) => (
        <Box
          key={i}
          sx={{
            width: 14,
            height: 6,
            borderRadius: "3px",
            bgcolor: i <= held ? "#0F172A" : i <= (required ?? 0) ? "transparent" : "#E2E8F0",
            border: i > held && i <= (required ?? 0) ? "1.5px dashed #94A3B8" : "none",
          }}
        />
      ))}
    </Box>
    <Box component="span" className="tabular" sx={{ fontSize: 12, color: "text.secondary" }}>
      {required ? `L${held} / L${required}` : `L${held}`}
    </Box>
  </Box>
);
