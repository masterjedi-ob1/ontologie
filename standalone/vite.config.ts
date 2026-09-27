import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";

// The ontology engine, seed data, types and tokens are shared with the Taruvi
// app (../src/ontology). Only the pure modules are imported, never the
// Refine-backed context, so this app never talks to Taruvi.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@onto": path.resolve(__dirname, "../src/ontology") },
    dedupe: ["react", "react-dom"],
  },
});
