import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router-dom/")
          ) {
            return "react-vendor";
          }

          if (id.includes("/framer-motion/")) {
            return "animation-vendor";
          }

          if (id.includes("/lucide-react/") || id.includes("/react-icons/")) {
            return "icons-vendor";
          }

          if (id.includes("/axios/")) {
            return "http-vendor";
          }

          if (id.includes("/react-hot-toast/")) {
            return "ui-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});
