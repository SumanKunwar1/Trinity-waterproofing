import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@radix-ui/react-slider", "@radix-ui/react-checkbox"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
