/** 小工具：可复现随机数、颜色换算、一维平滑噪声 */

/** mulberry32：同一种子得到同一序列，保证"同一配置 = 同一画面" */
export function rng(seed: number): () => number {
  let a = (seed >>> 0) || 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return [0, 0, 0];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function rgbToHex([r, g, b]: RGB): string {
  const c = (v: number) => Math.round(clamp(v, 0, 1) * 255).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const deg = (d: number) => (d * Math.PI) / 180;

/** sRGB → 线性（着色器里做线性空间的光照相加，最后再转回去） */
export const toLinear = (c: RGB): RGB => c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as RGB;

/** 色温（K）→ 近似 RGB（Tanner Helland 拟合），用于白光段的冷暖 */
export function kelvinToRgb(k: number): RGB {
  const t = clamp(k, 1000, 40000) / 100;
  let r: number, g: number, b: number;
  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * (t - 60) ** -0.1332047592;
    g = 288.1221695283 * (t - 60) ** -0.0755148492;
    b = 255;
  }
  return [clamp(r, 0, 255) / 255, clamp(g, 0, 255) / 255, clamp(b, 0, 255) / 255];
}

/** 一维值噪声（0..1），用于云层明暗和漂移，平滑且不重复 */
export function noise1(x: number, seed = 0): number {
  const h = (i: number) => {
    const s = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return h(i) * (1 - u) + h(i + 1) * u;
}

/** 按权重抽取下标 */
export function pickWeighted(weights: number[], r: number): number {
  const total = weights.reduce((s, w) => s + Math.max(0, w), 0);
  if (total <= 0) return 0;
  let x = r * total;
  for (let i = 0; i < weights.length; i++) {
    x -= Math.max(0, weights[i]);
    if (x < 0) return i;
  }
  return weights.length - 1;
}

/** 深合并（数组按下标合并），用于 set() 局部更新和读取旧配置 */
export function deepMerge<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base;
  if (base === undefined) return patch as T;
  if (Array.isArray(base)) {
    if (!Array.isArray(patch)) return base;
    const tpl = base[base.length - 1];
    return patch.map((p, i) => deepMerge(i < base.length ? base[i] : tpl, p)) as T;
  }
  if (typeof base === "object" && base !== null) {
    if (typeof patch !== "object") return base;
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
      out[k] = k in out ? deepMerge(out[k], v) : v;
    }
    return out as T;
  }
  return (typeof patch === typeof base ? patch : base) as T;
}

export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
