/**
 * 默认配置、色板与内置样式。
 * 每个样式都有 dark（发光）和 light（染色）两版；light 版 = dark 版 + 少量覆盖。
 */
import type { DeepPartial, PaletteConfig, PolanaluzConfig, WindowGroup } from "./types";
import { clone, deepMerge } from "./util";

// ---------------------------------------------------------------- 色板

export interface PaletteDef {
  id: string;
  /** 中文名 */
  name: string;
  /** English name */
  nameEn?: string;
  palette: PaletteConfig;
}

/** Polana 原色：从视频里取的玻璃颜色 */
const POLANA: PaletteConfig = {
  colors: ["#e5262b", "#f5c445", "#2dc68b", "#35b6e0", "#2f5bd6", "#d45bb0", "#f08a2c"],
  weights: [3, 3, 3, 1, 0.6, 0.4, 1],
  white: 0.16,
  saturation: 1.1,
};

/** aiknow：和首页标题渐变（紫 → 粉 → 橙）同一组颜色，加一点天蓝和暖白，克制不花 */
const AIKNOW: PaletteConfig = {
  colors: ["#7b5cff", "#c04bd9", "#ff6aa2", "#ffb357", "#5aa9ff"],
  weights: [3, 2, 2.5, 2, 1],
  white: 0.2,
  saturation: 1,
};

/** 彩窗用的浓彩版：发光的玻璃会被提亮，所以底色要更深、更饱和，亮起来才不发白 */
const AIKNOW_VIVID: PaletteConfig = {
  colors: ["#5b3df5", "#b136e0", "#ff3f86", "#ff9f1c", "#1fa8ff", "#7a5cff"],
  weights: [3, 2.5, 2.5, 1.6, 1.4, 2],
  white: 0.06,
  saturation: 1.1,
};

export const PALETTES: PaletteDef[] = [
  { id: "polana", name: "Polana 原色", palette: POLANA },
  {
    id: "polana-cool",
    name: "Polana 冷色（三角窗）",
    palette: { colors: ["#35b6e0", "#2f5bd6", "#d45bb0", "#9b6be0", "#2dc68b", "#f5c445"], weights: [3, 2, 3, 1.5, 1.5, 1], white: 0.12, saturation: 1.05 },
  },
  {
    id: "ember",
    name: "暖阳（红橙黄）",
    palette: { colors: ["#e5262b", "#f08a2c", "#f5c445", "#ffdf8a"], weights: [3, 3, 3, 1], white: 0.15, saturation: 1.1 },
  },
  {
    id: "aiknow",
    name: "aiknow 紫粉琥珀",
    palette: AIKNOW,
  },
  {
    id: "aiknow-vivid",
    name: "aiknow 浓彩（彩窗用）",
    palette: AIKNOW_VIVID,
  },
  {
    id: "microsoft",
    name: "微软蓝",
    palette: { colors: ["#1e90ff", "#36b4ff", "#0f6fe0", "#5cd0ff"], weights: [3, 2, 2, 1.5], white: 0.08, saturation: 1 },
  },
  {
    id: "aiknow-blue",
    name: "aiknow 蓝紫",
    palette: { colors: ["#2f54eb", "#7b5cff", "#c04bd9", "#ff6aa2", "#35b6e0"], weights: [3, 3, 2, 1.5, 1.5], white: 0.12, saturation: 1 },
  },
  {
    id: "huntnow",
    name: "Hunt Now 橙粉",
    palette: { colors: ["#ff5a1f", "#ff9a5a", "#e8467c", "#f5c445"], weights: [3, 2, 2.5, 1.5], white: 0.12, saturation: 1 },
  },
];

// ---------------------------------------------------------------- 窗户

export function makeWindow(p: Partial<WindowGroup> = {}): WindowGroup {
  return {
    enabled: true,
    mount: "free",
    kind: "slits",
    shape: "rect",
    x: 0.5,
    y: 0.5,
    distance: 9,
    width: 1.4,
    height: 2.6,
    facing: 0,
    slope: 15,
    count: 2,
    segments: 7,
    fill: 0.55,
    frame: 0,
    pieces: 0,
    spread: 0,
    gain: 1,
    seed: 0,
    ...p,
  };
}

// ---------------------------------------------------------------- 默认配置（= 光束 · 深色）
//
// 网页背景的构图围绕"焦点元素"（首页搜索框）：光从左上方的高窗斜射进来，
// 几道细光束从搜索框上掠过，边缘被彩光勾亮，身后落下柔和的影子。

export const DEFAULT_CONFIG: PolanaluzConfig = {
  theme: "dark",
  seed: 21,
  sun: { azimuth: 140, elevation: 20, intensity: 1.6, temperature: 5600, softness: 0.7 },
  windows: [
    makeWindow({ x: 0.36, y: 0.5, count: 4, fill: 0.42, width: 2.6, height: 2.6, segments: 3, distance: 8, slope: 10, seed: 1 }),
    makeWindow({ x: 0.74, y: 0.66, count: 2, fill: 0.5, width: 1.3, height: 2.2, segments: 3, distance: 8, slope: 10, seed: 2, gain: 0.8 }),
  ],
  palette: clone(AIKNOW),
  camera: { tilt: 0, yaw: 0, zoom: 1 },
  surface: { background: "#111214", texture: "stone", textureScale: 0.35, textureStrength: 0.35 },
  look: { opacity: 1, exposure: 1.4, glow: 0.25, caustics: 0.45, shade: 0.05, fade: 0.1, vignette: 0.3, grain: 0.04 },
  focus: { lift: 0.22, shadow: 0.85, rim: 1.1, rimWidth: 8, inside: 0.12 },
  scene: { mode: "floor", wallDistance: 6, sideWall: 0, roomColor: "#2b2e6b", ambient: 0.35, haze: 0.5, windowGlow: 1.2, bottomFade: 0, panel: 0, gloss: 0, floor: true, dust: 0 },
  motion: { mode: "drift", speed: 1, amount: 1, clouds: 0.25 },
};

// ---------------------------------------------------------------- 内置样式

export interface StyleDef {
  id: string;
  /** 中文名 */
  name: string;
  /** English name */
  nameEn?: string;
  desc: string;
  descEn?: string;
  dark: PolanaluzConfig;
  light: PolanaluzConfig;
}

/** 浅色版通用覆盖：浅底、纸张纹理、染色混合、几乎不要暗角 */
const LIGHT_BASE: DeepPartial<PolanaluzConfig> = {
  theme: "light",
  surface: { background: "#f6f6f3", texture: "paper", textureScale: 0.6, textureStrength: 0.35 },
  look: { exposure: 1.1, glow: 0.2, shade: 0.06, vignette: 0.03, grain: 0.03 },
};

function style(id: string, name: string, desc: string, dark: DeepPartial<PolanaluzConfig>, light: DeepPartial<PolanaluzConfig> = {}): StyleDef {
  const d = deepMerge(clone(DEFAULT_CONFIG), dark);
  const l = deepMerge(deepMerge(clone(d), LIGHT_BASE), light);
  return { id, name, desc, dark: d, light: l };
}

/** 房间场景（灵感：Windows 10 / 11 壁纸）：墙上的彩色玻璃窗发光，光柱穿过空气落到地面 */
const ROOM: DeepPartial<PolanaluzConfig> = {
  seed: 5,
  palette: clone(AIKNOW_VIVID),
  camera: { tilt: 72, yaw: 0, zoom: 1 },
  surface: { background: "#111214", texture: "none" },
  look: { exposure: 1.2, glow: 0.2, vignette: 0.2, caustics: 0.3, grain: 0 },
  scene: { mode: "room", wallDistance: 5, sideWall: 0, roomColor: "#262a5c", ambient: 0.35, haze: 0.8, windowGlow: 0.9, bottomFade: 0.15, panel: 1.8, gloss: 0.35, dust: 0.6 },
  motion: { amount: 0.6 },
};
/** 房间场景的浅色版（A）：淡紫的房间，光更柔 */
const ROOM_LIGHT: DeepPartial<PolanaluzConfig> = {
  surface: { background: "#f6f6f3", texture: "none" },
  look: { exposure: 1.05, vignette: 0.04, grain: 0 },
  sun: { intensity: 2.6 },
  palette: { saturation: 1.35 },
  scene: { roomColor: "#bdb5ec", ambient: 0.85, haze: 1.1, windowGlow: 1.0, bottomFade: 0.18, gloss: 0.25 },
};
/** 在房间场景基础上深合并（对象展开是浅合并，会把 scene 整个覆盖掉） */
const room = (p: DeepPartial<PolanaluzConfig>) => deepMerge(clone(ROOM) as PolanaluzConfig, p) as DeepPartial<PolanaluzConfig>;
const roomLight = (p: DeepPartial<PolanaluzConfig> = {}) => deepMerge(clone(ROOM_LIGHT) as PolanaluzConfig, p) as DeepPartial<PolanaluzConfig>;

/** 微软式窗格 + 格内彩色玻璃碎片 */
const roomWindow = (p: Partial<WindowGroup>) =>
  makeWindow({ mount: "wall", kind: "panes", shape: "rect", width: 1.7, height: 2.3, count: 2, segments: 2, frame: 0.35, pieces: 3, slope: 0, ...p });

export const STYLES: StyleDef[] = [
  style(
    "stained-rays-rl",
    "彩窗 · 光芒（右 → 左）",
    "Win10 式：右侧墙一扇彩色玻璃窗，光束呈扇形向左横扫整个画面，不落地，中心对准搜索框",
    room({
      sun: { azimuth: 15, elevation: 3, intensity: 1.6, temperature: 5600, softness: 0.4 },
      camera: { tilt: 82, yaw: 16, zoom: 1 },
      scene: { sideWall: 4.5, floor: false, haze: 0.42 },
      windows: [roomWindow({ mount: "side", x: 0.88, y: 0.46, width: 2.2, height: 2.2, spread: 24, seed: 1 })],
    }),
    roomLight({ scene: { haze: 1.4 } }),
  ),
  style(
    "stained-rays-lr",
    "彩窗 · 光芒（左 → 右）",
    "左侧墙一扇彩色玻璃窗，光束向右发散，横穿搜索框，地面落下彩色窗格",
    room({
      sun: { azimuth: 165, elevation: 3, intensity: 1.6, temperature: 5600, softness: 0.4 },
      camera: { tilt: 82, yaw: -16, zoom: 1 },
      scene: { sideWall: -4.5, floor: true, haze: 0.5 },
      windows: [roomWindow({ mount: "side", x: 0.14, y: 0.5, width: 2.2, height: 2.2, spread: 24, seed: 1 })],
    }),
    roomLight({ scene: { haze: 1.4 } }),
  ),
  style(
    "stained-pair",
    "彩窗 · 双窗汇光",
    "标题两侧各一扇彩色玻璃窗，两束光柱汇向搜索框，地面落下彩色窗格",
    room({
      sun: { azimuth: 90, elevation: 24, intensity: 1.6, temperature: 5600, softness: 0.4 },
      windows: [roomWindow({ x: 0.12, y: 0.17, facing: 40, seed: 1 }), roomWindow({ x: 0.88, y: 0.17, facing: -40, seed: 2 })],
    }),
    roomLight(),
  ),
  style(
    "stained-side",
    "彩窗 · 侧窗光柱",
    "Win10 式：右侧墙上一扇彩色玻璃窗，带窗缝的光柱横穿房间，落在搜索框上",
    room({
      sun: { azimuth: 25, elevation: 18, intensity: 1.6, temperature: 5600, softness: 0.4 },
      camera: { tilt: 78, yaw: 18, zoom: 1 },
      scene: { sideWall: 4.5 },
      windows: [roomWindow({ mount: "side", x: 0.84, y: 0.4, width: 2.4, height: 2.2, seed: 1 })],
    }),
    roomLight(),
  ),
  style(
    "stained-floor",
    "彩窗 · 地面窗影",
    "Win11 式：后墙左上一扇彩色玻璃窗，光柱落在搜索框左侧的地面，投出彩色窗格",
    room({
      sun: { azimuth: 122, elevation: 22, intensity: 1.6, temperature: 5600, softness: 0.4 },
      camera: { tilt: 74, yaw: 0, zoom: 1 },
      windows: [roomWindow({ x: 0.1, y: 0.2, width: 1.9, height: 2.0, pieces: 2, seed: 3 })],
    }),
    roomLight(),
  ),
  style(
    "microsoft-classic",
    "微软蓝 · 经典",
    "致敬 Windows 壁纸：纯净的 2×2 窗格、蓝色调，不加彩色碎片",
    room({
      palette: { colors: ["#1e90ff", "#36b4ff", "#0f6fe0", "#5cd0ff"], weights: [3, 2, 2, 1.5], white: 0.08, saturation: 1 },
      sun: { azimuth: 25, elevation: 18, intensity: 1.6, temperature: 6500, softness: 0.4 },
      camera: { tilt: 78, yaw: 18, zoom: 1 },
      scene: { sideWall: 4.5, roomColor: "#0b2a7a" },
      windows: [roomWindow({ mount: "side", x: 0.84, y: 0.4, width: 2.4, height: 2.2, pieces: 0, seed: 1 })],
    }),
    roomLight({ scene: { roomColor: "#9cc4ff" } }),
  ),
  style("beams", "光束（地面）", "几道细光束从左上方斜射，掠过搜索框，边缘彩光、身后落影", {}),
  style(
    "polana-beams",
    "Polana 光带（教堂地面）",
    "参考：教堂地面上的长光带，红黄绿分节，斜看地面",
    {
      seed: 7,
      sun: { azimuth: 70, elevation: 26, intensity: 1.7, temperature: 5400, softness: 0.9 },
      windows: [
        makeWindow({ x: 0.38, y: 0.72, count: 2, width: 2.2, height: 3.2, segments: 7, fill: 0.72, seed: 1 }),
        makeWindow({ x: 0.8, y: 0.45, count: 1, width: 0.7, height: 2.6, segments: 6, fill: 0.8, seed: 2, gain: 0.9 }),
      ],
      palette: clone(POLANA),
      camera: { tilt: 36 },
      surface: { background: "#221e1a", texture: "mosaic", textureScale: 0.05, textureStrength: 0.4 },
      look: { exposure: 1.5 },
    },
  ),
  style(
    "polana-grid",
    "Polana 格窗（教堂地面）",
    "参考：底部三角窗投下成片的平行四边形彩色光斑",
    {
      seed: 11,
      sun: { azimuth: 118, elevation: 32, intensity: 1.7, softness: 0.7 },
      windows: [
        makeWindow({ kind: "grid", shape: "rect", x: 0.32, y: 0.6, count: 4, segments: 5, width: 3.8, height: 3.6, facing: -25, slope: 0, frame: 0.5, distance: 8, seed: 3 }),
        makeWindow({ kind: "grid", shape: "triangle", x: 0.8, y: 0.38, count: 4, segments: 5, width: 3, height: 3.2, facing: -25, slope: 0, frame: 0.5, distance: 8, seed: 4, gain: 0.85 }),
      ],
      palette: { ...clone(POLANA), weights: [4, 1.5, 4, 1.5, 0.6, 0.6, 0.8], white: 0.1 },
      camera: { tilt: 36 },
      surface: { background: "#221e1a", texture: "mosaic", textureScale: 0.05, textureStrength: 0.4 },
      look: { exposure: 1.3 },
    },
  ),
];

export const getStyle = (id: string) => STYLES.find((s) => s.id === id);

// ---------------------------------------------------------------- English names

const PALETTE_EN: Record<string, string> = {
  polana: "Polana original",
  "polana-cool": "Polana cool (triangle windows)",
  ember: "Warm sun (red, orange, yellow)",
  aiknow: "aiknow violet, pink, amber",
  "aiknow-vivid": "aiknow vivid (for stained windows)",
  microsoft: "Microsoft blue",
  "aiknow-blue": "aiknow blue-violet",
  huntnow: "Hunt Now orange-pink",
};
PALETTES.forEach((p) => (p.nameEn = PALETTE_EN[p.id] ?? p.name));

const STYLE_EN: Record<string, [string, string]> = {
  "stained-rays-rl": ["Stained rays (right → left)", "Windows 10 style: a stained-glass window on the right wall; beams fan out to the left across the whole page, centered on the search box"],
  "stained-rays-lr": ["Stained rays (left → right)", "A stained-glass window on the left wall; beams spread to the right across the search box and paint colored panes on the floor"],
  "stained-pair": ["Twin windows", "Two stained-glass windows beside the headline; both beams converge on the search box"],
  "stained-side": ["Side window", "Windows 10 style: a side-wall window; crisp beams with pane gaps cross the room and land on the search box"],
  "stained-floor": ["Floor shadows", "Windows 11 style: a back-wall window; light falls on the floor left of the search box"],
  "microsoft-classic": ["Microsoft blue", "A tribute to the Windows wallpaper: clean 2×2 panes in blue, no stained pieces"],
  beams: ["Light beams (floor)", "Thin beams slant in from the top left and sweep past the search box"],
  "polana-beams": ["Polana beams (church floor)", "Reference: long segmented beams of red, yellow and green on the church floor"],
  "polana-grid": ["Polana grid (church floor)", "Reference: parallelogram patches from the triangular windows"],
};
STYLES.forEach((st) => {
  const e = STYLE_EN[st.id];
  st.nameEn = e?.[0] ?? st.name;
  st.descEn = e?.[1] ?? st.desc;
});
