import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    // In dev the app calls /api/... and Vite forwards to the local server,
    // so there is no hardcoded production URL in the source.
    proxy: {
      "/api": {
        target: "http://localhost:5555",
        changeOrigin: true,
      },
    },
  },
});
