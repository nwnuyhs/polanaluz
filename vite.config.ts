import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { glslMinify } from "./build/glslMinify";

/**
 * 仅开发时：POST /__snap?name=xxx[&dir=examples]（body 为 PNG / WebP / JSON）→ 保存到 .snapshots/ 或 examples/，
 * 用来在原始分辨率下检查画面细节。生产构建不包含。
 */
function snapshots(): Plugin {
  return {
    name: "polanaluz-snapshots",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__snap", (req, res) => {
        if (req.method !== "POST") return void res.writeHead(405).end();
        const q = new URL(req.url ?? "", "http://x").searchParams;
        const name = (q.get("name") ?? "snap").replace(/[^\w.-]/g, "_");
        // 只允许写进 .snapshots/ 或 examples/（示例页用的静态图、配置）
        const sub = q.get("dir") === "examples" ? "examples" : ".snapshots";
        const file = /\.(png|webp|json)$/.test(name) ? name : `${name}.png`;
        const chunks: Buffer[] = [];
        req.on("data", (c: Buffer) => chunks.push(c));
        req.on("end", () => {
          const dir = resolve(__dirname, sub);
          mkdirSync(dir, { recursive: true });
          writeFileSync(resolve(dir, file), Buffer.concat(chunks));
          res.writeHead(200).end("ok");
        });
      });
    },
  };
}

// 生成器（studio）的开发与构建
export default defineConfig({
  // GitHub Pages 部署在 /polanaluz/ 下（见 .github/workflows/pages.yml）
  base: process.env.POLANALUZ_BASE ?? "/",
  plugins: [snapshots(), glslMinify()],
  server: { port: 5190 },
  build: { outDir: "dist/studio" },
});
