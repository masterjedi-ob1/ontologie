import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Link } from "react-router";
import { Button, CssBaseline, ThemeProvider } from "@mui/material";
import SearchOffRounded from "@mui/icons-material/SearchOffRounded";
import "@fontsource-variable/inter";
import { theme } from "./theme";
import { OntologyState } from "./state/OntologyState";
import { Layout } from "./components/Layout";
import { EmptyState } from "./components/Common";
import { MyMap } from "./pages/MyMap";
import { Explore } from "./pages/Explore";
import { Roles } from "./pages/Roles";
import { RoleDetail } from "./pages/RoleDetail";
import { Navigator } from "./pages/Navigator";
import { Intake } from "./pages/Intake";

const NotFound = () => (
  <EmptyState icon={<SearchOffRounded />} title="Page not found" action={<Button component={Link} to="/" variant="contained">Go to My Map</Button>} />
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <OntologyState>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<MyMap />} />
              <Route path="explore" element={<Explore />} />
              <Route path="roles" element={<Roles />} />
              <Route path="roles/:id" element={<RoleDetail />} />
              <Route path="navigator" element={<Navigator />} />
              <Route path="intake" element={<Intake />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </OntologyState>
    </ThemeProvider>
  </StrictMode>,
);
