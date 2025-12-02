import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@radix-ui/react-slider", "@radix-ui/react-checkbox"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5030", // Backend server
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
