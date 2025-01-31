import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "./src/domain"),
      "@handler": path.resolve(__dirname, "./src/handler"),
      "@infra": path.resolve(__dirname, "./src/infra"),
      "@injector": path.resolve(__dirname, "./src/injector"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@view": path.resolve(__dirname, "./src/view"),
      "@assets": path.resolve(__dirname, "./src/view/assets"),
      "@hooks": path.resolve(__dirname, "./src/view/hooks"),
      "@organisms": path.resolve(__dirname, "./src/view/organisms"),
      "@pages": path.resolve(__dirname, "./src/view/pages"),
      "@providers": path.resolve(__dirname, "./src/view/providers"),
      "@routes": path.resolve(__dirname, "./src/view/routes"),
      assets: path.resolve(__dirname, "src/view/assets"),
    },
  },
});
