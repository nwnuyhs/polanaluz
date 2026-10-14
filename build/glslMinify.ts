import type { Plugin } from "vite";

/**
 * 构建时压缩着色器源码：去掉 GLSL 里的 // 注释、缩进和空行（# 预处理指令仍各占一行）。
 * 着色器里的中文注释占了核心库体积的一大半，运行时用不到。
 */
export function glslMinify(): Plugin {
  return {
    name: "polanaluz-glsl-minify",
    apply: "build",
    transform(code, id) {
      if (!/[\/]core[\/]shaders\.ts$/.test(id)) return null;
      const out = code.replace(/`(#version[\s\S]*?)`/g, (_m, body: string) => {
        const lines = body
          .split("\n")
          .map((l) => l.replace(/\/\/.*$/, "").replace(/\s+/g, " ").trim())
          .filter(Boolean);
        return "`" + lines.join("\n") + "`";
      });
      return { code: out, map: null };
    },
  };
}
