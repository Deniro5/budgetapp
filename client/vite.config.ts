import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      types: path.resolve(__dirname, "src/types"),
      store: path.resolve(__dirname, "src/store"),
      components: path.resolve(__dirname, "src/components"),
      constants: path.resolve(__dirname, "src/constants"),
      styles: path.resolve(__dirname, "src/styles"),
      theme: path.resolve(__dirname, "src/Theme"),
      utils: path.resolve(__dirname, "src/utils"),
    },
  },
  server: {
    port: 3000,
  },
});
