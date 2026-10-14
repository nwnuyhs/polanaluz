/**
 * <polana-luz> Web Component：一个标签放进页面就能用，任何框架都兼容。
 *
 *   <polana-luz
 *     preset="stained-rays-rl"        内置样式（不传则用默认样式）
 *     config-url="/polanaluz.json"    或者：生成器导出的配置 JSON（含 dark / light 两版）
 *     theme="auto"                    auto（默认）/ dark / light
 *     focus="#search-box"             光要围绕的元素（CSS 选择器）
 *     mode="dynamic"                  dynamic（默认）/ static（只显示静态图，不加载 WebGL）
 *     poster-dark="/bg-dark.webp"     静态图：首屏占位、静态模式、不支持 WebGL2 时使用
 *     poster-light="/bg-light.webp"
 *     render-scale="0.5"
 *   ></polana-luz>
 *
 * theme="auto" 时按这个顺序判断：<html data-mode="dark|light">（aiknow / Hunt Now 的写法）→
 * <html data-theme> → <html class="dark"> → 系统的 prefers-color-scheme；切换时平滑过渡。
 * 也可以用 JS 直接给配置：el.config = { dark, light }。
 */
import { Polanaluz } from "./Polanaluz";
import { getStyle, STYLES } from "./presets";
import type { DeepPartial, PolanaluzConfig, Theme } from "./types";

export interface PolanaluzBundle {
  dark: DeepPartial<PolanaluzConfig>;
  light: DeepPartial<PolanaluzConfig>;
  style?: string;
}

const FADE_MS = 600;

function resolveTheme(attr: string | null): Theme {
  if (attr === "dark" || attr === "light") return attr;
  const html = document.documentElement;
  const mode = html.dataset.mode ?? html.dataset.theme;
  if (mode === "dark" || mode === "light") return mode;
  if (html.classList.contains("dark")) return "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** 类在浏览器里才创建：服务端渲染（Next.js 等）时没有 HTMLElement，import 本模块也不会出错 */
function createElementClass() {
  return class PolanaluzElement extends HTMLElement {
  static observedAttributes = ["preset", "config-url", "theme", "focus", "mode", "poster-dark", "poster-light", "render-scale"];

  private root: ShadowRoot;
  private canvas: HTMLCanvasElement;
  private poster: HTMLImageElement;
  private engine: Polanaluz | null = null;
  private bundle: PolanaluzBundle | null = null;
  private theme: Theme = "dark";
  private cleanups: (() => void)[] = [];
  private loadToken = 0;
  private focusWait?: MutationObserver;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.root.innerHTML = `<style>
      :host { display: block; position: relative; overflow: hidden; contain: strict; }
      img, canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
      img { object-fit: cover; }
      canvas { opacity: 0; transition: opacity ${FADE_MS}ms ease; }
      canvas.on { opacity: 1; }
      @media (prefers-reduced-motion: reduce) { canvas { transition: none; } }
    </style><img alt="" aria-hidden="true" decoding="async" /><canvas aria-hidden="true"></canvas>`;
    this.poster = this.root.querySelector("img")!;
    this.canvas = this.root.querySelector("canvas")!;
  }

  /** 直接给配置（生成器导出的 JSON 对象） */
  set config(b: PolanaluzBundle | null) {
    this.bundle = b;
    this.apply();
  }
  get config(): PolanaluzBundle | null {
    return this.bundle;
  }

  /** 底层引擎（动态模式下才有），可以用来 pause() / play() */
  get instance(): Polanaluz | null {
    return this.engine;
  }

  connectedCallback() {
    // 主题：监听 <html> 的属性和系统设置
    const onTheme = () => {
      const t = resolveTheme(this.getAttribute("theme"));
      if (t !== this.theme) {
        this.theme = t;
        this.apply(true);
      }
    };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode", "data-theme", "class"] });
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener("change", onTheme);
    this.cleanups.push(() => mo.disconnect(), () => mq?.removeEventListener("change", onTheme));
    this.theme = resolveTheme(this.getAttribute("theme"));
    this.load();
  }

  disconnectedCallback() {
    this.cleanups.forEach((f) => f());
    this.cleanups = [];
    this.focusWait?.disconnect();
    this.engine?.destroy();
    this.engine = null;
  }

  attributeChangedCallback(name: string, oldV: string | null, newV: string | null) {
    if (!this.isConnected || oldV === newV) return;
    if (name === "theme") this.theme = resolveTheme(newV);
    if (name === "preset" || name === "config-url") this.load();
    else this.apply(name === "theme");
  }

  /** 读取配置：config-url > preset > 默认样式 */
  private async load() {
    const token = ++this.loadToken;
    const url = this.getAttribute("config-url");
    if (url) {
      try {
        const b = (await (await fetch(url)).json()) as PolanaluzBundle;
        if (token !== this.loadToken) return;
        this.bundle = b;
      } catch {
        console.warn("polana-luz: 配置读取失败", url);
      }
    } else {
      const s = getStyle(this.getAttribute("preset") ?? "") ?? STYLES[0];
      this.bundle = { dark: s.dark, light: s.light, style: s.id };
    }
    this.apply();
  }

  private apply(fade = false) {
    const b = this.bundle;
    const posterSrc = this.getAttribute(this.theme === "dark" ? "poster-dark" : "poster-light");
    if (posterSrc && this.poster.getAttribute("src") !== posterSrc) this.poster.src = posterSrc;
    this.poster.hidden = !posterSrc;
    if (!b) return;

    const wantDynamic = this.getAttribute("mode") !== "static" && Polanaluz.supported();
    if (!wantDynamic) {
      this.engine?.destroy();
      this.engine = null;
      this.canvas.classList.remove("on");
      return;
    }
    const cfg = this.theme === "dark" ? b.dark : b.light;
    const scale = parseFloat(this.getAttribute("render-scale") ?? "") || 0.5;
    if (!this.engine) {
      this.engine = new Polanaluz(this.canvas, cfg, { renderScale: scale });
      requestAnimationFrame(() => requestAnimationFrame(() => this.canvas.classList.add("on")));
    } else if (fade) {
      // 切换主题：先淡出，再换配置，再淡入（中间露出对应主题的静态图）
      this.canvas.classList.remove("on");
      setTimeout(() => {
        this.engine?.setConfig(cfg);
        requestAnimationFrame(() => this.canvas.classList.add("on"));
      }, FADE_MS / 2);
    } else {
      this.engine.setConfig(cfg);
      this.engine.setOptions({ renderScale: scale });
    }
    this.watchFocus();
  }

  /** 跟踪焦点元素；元素还没渲染出来（React 等）就等它出现 */
  private watchFocus() {
    this.focusWait?.disconnect();
    const sel = this.getAttribute("focus");
    const el = sel ? document.querySelector(sel) : null;
    this.engine?.trackFocus(el);
    if (sel && !el) {
      this.focusWait = new MutationObserver(() => {
        const found = document.querySelector(sel);
        if (found) {
          this.focusWait?.disconnect();
          this.engine?.trackFocus(found);
        }
      });
      this.focusWait.observe(document.body, { childList: true, subtree: true });
    }
  }
  };
}

/** 注册 <polana-luz>（重复调用无害；不在浏览器里时什么也不做） */
export function defineElement(name = "polana-luz") {
  if (typeof window === "undefined" || typeof customElements === "undefined" || customElements.get(name)) return;
  customElements.define(name, createElementClass());
}
