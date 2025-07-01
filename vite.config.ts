import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  test: {
    exclude: ["node_modules", "e2e/**"],
    environment: "jsdom",
    server: {
      deps: {
        inline: ["vuetify"],
      },
    },
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
