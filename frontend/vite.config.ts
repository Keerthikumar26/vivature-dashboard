import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Put .tsx and .jsx BEFORE .ts and .js so React component folders
    // with index.tsx are found before any stale index.ts barrel files
    extensions: [".mjs", ".js", ".mts", ".jsx", ".tsx", ".ts", ".json"],
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
