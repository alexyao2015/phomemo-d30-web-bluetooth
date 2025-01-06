import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  base: process.env.BASE_URL || "/",
  plugins: [vue(), vuetify({ autoImport: true })],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  esbuild: {
    legalComments: "none",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
