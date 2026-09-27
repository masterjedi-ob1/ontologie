import { AppBar, Box, Chip, Container, Link as MuiLink, Toolbar, Tooltip, Typography } from "@mui/material";
import { NavLink, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import { onto } from "@onto/tokens";

const NAV = [
  { to: "/", label: "My Map", title: "My Map" },
  { to: "/explore", label: "Explore", title: "Explore map" },
  { to: "/roles", label: "Roles", title: "Roles" },
  { to: "/navigator", label: "Navigator", title: "Navigator dashboard" },
  { to: "/intake", label: "Update skills", title: "Update your skills" },
];

export const Logo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
    <rect width="32" height="32" rx="8" fill={onto.ink} />
    <circle cx="9.5" cy="16" r="4" fill="#fff" />
    <path d="M13.5 16h4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <rect x="18" y="12" width="8" height="8" rx="2" fill={onto.action} />
  </svg>
);

export const Layout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const hit = [...NAV].reverse().find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)));
    document.title = hit ? `${hit.title} · Ontologie` : "Ontologie";
  }, [pathname]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <MuiLink
        href="#main"
        sx={{ position: "absolute", left: 8, top: -48, zIndex: 2000, bgcolor: "#fff", px: 2, py: 1, borderRadius: 1, "&:focus": { top: 8 } }}
      >
        Skip to content
      </MuiLink>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ bgcolor: "#fff", borderBottom: `1px solid ${onto.borderSubtle}` }}>
        <Toolbar sx={{ gap: 2, minHeight: { xs: 56 }, px: { xs: 2, md: 4 } }}>
          <Box component={NavLink} to="/" sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none", color: "inherit", flexShrink: 0 }}>
            <Logo />
            <Typography component="span" sx={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>
              Ontologie
            </Typography>
          </Box>
          <Box component="nav" aria-label="Primary" sx={{ display: "flex", gap: 0.5, overflowX: "auto", flex: 1, scrollbarWidth: "none" }}>
            {NAV.map((n) => (
              <Box
                key={n.to}
                component={NavLink}
                to={n.to}
                end={n.to === "/"}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: "6px",
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  color: onto.muted,
                  textDecoration: "none",
                  "&:hover": { color: onto.ink, bgcolor: onto.canvas },
                  "&.active": { color: onto.ink, bgcolor: "#F1F5F9" },
                }}
              >
                {n.label}
              </Box>
            ))}
          </Box>
          <Tooltip title="Illustrative Northeast Ohio data. Wages, openings and program costs are placeholders, not sourced figures.">
            <Chip
              icon={<ScienceRounded aria-hidden sx={{ fontSize: 16 }} />}
              label="Sample data"
              size="small"
              variant="outlined"
              sx={{ display: { xs: "none", sm: "inline-flex" }, borderColor: onto.borderStrong, color: onto.muted, fontWeight: 500 }}
            />
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container component="main" id="main" tabIndex={-1} maxWidth={false} sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1440, outline: "none" }}>
        <Outlet />
      </Container>
    </Box>
  );
};
