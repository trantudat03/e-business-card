import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [tsconfigPaths(), react()],
    esbuild: {
      target: "es2020", // hoặc 'esnext'
    },
    build: {
      target: "es2020", // hoặc 'esnext'
    },
  });
};
