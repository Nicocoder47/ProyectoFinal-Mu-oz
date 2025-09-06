// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración para Vite 
export default defineConfig({
  plugins: [react()],
  base: "/", 
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
