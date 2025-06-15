import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = "planetizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? `/${repositoryName}/` : "/",
  plugins: [react()],
  server: {
    port: 8007,
  },
}));
