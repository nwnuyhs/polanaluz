/**
 * 玻璃图案：用 Canvas2D 画成一张小纹理，着色器再把它"投影"到地面。
 * 黑色 = 不透光（混凝土 / 窗框），彩色 = 玻璃透过的光。
 *
 * 真实的彩色玻璃不是均匀色块：厚薄不均（同一块里有深浅渐变）、切口不完全平直、
 * 有气泡和拉丝条纹。这些细节投到地面后，就是光斑里"活"的部分。
 *
 * 纹理坐标：canvas 顶部 = 窗户顶部。
 */
import type { PaletteConfig, WindowGroup } from "./types";
import { clamp, hexToRgb, pickWeighted, rgbToHex, rng, type RGB } from "./util";

export const PATTERN_SIZE = 512;
/** 四周留黑边，投影时窗外自然是 0 */
const BORDER = 4;

/** 透明白玻璃：略带暖色 */
const WHITE_GLASS: RGB = [1, 0.96, 0.86];

function saturate([r, g, b]: RGB, s: number): RGB {
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return [r, g, b].map((v) => clamp(l + (v - l) * s, 0, 1)) as RGB;
}

const shade = (c: RGB, k: number): RGB => c.map((v) => clamp(v * k, 0, 1)) as RGB;
/** 向白色靠一点（玻璃较薄处更亮、更淡） */
const lift = (c: RGB, k: number): RGB => c.map((v) => clamp(v + (1 - v) * k, 0, 1)) as RGB;

/** 依据色板抽一块玻璃的颜色；尽量不和上一块重复 */
function makeGlassPicker(p: PaletteConfig, rand: () => number) {
  const colors = p.colors.map((c) => saturate(hexToRgb(c), p.saturation));
  const weights = p.colors.map((_, i) => p.weights[i] ?? 1);
  let last = -2;
  return (): RGB => {
    if (rand() < p.white && last !== -1) {
      last = -1;
      return WHITE_GLASS;
    }
    let i = pickWeighted(weights, rand());
    for (let k = 0; k < 4 && i === last && colors.length > 1; k++) i = pickWeighted(weights, rand());
    last = i;
    return colors[i] ?? WHITE_GLASS;
  };
}

type Pt = [number, number];

/**
 * 一块玻璃（任意多边形）：
 * - 沿随机方向的深浅渐变（厚薄不均）
 * - 几团柔和的亮斑 / 暗斑
 * - 少量细长的拉丝条纹和小气泡
 */
function paintGlass(ctx: CanvasRenderingContext2D, poly: Pt[], c: RGB, rand: () => number) {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const w = x1 - x0, h = y1 - y0;
  ctx.save();
  ctx.beginPath();
  poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.clip();

  // 厚薄渐变
  const a = rand() * Math.PI * 2;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.hypot(w, h) / 2;
  const g = ctx.createLinearGradient(cx - Math.cos(a) * r, cy - Math.sin(a) * r, cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  g.addColorStop(0, rgbToHex(lift(c, 0.12 + rand() * 0.12)));
  g.addColorStop(0.5 + (rand() - 0.5) * 0.4, rgbToHex(c));
  g.addColorStop(1, rgbToHex(shade(c, 0.72 + rand() * 0.15)));
  ctx.fillStyle = g;
  ctx.fillRect(x0, y0, w, h);

  // 明暗斑
  const blobs = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < blobs; i++) {
    const bx = x0 + rand() * w, by = y0 + rand() * h;
    const br = Math.max(w, h) * (0.2 + rand() * 0.45);
    const rg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    const light = rand() < 0.6;
    const al = 0.1 + rand() * 0.16;
    rg.addColorStop(0, light ? `rgba(255,250,235,${al})` : `rgba(0,0,0,${al})`);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(x0, y0, w, h);
  }

  // 拉丝条纹（沿长边方向）
  const vertical = h >= w;
  const streaks = 3 + Math.floor(rand() * 4);
  for (let i = 0; i < streaks; i++) {
    ctx.globalAlpha = 0.03 + rand() * 0.05;
    ctx.fillStyle = rand() < 0.55 ? "#fffaf0" : "#000";
    const t = 0.6 + rand() * 1.6;
    if (vertical) ctx.fillRect(x0 + rand() * w, y0, t, h);
    else ctx.fillRect(x0, y0 + rand() * h, w, t);
  }

  // 小气泡（亮点）
  const bubbles = Math.floor(rand() * 2);
  for (let i = 0; i < bubbles; i++) {
    ctx.globalAlpha = 0.25 + rand() * 0.3;
    ctx.fillStyle = "#fffaf0";
    ctx.beginPath();
    ctx.arc(x0 + rand() * w, y0 + rand() * h, 0.8 + rand() * 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function newCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = c.height = PATTERN_SIZE;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, PATTERN_SIZE, PATTERN_SIZE);
  return [c, ctx];
}

/** 穹顶光缝：count 条竖缝，每条分成 segments 段颜色；段长随机，切口略斜 */
function drawSlits(ctx: CanvasRenderingContext2D, g: WindowGroup, pick: () => RGB, rand: () => number) {
  const inner = PATTERN_SIZE - BORDER * 2;
  const n = Math.max(1, Math.round(g.count));
  const pitch = inner / n;
  const sw = Math.max(2, pitch * clamp(g.fill, 0.05, 1));
  const lead = clamp(g.frame, 0, 1) * 10;
  const segs = Math.max(1, Math.round(g.segments));
  for (let i = 0; i < n; i++) {
    const x = BORDER + pitch * i + (pitch - sw) / 2;
    const lens = Array.from({ length: segs }, () => 0.45 + rand() * 1.1);
    const total = lens.reduce((a, b) => a + b, 0);
    // 分界线：左右两端各自偏移一点，切口不完全水平
    const yl: number[] = [BORDER];
    const yr: number[] = [BORDER];
    let acc = 0;
    for (let k = 0; k < segs - 1; k++) {
      acc += (lens[k] / total) * inner;
      const tilt = (rand() - 0.5) * Math.min(sw * 0.5, (inner / segs) * 0.35);
      yl.push(BORDER + acc - tilt);
      yr.push(BORDER + acc + tilt);
    }
    yl.push(PATTERN_SIZE - BORDER);
    yr.push(PATTERN_SIZE - BORDER);
    for (let k = 0; k < segs; k++) {
      paintGlass(ctx, [[x, yl[k]], [x + sw, yr[k]], [x + sw, yr[k + 1]], [x, yl[k + 1]]], pick(), rand);
    }
    if (lead > 0) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = lead;
      for (let k = 1; k < segs; k++) {
        ctx.beginPath();
        ctx.moveTo(x, yl[k]);
        ctx.lineTo(x + sw, yr[k]);
        ctx.stroke();
      }
    }
  }
}

/** 网格彩窗：segments 行 × count 列；shape=triangle 时裁成尖顶三角（Polana 底部窗） */
function drawGrid(ctx: CanvasRenderingContext2D, g: WindowGroup, pick: () => RGB, rand: () => number) {
  const inner = PATTERN_SIZE - BORDER * 2;
  const cols = Math.max(1, Math.round(g.count));
  const rows = Math.max(1, Math.round(g.segments));
  const cw = inner / cols;
  const ch = inner / rows;
  ctx.save();
  if (g.shape === "triangle") {
    ctx.beginPath();
    ctx.moveTo(PATTERN_SIZE / 2, BORDER);
    ctx.lineTo(PATTERN_SIZE - BORDER, PATTERN_SIZE - BORDER);
    ctx.lineTo(BORDER, PATTERN_SIZE - BORDER);
    ctx.closePath();
    ctx.clip();
  } else if (g.shape === "arch") {
    // 圆拱窗：上半圆 + 下矩形（纹理会被拉伸到窗户的宽高比，所以这里按"半宽"画半圆）
    const rx = inner / 2;
    const ry = Math.min(inner * 0.35, inner / 2);
    ctx.beginPath();
    ctx.moveTo(BORDER, PATTERN_SIZE - BORDER);
    ctx.lineTo(BORDER, BORDER + ry);
    ctx.ellipse(PATTERN_SIZE / 2, BORDER + ry, rx, ry, 0, Math.PI, 0);
    ctx.lineTo(PATTERN_SIZE - BORDER, PATTERN_SIZE - BORDER);
    ctx.closePath();
    ctx.clip();
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = BORDER + c * cw, y = BORDER + r * ch;
      paintGlass(ctx, [[x, y], [x + cw, y], [x + cw, y + ch], [x, y + ch]], pick(), rand);
    }
  }
  const lead = Math.max(0, clamp(g.frame, 0, 1) * 14);
  if (lead > 0) {
    ctx.fillStyle = "#000";
    for (let c = 0; c <= cols; c++) ctx.fillRect(BORDER + c * cw - lead / 2, 0, lead, PATTERN_SIZE);
    for (let r = 0; r <= rows; r++) ctx.fillRect(0, BORDER + r * ch - lead / 2, PATTERN_SIZE, lead);
  }
  ctx.restore();
}

/** 窗棂宽度（纹理像素）。着色器里精确计算光柱时用同一个换算，见 panesMullionUv() */
export const PANES_MULLION_PX = 24;
/** 窗棂宽度换算到窗户坐标 uv（-1..1） */
export const panesMullionUv = (frame: number) => (clamp(frame, 0, 1) * PANES_MULLION_PX * 2) / PATTERN_SIZE;
export const PANES_BORDER_UV = (BORDER * 2) / PATTERN_SIZE;

/** 微软式窗格里的一块玻璃：干净的渐变 + 一道斜向反光 + 细倒角高光（不要气泡和杂斑） */
function paintPane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB, rand: () => number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const g = ctx.createLinearGradient(x + w, y, x, y + h);
  g.addColorStop(0, rgbToHex(lift(c, 0.22)));
  g.addColorStop(0.55, rgbToHex(c));
  g.addColorStop(1, rgbToHex(shade(c, 0.8)));
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  // 斜向反光带
  const bx = x + w * (0.25 + rand() * 0.3);
  const band = ctx.createLinearGradient(bx - w * 0.25, y, bx + w * 0.25, y + h * 0.4);
  band.addColorStop(0, "rgba(255,255,255,0)");
  band.addColorStop(0.5, "rgba(255,255,255,0.13)");
  band.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = band;
  ctx.fillRect(x, y, w, h);
  // 倒角高光：上沿和右沿一条细亮线
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(x, y, w, 2);
  ctx.fillRect(x + w - 2, y, 2, h);
  ctx.restore();
}

/** 干净的彩色玻璃片：只有一道柔和的明暗渐变（微软那种通透感），没有杂斑、气泡、拉丝 */
function paintCleanGlass(ctx: CanvasRenderingContext2D, poly: Pt[], c: RGB, rand: () => number) {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  ctx.save();
  ctx.beginPath();
  poly.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.clip();
  const a = -Math.PI / 4 + (rand() - 0.5) * 0.6;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, r = Math.hypot(x1 - x0, y1 - y0) / 2;
  const g = ctx.createLinearGradient(cx - Math.cos(a) * r, cy + Math.sin(a) * r, cx + Math.cos(a) * r, cy - Math.sin(a) * r);
  g.addColorStop(0, rgbToHex(shade(c, 0.82)));
  g.addColorStop(1, rgbToHex(lift(c, 0.14)));
  ctx.fillStyle = g;
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.restore();
}

/**
 * 一块大窗格里拼彩色玻璃碎片：抖动网格切成不规则四边形，每片一种颜色，细铅条分隔，
 * 最后整块再加一道反光和倒角高光，看起来仍是"一块玻璃"。
 */
function paintStainedPane(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, n: number, pick: () => RGB, rand: () => number) {
  const nx = n, ny = Math.max(1, Math.round((n * h) / w));
  const jx = (w / nx) * 0.28, jy = (h / ny) * 0.28;
  const pt: Pt[][] = [];
  for (let j = 0; j <= ny; j++) {
    pt.push([]);
    for (let i = 0; i <= nx; i++) {
      const edgeX = i === 0 || i === nx, edgeY = j === 0 || j === ny;
      pt[j].push([x + (i / nx) * w + (edgeX ? 0 : (rand() - 0.5) * 2 * jx), y + (j / ny) * h + (edgeY ? 0 : (rand() - 0.5) * 2 * jy)]);
    }
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const poly: Pt[] = [pt[j][i], pt[j][i + 1], pt[j + 1][i + 1], pt[j + 1][i]];
      paintCleanGlass(ctx, poly, pick(), rand);
      ctx.strokeStyle = "rgba(0,0,0,0.85)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      poly.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const band = ctx.createLinearGradient(x, y, x + w, y + h);
  band.addColorStop(0.3, "rgba(255,255,255,0)");
  band.addColorStop(0.45, "rgba(255,255,255,0.1)");
  band.addColorStop(0.6, "rgba(255,255,255,0)");
  ctx.fillStyle = band;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(x, y, w, 2);
  ctx.fillRect(x + w - 2, y, 2, h);
  ctx.restore();
}

/** 微软式窗格：segments 行 × count 列的大玻璃（最多 4×4），细窗棂；pieces > 0 时每块里拼彩色玻璃 */
function drawPanes(ctx: CanvasRenderingContext2D, g: WindowGroup, pick: () => RGB, rand: () => number) {
  const inner = PATTERN_SIZE - BORDER * 2;
  const cols = clamp(Math.round(g.count), 1, 4);
  const rows = clamp(Math.round(g.segments), 1, 4);
  const cw = inner / cols;
  const ch = inner / rows;
  const m = clamp(g.frame, 0, 1) * PANES_MULLION_PX;
  const n = Math.round(clamp(g.pieces ?? 0, 0, 8));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = BORDER + c * cw + m / 2, y = BORDER + r * ch + m / 2;
      if (n > 0) paintStainedPane(ctx, x, y, cw - m, ch - m, n, pick, rand);
      else paintPane(ctx, x, y, cw - m, ch - m, pick(), rand);
    }
  }
}

/** 生成一组窗户的图案纹理 */
export function drawPattern(g: WindowGroup, palette: PaletteConfig, seed: number): HTMLCanvasElement {
  const [canvas, ctx] = newCanvas();
  const rand = rng(seed * 7919 + g.seed * 104729 + 17);
  const pick = makeGlassPicker(palette, rand);
  if (g.kind === "panes") drawPanes(ctx, g, pick, rand);
  else if (g.kind === "grid") drawGrid(ctx, g, pick, rand);
  else drawSlits(ctx, g, pick, rand);
  return canvas;
}
