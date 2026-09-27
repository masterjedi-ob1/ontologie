import { createTheme } from "@mui/material/styles";
import { onto } from "@onto/tokens";

const FONT = "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";

/** "Taruvi Enterprise Path" (Stitch DESIGN.md) expressed as an MUI theme. */
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: onto.ink, contrastText: "#fff" },
    secondary: { main: onto.action, contrastText: "#fff" },
    background: { default: onto.canvas, paper: onto.card },
    text: { primary: onto.ink, secondary: onto.muted },
    divider: onto.borderSubtle,
    success: { main: "#047857" },
    warning: { main: "#B45309" },
    info: { main: "#4338CA" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: FONT,
    h1: { fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.22, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.875rem", fontWeight: 600, lineHeight: 1.27, letterSpacing: "-0.015em" },
    h3: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.01em" },
    h4: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: "1rem", lineHeight: 1.625, color: "#334155" },
    body2: { fontSize: "0.875rem", lineHeight: 1.57, color: "#334155" },
    caption: { fontSize: "0.75rem", lineHeight: 1.5, color: onto.muted },
    overline: { fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em", lineHeight: 1.3 },
    button: { textTransform: "none", fontWeight: 500, fontSize: "0.875rem" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: onto.canvas, WebkitFontSmoothing: "antialiased" },
        ".tabular": { fontVariantNumeric: "tabular-nums" },
        "h1, h2, h3": { textWrap: "balance" },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { outlined: { borderColor: onto.borderSubtle } },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { borderColor: onto.borderSubtle, boxShadow: onto.elev1 } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 6, minHeight: 36, touchAction: "manipulation" },
        sizeLarge: { minHeight: 44 },
        outlined: { borderColor: onto.borderStrong, color: onto.ink, "&:hover": { background: onto.canvas, borderColor: onto.borderStrong } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          background: "#fff",
          "& fieldset": { borderColor: onto.borderStrong },
          "&.Mui-focused fieldset": { borderColor: `${onto.action} !important`, boxShadow: "0 0 0 3px rgba(37,99,235,0.15)" },
        },
        input: { fontSize: 16 },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { "&.Mui-focused": { color: onto.action } } } },
    MuiTab: { styleOverrides: { root: { textTransform: "none", fontWeight: 500, minHeight: 44 } } },
    MuiTableCell: {
      styleOverrides: {
        head: { background: onto.canvas, color: onto.muted, fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: `2px solid ${onto.borderSubtle}` },
        body: { borderBottom: "1px solid #F1F5F9", fontSize: "0.875rem" },
      },
    },
    MuiTooltip: { styleOverrides: { tooltip: { background: onto.ink, fontSize: "0.75rem" } } },
    MuiLink: { defaultProps: { underline: "hover" }, styleOverrides: { root: { color: onto.action } } },
  },
});
