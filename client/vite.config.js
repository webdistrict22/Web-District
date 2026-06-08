import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll("\\", "/");

          if (normalizedId.endsWith("/src/i18n/translations.js")) {
            return "translations";
          }

          if (!normalizedId.includes("/node_modules/")) return undefined;

          if (
            normalizedId.includes("/react/") ||
            normalizedId.includes("/react-dom/") ||
            normalizedId.includes("/react-router-dom/")
          ) {
            return "react-vendor";
          }

          if (
            normalizedId.includes("/lucide-react/") ||
            normalizedId.includes("/react-icons/")
          ) {
            return "icons-vendor";
          }

          if (normalizedId.includes("/axios/")) {
            return "http-vendor";
          }

          if (normalizedId.includes("/react-hot-toast/")) {
            return "ui-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});
