function kt(e) {
  let t = e >>> 0 || 2654435769;
  return () => {
    t = t + 1831565813 >>> 0;
    let o = t;
    return o = Math.imul(o ^ o >>> 15, o | 1), o ^= o + Math.imul(o ^ o >>> 7, o | 61), ((o ^ o >>> 14) >>> 0) / 4294967296;
  };
}
function lt(e) {
  let t = e.trim().replace(/^#/, "");
  t.length === 3 && (t = t.split("").map((i) => i + i).join(""));
  const o = parseInt(t.slice(0, 6), 16);
  return Number.isNaN(o) ? [0, 0, 0] : [(o >> 16 & 255) / 255, (o >> 8 & 255) / 255, (o & 255) / 255];
}
function N([e, t, o]) {
  const i = (s) => Math.round(y(s, 0, 1) * 255).toString(16).padStart(2, "0");
  return `#${i(e)}${i(t)}${i(o)}`;
}
const y = (e, t, o) => Math.min(o, Math.max(t, e)), L = (e) => e * Math.PI / 180, pt = (e) => e.map((t) => t <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4);
function Ft(e) {
  const t = y(e, 1e3, 4e4) / 100;
  let o, i, s;
  return t <= 66 ? (o = 255, i = 99.4708025861 * Math.log(t) - 161.1195681661, s = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307) : (o = 329.698727446 * (t - 60) ** -0.1332047592, i = 288.1221695283 * (t - 60) ** -0.0755148492, s = 255), [y(o, 0, 255) / 255, y(i, 0, 255) / 255, y(s, 0, 255) / 255];
}
function gt(e, t = 0) {
  const o = (n) => {
    const r = Math.sin(n * 127.1 + t * 311.7) * 43758.5453;
    return r - Math.floor(r);
  }, i = Math.floor(e), s = e - i, a = s * s * (3 - 2 * s);
  return o(i) * (1 - a) + o(i + 1) * a;
}
function bt(e, t) {
  const o = e.reduce((s, a) => s + Math.max(0, a), 0);
  if (o <= 0) return 0;
  let i = t * o;
  for (let s = 0; s < e.length; s++)
    if (i -= Math.max(0, e[s]), i < 0) return s;
  return e.length - 1;
}
function F(e, t) {
  if (t == null) return e;
  if (e === void 0) return t;
  if (Array.isArray(e)) {
    if (!Array.isArray(t)) return e;
    const o = e[e.length - 1];
    return t.map((i, s) => F(s < e.length ? e[s] : o, i));
  }
  if (typeof e == "object" && e !== null) {
    if (typeof t != "object") return e;
    const o = { ...e };
    for (const [i, s] of Object.entries(t))
      o[i] = i in o ? F(o[i], s) : s;
    return o;
  }
  return typeof t == typeof e ? t : e;
}
const k = (e) => JSON.parse(JSON.stringify(e)), ct = {
  colors: ["#e5262b", "#f5c445", "#2dc68b", "#35b6e0", "#2f5bd6", "#d45bb0", "#f08a2c"],
  weights: [3, 3, 3, 1, 0.6, 0.4, 1],
  white: 0.16,
  saturation: 1.1
}, Tt = {
  colors: ["#7b5cff", "#c04bd9", "#ff6aa2", "#ffb357", "#5aa9ff"],
  weights: [3, 2, 2.5, 2, 1],
  white: 0.2,
  saturation: 1
}, Pt = {
  colors: ["#5b3df5", "#b136e0", "#ff3f86", "#ff9f1c", "#1fa8ff", "#7a5cff"],
  weights: [3, 2.5, 2.5, 1.6, 1.4, 2],
  white: 0.06,
  saturation: 1.1
}, Ct = [
  { id: "polana", name: "Polana 原色", palette: ct },
  {
    id: "polana-cool",
    name: "Polana 冷色（三角窗）",
    palette: { colors: ["#35b6e0", "#2f5bd6", "#d45bb0", "#9b6be0", "#2dc68b", "#f5c445"], weights: [3, 2, 3, 1.5, 1.5, 1], white: 0.12, saturation: 1.05 }
  },
  {
    id: "ember",
    name: "暖阳（红橙黄）",
    palette: { colors: ["#e5262b", "#f08a2c", "#f5c445", "#ffdf8a"], weights: [3, 3, 3, 1], white: 0.15, saturation: 1.1 }
  },
  {
    id: "aiknow",
    name: "aiknow 紫粉琥珀",
    palette: Tt
  },
  {
    id: "aiknow-vivid",
    name: "aiknow 浓彩（彩窗用）",
    palette: Pt
  },
  {
    id: "microsoft",
    name: "微软蓝",
    palette: { colors: ["#1e90ff", "#36b4ff", "#0f6fe0", "#5cd0ff"], weights: [3, 2, 2, 1.5], white: 0.08, saturation: 1 }
  },
  {
    id: "aiknow-blue",
    name: "aiknow 蓝紫",
    palette: { colors: ["#2f54eb", "#7b5cff", "#c04bd9", "#ff6aa2", "#35b6e0"], weights: [3, 3, 2, 1.5, 1.5], white: 0.12, saturation: 1 }
  },
  {
    id: "huntnow",
    name: "Hunt Now 橙粉",
    palette: { colors: ["#ff5a1f", "#ff9a5a", "#e8467c", "#f5c445"], weights: [3, 2, 2.5, 1.5], white: 0.12, saturation: 1 }
  }
];
function U(e = {}) {
  return {
    enabled: !0,
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
    ...e
  };
}
const ut = {
  theme: "dark",
  seed: 21,
  sun: { azimuth: 140, elevation: 20, intensity: 1.6, temperature: 5600, softness: 0.7 },
  windows: [
    U({ x: 0.36, y: 0.5, count: 4, fill: 0.42, width: 2.6, height: 2.6, segments: 3, distance: 8, slope: 10, seed: 1 }),
    U({ x: 0.74, y: 0.66, count: 2, fill: 0.5, width: 1.3, height: 2.2, segments: 3, distance: 8, slope: 10, seed: 2, gain: 0.8 })
  ],
  palette: k(Tt),
  camera: { tilt: 0, yaw: 0, zoom: 1 },
  surface: { background: "#111214", texture: "stone", textureScale: 0.35, textureStrength: 0.35 },
  look: { opacity: 1, exposure: 1.4, glow: 0.25, caustics: 0.45, shade: 0.05, fade: 0.1, vignette: 0.3, grain: 0.04 },
  focus: { lift: 0.22, shadow: 0.85, rim: 1.1, rimWidth: 8, inside: 0.12 },
  scene: { mode: "floor", wallDistance: 6, sideWall: 0, roomColor: "#2b2e6b", ambient: 0.35, haze: 0.5, windowGlow: 1.2, bottomFade: 0, panel: 0, gloss: 0, floor: !0, dust: 0 },
  motion: { mode: "drift", speed: 1, amount: 1, clouds: 0.25 }
}, _t = {
  theme: "light",
  surface: { background: "#f6f6f3", texture: "paper", textureScale: 0.6, textureStrength: 0.35 },
  look: { exposure: 1.1, glow: 0.2, shade: 0.06, vignette: 0.03, grain: 0.03 }
};
function _(e, t, o, i, s = {}) {
  const a = F(k(ut), i), n = F(F(k(a), _t), s);
  return { id: e, name: t, desc: o, dark: a, light: n };
}
const Lt = {
  seed: 5,
  palette: k(Pt),
  camera: { tilt: 72, yaw: 0, zoom: 1 },
  surface: { background: "#111214", texture: "none" },
  look: { exposure: 1.2, glow: 0.2, vignette: 0.2, caustics: 0.3, grain: 0 },
  scene: { mode: "room", wallDistance: 5, sideWall: 0, roomColor: "#262a5c", ambient: 0.35, haze: 0.8, windowGlow: 0.9, bottomFade: 0.15, panel: 1.8, gloss: 0.35, dust: 0.6 },
  motion: { amount: 0.6 }
}, zt = {
  surface: { background: "#f6f6f3", texture: "none" },
  look: { exposure: 1.05, vignette: 0.04, grain: 0 },
  sun: { intensity: 2.6 },
  palette: { saturation: 1.35 },
  scene: { roomColor: "#bdb5ec", ambient: 0.85, haze: 1.1, windowGlow: 1, bottomFade: 0.18, gloss: 0.25 }
}, H = (e) => F(k(Lt), e), V = (e = {}) => F(k(zt), e), I = (e) => U({ mount: "wall", kind: "panes", shape: "rect", width: 1.7, height: 2.3, count: 2, segments: 2, frame: 0.35, pieces: 3, slope: 0, ...e }), ft = [
  _(
    "stained-rays-rl",
    "彩窗 · 光芒（右 → 左）",
    "Win10 式：右侧墙一扇彩色玻璃窗，光束呈扇形向左横扫整个画面，不落地，中心对准搜索框",
    H({
      sun: { azimuth: 15, elevation: 3, intensity: 1.6, temperature: 5600, softness: 0.4 },
      camera: { tilt: 82, yaw: 16, zoom: 1 },
      scene: { sideWall: 4.5, floor: !1, haze: 0.42 },
      windows: [I({ mount: "side", x: 0.88, y: 0.46, width: 2.2, height: 2.2, spread: 24, seed: 1 })]
    }),
    V({ scene: { haze: 1.4 } })
  ),
  _(
    "stained-rays-lr",
    "彩窗 · 光芒（左 → 右）",
    "左侧墙一扇彩色玻璃窗，光束向右发散，横穿搜索框，地面落下彩色窗格",
    H({
      sun: { azimuth: 165, elevation: 3, intensity: 1.6, temperature: 5600, softness: 0.4 },
      camera: { tilt: 82, yaw: -16, zoom: 1 },
      scene: { sideWall: -4.5, floor: !0, haze: 0.5 },
      windows: [I({ mount: "side", x: 0.14, y: 0.5, width: 2.2, height: 2.2, spread: 24, seed: 1 })]
    }),
    V({ scene: { haze: 1.4 } })
  ),
  _(
    "stained-pair",
    "彩窗 · 双窗汇光",
    "标题两侧各一扇彩色玻璃窗，两束光柱汇向搜索框，地面落下彩色窗格",
    H({
      sun: { azimuth: 90, elevation: 24, intensity: 1.6, temperature: 5600, softness: 0.4 },
      windows: [I({ x: 0.12, y: 0.17, facing: 40, seed: 1 }), I({ x: 0.88, y: 0.17, facing: -40, seed: 2 })]
    }),
    V()
  ),
  _(
    "stained-side",
    "彩窗 · 侧窗光柱",
    "Win10 式：右侧墙上一扇彩色玻璃窗，带窗缝的光柱横穿房间，落在搜索框上",
    H({
      sun: { azimuth: 25, elevation: 18, intensity: 1.6, temperature: 5600, softness: 0.4 },
      camera: { tilt: 78, yaw: 18, zoom: 1 },
      scene: { sideWall: 4.5 },
      windows: [I({ mount: "side", x: 0.84, y: 0.4, width: 2.4, height: 2.2, seed: 1 })]
    }),
    V()
  ),
  _(
    "stained-floor",
    "彩窗 · 地面窗影",
    "Win11 式：后墙左上一扇彩色玻璃窗，光柱落在搜索框左侧的地面，投出彩色窗格",
    H({
      sun: { azimuth: 122, elevation: 22, intensity: 1.6, temperature: 5600, softness: 0.4 },
      camera: { tilt: 74, yaw: 0, zoom: 1 },
      windows: [I({ x: 0.1, y: 0.2, width: 1.9, height: 2, pieces: 2, seed: 3 })]
    }),
    V()
  ),
  _(
    "microsoft-classic",
    "微软蓝 · 经典",
    "致敬 Windows 壁纸：纯净的 2×2 窗格、蓝色调，不加彩色碎片",
    H({
      palette: { colors: ["#1e90ff", "#36b4ff", "#0f6fe0", "#5cd0ff"], weights: [3, 2, 2, 1.5], white: 0.08, saturation: 1 },
      sun: { azimuth: 25, elevation: 18, intensity: 1.6, temperature: 6500, softness: 0.4 },
      camera: { tilt: 78, yaw: 18, zoom: 1 },
      scene: { sideWall: 4.5, roomColor: "#0b2a7a" },
      windows: [I({ mount: "side", x: 0.84, y: 0.4, width: 2.4, height: 2.2, pieces: 0, seed: 1 })]
    }),
    V({ scene: { roomColor: "#9cc4ff" } })
  ),
  _("beams", "光束（地面）", "几道细光束从左上方斜射，掠过搜索框，边缘彩光、身后落影", {}),
  _(
    "polana-beams",
    "Polana 光带（教堂地面）",
    "参考：教堂地面上的长光带，红黄绿分节，斜看地面",
    {
      seed: 7,
      sun: { azimuth: 70, elevation: 26, intensity: 1.7, temperature: 5400, softness: 0.9 },
      windows: [
        U({ x: 0.38, y: 0.72, count: 2, width: 2.2, height: 3.2, segments: 7, fill: 0.72, seed: 1 }),
        U({ x: 0.8, y: 0.45, count: 1, width: 0.7, height: 2.6, segments: 6, fill: 0.8, seed: 2, gain: 0.9 })
      ],
      palette: k(ct),
      camera: { tilt: 36 },
      surface: { background: "#221e1a", texture: "mosaic", textureScale: 0.05, textureStrength: 0.4 },
      look: { exposure: 1.5 }
    }
  ),
  _(
    "polana-grid",
    "Polana 格窗（教堂地面）",
    "参考：底部三角窗投下成片的平行四边形彩色光斑",
    {
      seed: 11,
      sun: { azimuth: 118, elevation: 32, intensity: 1.7, softness: 0.7 },
      windows: [
        U({ kind: "grid", shape: "rect", x: 0.32, y: 0.6, count: 4, segments: 5, width: 3.8, height: 3.6, facing: -25, slope: 0, frame: 0.5, distance: 8, seed: 3 }),
        U({ kind: "grid", shape: "triangle", x: 0.8, y: 0.38, count: 4, segments: 5, width: 3, height: 3.2, facing: -25, slope: 0, frame: 0.5, distance: 8, seed: 4, gain: 0.85 })
      ],
      palette: { ...k(ct), weights: [4, 1.5, 4, 1.5, 0.6, 0.6, 0.8], white: 0.1 },
      camera: { tilt: 36 },
      surface: { background: "#221e1a", texture: "mosaic", textureScale: 0.05, textureStrength: 0.4 },
      look: { exposure: 1.3 }
    }
  )
], Nt = (e) => ft.find((t) => t.id === e), Dt = {
  polana: "Polana original",
  "polana-cool": "Polana cool (triangle windows)",
  ember: "Warm sun (red, orange, yellow)",
  aiknow: "aiknow violet, pink, amber",
  "aiknow-vivid": "aiknow vivid (for stained windows)",
  microsoft: "Microsoft blue",
  "aiknow-blue": "aiknow blue-violet",
  huntnow: "Hunt Now orange-pink"
};
Ct.forEach((e) => e.nameEn = Dt[e.id] ?? e.name);
const Gt = {
  "stained-rays-rl": ["Stained rays (right → left)", "Windows 10 style: a stained-glass window on the right wall; beams fan out to the left across the whole page, centered on the search box"],
  "stained-rays-lr": ["Stained rays (left → right)", "A stained-glass window on the left wall; beams spread to the right across the search box and paint colored panes on the floor"],
  "stained-pair": ["Twin windows", "Two stained-glass windows beside the headline; both beams converge on the search box"],
  "stained-side": ["Side window", "Windows 10 style: a side-wall window; crisp beams with pane gaps cross the room and land on the search box"],
  "stained-floor": ["Floor shadows", "Windows 11 style: a back-wall window; light falls on the floor left of the search box"],
  "microsoft-classic": ["Microsoft blue", "A tribute to the Windows wallpaper: clean 2×2 panes in blue, no stained pieces"],
  beams: ["Light beams (floor)", "Thin beams slant in from the top left and sweep past the search box"],
  "polana-beams": ["Polana beams (church floor)", "Reference: long segmented beams of red, yellow and green on the church floor"],
  "polana-grid": ["Polana grid (church floor)", "Reference: parallelogram patches from the triangular windows"]
};
ft.forEach((e) => {
  const t = Gt[e.id];
  e.nameEn = (t == null ? void 0 : t[0]) ?? e.name, e.descEn = (t == null ? void 0 : t[1]) ?? e.desc;
});
const x = 512, g = 4, wt = [1, 0.96, 0.86];
function qt([e, t, o], i) {
  const s = 0.2126 * e + 0.7152 * t + 0.0722 * o;
  return [e, t, o].map((a) => y(s + (a - s) * i, 0, 1));
}
const ht = (e, t) => e.map((o) => y(o * t, 0, 1)), dt = (e, t) => e.map((o) => y(o + (1 - o) * t, 0, 1));
function Xt(e, t) {
  const o = e.colors.map((a) => qt(lt(a), e.saturation)), i = e.colors.map((a, n) => e.weights[n] ?? 1);
  let s = -2;
  return () => {
    if (t() < e.white && s !== -1)
      return s = -1, wt;
    let a = bt(i, t());
    for (let n = 0; n < 4 && a === s && o.length > 1; n++) a = bt(i, t());
    return s = a, o[a] ?? wt;
  };
}
function Rt(e, t, o, i) {
  const s = t.map((A) => A[0]), a = t.map((A) => A[1]), n = Math.min(...s), r = Math.max(...s), l = Math.min(...a), c = Math.max(...a), u = r - n, f = c - l;
  e.save(), e.beginPath(), t.forEach(([A, W], D) => D ? e.lineTo(A, W) : e.moveTo(A, W)), e.closePath(), e.clip();
  const p = i() * Math.PI * 2, w = (n + r) / 2, d = (l + c) / 2, h = Math.hypot(u, f) / 2, M = e.createLinearGradient(w - Math.cos(p) * h, d - Math.sin(p) * h, w + Math.cos(p) * h, d + Math.sin(p) * h);
  M.addColorStop(0, N(dt(o, 0.12 + i() * 0.12))), M.addColorStop(0.5 + (i() - 0.5) * 0.4, N(o)), M.addColorStop(1, N(ht(o, 0.72 + i() * 0.15))), e.fillStyle = M, e.fillRect(n, l, u, f);
  const m = 2 + Math.floor(i() * 3);
  for (let A = 0; A < m; A++) {
    const W = n + i() * u, D = l + i() * f, j = Math.max(u, f) * (0.2 + i() * 0.45), C = e.createRadialGradient(W, D, 0, W, D, j), Q = i() < 0.6, K = 0.1 + i() * 0.16;
    C.addColorStop(0, Q ? `rgba(255,250,235,${K})` : `rgba(0,0,0,${K})`), C.addColorStop(1, "rgba(0,0,0,0)"), e.fillStyle = C, e.fillRect(n, l, u, f);
  }
  const P = f >= u, z = 3 + Math.floor(i() * 4);
  for (let A = 0; A < z; A++) {
    e.globalAlpha = 0.03 + i() * 0.05, e.fillStyle = i() < 0.55 ? "#fffaf0" : "#000";
    const W = 0.6 + i() * 1.6;
    P ? e.fillRect(n + i() * u, l, W, f) : e.fillRect(n, l + i() * f, u, W);
  }
  const O = Math.floor(i() * 2);
  for (let A = 0; A < O; A++)
    e.globalAlpha = 0.25 + i() * 0.3, e.fillStyle = "#fffaf0", e.beginPath(), e.arc(n + i() * u, l + i() * f, 0.8 + i() * 1.6, 0, Math.PI * 2), e.fill();
  e.restore();
}
function It() {
  const e = document.createElement("canvas");
  e.width = e.height = x;
  const t = e.getContext("2d");
  return t.fillStyle = "#000", t.fillRect(0, 0, x, x), [e, t];
}
function Ut(e, t, o, i) {
  const s = x - g * 2, a = Math.max(1, Math.round(t.count)), n = s / a, r = Math.max(2, n * y(t.fill, 0.05, 1)), l = y(t.frame, 0, 1) * 10, c = Math.max(1, Math.round(t.segments));
  for (let u = 0; u < a; u++) {
    const f = g + n * u + (n - r) / 2, p = Array.from({ length: c }, () => 0.45 + i() * 1.1), w = p.reduce((m, P) => m + P, 0), d = [g], h = [g];
    let M = 0;
    for (let m = 0; m < c - 1; m++) {
      M += p[m] / w * s;
      const P = (i() - 0.5) * Math.min(r * 0.5, s / c * 0.35);
      d.push(g + M - P), h.push(g + M + P);
    }
    d.push(x - g), h.push(x - g);
    for (let m = 0; m < c; m++)
      Rt(e, [[f, d[m]], [f + r, h[m]], [f + r, h[m + 1]], [f, d[m + 1]]], o(), i);
    if (l > 0) {
      e.strokeStyle = "#000", e.lineWidth = l;
      for (let m = 1; m < c; m++)
        e.beginPath(), e.moveTo(f, d[m]), e.lineTo(f + r, h[m]), e.stroke();
    }
  }
}
function Ot(e, t, o, i) {
  const s = x - g * 2, a = Math.max(1, Math.round(t.count)), n = Math.max(1, Math.round(t.segments)), r = s / a, l = s / n;
  if (e.save(), t.shape === "triangle")
    e.beginPath(), e.moveTo(x / 2, g), e.lineTo(x - g, x - g), e.lineTo(g, x - g), e.closePath(), e.clip();
  else if (t.shape === "arch") {
    const u = s / 2, f = Math.min(s * 0.35, s / 2);
    e.beginPath(), e.moveTo(g, x - g), e.lineTo(g, g + f), e.ellipse(x / 2, g + f, u, f, 0, Math.PI, 0), e.lineTo(x - g, x - g), e.closePath(), e.clip();
  }
  for (let u = 0; u < n; u++)
    for (let f = 0; f < a; f++) {
      const p = g + f * r, w = g + u * l;
      Rt(e, [[p, w], [p + r, w], [p + r, w + l], [p, w + l]], o(), i);
    }
  const c = Math.max(0, y(t.frame, 0, 1) * 14);
  if (c > 0) {
    e.fillStyle = "#000";
    for (let u = 0; u <= a; u++) e.fillRect(g + u * r - c / 2, 0, c, x);
    for (let u = 0; u <= n; u++) e.fillRect(0, g + u * l - c / 2, x, c);
  }
  e.restore();
}
const Wt = 24, Bt = (e) => y(e, 0, 1) * Wt * 2 / x;
function Ht(e, t, o, i, s, a, n) {
  e.save(), e.beginPath(), e.rect(t, o, i, s), e.clip();
  const r = e.createLinearGradient(t + i, o, t, o + s);
  r.addColorStop(0, N(dt(a, 0.22))), r.addColorStop(0.55, N(a)), r.addColorStop(1, N(ht(a, 0.8))), e.fillStyle = r, e.fillRect(t, o, i, s);
  const l = t + i * (0.25 + n() * 0.3), c = e.createLinearGradient(l - i * 0.25, o, l + i * 0.25, o + s * 0.4);
  c.addColorStop(0, "rgba(255,255,255,0)"), c.addColorStop(0.5, "rgba(255,255,255,0.13)"), c.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = c, e.fillRect(t, o, i, s), e.fillStyle = "rgba(255,255,255,0.28)", e.fillRect(t, o, i, 2), e.fillRect(t + i - 2, o, 2, s), e.restore();
}
function Vt(e, t, o, i) {
  const s = t.map((h) => h[0]), a = t.map((h) => h[1]), n = Math.min(...s), r = Math.max(...s), l = Math.min(...a), c = Math.max(...a);
  e.save(), e.beginPath(), t.forEach(([h, M], m) => m ? e.lineTo(h, M) : e.moveTo(h, M)), e.closePath(), e.clip();
  const u = -Math.PI / 4 + (i() - 0.5) * 0.6, f = (n + r) / 2, p = (l + c) / 2, w = Math.hypot(r - n, c - l) / 2, d = e.createLinearGradient(f - Math.cos(u) * w, p + Math.sin(u) * w, f + Math.cos(u) * w, p - Math.sin(u) * w);
  d.addColorStop(0, N(ht(o, 0.82))), d.addColorStop(1, N(dt(o, 0.14))), e.fillStyle = d, e.fillRect(n, l, r - n, c - l), e.restore();
}
function Yt(e, t, o, i, s, a, n, r) {
  const l = a, c = Math.max(1, Math.round(a * s / i)), u = i / l * 0.28, f = s / c * 0.28, p = [];
  for (let d = 0; d <= c; d++) {
    p.push([]);
    for (let h = 0; h <= l; h++) {
      const M = h === 0 || h === l, m = d === 0 || d === c;
      p[d].push([t + h / l * i + (M ? 0 : (r() - 0.5) * 2 * u), o + d / c * s + (m ? 0 : (r() - 0.5) * 2 * f)]);
    }
  }
  for (let d = 0; d < c; d++)
    for (let h = 0; h < l; h++) {
      const M = [p[d][h], p[d][h + 1], p[d + 1][h + 1], p[d + 1][h]];
      Vt(e, M, n(), r), e.strokeStyle = "rgba(0,0,0,0.85)", e.lineWidth = 2.2, e.beginPath(), M.forEach(([m, P], z) => z ? e.lineTo(m, P) : e.moveTo(m, P)), e.closePath(), e.stroke();
    }
  e.save(), e.beginPath(), e.rect(t, o, i, s), e.clip();
  const w = e.createLinearGradient(t, o, t + i, o + s);
  w.addColorStop(0.3, "rgba(255,255,255,0)"), w.addColorStop(0.45, "rgba(255,255,255,0.1)"), w.addColorStop(0.6, "rgba(255,255,255,0)"), e.fillStyle = w, e.fillRect(t, o, i, s), e.fillStyle = "rgba(255,255,255,0.25)", e.fillRect(t, o, i, 2), e.fillRect(t + i - 2, o, 2, s), e.restore();
}
function jt(e, t, o, i) {
  const s = x - g * 2, a = y(Math.round(t.count), 1, 4), n = y(Math.round(t.segments), 1, 4), r = s / a, l = s / n, c = y(t.frame, 0, 1) * Wt, u = Math.round(y(t.pieces ?? 0, 0, 8));
  for (let f = 0; f < n; f++)
    for (let p = 0; p < a; p++) {
      const w = g + p * r + c / 2, d = g + f * l + c / 2;
      u > 0 ? Yt(e, w, d, r - c, l - c, u, o, i) : Ht(e, w, d, r - c, l - c, o(), i);
    }
}
function Kt(e, t, o) {
  const [i, s] = It(), a = kt(o * 7919 + e.seed * 104729 + 17), n = Xt(t, a);
  return e.kind === "panes" ? jt(s, e, n, a) : e.kind === "grid" ? Ot(s, e, n, a) : Ut(s, e, n, a), i;
}
const T = 4, $t = 24, Zt = (
  /* glsl */
  `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
vec2 p = P[gl_VertexID];
vUv = p * 0.5 + 0.5;
gl_Position = vec4(p, 0.0, 1.0);
}`
), Jt = (
  /* glsl */
  `#version 300 es
precision highp float;
precision highp sampler2DArray;
#define MAX_W ${T}
#define TAPS ${$t}
#define PATTERN_SIZE 512.0
in vec2 vUv;
out vec4 outColor;
uniform sampler2DArray uPattern;
uniform float uAspect;
uniform vec3 uCamPos;
uniform vec3 uCamF;
uniform vec3 uCamR;
uniform vec3 uCamU;
uniform float uCamK;
uniform vec3 uL;
uniform vec3 uSunColor;
uniform float uSoft;
uniform int uCount;
uniform vec3 uWC[MAX_W];
uniform vec3 uWU[MAX_W];
uniform vec3 uWV[MAX_W];
uniform vec3 uWN[MAX_W];
uniform vec2 uWHalf[MAX_W];
uniform float uWGain[MAX_W];
uniform int uWMount[MAX_W];
uniform vec3 uWL[MAX_W];
uniform vec4 uWGrid[MAX_W];
#define PANES_BORDER 0.015625
uniform vec4 uWSrc[MAX_W];
uniform vec3 uBg;
uniform int uTexture;
uniform float uTexScale;
uniform float uTexStrength;
uniform int uTheme;
uniform float uOpacity;
uniform float uExposure;
uniform float uGlow;
uniform float uCaustics;
uniform float uSeed;
uniform float uShade;
uniform float uFade;
uniform float uVignette;
uniform float uGrain;
uniform float uTime;
uniform int uFocusOn;
uniform vec2 uFocusC;
uniform vec2 uFocusHalf;
uniform float uFocusR;
uniform float uFocusLift;
uniform float uFocusShadow;
uniform float uFocusRim;
uniform float uFocusRimW;
uniform float uFocusInside;
uniform vec4 uFocusS;
uniform vec2 uFocusSR;
uniform int uRoom;
uniform float uWallY;
uniform float uSideX;
uniform vec3 uRoomColor;
uniform float uAmbient;
uniform float uHaze;
uniform float uWinGlow;
uniform float uBottomFade;
uniform float uPanel;
uniform float uGloss;
uniform int uFloor;
uniform float uDust;
float hash21(vec2 p) {
p = fract(p * vec2(123.34, 456.21));
p += dot(p, p + 45.32);
return fract(p.x * p.y);
}
float vnoise(vec2 p) {
vec2 i = floor(p);
vec2 f = fract(p);
vec2 u = f * f * (3.0 - 2.0 * f);
float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
float s = 0.0, a = 0.5;
for (int i = 0; i < 4; i++) {
s += a * vnoise(p);
p = p * 2.03 + vec2(17.1, 9.2);
a *= 0.5;
}
return s / 0.9375;
}
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
vec2 vogel(int k, float rot) {
float r = sqrt((float(k) + 0.5) / float(TAPS));
float a = float(k) * 2.39996323 + rot;
return r * vec2(cos(a), sin(a));
}
vec3 tapPattern(int i, vec2 uv, float lod) {
vec2 a = abs(uv);
if (any(greaterThan(a, vec2(1.0)))) return vec3(0.0);
float e = exp2(lod) * 3.0 / PATTERN_SIZE;
vec2 m = 1.0 - smoothstep(vec2(1.0 - e), vec2(1.0), a);
vec2 tc = vec2(0.5 + 0.5 * uv.x, 0.5 - 0.5 * uv.y);
return textureLod(uPattern, vec3(tc, float(i)), lod).rgb * (m.x * m.y);
}
float caustic(vec2 q, float seed, float blur) {
if (uCaustics <= 0.0) return 1.0;
vec2 p = q * vec2(4.2, 1.9) + seed * 13.7;
vec2 warp = vec2(fbm(p * 0.6), fbm(p * 0.6 + 5.2));
float n = fbm(p + warp * 1.8);
float ridge = pow(1.0 - abs(n * 2.0 - 1.0), 5.0);
float body = fbm(p * 0.35 + 3.1) - 0.5;
float sharp = clamp(1.0 - blur * 5.0, 0.0, 1.0);
return max(0.0, 1.0 + uCaustics * (sharp * (ridge * 1.1 - 0.2) + body * 0.7));
}
float floorAlbedo(vec2 p) {
if (uTexture == 0 || uTexStrength <= 0.0) return 1.0;
vec2 q = p / max(uTexScale, 1e-3);
float w = max(fwidth(q.x), fwidth(q.y));
float v = 1.0;
if (uTexture == 1) {
vec2 id = floor(q);
vec2 f = fract(q);
float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
float grout = smoothstep(0.0, 0.07 + w, edge);
float h = hash21(id);
float tile = 0.8 + 0.3 * h - step(0.92, h) * 0.25;
tile *= 0.88 + 0.24 * fbm(q * 0.06);
v = tile * mix(0.8, 1.0, grout);
v = mix(v, 0.93 + 0.12 * fbm(q * 0.06), smoothstep(0.3, 0.8, w));
} else if (uTexture == 2) {
float s = 0.0;
for (int l = 0; l < 2; l++) {
vec2 qq = q * (l == 0 ? 1.0 : 2.7);
vec2 id = floor(qq);
vec2 c = vec2(hash21(id), hash21(id + 7.1));
float r = 0.12 + 0.22 * hash21(id + 3.3);
float d = length(fract(qq) - c);
float dot_ = 1.0 - smoothstep(r - max(w, 0.02), r, d);
s += dot_ * (hash21(id + 9.7) - 0.45) * (l == 0 ? 0.9 : 0.6);
}
v = 1.0 + s;
v = mix(v, 1.0, smoothstep(0.3, 0.8, w));
} else if (uTexture == 3) {
float fine = clamp(1.0 - w * 4.0, 0.0, 1.0);
v = 0.84 + 0.32 * fbm(q * 0.5) + (vnoise(q * 7.0) - 0.5) * 0.22 * fine;
float pit = step(0.965, hash21(floor(q * 3.0))) * (1.0 - smoothstep(0.08, 0.2, length(fract(q * 3.0) - 0.5)));
v -= pit * 0.35 * fine;
} else {
float fine = clamp(1.0 - w * 3.0, 0.0, 1.0);
v = 1.0 + (fbm(q * 0.7) - 0.5) * 0.08 + (vnoise(q * 22.0) - 0.5) * 0.08 * fine;
}
return mix(1.0, v, uTexStrength);
}
float sdRoundRect(vec2 p, vec2 b, float r) {
vec2 q = abs(p) - b + r;
return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void lightAt(vec3 P, float rot, bool occlude, out vec3 light, out vec3 halo) {
light = vec3(0.0);
halo = vec3(0.0);
for (int i = 0; i < MAX_W; i++) {
if (i >= uCount) break;
vec3 N = uWN[i];
bool pointSrc = uWSrc[i].w > 0.0;
vec3 L = pointSrc ? normalize(uWSrc[i].xyz - P) : uWL[i];
float denom = dot(L, N);
if (abs(denom) < 1e-3) continue;
float t = dot(uWC[i] - P, N) / denom;
if (t <= 1e-3) continue;
vec3 d = P + t * L - uWC[i];
vec2 half_ = uWHalf[i];
vec2 q = vec2(dot(d, uWU[i]), dot(d, uWV[i]));
vec2 uv = q / half_;
float r = t * uSoft / max(abs(denom), 0.25);
vec2 ruv = vec2(r) / half_;
vec2 gr = vec2(r * 1.5 + 0.035) / half_;
vec2 reach = max(ruv, gr);
if (any(greaterThan(abs(uv) - reach, vec2(1.02)))) continue;
float lod = max(0.0, log2(max(max(ruv.x, ruv.y) * 0.5 * PATTERN_SIZE * 0.8, 1.0)));
float glod = max(0.0, log2(max(max(gr.x, gr.y) * 0.5 * PATTERN_SIZE * 1.0, 1.0)));
vec3 acc = vec3(0.0);
for (int k = 0; k < TAPS; k++) {
acc += tapPattern(i, uv + vogel(k, rot) * ruv, lod);
}
acc /= float(TAPS);
vec3 h = tapPattern(i, uv, glod);
for (int k = 0; k < 8; k++) {
float a = float(k) * 0.78539816;
h += tapPattern(i, uv + vec2(cos(a), sin(a)) * gr * 0.7, glod);
}
h /= 9.0;
float atten = uWGain[i] * exp(-uFade * t * 0.1);
if (pointSrc) {
vec3 dS = P - uWSrc[i].xyz;
atten *= min(uWSrc[i].w * uWSrc[i].w / dot(dS, dS), 1.5);
}
if (occlude && uFocusOn == 1) {
vec2 rel = P.xy - uFocusC;
if (sdRoundRect(rel, uFocusHalf, uFocusR) > 0.0) {
float lz = max(L.z, 0.05);
vec2 hp = rel + L.xy * (uFocusLift / lz);
float pen = uFocusLift * uSoft / lz * 2.5 + 0.02;
atten *= 1.0 - uFocusShadow * (1.0 - smoothstep(-pen, pen, sdRoundRect(hp, uFocusHalf, uFocusR)));
}
}
light += acc * caustic(q, uSeed + float(i) * 7.31, r) * atten;
halo += h * atten;
}
light *= uSunColor;
halo *= uSunColor;
}
void clipLin(float p, float q, inout float t0, inout float t1) {
if (abs(q) < 1e-8) {
if (p < 0.0) t1 = -1.0;
return;
}
float tc = -p / q;
if (q > 0.0) t0 = max(t0, tc); else t1 = min(t1, tc);
}
vec3 volPoint(int i, vec3 ro, vec3 rd, float tMax) {
vec3 Sx = uWSrc[i].xyz;
float D = uWSrc[i].w;
vec3 C = uWC[i], N = uWN[i], U = uWU[i], V = uWV[i];
vec2 half_ = uWHalf[i];
float cN = dot(C - Sx, N);
if (abs(cN) < 1e-5) return vec3(0.0);
float sg = sign(cN);
vec3 w0 = ro - Sx;
float n0 = dot(w0, N), n1 = dot(rd, N);
float T0 = 0.0, T1 = tMax;
clipLin(sg * n0 - abs(cN), sg * n1, T0, T1);
if (T1 <= T0) return vec3(0.0);
float su = dot(Sx - C, U), sv = dot(Sx - C, V);
vec2 a0 = vec2(su * n0 + cN * dot(w0, U), sv * n0 + cN * dot(w0, V));
vec2 a1 = vec2(su * n1 + cN * dot(rd, U), sv * n1 + cN * dot(rd, V));
vec4 grid = uWGrid[i];
bool panes = grid.w > 0.5;
float cols = panes ? grid.x : 1.0, rows = panes ? grid.y : 1.0, mu = panes ? grid.z : 0.0;
float bu = panes ? PANES_BORDER : 0.0;
float cwu = (2.0 - 2.0 * bu) / cols, chu = (2.0 - 2.0 * bu) / rows;
vec3 c = vec3(0.0);
for (int r = 0; r < 4; r++) {
if (float(r) >= rows) break;
for (int k = 0; k < 4; k++) {
if (float(k) >= cols) break;
float x0 = -1.0 + bu + float(k) * cwu + mu * 0.5;
float y1 = 1.0 - bu - float(r) * chu - mu * 0.5;
vec2 lo = vec2(x0, y1 - (chu - mu)) * half_;
vec2 hi = vec2(x0 + cwu - mu, y1) * half_;
float t0 = T0, t1 = T1;
for (int a = 0; a < 2; a++) {
clipLin(sg * (a0[a] - lo[a] * n0), sg * (a1[a] - lo[a] * n1), t0, t1);
clipLin(sg * (hi[a] * n0 - a0[a]), sg * (hi[a] * n1 - a1[a]), t0, t1);
}
if (t1 <= t0) continue;
float len = t1 - t0;
vec3 pc = vec3(0.0);
for (int m = 0; m < 4; m++) {
float t = t0 + len * (float(m) + 0.5) / 4.0;
vec2 uv = (a0 + a1 * t) / ((n0 + n1 * t) * half_);
vec3 X = ro + rd * t;
float dist2 = dot(X - Sx, X - Sx);
float fall = min(D * D / dist2, 1.5);
float phase = 0.55 + 1.2 * pow(max(dot(rd, normalize(Sx - X)), 0.0), 3.0);
pc += tapPattern(i, uv, 1.0) * fall * phase * exp(-uFade * sqrt(dist2) * 0.1);
}
c += pc / 4.0 * len;
}
}
return c * uWGain[i];
}
vec3 volBeams(vec3 ro, vec3 rd, float tMax, float jit) {
vec3 sum = vec3(0.0);
for (int i = 0; i < MAX_W; i++) {
if (i >= uCount) break;
if (uWGain[i] <= 0.0) continue;
if (uWSrc[i].w > 0.0) {
sum += volPoint(i, ro, rd, tMax);
continue;
}
vec3 L = uWL[i];
vec3 N = uWN[i];
float denom = dot(L, N);
if (abs(denom) < 1e-3) continue;
vec2 half_ = uWHalf[i];
float s0 = dot(uWC[i] - ro, N) / denom;
float s1 = -dot(rd, N) / denom;
vec3 d0 = ro + s0 * L - uWC[i];
vec3 dd = rd + s1 * L;
vec2 A = vec2(dot(d0, uWU[i]), dot(d0, uWV[i])) / half_;
vec2 B = vec2(dot(dd, uWU[i]), dot(dd, uWV[i])) / half_;
float T0 = 0.0, T1 = tMax;
if (abs(s1) < 1e-6) {
if (s0 <= 0.0) continue;
} else {
float ts = -s0 / s1;
if (s1 > 0.0) T0 = max(T0, ts); else T1 = min(T1, ts);
}
if (T1 <= T0) continue;
float phase = 0.55 + 1.2 * pow(max(dot(rd, L), 0.0), 3.0);
vec4 grid = uWGrid[i];
vec3 c = vec3(0.0);
if (grid.w > 0.5) {
float cols = grid.x, rows = grid.y, mu = grid.z;
float cwu = (2.0 - 2.0 * PANES_BORDER) / cols;
float chu = (2.0 - 2.0 * PANES_BORDER) / rows;
for (int r = 0; r < 4; r++) {
if (float(r) >= rows) break;
for (int k = 0; k < 4; k++) {
if (float(k) >= cols) break;
float x0 = -1.0 + PANES_BORDER + float(k) * cwu + mu * 0.5;
float y1 = 1.0 - PANES_BORDER - float(r) * chu - mu * 0.5;
vec2 lo = vec2(x0, y1 - (chu - mu));
vec2 hi = vec2(x0 + cwu - mu, y1);
float t0 = T0, t1 = T1;
for (int a = 0; a < 2; a++) {
if (abs(B[a]) < 1e-6) {
if (A[a] < lo[a] || A[a] > hi[a]) t1 = -1.0;
continue;
}
float ta = (lo[a] - A[a]) / B[a], tb = (hi[a] - A[a]) / B[a];
t0 = max(t0, min(ta, tb));
t1 = min(t1, max(ta, tb));
}
if (t1 <= t0) continue;
float len = t1 - t0;
vec3 pc = vec3(0.0);
for (int m = 0; m < 3; m++) {
float t = t0 + len * (float(m) + 0.5) / 3.0;
pc += tapPattern(i, A + B * t, 1.0) * exp(-uFade * (s0 + s1 * t) * 0.1);
}
c += pc / 3.0 * len;
}
}
} else {
float t0 = T0, t1 = T1;
for (int k = 0; k < 2; k++) {
float a = A[k], b = B[k];
if (abs(b) < 1e-6) {
if (abs(a) > 1.0) t1 = -1.0;
continue;
}
float ta = (-1.0 - a) / b, tb = (1.0 - a) / b;
t0 = max(t0, min(ta, tb));
t1 = min(t1, max(ta, tb));
}
if (t1 <= t0) continue;
const int M = 10;
float len = t1 - t0;
for (int m = 0; m < M; m++) {
float t = t0 + len * (float(m) + jit) / float(M);
float sd = s0 + s1 * t;
float rr = sd * uSoft / max(abs(denom), 0.25);
float lod = max(0.0, log2(max(max(rr / half_.x, rr / half_.y) * 0.5 * PATTERN_SIZE * 0.8, 1.0))) + 1.0;
c += tapPattern(i, A + B * t, lod) * exp(-uFade * sd * 0.1);
}
c *= len / float(M);
}
sum += c * uWGain[i] * phase;
}
return sum * uSunColor;
}
void applyFocus(vec3 P, float rot, inout vec3 light, inout vec3 halo, inout float ao) {
vec2 rel = P.xy - uFocusC;
float boxD = sdRoundRect(rel, uFocusHalf, uFocusR);
ao *= 1.0 - uFocusShadow * 0.12 * exp(-max(boxD, 0.0) / (uFocusRimW * 3.0)) * step(0.0, boxD);
if (boxD < uFocusRimW * 8.0) {
vec3 l2, h2;
lightAt(vec3(P.xy, uFocusLift), rot, false, l2, h2);
l2 += h2 * 0.6;
if (boxD < 0.0) {
light = l2 * uFocusInside;
halo = vec3(0.0);
}
float rim = exp(-abs(boxD) / uFocusRimW) * (boxD < 0.0 ? 0.35 : 1.0);
light += l2 * rim * uFocusRim;
}
}
float panelSeams(vec2 p) {
if (uPanel <= 0.0) return 1.0;
vec2 q = p / uPanel;
vec2 f = abs(fract(q) - 0.5);
vec2 w = fwidth(q);
vec2 l = smoothstep(vec2(0.5) - w * 1.5 - 0.006, vec2(0.5), f);
return 1.0 - (uTheme == 1 ? 0.05 : 0.1) * max(l.x, l.y);
}
vec3 windowEmission(vec3 P, int surface, float lod) {
vec3 e = vec3(0.0);
for (int i = 0; i < MAX_W; i++) {
if (i >= uCount) break;
if (uWMount[i] != surface) continue;
vec3 d = P - uWC[i];
vec2 half_ = uWHalf[i];
vec2 q = vec2(dot(d, uWU[i]), dot(d, uWV[i]));
vec2 uv = q / half_;
float g = uWGain[i];
float lift_ = 0.9 + 0.2 * clamp(uv.y * 0.5 + 0.5, 0.0, 1.0);
e += tapPattern(i, uv, lod) * g * lift_ * 0.6;
vec3 avg = textureLod(uPattern, vec3(0.5, 0.5, float(i)), 9.0).rgb * 2.0;
float sd = length(max(abs(q) - half_, 0.0));
e += avg * g * (exp(-sd * 5.0) * 0.3 + exp(-sd * 1.4) * 0.08) * (sd > 0.0 ? 1.0 : 0.3);
}
return e * uSunColor * uWinGlow;
}
float dustField(vec2 p, float t) {
float s = 0.0;
for (int l = 0; l < 3; l++) {
float fl = float(l);
float sc = 34.0 + fl * 22.0;
vec2 q = p * sc + vec2(t * (0.05 + 0.03 * fl), -t * (0.09 + 0.04 * fl)) * sc * 0.1;
vec2 id = floor(q);
vec2 f = fract(q);
float h = hash21(id + fl * 17.0);
if (h < 0.9) continue;
vec2 c = vec2(hash21(id + 3.1), hash21(id + 7.7)) * 0.6 + 0.2;
c += 0.12 * vec2(sin(t * 0.5 + h * 40.0), cos(t * 0.43 + h * 31.0));
float r = 0.07 + 0.08 * hash21(id + 9.2);
float tw = 0.55 + 0.45 * sin(t * (0.8 + h * 1.5) + h * 50.0);
s += smoothstep(r, r * 0.2, length(f - c)) * tw * (1.0 - fl * 0.25);
}
return s;
}
vec3 voidColor(vec3 dir) {
float lo = uTheme == 1 ? 0.82 : 0.3;
return uRoomColor * uAmbient * (lo + (1.0 - lo) * smoothstep(-0.45, 0.12, dir.z));
}
vec3 aces(vec3 x) {
return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
void main() {
vec2 ndc = vUv * 2.0 - 1.0;
vec3 dir = normalize(uCamF + ndc.x * uCamK * uAspect * uCamR + ndc.y * uCamK * uCamU);
float rot = ign(gl_FragCoord.xy) * 6.2831853;
vec3 col;
if (uRoom == 1) {
vec3 ro = uCamPos;
float tF = (uFloor == 1 && dir.z < -1e-5) ? -ro.z / dir.z : 1e6;
float tW = dir.y > 1e-5 ? (uWallY - ro.y) / dir.y : 1e6;
float tS = (uSideX != 0.0 && dir.x * uSideX > 1e-5) ? (uSideX - ro.x) / dir.x : 1e6;
if (uFloor == 0) {
if (tW < 1e5 && ro.z + dir.z * tW < 0.0) tW = 1e6;
if (tS < 1e5 && ro.z + dir.z * tS < 0.0) tS = 1e6;
}
float tH = min(tF, min(tW, tS));
bool miss = tH > 1e5;
if (miss) tH = 40.0;
int surface = miss ? 3 : (tH == tF ? 0 : (tH == tW ? 1 : 2));
vec3 P = ro + dir * tH;
vec3 light = vec3(0.0), halo = vec3(0.0);
if (!miss) lightAt(P, rot, false, light, halo);
float ao = 1.0;
float near = 0.0;
for (int i = 0; i < MAX_W; i++) {
if (i >= uCount) break;
if (uWMount[i] == 0) continue;
near += uWGain[i] * exp(-length(P - uWC[i]) * 0.28);
}
float corner = 1.0;
if (surface == 0) corner = (1.0 - 0.45 * exp(-(uWallY - P.y) * 1.2)) * (uSideX != 0.0 ? 1.0 - 0.45 * exp(-abs(uSideX - P.x) * 1.2) : 1.0);
else if (surface != 3 && uFloor == 1) corner = 1.0 - 0.35 * exp(-P.z * 1.4);
vec3 ambient = uRoomColor * uAmbient * (0.7 + 0.45 * near) * corner * ao;
vec3 directAlb = mix(uRoomColor, vec3(1.0), 0.7);
if (surface == 0) {
float alb = floorAlbedo(P.xy);
col = ambient * alb + directAlb * alb * (light + halo * uGlow);
if (uGloss > 0.0) {
vec3 rr = vec3(dir.xy, -dir.z);
float tw = rr.y > 1e-5 ? (uWallY - P.y) / rr.y : 1e6;
float ts2 = (uSideX != 0.0 && rr.x * uSideX > 1e-5) ? (uSideX - P.x) / rr.x : 1e6;
float tr = min(tw, ts2);
if (tr < 1e5) {
vec3 Q = P + rr * tr;
vec3 refl = windowEmission(Q, tr == tw ? 1 : 2, 6.0);
float fres = 0.15 + 0.85 * pow(1.0 - abs(dir.z), 4.0);
col += refl * uGloss * fres * exp(-tr * 0.12) * 0.35;
}
}
} else if (surface == 3) {
col = voidColor(dir);
} else {
vec2 wp = surface == 1 ? P.xz : P.yz;
col = ambient * panelSeams(wp) + directAlb * (light + halo * uGlow) * 0.8 + windowEmission(P, surface, 1.6);
if (uFloor == 0) col = mix(voidColor(dir), col, smoothstep(0.0, 1.6, P.z));
}
if (uHaze > 0.0) {
float jit = hash21(gl_FragCoord.xy * 1.37 + 3.1);
vec3 vb = volBeams(ro, dir, min(tH, 60.0), jit) * uHaze * 0.25;
col += vb;
light += vb * 2.0;
if (uDust > 0.0) {
float lum = dot(vb, vec3(0.3, 0.5, 0.2));
col += normalize(vb + 1e-4) * 1.7 * dustField(vec2(vUv.x * uAspect, vUv.y), uTime) * uDust * min(lum * 6.0, 2.0);
}
}
if (uFocusOn == 1 && uFocusRim > 0.0) {
vec2 sp = vec2(vUv.x * uAspect, vUv.y);
float bd = sdRoundRect(sp - uFocusS.xy, uFocusS.zw, uFocusSR.x);
float rim = exp(-abs(bd) / uFocusSR.y) * (bd < 0.0 ? 0.4 : 1.0);
col += (light + halo * uGlow) * rim * uFocusRim * 0.5;
}
col = aces(col * uExposure);
} else {
float tc = -uCamPos.z / min(dir.z, -1e-4);
vec3 P = uCamPos + tc * dir;
P.z = 0.0;
vec3 light, halo;
lightAt(P, rot, true, light, halo);
float ao = 1.0;
if (uFocusOn == 1) applyFocus(P, rot, light, halo, ao);
float alb = floorAlbedo(P.xy);
float amb = 0.82 + 0.36 * fbm(P.xy * 0.18 + uSeed);
if (uTheme == 0) {
vec3 lit = (light + halo * uGlow) * alb * uExposure;
float m = max(max(lit.r, lit.g), lit.b);
vec3 tm = lit * (1.0 - exp(-m)) / max(m, 1e-4);
tm += (1.0 - tm) * smoothstep(1.1, 4.0, m) * 0.55;
col = uBg * alb * amb * ao + tm;
} else {
vec3 L = (light + halo * uGlow) * alb;
float m = max(max(L.r, L.g), L.b);
float cov = 1.0 - exp(-(L.r + L.g + L.b) * uExposure * 0.75);
vec3 chroma = pow(L / max(m, 1e-4), vec3(1.0 / 2.2));
vec3 bgS = pow(uBg, vec3(1.0 / 2.2)) * mix(1.0, alb, 0.6) * mix(1.0, amb, 0.04);
vec3 s = bgS * ao * (1.0 - uShade * (1.0 - cov)) * mix(vec3(1.0), chroma, cov * 0.78);
col = pow(s, vec3(2.2)) + uBg * cov * 0.04;
}
}
vec2 vq = ndc * vec2(uAspect, 1.0) / max(uAspect, 1.0);
col *= 1.0 - uVignette * smoothstep(0.35, 1.25, length(vq));
col = mix(uBg, col, uOpacity);
if (uBottomFade > 0.0) col = mix(uBg, col, smoothstep(0.0, uBottomFade, vUv.y));
col = mix(col * 12.92, 1.055 * pow(max(col, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, col));
float n = hash21(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5;
col += n * (1.0 / 255.0 + uGrain * 0.05);
outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`
), Qt = (e, t) => [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]], yt = (e) => {
  const t = Math.hypot(e[0], e[1], e[2]) || 1;
  return [e[0] / t, e[1] / t, e[2] / t];
}, Y = Math.tan(L(25)), te = 4;
function nt(e, t) {
  const o = L(e), i = L(y(t, -30, 89));
  return [Math.cos(i) * Math.cos(o), Math.cos(i) * Math.sin(o), Math.sin(i)];
}
function ee(e, t, o = 0) {
  const i = L(y(e, 0, 85)), s = te / Math.max(t, 0.05) / Y, a = L(y(o, -60, 60)), n = (r) => [r[0] * Math.cos(a) + r[1] * Math.sin(a), -r[0] * Math.sin(a) + r[1] * Math.cos(a), r[2]];
  return {
    pos: n([0, -s * Math.sin(i), s * Math.cos(i)]),
    f: n([0, Math.sin(i), -Math.cos(i)]),
    r: n([1, 0, 0]),
    u: n([0, Math.cos(i), Math.sin(i)])
  };
}
function xt(e, t, o, i) {
  const s = o * 2 - 1, a = 1 - i * 2, n = [0, 1, 2].map((l) => e.f[l] + s * Y * t * e.r[l] + a * Y * e.u[l]), r = -e.pos[2] / Math.min(n[2], -1e-4);
  return [e.pos[0] + r * n[0], e.pos[1] + r * n[1], 0];
}
function St(e, t, o, i, s, a) {
  const n = o * 2 - 1, r = 1 - i * 2, l = [0, 1, 2].map((u) => e.f[u] + n * Y * t * e.r[u] + r * Y * e.u[u]), c = (a - e.pos[s]) / (Math.abs(l[s]) < 1e-5 ? 1e-5 : l[s]);
  return [0, 1, 2].map((u) => e.pos[u] + Math.max(c, 0) * l[u]);
}
const oe = (e) => JSON.stringify([
  e.seed,
  e.palette,
  e.windows.slice(0, T).map((t) => [t.kind, t.shape, t.count, t.segments, t.fill, t.frame, t.pieces, t.seed])
]);
class Mt {
  constructor(t, o = {}, i = {}) {
    this.loc = /* @__PURE__ */ new Map(), this.lastPatternKey = "", this.raf = 0, this.lastFrame = 0, this.time = 0, this.dirty = !0, this.paused = !1, this.focus = null, this.visible = !0, this.pageVisible = !0, this.reducedMotion = !1, this.destroyed = !1, this.lost = !1, this.cleanups = [], this.canvas = t, this.config = F(k(ut), o), this.opts = {
      renderScale: i.renderScale ?? 0.5,
      maxDpr: i.maxDpr ?? 2,
      fps: i.fps ?? 30,
      respectReducedMotion: i.respectReducedMotion ?? !0,
      preserveDrawingBuffer: i.preserveDrawingBuffer ?? !1
    }, this.initGL(), this.watch(), this.resize(), this.loop = this.loop.bind(this), this.raf = requestAnimationFrame(this.loop);
  }
  /** 当前浏览器能否运行（WebGL2） */
  static supported() {
    try {
      return !!document.createElement("canvas").getContext("webgl2");
    } catch {
      return !1;
    }
  }
  // ---------------------------------------------------------------- 公开 API
  getConfig() {
    return k(this.config);
  }
  /** 局部更新（深合并）。传数组会整体替换对应下标。 */
  set(t) {
    this.config = F(this.config, t), this.dirty = !0;
  }
  /** 整体替换 */
  setConfig(t) {
    this.config = F(k(ut), t), this.dirty = !0;
  }
  /** 修改渲染选项（例如 renderScale） */
  setOptions(t) {
    Object.assign(this.opts, t), this.resize();
  }
  /**
   * 焦点元素（例如搜索框）的位置，CSS 像素、相对画布左上角。传 null 取消。
   * 光会从它上面掠过：边缘被彩光勾亮，身后投下柔和的影子。
   */
  setFocus(t) {
    this.focus = t, this.dirty = !0;
  }
  /** 跟踪一个元素：尺寸变化、滚动、窗口缩放时自动更新焦点位置。返回取消函数。 */
  trackFocus(t) {
    var n;
    if ((n = this.untrack) == null || n.call(this), !t)
      return this.setFocus(null), () => {
      };
    const o = parseFloat(getComputedStyle(t).borderTopLeftRadius) || 0, i = () => {
      const r = this.canvas.getBoundingClientRect(), l = t.getBoundingClientRect(), c = this.focus, u = l.left - r.left, f = l.top - r.top;
      c && Math.abs(c.x - u) < 0.5 && Math.abs(c.y - f) < 0.5 && Math.abs(c.width - l.width) < 0.5 && Math.abs(c.height - l.height) < 0.5 || this.setFocus({ x: u, y: f, width: l.width, height: l.height, radius: o });
    }, s = () => i();
    s(), this.measureFocus = i;
    const a = "ResizeObserver" in window ? new ResizeObserver(s) : null;
    return a == null || a.observe(t), a == null || a.observe(this.canvas), a == null || a.observe(document.documentElement), window.addEventListener("scroll", s, { passive: !0, capture: !0 }), window.addEventListener("resize", s), this.untrack = () => {
      a == null || a.disconnect(), window.removeEventListener("scroll", s, { capture: !0 }), window.removeEventListener("resize", s), this.measureFocus = void 0, this.untrack = void 0;
    }, this.untrack;
  }
  /** 当前动画时间（秒） */
  get currentTime() {
    return this.time;
  }
  /** 当前动画时间（秒），导出静态图时可指定 */
  setTime(t) {
    this.time = t, this.dirty = !0;
  }
  /** 暂停 / 继续动画（不改配置；暂停时画面停在当前帧） */
  pause() {
    this.paused = !0;
  }
  play() {
    this.paused = !1;
  }
  get isPaused() {
    return this.paused;
  }
  /** 是否处于播放状态（动态模式、未暂停、可见、未开启"减少动态效果"） */
  get animating() {
    return this.config.motion.mode !== "static" && !this.paused && !(this.opts.respectReducedMotion && this.reducedMotion) && this.visible && this.pageVisible && !this.lost;
  }
  /** 以指定像素尺寸渲染并导出 PNG（不影响屏幕上的显示） */
  async toBlob(t, o, i = "image/png", s) {
    const a = [this.canvas.width, this.canvas.height], n = this.gl.getParameter(this.gl.MAX_RENDERBUFFER_SIZE), r = Math.min(1, n / Math.max(t, o));
    this.canvas.width = Math.round(t * r), this.canvas.height = Math.round(o * r), this.render();
    const l = await new Promise(
      (c, u) => this.canvas.toBlob((f) => f ? c(f) : u(new Error("toBlob failed")), i, s)
    );
    return [this.canvas.width, this.canvas.height] = a, this.dirty = !0, l;
  }
  destroy() {
    var o, i, s;
    this.destroyed = !0, cancelAnimationFrame(this.raf), (o = this.untrack) == null || o.call(this), this.cleanups.forEach((a) => a()), (i = this.io) == null || i.disconnect(), (s = this.ro) == null || s.disconnect();
    const t = this.gl;
    t && !t.isContextLost() && (t.deleteTexture(this.tex), t.deleteProgram(this.program), t.deleteVertexArray(this.vao));
  }
  // ---------------------------------------------------------------- 初始化
  initGL() {
    const t = this.canvas.getContext("webgl2", {
      alpha: !1,
      antialias: !1,
      depth: !1,
      stencil: !1,
      premultipliedAlpha: !1,
      preserveDrawingBuffer: this.opts.preserveDrawingBuffer,
      powerPreference: "low-power"
    });
    if (!t) throw new Error("Polanaluz: 当前浏览器不支持 WebGL2");
    this.gl = t;
    const o = (s, a) => {
      const n = t.createShader(s);
      if (t.shaderSource(n, a), t.compileShader(n), !t.getShaderParameter(n, t.COMPILE_STATUS)) throw new Error("Polanaluz shader: " + t.getShaderInfoLog(n));
      return n;
    }, i = t.createProgram();
    if (t.attachShader(i, o(t.VERTEX_SHADER, Zt)), t.attachShader(i, o(t.FRAGMENT_SHADER, Jt)), t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS)) throw new Error("Polanaluz link: " + t.getProgramInfoLog(i));
    this.program = i, this.loc.clear(), this.vao = t.createVertexArray(), this.tex = t.createTexture(), t.bindTexture(t.TEXTURE_2D_ARRAY, this.tex), t.texStorage3D(t.TEXTURE_2D_ARRAY, Math.log2(x) + 1, t.SRGB8_ALPHA8, x, x, T), t.texParameteri(t.TEXTURE_2D_ARRAY, t.TEXTURE_MIN_FILTER, t.LINEAR_MIPMAP_LINEAR), t.texParameteri(t.TEXTURE_2D_ARRAY, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D_ARRAY, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D_ARRAY, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), this.lastPatternKey = "", this.dirty = !0;
  }
  watch() {
    var o;
    const t = (i, s, a) => {
      i.addEventListener(s, a), this.cleanups.push(() => i.removeEventListener(s, a));
    };
    t(this.canvas, "webglcontextlost", (i) => {
      i.preventDefault(), this.lost = !0;
    }), t(this.canvas, "webglcontextrestored", () => {
      this.lost = !1, this.initGL();
    }), t(document, "visibilitychange", () => {
      this.pageVisible = document.visibilityState === "visible";
    }), this.pageVisible = document.visibilityState !== "hidden", "IntersectionObserver" in window && (this.io = new IntersectionObserver((i) => {
      this.visible = i.some((s) => s.isIntersecting), this.visible && (this.dirty = !0);
    }), this.io.observe(this.canvas)), "ResizeObserver" in window && (this.ro = new ResizeObserver(() => this.resize()), this.ro.observe(this.canvas)), this.mq = (o = window.matchMedia) == null ? void 0 : o.call(window, "(prefers-reduced-motion: reduce)"), this.mq && (this.reducedMotion = this.mq.matches, t(this.mq, "change", () => {
      var i;
      this.reducedMotion = !!((i = this.mq) != null && i.matches), this.dirty = !0;
    }));
  }
  resize() {
    const t = this.canvas.getBoundingClientRect(), o = Math.min(window.devicePixelRatio || 1, this.opts.maxDpr), i = Math.max(1, Math.round(t.width * o * this.opts.renderScale)), s = Math.max(1, Math.round(t.height * o * this.opts.renderScale));
    (i !== this.canvas.width || s !== this.canvas.height) && (this.canvas.width = i, this.canvas.height = s), this.dirty = !0;
  }
  // ---------------------------------------------------------------- 渲染
  loop(t) {
    if (!this.destroyed && (this.raf = requestAnimationFrame(this.loop), !this.lost))
      if (this.animating) {
        const o = this.lastFrame ? (t - this.lastFrame) / 1e3 : 0;
        if (o > 0 && o < 1e3 / this.opts.fps / 1e3 - 2e-3) return;
        this.time += Math.min(o, 0.1), this.lastFrame = t, this.render();
      } else
        this.lastFrame = 0, this.dirty && this.visible && this.render();
  }
  u(t) {
    return this.loc.has(t) || this.loc.set(t, this.gl.getUniformLocation(this.program, t)), this.loc.get(t);
  }
  uploadPatterns() {
    const t = oe(this.config);
    if (t === this.lastPatternKey) return;
    this.lastPatternKey = t;
    const o = this.gl;
    o.bindTexture(o.TEXTURE_2D_ARRAY, this.tex), this.config.windows.slice(0, T).forEach((i, s) => {
      const a = Kt(i, this.config.palette, this.config.seed);
      o.texSubImage3D(o.TEXTURE_2D_ARRAY, 0, 0, 0, s, x, x, 1, o.RGBA, o.UNSIGNED_BYTE, a);
    }), o.generateMipmap(o.TEXTURE_2D_ARRAY);
  }
  /** 立即渲染一帧 */
  render() {
    var mt;
    const t = this.gl, o = this.config;
    (mt = this.measureFocus) == null || mt.call(this), this.dirty = !1, this.uploadPatterns();
    const i = this.canvas.width, s = this.canvas.height, a = i / s;
    t.viewport(0, 0, i, s), t.useProgram(this.program), t.bindVertexArray(this.vao), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D_ARRAY, this.tex), t.uniform1i(this.u("uPattern"), 0);
    const n = ee(o.camera.tilt, o.camera.zoom, o.camera.yaw ?? 0);
    t.uniform1f(this.u("uAspect"), a), t.uniform3fv(this.u("uCamPos"), n.pos), t.uniform3fv(this.u("uCamF"), n.f), t.uniform3fv(this.u("uCamR"), n.r), t.uniform3fv(this.u("uCamU"), n.u), t.uniform1f(this.u("uCamK"), Y);
    const r = o.motion, l = r.mode !== "static", c = this.time * r.speed, u = l ? r.amount * (5 * Math.sin(c / 47 * Math.PI * 2) + 3 * (gt(c / 23, 1) - 0.5)) : 0, f = l ? r.amount * 2.2 * Math.sin(c / 61 * Math.PI * 2 + 1.3) : 0, p = l ? 1 - r.clouds * 0.55 * y(gt(c / 9, 2) * 1.6 - 0.45, 0, 1) : 1, w = nt(o.sun.azimuth + u, o.sun.elevation + f), d = nt(o.sun.azimuth, o.sun.elevation);
    t.uniform3fv(this.u("uL"), w);
    const h = Ft(o.sun.temperature), M = o.sun.intensity * p;
    t.uniform3f(this.u("uSunColor"), h[0] * M, h[1] * M, h[2] * M), t.uniform1f(this.u("uSoft"), Math.tan(L(Math.max(o.sun.softness, 0.05) / 2)));
    const m = o.windows.slice(0, T), P = new Float32Array(T * 3), z = new Float32Array(T * 3), O = new Float32Array(T * 3), A = new Float32Array(T * 3), W = new Float32Array(T * 2), D = new Float32Array(T), j = new Int32Array(T), C = new Float32Array(T * 3), Q = new Float32Array(T * 4), K = new Float32Array(T * 4), tt = o.scene.mode === "room";
    m.forEach((v, b) => {
      W.set([Math.max(v.width, 0.01) / 2, Math.max(v.height, 0.01) / 2], b * 2), D[b] = v.enabled ? v.gain : 0, v.kind === "panes" && Q.set([y(Math.round(v.count), 1, 4), y(Math.round(v.segments), 1, 4), Bt(v.frame), 1], b * 4), C.set(tt && v.mount !== "free" ? nt(o.sun.azimuth + v.facing + u, o.sun.elevation + f) : w, b * 3);
      const q = (R) => {
        const vt = y(v.spread ?? 0, 0, 120);
        if (vt <= 0.1) return;
        const it = Math.hypot(v.width, v.height) / 2 / Math.tan(L(vt / 2)), at = [C[b * 3], C[b * 3 + 1], C[b * 3 + 2]];
        K.set([R[0] + at[0] * it, R[1] + at[1] * it, R[2] + at[2] * it, it], b * 4);
      };
      if (tt && v.mount === "wall") {
        const R = St(n, a, v.x, v.y, 1, o.scene.wallDistance);
        P.set(R, b * 3), q(R), z.set([1, 0, 0], b * 3), O.set([0, 0, 1], b * 3), A.set([0, -1, 0], b * 3), j[b] = 1;
        return;
      }
      if (tt && v.mount === "side" && o.scene.sideWall !== 0) {
        const R = St(n, a, v.x, v.y, 0, o.scene.sideWall);
        P.set(R, b * 3), q(R), z.set([0, 1, 0], b * 3), O.set([0, 0, 1], b * 3), A.set([1, 0, 0], b * 3), j[b] = 2;
        return;
      }
      const et = xt(n, a, v.x, v.y), ot = [0, 1, 2].map((R) => et[R] + v.distance * d[R]), X = L(o.sun.azimuth + y(v.facing, -75, 75)), B = L(y(v.slope, 0, 90)), $ = [Math.cos(X), Math.sin(X), 0], Z = [-Math.sin(X), Math.cos(X), 0], J = yt([-Math.sin(B) * $[0], -Math.sin(B) * $[1], Math.cos(B)]), st = yt(Qt(Z, J));
      P.set(ot, b * 3), z.set(Z, b * 3), O.set(J, b * 3), A.set(st, b * 3);
    }), t.uniform1i(this.u("uCount"), m.length), t.uniform3fv(this.u("uWC"), P), t.uniform3fv(this.u("uWU"), z), t.uniform3fv(this.u("uWV"), O), t.uniform3fv(this.u("uWN"), A), t.uniform2fv(this.u("uWHalf"), W), t.uniform1fv(this.u("uWGain"), D), t.uniform1iv(this.u("uWMount"), j), t.uniform3fv(this.u("uWL"), C), t.uniform4fv(this.u("uWGrid"), Q), t.uniform4fv(this.u("uWSrc"), K);
    const E = o.scene;
    t.uniform1i(this.u("uRoom"), tt ? 1 : 0), t.uniform1f(this.u("uWallY"), E.wallDistance), t.uniform1f(this.u("uSideX"), E.sideWall), t.uniform3fv(this.u("uRoomColor"), pt(lt(E.roomColor))), t.uniform1f(this.u("uAmbient"), E.ambient), t.uniform1f(this.u("uHaze"), E.haze), t.uniform1f(this.u("uWinGlow"), E.windowGlow), t.uniform1f(this.u("uBottomFade"), E.bottomFade), t.uniform1f(this.u("uPanel"), E.panel), t.uniform1f(this.u("uGloss"), E.gloss ?? 0), t.uniform1i(this.u("uFloor"), E.floor === !1 ? 0 : 1), t.uniform1f(this.u("uDust"), E.dust ?? 0), t.uniform3fv(this.u("uBg"), pt(lt(o.surface.background))), t.uniform1i(this.u("uTexture"), { none: 0, mosaic: 1, terrazzo: 2, stone: 3, paper: 4 }[o.surface.texture] ?? 0), t.uniform1f(this.u("uTexScale"), o.surface.textureScale), t.uniform1f(this.u("uTexStrength"), o.surface.textureStrength), t.uniform1i(this.u("uTheme"), o.theme === "light" ? 1 : 0), t.uniform1f(this.u("uOpacity"), o.look.opacity), t.uniform1f(this.u("uExposure"), o.look.exposure), t.uniform1f(this.u("uGlow"), o.look.glow), t.uniform1f(this.u("uCaustics"), o.look.caustics), t.uniform1f(this.u("uSeed"), o.seed % 1e3 * 0.137), t.uniform1f(this.u("uShade"), o.look.shade), t.uniform1f(this.u("uFade"), o.look.fade), t.uniform1f(this.u("uVignette"), o.look.vignette), t.uniform1f(this.u("uGrain"), o.look.grain), t.uniform1f(this.u("uTime"), this.time);
    const S = this.focus, Et = this.canvas.clientWidth || 1, G = this.canvas.clientHeight || 1;
    if (S && S.width > 0 && S.height > 0) {
      const v = (st, R) => xt(n, a, st / Et, R / G), b = v(S.x, S.y), q = v(S.x + S.width, S.y + S.height), et = S.x + S.width / 2, ot = S.y + S.height / 2, X = v(et, ot), B = v(et + 1, ot), $ = Math.hypot(B[0] - X[0], B[1] - X[1]), Z = Math.abs(q[0] - b[0]) / 2, J = Math.abs(q[1] - b[1]) / 2;
      t.uniform1i(this.u("uFocusOn"), 1), t.uniform2f(this.u("uFocusC"), (b[0] + q[0]) / 2, (b[1] + q[1]) / 2), t.uniform2f(this.u("uFocusHalf"), Z, J), t.uniform1f(this.u("uFocusR"), Math.min(S.radius * $, Z, J)), t.uniform1f(this.u("uFocusLift"), o.focus.lift), t.uniform1f(this.u("uFocusShadow"), o.focus.shadow), t.uniform1f(this.u("uFocusRim"), o.focus.rim), t.uniform1f(this.u("uFocusRimW"), Math.max(o.focus.rimWidth, 0.5) * $), t.uniform1f(this.u("uFocusInside"), o.focus.inside), t.uniform4f(this.u("uFocusS"), (S.x + S.width / 2) / G, 1 - (S.y + S.height / 2) / G, S.width / 2 / G, S.height / 2 / G), t.uniform2f(this.u("uFocusSR"), Math.min(S.radius, S.width / 2, S.height / 2) / G, Math.max(o.focus.rimWidth, 0.5) / G);
    } else
      t.uniform1i(this.u("uFocusOn"), 0);
    t.drawArrays(t.TRIANGLES, 0, 3);
  }
}
const At = 600;
function rt(e) {
  var i;
  if (e === "dark" || e === "light") return e;
  const t = document.documentElement, o = t.dataset.mode ?? t.dataset.theme;
  return o === "dark" || o === "light" ? o : t.classList.contains("dark") || (i = window.matchMedia) != null && i.call(window, "(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function ie() {
  var e;
  return e = class extends HTMLElement {
    constructor() {
      super(), this.engine = null, this.bundle = null, this.theme = "dark", this.cleanups = [], this.loadToken = 0, this.root = this.attachShadow({ mode: "open" }), this.root.innerHTML = `<style>
      :host { display: block; position: relative; overflow: hidden; contain: strict; }
      img, canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
      img { object-fit: cover; }
      canvas { opacity: 0; transition: opacity ${At}ms ease; }
      canvas.on { opacity: 1; }
      @media (prefers-reduced-motion: reduce) { canvas { transition: none; } }
    </style><img alt="" aria-hidden="true" decoding="async" /><canvas aria-hidden="true"></canvas>`, this.poster = this.root.querySelector("img"), this.canvas = this.root.querySelector("canvas");
    }
    /** 直接给配置（生成器导出的 JSON 对象） */
    set config(o) {
      this.bundle = o, this.apply();
    }
    get config() {
      return this.bundle;
    }
    /** 底层引擎（动态模式下才有），可以用来 pause() / play() */
    get instance() {
      return this.engine;
    }
    connectedCallback() {
      var a;
      const o = () => {
        const n = rt(this.getAttribute("theme"));
        n !== this.theme && (this.theme = n, this.apply(!0));
      }, i = new MutationObserver(o);
      i.observe(document.documentElement, { attributes: !0, attributeFilter: ["data-mode", "data-theme", "class"] });
      const s = (a = window.matchMedia) == null ? void 0 : a.call(window, "(prefers-color-scheme: dark)");
      s == null || s.addEventListener("change", o), this.cleanups.push(() => i.disconnect(), () => s == null ? void 0 : s.removeEventListener("change", o)), this.theme = rt(this.getAttribute("theme")), this.load();
    }
    disconnectedCallback() {
      var o, i;
      this.cleanups.forEach((s) => s()), this.cleanups = [], (o = this.focusWait) == null || o.disconnect(), (i = this.engine) == null || i.destroy(), this.engine = null;
    }
    attributeChangedCallback(o, i, s) {
      !this.isConnected || i === s || (o === "theme" && (this.theme = rt(s)), o === "preset" || o === "config-url" ? this.load() : this.apply(o === "theme"));
    }
    /** 读取配置：config-url > preset > 默认样式 */
    async load() {
      const o = ++this.loadToken, i = this.getAttribute("config-url");
      if (i)
        try {
          const s = await (await fetch(i)).json();
          if (o !== this.loadToken) return;
          this.bundle = s;
        } catch {
          console.warn("polana-luz: 配置读取失败", i);
        }
      else {
        const s = Nt(this.getAttribute("preset") ?? "") ?? ft[0];
        this.bundle = { dark: s.dark, light: s.light, style: s.id };
      }
      this.apply();
    }
    apply(o = !1) {
      var l;
      const i = this.bundle, s = this.getAttribute(this.theme === "dark" ? "poster-dark" : "poster-light");
      if (s && this.poster.getAttribute("src") !== s && (this.poster.src = s), this.poster.hidden = !s, !i) return;
      if (!(this.getAttribute("mode") !== "static" && Mt.supported())) {
        (l = this.engine) == null || l.destroy(), this.engine = null, this.canvas.classList.remove("on");
        return;
      }
      const n = this.theme === "dark" ? i.dark : i.light, r = parseFloat(this.getAttribute("render-scale") ?? "") || 0.5;
      this.engine ? o ? (this.canvas.classList.remove("on"), setTimeout(() => {
        var c;
        (c = this.engine) == null || c.setConfig(n), requestAnimationFrame(() => this.canvas.classList.add("on"));
      }, At / 2)) : (this.engine.setConfig(n), this.engine.setOptions({ renderScale: r })) : (this.engine = new Mt(this.canvas, n, { renderScale: r }), requestAnimationFrame(() => requestAnimationFrame(() => this.canvas.classList.add("on")))), this.watchFocus();
    }
    /** 跟踪焦点元素；元素还没渲染出来（React 等）就等它出现 */
    watchFocus() {
      var s, a;
      (s = this.focusWait) == null || s.disconnect();
      const o = this.getAttribute("focus"), i = o ? document.querySelector(o) : null;
      (a = this.engine) == null || a.trackFocus(i), o && !i && (this.focusWait = new MutationObserver(() => {
        var r, l;
        const n = document.querySelector(o);
        n && ((r = this.focusWait) == null || r.disconnect(), (l = this.engine) == null || l.trackFocus(n));
      }), this.focusWait.observe(document.body, { childList: !0, subtree: !0 }));
    }
  }, e.observedAttributes = ["preset", "config-url", "theme", "focus", "mode", "poster-dark", "poster-light", "render-scale"], e;
}
function se(e = "polana-luz") {
  typeof window > "u" || typeof customElements > "u" || customElements.get(e) || customElements.define(e, ie());
}
se();
export {
  ut as DEFAULT_CONFIG,
  Ct as PALETTES,
  Mt as Polanaluz,
  ft as STYLES,
  se as defineElement,
  Nt as getStyle,
  U as makeWindow
};
