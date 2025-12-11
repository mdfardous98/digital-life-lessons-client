// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // FIX: Explicitly set the base path. This is the most common fix
  // for "Failed to fetch dynamically imported module" errors in production/deployment.
  base: "/", // Should be '/' if deployed to the root of a domain.
  // Change to '/repo-name/' if deployed to a subfolder (like GitHub Pages).
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      // Add any aliases you need
    },
  },
});
