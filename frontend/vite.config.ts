import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@radix-ui/react-slider", "@radix-ui/react-checkbox"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5030",
        changeOrigin: true,
      },
    },
    middlewareMode: false,
  },
  preview: {
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});