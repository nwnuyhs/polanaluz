import { defineConfig } from "vite";
import { glslMinify } from "./build/glslMinify";

// 核心库：零依赖，输出 ESM + IIFE（<script> 直接用，全局变量 Polanaluz）
export default defineConfig({
  plugins: [glslMinify()],
  publicDir: false,
  build: {
    outDir: "dist/lib",
    emptyOutDir: true,
    lib: {
      entry: "src/core/index.ts",
      name: "Polanaluz",
      formats: ["es", "iife"],
      fileName: (f) => (f === "es" ? "polanaluz.esm.js" : "polanaluz.min.js"),
    },
  },
});
