/**
 * Polanaluz 生成器：实时预览 + 参数面板 + 网页模拟 + 导出，界面中英文可切换。
 * 状态：当前样式的深色、浅色两份配置都可编辑，切换主题就切换正在编辑的那份。
 * 全部状态写进 URL hash，复制链接即可分享同一个效果。
 */
import GUI from "lil-gui";
import "./studio.css";
import { Polanaluz, PALETTES, STYLES, getStyle, makeWindow } from "../core";
import type { PolanaluzConfig, Theme } from "../core";
import { deepMerge } from "../core/util";
import { applyStaticText, lang, opts, setLang, tr } from "./i18n";

const MAX_WINDOWS = 4;
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

interface State {
  style: string;
  theme: Theme;
  configs: Record<Theme, PolanaluzConfig>;
}

// ---------------------------------------------------------------- 状态与 URL

function fromStyle(id: string, theme: Theme = "dark"): State {
  const s = getStyle(id) ?? STYLES[0];
  return { style: s.id, theme, configs: { dark: clone(s.dark), light: clone(s.light) } };
}

function loadState(): State {
  try {
    const h = location.hash.slice(1);
    if (h) {
      const s = JSON.parse(decodeURIComponent(escape(atob(h)))) as State;
      if (s?.configs?.dark && s.configs.light) {
        // 用默认值补齐旧链接里缺的字段
        const base = fromStyle(s.style, s.theme);
        base.configs.dark = deepMerge(base.configs.dark, s.configs.dark);
        base.configs.light = deepMerge(base.configs.light, s.configs.light);
        return base;
      }
    }
  } catch {
    /* 链接损坏时回到默认 */
  }
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;
  return fromStyle(STYLES[0].id, prefersLight ? "light" : "dark");
}

let saveTimer = 0;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const h = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    history.replaceState(null, "", "#" + h);
  }, 250);
}

let state = loadState();
const cfg = () => state.configs[state.theme];

// ---------------------------------------------------------------- 引擎

const canvas = $<HTMLCanvasElement>("stage");
if (!Polanaluz.supported()) {
  document.body.insertAdjacentHTML("beforeend", `<p class="unsupported">${tr("当前浏览器不支持 WebGL2，无法预览。", "This browser does not support WebGL2.")}</p>`);
  throw new Error("WebGL2 unsupported");
}
const engine = new Polanaluz(canvas, cfg(), { preserveDrawingBuffer: true });
const apply = () => {
  engine.setConfig(cfg());
  document.documentElement.dataset.theme = state.theme;
  saveState();
};

// ---------------------------------------------------------------- 参数面板

let gui: GUI | null = null;

function buildGui() {
  const open = gui ? collectOpen(gui) : null;
  gui?.destroy();
  const c = cfg();
  gui = new GUI({ title: state.theme === "dark" ? tr("参数 · 深色版", "Settings · dark") : tr("参数 · 浅色版", "Settings · light"), width: 300 });
  gui.onChange(apply);

  const sun = gui.addFolder(tr("光源（太阳）", "Light (sun)"));
  sun.add(c.sun, "azimuth", 0, 360, 1).name(tr("方位角 °", "Azimuth °"));
  sun.add(c.sun, "elevation", -20, 85, 0.5).name(tr("高度角 °", "Elevation °"));
  sun.add(c.sun, "intensity", 0, 4, 0.05).name(tr("强度", "Intensity"));
  sun.add(c.sun, "temperature", 2800, 8000, 50).name(tr("色温 K", "Temperature K"));
  sun.add(c.sun, "softness", 0.1, 10, 0.1).name(tr("柔度", "Softness"));

  c.windows.forEach((w, i) => {
    const f = gui!.addFolder(`${tr("窗户", "Window")} ${i + 1}`);
    f.add(w, "enabled").name(tr("启用", "Enabled"));
    f.add(w, "mount", opts([["只投影", "Projection only", "free"], ["后墙", "Back wall", "wall"], ["侧墙", "Side wall", "side"]])).name(tr("安装位置", "Mount")).onFinishChange(buildGui);
    f.add(w, "kind", opts([["微软式窗格", "Panes (Windows style)", "panes"], ["彩色网格窗", "Stained grid", "grid"], ["光缝", "Slits", "slits"]])).name(tr("窗型", "Window type")).onFinishChange(buildGui);
    if (w.kind === "grid") f.add(w, "shape", opts([["矩形", "Rectangle", "rect"], ["圆拱", "Arch", "arch"], ["三角", "Triangle", "triangle"]])).name(tr("外形", "Shape"));
    f.add(w, "x", -0.5, 1.5, 0.01).name(tr("落点 X", "Target X"));
    f.add(w, "y", -0.5, 1.5, 0.01).name(tr("落点 Y", "Target Y"));
    f.add(w, "distance", 1, 30, 0.1).name(tr("离窗距离", "Distance"));
    f.add(w, "width", 0.1, 8, 0.05).name(tr("窗宽", "Width"));
    f.add(w, "height", 0.1, 8, 0.05).name(tr("窗高", "Height"));
    f.add(w, "facing", -75, 75, 1).name(w.mount === "free" ? tr("朝向偏转 °", "Facing °") : tr("光线偏转 °", "Beam turn °"));
    f.add(w, "slope", 0, 90, 1).name(tr("窗面倾角 °", "Slope °"));
    const isPanes = w.kind === "panes";
    f.add(w, "count", 1, isPanes ? 4 : w.kind === "grid" ? 16 : 12, 1).name(w.kind === "slits" ? tr("光缝条数", "Slits") : tr("列数", "Columns"));
    f.add(w, "segments", 1, isPanes ? 4 : 16, 1).name(w.kind === "slits" ? tr("颜色分段", "Segments") : tr("行数", "Rows"));
    if (isPanes) f.add(w, "pieces", 0, 8, 1).name(tr("格内彩色碎片", "Stained pieces"));
    if (w.mount !== "free") f.add(w, "spread", 0, 90, 0.5).name(tr("发散角 °", "Spread °"));
    if (w.kind === "slits") f.add(w, "fill", 0.05, 1, 0.01).name(tr("缝宽比例", "Slit fill"));
    f.add(w, "frame", 0, 1, 0.01).name(tr("窗框粗细", "Frame"));
    f.add(w, "gain", 0, 3, 0.05).name(tr("亮度", "Brightness"));
    f.add(w, "seed", 0, 999, 1).name(tr("图案种子", "Pattern seed"));
    f.add({ remove: () => removeWindow(i) }, "remove").name(tr("✕ 删除这组", "✕ Remove"));
    f.close();
  });
  if (c.windows.length < MAX_WINDOWS) gui.add({ add: addWindow }, "add").name(tr("＋ 添加窗户组", "＋ Add window"));

  const pal = gui.addFolder(tr("色彩", "Color"));
  pal
    .add({ preset: "" }, "preset", Object.fromEntries([[tr("（选择色板）", "(choose a palette)"), ""], ...PALETTES.map((p) => [tr(p.name, p.nameEn ?? p.name), p.id])]))
    .name(tr("色板预设", "Palette"))
    .onChange((id: string) => {
      const p = PALETTES.find((x) => x.id === id);
      if (!p) return;
      cfg().palette = clone(p.palette);
      apply();
      buildGui();
    });
  c.palette.colors.forEach((_, i) => {
    pal.addColor(c.palette.colors, i as keyof string[]).name(`${tr("颜色", "Color")} ${i + 1}`);
    pal.add(c.palette.weights, i as keyof number[], 0, 5, 0.1).name(`　${tr("权重", "Weight")} ${i + 1}`);
  });
  pal.add(c.palette, "white", 0, 0.8, 0.01).name(tr("白玻璃比例", "Clear glass"));
  pal.add(c.palette, "saturation", 0, 1.6, 0.01).name(tr("饱和度", "Saturation"));
  pal.add(c, "seed", 0, 9999, 1).name(tr("全局种子", "Global seed"));
  pal.close();

  const sce = gui.addFolder(tr("场景", "Scene"));
  sce.add(c.scene, "mode", opts([["地面俯视", "Floor (top-down)", "floor"], ["房间", "Room", "room"]])).name(tr("模式", "Mode"));
  sce.addColor(c.scene, "roomColor").name(tr("房间色调", "Room color"));
  sce.add(c.scene, "ambient", 0, 2, 0.01).name(tr("环境光", "Ambient"));
  sce.add(c.scene, "haze", 0, 3, 0.01).name(tr("光柱浓度", "Beam haze"));
  sce.add(c.scene, "windowGlow", 0, 4, 0.05).name(tr("窗户发光", "Window glow"));
  sce.add(c.scene, "wallDistance", 1, 20, 0.1).name(tr("后墙距离", "Back wall distance"));
  sce.add(c.scene, "sideWall", -20, 20, 0.1).name(tr("侧墙（正右 负左 0无）", "Side wall (+R −L 0 none)"));
  sce.add(c.scene, "floor").name(tr("地面", "Floor"));
  sce.add(c.scene, "dust", 0, 1, 0.01).name(tr("浮尘", "Dust"));
  sce.add(c.scene, "panel", 0, 4, 0.05).name(tr("墙面分缝", "Wall panels"));
  sce.add(c.scene, "gloss", 0, 1, 0.01).name(tr("地面光泽", "Floor gloss"));
  sce.add(c.scene, "bottomFade", 0, 0.6, 0.01).name(tr("底部淡出", "Bottom fade"));
  sce.close();

  const cam = gui.addFolder(tr("投影视角", "Camera"));
  cam.add(c.camera, "tilt", 0, 85, 0.5).name(tr("俯视角 °", "Tilt °"));
  cam.add(c.camera, "yaw", -60, 60, 0.5).name(tr("偏航角 °", "Yaw °"));
  cam.add(c.camera, "zoom", 0.3, 3, 0.01).name(tr("缩放", "Zoom"));
  cam.close();

  const sur = gui.addFolder(tr("地面", "Surface"));
  sur.addColor(c.surface, "background").name(tr("背景色", "Background"));
  sur.add(c.surface, "texture", opts([["无", "None", "none"], ["纸张", "Paper", "paper"], ["清水混凝土", "Concrete", "stone"], ["马赛克", "Mosaic", "mosaic"], ["水磨石", "Terrazzo", "terrazzo"]])).name(tr("纹理", "Texture"));
  sur.add(c.surface, "textureScale", 0.02, 1, 0.005).name(tr("纹理尺寸", "Texture scale"));
  sur.add(c.surface, "textureStrength", 0, 1, 0.01).name(tr("纹理强度", "Texture strength"));
  sur.close();

  const look = gui.addFolder(tr("画面", "Look"));
  look.add(c.look, "opacity", 0, 1, 0.01).name(tr("不透明度", "Opacity"));
  look.add(c.look, "exposure", 0, 4, 0.05).name(tr("曝光", "Exposure"));
  look.add(c.look, "glow", 0, 2, 0.01).name(tr("光晕", "Glow"));
  look.add(c.look, "caustics", 0, 1.5, 0.01).name(tr("玻璃纹理", "Glass caustics"));
  if (c.theme === "light") look.add(c.look, "shade", 0, 0.4, 0.005).name(tr("环境阴影", "Ambient shade"));
  look.add(c.look, "fade", 0, 2, 0.01).name(tr("远端衰减", "Fade"));
  look.add(c.look, "vignette", 0, 1, 0.01).name(tr("暗角", "Vignette"));
  look.add(c.look, "grain", 0, 1, 0.01).name(tr("颗粒", "Grain"));
  look.close();

  const fo = gui.addFolder(tr("搜索框（焦点元素）", "Search box (focus)"));
  fo.add(c.focus, "lift", 0, 1, 0.01).name(tr("悬浮高度", "Lift"));
  fo.add(c.focus, "shadow", 0, 1, 0.01).name(tr("影子浓度", "Shadow"));
  fo.add(c.focus, "rim", 0, 3, 0.05).name(tr("边缘受光", "Rim light"));
  fo.add(c.focus, "rimWidth", 1, 40, 0.5).name(tr("边缘光宽度 px", "Rim width px"));
  fo.add(c.focus, "inside", 0, 1, 0.01).name(tr("框内透光", "Inner light"));

  const mo = gui.addFolder(tr("动画", "Animation"));
  mo.add(c.motion, "mode", opts([["静态", "Static", "static"], ["缓慢漂移", "Slow drift", "drift"]])).name(tr("模式", "Mode"));
  mo.add(c.motion, "speed", 0, 6, 0.05).name(tr("速度", "Speed"));
  mo.add(c.motion, "amount", 0, 4, 0.05).name(tr("幅度", "Amount"));
  mo.add(c.motion, "clouds", 0, 1, 0.01).name(tr("云层明暗", "Clouds"));
  mo.close();

  const r = gui.addFolder(tr("渲染", "Render"));
  r.add(renderOpts, "renderScale", 0.25, 1, 0.05).name(tr("渲染分辨率", "Render scale")).onChange((v: number) => engine.setOptions({ renderScale: v }));
  r.close();

  if (open) restoreOpen(gui, open);
}

const renderOpts = { renderScale: 0.5 };

function collectOpen(g: GUI): Set<string> {
  return new Set(g.foldersRecursive().filter((f) => !f._closed).map((f) => f._title));
}
function restoreOpen(g: GUI, open: Set<string>) {
  g.foldersRecursive().forEach((f) => (open.has(f._title) ? f.open() : f.close()));
}

function addWindow() {
  for (const t of ["dark", "light"] as Theme[]) {
    const ws = state.configs[t].windows;
    if (ws.length < MAX_WINDOWS) ws.push(makeWindow({ x: 0.5, y: 0.5, seed: ws.length + 1 }));
  }
  apply();
  buildGui();
}
function removeWindow(i: number) {
  for (const t of ["dark", "light"] as Theme[]) state.configs[t].windows.splice(i, 1);
  apply();
  buildGui();
}

// ---------------------------------------------------------------- 顶部工具栏

const styleSel = $<HTMLSelectElement>("style");
const fillStyles = () =>
  (styleSel.innerHTML = STYLES.map((s) => `<option value="${s.id}" title="${tr(s.desc, s.descEn ?? s.desc)}">${tr(s.name, s.nameEn ?? s.name)}</option>`).join(""));
fillStyles();

function syncBar() {
  styleSel.value = state.style;
  document.querySelectorAll<HTMLButtonElement>("[data-theme]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.theme === state.theme)));
  $("play").textContent = engine.isPaused ? "▶" : "❚❚";
}

styleSel.onchange = () => {
  state = fromStyle(styleSel.value, state.theme);
  apply();
  buildGui();
  syncBar();
};
document.querySelectorAll<HTMLButtonElement>("[data-theme]").forEach((b) => {
  b.onclick = () => {
    state.theme = b.dataset.theme as Theme;
    apply();
    buildGui();
    syncBar();
  };
});
$("play").onclick = () => {
  engine.isPaused ? engine.play() : engine.pause();
  syncBar();
};
$("shuffle").onclick = () => {
  const seed = Math.floor(Math.random() * 9999);
  state.configs.dark.seed = seed;
  state.configs.light.seed = seed;
  apply();
  gui?.controllersRecursive().forEach((c) => c.updateDisplay());
};
$("reset").onclick = () => {
  state = fromStyle(state.style, state.theme);
  apply();
  buildGui();
  toast(tr("已恢复默认参数", "Reset to defaults"));
};

// ---------------------------------------------------------------- 导出

function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/** 导出给网页用的配置：深色、浅色两版 */
const exportBundle = () => ({ name: "polanaluz", version: 1, style: state.style, dark: state.configs.dark, light: state.configs.light });

/**
 * 静态图：用对应主题的配置、动画第 0 秒、不带搜索框描边（网页上搜索框的位置会和生成器里不同），
 * 渲染完恢复当前画面。
 */
async function renderStatic(theme: Theme, w = 1920, h = 1080): Promise<Blob> {
  const t = engine.currentTime;
  engine.trackFocus(null);
  engine.setConfig(state.configs[theme]);
  engine.setTime(0);
  try {
    return await engine.toBlob(w, h, "image/webp", 0.88);
  } finally {
    engine.setConfig(cfg());
    engine.setTime(t);
    syncFocus();
  }
}

async function doExport(kind: string) {
  if (kind === "png") {
    const w = Math.round(Math.min(3840, window.innerWidth * 2));
    const h = Math.round((w * window.innerHeight) / window.innerWidth);
    download(await engine.toBlob(w, h), `polanaluz-${state.style}-${state.theme}-${w}x${h}.png`);
    return toast(`${tr("已导出", "Exported")} ${w}×${h} PNG`);
  }
  if (kind === "copy") {
    try {
      await navigator.clipboard.writeText(JSON.stringify(exportBundle(), null, 2));
      return toast(tr("已复制配置 JSON（含深色、浅色两版）", "Config JSON copied (dark + light)"));
    } catch {
      return toast(tr("复制失败：浏览器不允许访问剪贴板", "Copy failed: clipboard access denied"));
    }
  }
  if (kind === "json" || kind === "bundle") {
    download(new Blob([JSON.stringify(exportBundle(), null, 2)], { type: "application/json" }), "polanaluz.json");
  }
  if (kind === "webp" || kind === "bundle") {
    for (const t of ["dark", "light"] as Theme[]) download(await renderStatic(t), `polanaluz-${t}.webp`);
  }
  toast(kind === "bundle" ? tr("已导出接入包：polanaluz.json、polanaluz-dark.webp、polanaluz-light.webp", "Exported: polanaluz.json, polanaluz-dark.webp, polanaluz-light.webp") : tr("已导出", "Exported"));
}

const menuBtn = $("export");
const menu = $("export-menu");
const setMenu = (open: boolean) => {
  menu.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
};
menuBtn.onclick = (e) => {
  e.stopPropagation();
  setMenu(menu.hidden);
};
menu.querySelectorAll<HTMLButtonElement>("[data-export]").forEach((b) => {
  b.onclick = async () => {
    setMenu(false);
    await doExport(b.dataset.export!);
  };
});
document.addEventListener("click", (e) => {
  if (!menu.hidden && !(e.target as HTMLElement).closest(".menu")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

const toggle = (btn: string, el: string, before?: () => void) => {
  $(btn).onclick = () => {
    before?.();
    const box = $(el);
    box.hidden = !box.hidden;
    $(btn).setAttribute("aria-pressed", String(!box.hidden));
  };
};
toggle("toggle-mock", "mock");
// 网页模拟打开时，光以模拟页面的搜索框为焦点
const syncFocus = () => engine.trackFocus($("mock").hidden ? null : $("mock-search"));
$("toggle-mock").addEventListener("click", syncFocus);
$("toggle-mock").setAttribute("aria-pressed", "true");
syncFocus();

// 快捷键
window.addEventListener("keydown", (e) => {
  if ((e.target as HTMLElement).closest("input, select, textarea")) return;
  if (e.code === "Space") {
    e.preventDefault();
    $("play").click();
  } else if (e.key === "r" || e.key === "R") $("shuffle").click();
});

let toastTimer = 0;
function toast(msg: string) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove("show"), 2200);
}

// 语言切换
const syncLangBtn = () => ($("lang").textContent = lang === "en" ? "中文" : "EN");
$("lang").onclick = () => {
  setLang(lang === "en" ? "zh" : "en");
  fillStyles();
  buildGui();
  syncBar();
  syncLangBtn();
};

// ---------------------------------------------------------------- 启动

applyStaticText();
syncLangBtn();
apply();
buildGui();
syncBar();
// 调试用：控制台里可以直接操作
(window as unknown as { polanaluz: Polanaluz }).polanaluz = engine;

// 开发用：把画面和模拟页面的关键元素合成为一张原尺寸截图，存到 .snapshots/（见 vite.config.ts）
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__studio = { exportBundle, renderStatic };
  (window as unknown as Record<string, unknown>).__compose = async (name: string, W = 1440, H = 900) => {
    const sb = $("mock-search").getBoundingClientRect();
    const h1 = document.querySelector(".mock-hero h1")!.getBoundingClientRect();
    const sx = W / innerWidth, sy = H / innerHeight;
    const bmp = await createImageBitmap(await engine.toBlob(W, H));
    const c = new OffscreenCanvas(W, H);
    const x = c.getContext("2d")!;
    x.drawImage(bmp, 0, 0);
    const dark = state.theme === "dark";
    x.font = `700 ${Math.round(48 * sy)}px system-ui, "Microsoft YaHei UI"`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillStyle = dark ? "#edeef0" : "#15171c";
    x.fillText(document.querySelector(".mock-hero h1")!.textContent ?? "", (h1.left + h1.width / 2) * sx, (h1.top + h1.height / 2) * sy);
    x.beginPath();
    x.roundRect(sb.left * sx, sb.top * sy, sb.width * sx, sb.height * sy, 18 * sx);
    x.fillStyle = dark ? "rgba(26,27,30,0.86)" : "rgba(255,255,255,0.86)";
    x.fill();
    x.lineWidth = 1.5 * sx;
    x.strokeStyle = dark ? "#edeef0" : "#15171c";
    x.stroke();
    x.font = `${Math.round(18 * sy)}px system-ui, "Microsoft YaHei UI"`;
    x.textAlign = "left";
    x.fillStyle = dark ? "#9a9ea6" : "#5d626b";
    x.fillText(document.querySelector(".mock-search .ph")!.textContent ?? "", (sb.left + 28) * sx, (sb.top + 36) * sy);
    const out = await c.convertToBlob({ type: "image/png" });
    return (await fetch("/__snap?name=" + name, { method: "POST", body: out })).status;
  };
}
