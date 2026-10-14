import { DEFAULT_CONFIG } from "./presets";
import { drawPattern, panesMullionUv, PATTERN_SIZE } from "./patterns";
import { FRAG, MAX_WINDOWS, VERT } from "./shaders";
import type { DeepPartial, FocusRect, PolanaluzConfig, PolanaluzOptions, WindowGroup } from "./types";
import { clamp, clone, deepMerge, deg, hexToRgb, kelvinToRgb, noise1, toLinear } from "./util";

type V3 = [number, number, number];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** 相机视野：tan(25°)。俯视角 0、zoom 1 时屏幕半高 = 4 个地面单位 */
const CAM_K = Math.tan(deg(25));
const BASE_HALF_HEIGHT = 4;

function sunDir(azimuth: number, elevation: number): V3 {
  const a = deg(azimuth);
  // 房间模式里光可以接近水平甚至略微向上（横穿画面、不落地）
  const e = deg(clamp(elevation, -30, 89));
  return [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
}

interface Camera {
  pos: V3;
  f: V3;
  r: V3;
  u: V3;
}

function makeCamera(tilt: number, zoom: number, yaw = 0): Camera {
  const th = deg(clamp(tilt, 0, 85));
  const d = BASE_HALF_HEIGHT / Math.max(zoom, 0.05) / CAM_K;
  // 先按俯视角摆好，再绕竖直轴转 yaw（相机仍然看向画面中心对应的地面点）
  const y = deg(clamp(yaw, -60, 60));
  const rz = (v: V3): V3 => [v[0] * Math.cos(y) + v[1] * Math.sin(y), -v[0] * Math.sin(y) + v[1] * Math.cos(y), v[2]];
  return {
    pos: rz([0, -d * Math.sin(th), d * Math.cos(th)]),
    f: rz([0, Math.sin(th), -Math.cos(th)]),
    r: rz([1, 0, 0]),
    u: rz([0, Math.cos(th), Math.sin(th)]),
  };
}

/** 屏幕比例坐标（0..1，左上为原点）→ 地面点 */
function screenToFloor(cam: Camera, aspect: number, x: number, y: number): V3 {
  const nx = x * 2 - 1;
  const ny = 1 - y * 2;
  const dir: V3 = [0, 1, 2].map((i) => cam.f[i] + nx * CAM_K * aspect * cam.r[i] + ny * CAM_K * cam.u[i]) as V3;
  const t = -cam.pos[2] / Math.min(dir[2], -1e-4);
  return [cam.pos[0] + t * dir[0], cam.pos[1] + t * dir[1], 0];
}

/** 屏幕比例坐标 → 与平面（axis 分量 = value）的交点，用于把窗户"挂"到墙上 */
function screenToPlane(cam: Camera, aspect: number, x: number, y: number, axis: 0 | 1, value: number): V3 {
  const nx = x * 2 - 1;
  const ny = 1 - y * 2;
  const dir: V3 = [0, 1, 2].map((i) => cam.f[i] + nx * CAM_K * aspect * cam.r[i] + ny * CAM_K * cam.u[i]) as V3;
  const t = (value - cam.pos[axis]) / (Math.abs(dir[axis]) < 1e-5 ? 1e-5 : dir[axis]);
  return [0, 1, 2].map((i) => cam.pos[i] + Math.max(t, 0) * dir[i]) as V3;
}

/** 用于判断图案是否需要重画的字段 */
const patternKey = (c: PolanaluzConfig) =>
  JSON.stringify([
    c.seed,
    c.palette,
    c.windows.slice(0, MAX_WINDOWS).map((w) => [w.kind, w.shape, w.count, w.segments, w.fill, w.frame, w.pieces, w.seed]),
  ]);

export class Polanaluz {
  /** 当前浏览器能否运行（WebGL2） */
  static supported(): boolean {
    try {
      return !!document.createElement("canvas").getContext("webgl2");
    } catch {
      return false;
    }
  }

  readonly canvas: HTMLCanvasElement;
  private gl!: WebGL2RenderingContext;
  private program!: WebGLProgram;
  private vao!: WebGLVertexArrayObject;
  private tex!: WebGLTexture;
  private loc = new Map<string, WebGLUniformLocation | null>();
  private config: PolanaluzConfig;
  private opts: Required<PolanaluzOptions>;
  private lastPatternKey = "";
  private raf = 0;
  private lastFrame = 0;
  private time = 0;
  private dirty = true;
  private paused = false;
  private focus: FocusRect | null = null;
  private measureFocus?: () => void;
  private untrack?: () => void;
  private visible = true;
  private pageVisible = true;
  private reducedMotion = false;
  private destroyed = false;
  private lost = false;
  private io?: IntersectionObserver;
  private ro?: ResizeObserver;
  private mq?: MediaQueryList;
  private cleanups: (() => void)[] = [];

  constructor(canvas: HTMLCanvasElement, config: DeepPartial<PolanaluzConfig> = {}, options: PolanaluzOptions = {}) {
    this.canvas = canvas;
    this.config = deepMerge(clone(DEFAULT_CONFIG), config);
    this.opts = {
      renderScale: options.renderScale ?? 0.5,
      maxDpr: options.maxDpr ?? 2,
      fps: options.fps ?? 30,
      respectReducedMotion: options.respectReducedMotion ?? true,
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
    };
    this.initGL();
    this.watch();
    this.resize();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  // ---------------------------------------------------------------- 公开 API

  getConfig(): PolanaluzConfig {
    return clone(this.config);
  }

  /** 局部更新（深合并）。传数组会整体替换对应下标。 */
  set(patch: DeepPartial<PolanaluzConfig>): void {
    this.config = deepMerge(this.config, patch);
    this.dirty = true;
  }

  /** 整体替换 */
  setConfig(config: DeepPartial<PolanaluzConfig>): void {
    this.config = deepMerge(clone(DEFAULT_CONFIG), config);
    this.dirty = true;
  }

  /** 修改渲染选项（例如 renderScale） */
  setOptions(o: PolanaluzOptions): void {
    Object.assign(this.opts, o);
    this.resize();
  }

  /**
   * 焦点元素（例如搜索框）的位置，CSS 像素、相对画布左上角。传 null 取消。
   * 光会从它上面掠过：边缘被彩光勾亮，身后投下柔和的影子。
   */
  setFocus(rect: FocusRect | null): void {
    this.focus = rect;
    this.dirty = true;
  }

  /** 跟踪一个元素：尺寸变化、滚动、窗口缩放时自动更新焦点位置。返回取消函数。 */
  trackFocus(el: Element | null): () => void {
    this.untrack?.();
    if (!el) {
      this.setFocus(null);
      return () => {};
    }
    const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    // 只在位置真的变了时才标记重绘（动画模式下每帧都会调用）
    const measure = () => {
      const c = this.canvas.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const f = this.focus;
      const x = r.left - c.left, y = r.top - c.top;
      if (f && Math.abs(f.x - x) < 0.5 && Math.abs(f.y - y) < 0.5 && Math.abs(f.width - r.width) < 0.5 && Math.abs(f.height - r.height) < 0.5) return;
      this.setFocus({ x, y, width: r.width, height: r.height, radius });
    };
    const update = () => measure();
    update();
    // 元素只是挪了位置（上方内容变高、字体加载完、换语言重排）时尺寸不变，ResizeObserver 察觉不到：
    // 所以每次渲染前也量一次（见 render），并且监听整页尺寸变化
    this.measureFocus = measure;
    const ro = "ResizeObserver" in window ? new ResizeObserver(update) : null;
    ro?.observe(el);
    ro?.observe(this.canvas);
    ro?.observe(document.documentElement);
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    this.untrack = () => {
      ro?.disconnect();
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
      this.measureFocus = undefined;
      this.untrack = undefined;
    };
    return this.untrack;
  }

  /** 当前动画时间（秒） */
  get currentTime(): number {
    return this.time;
  }

  /** 当前动画时间（秒），导出静态图时可指定 */
  setTime(t: number): void {
    this.time = t;
    this.dirty = true;
  }

  /** 暂停 / 继续动画（不改配置；暂停时画面停在当前帧） */
  pause(): void {
    this.paused = true;
  }
  play(): void {
    this.paused = false;
  }
  get isPaused(): boolean {
    return this.paused;
  }

  /** 是否处于播放状态（动态模式、未暂停、可见、未开启"减少动态效果"） */
  get animating(): boolean {
    return (
      this.config.motion.mode !== "static" &&
      !this.paused &&
      !(this.opts.respectReducedMotion && this.reducedMotion) &&
      this.visible &&
      this.pageVisible &&
      !this.lost
    );
  }

  /** 以指定像素尺寸渲染并导出 PNG（不影响屏幕上的显示） */
  async toBlob(width: number, height: number, type = "image/png", quality?: number): Promise<Blob> {
    const prev = [this.canvas.width, this.canvas.height];
    const max = this.gl.getParameter(this.gl.MAX_RENDERBUFFER_SIZE) as number;
    const s = Math.min(1, max / Math.max(width, height));
    this.canvas.width = Math.round(width * s);
    this.canvas.height = Math.round(height * s);
    this.render();
    const blob = await new Promise<Blob>((ok, fail) =>
      this.canvas.toBlob((b) => (b ? ok(b) : fail(new Error("toBlob failed"))), type, quality),
    );
    [this.canvas.width, this.canvas.height] = prev;
    this.dirty = true;
    return blob;
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    this.untrack?.();
    this.cleanups.forEach((f) => f());
    this.io?.disconnect();
    this.ro?.disconnect();
    const gl = this.gl;
    if (gl && !gl.isContextLost()) {
      gl.deleteTexture(this.tex);
      gl.deleteProgram(this.program);
      gl.deleteVertexArray(this.vao);
    }
  }

  // ---------------------------------------------------------------- 初始化

  private initGL(): void {
    const gl = this.canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: this.opts.preserveDrawingBuffer,
      powerPreference: "low-power",
    });
    if (!gl) throw new Error("Polanaluz: 当前浏览器不支持 WebGL2");
    this.gl = gl;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("Polanaluz shader: " + gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("Polanaluz link: " + gl.getProgramInfoLog(p));
    this.program = p;
    this.loc.clear();
    this.vao = gl.createVertexArray()!;

    // 图案纹理数组：每组窗户一层；sRGB 格式，采样时自动转线性
    this.tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.tex);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, Math.log2(PATTERN_SIZE) + 1, gl.SRGB8_ALPHA8, PATTERN_SIZE, PATTERN_SIZE, MAX_WINDOWS);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.lastPatternKey = "";
    this.dirty = true;
  }

  private watch(): void {
    const on = <K extends string>(t: EventTarget, ev: K, fn: (e: Event) => void) => {
      t.addEventListener(ev, fn);
      this.cleanups.push(() => t.removeEventListener(ev, fn));
    };
    on(this.canvas, "webglcontextlost", (e) => {
      e.preventDefault();
      this.lost = true;
    });
    on(this.canvas, "webglcontextrestored", () => {
      this.lost = false;
      this.initGL();
    });
    on(document, "visibilitychange", () => {
      this.pageVisible = document.visibilityState === "visible";
    });
    this.pageVisible = document.visibilityState !== "hidden";

    if ("IntersectionObserver" in window) {
      this.io = new IntersectionObserver((es) => {
        this.visible = es.some((e) => e.isIntersecting);
        if (this.visible) this.dirty = true;
      });
      this.io.observe(this.canvas);
    }
    if ("ResizeObserver" in window) {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.canvas);
    }
    this.mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (this.mq) {
      this.reducedMotion = this.mq.matches;
      on(this.mq, "change", () => {
        this.reducedMotion = !!this.mq?.matches;
        this.dirty = true;
      });
    }
  }

  private resize(): void {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.maxDpr);
    const w = Math.max(1, Math.round(r.width * dpr * this.opts.renderScale));
    const h = Math.max(1, Math.round(r.height * dpr * this.opts.renderScale));
    if (w !== this.canvas.width || h !== this.canvas.height) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.dirty = true;
  }

  // ---------------------------------------------------------------- 渲染

  private loop(now: number): void {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (this.lost) return;
    if (this.animating) {
      const dt = this.lastFrame ? (now - this.lastFrame) / 1000 : 0;
      if (dt > 0 && dt < 1000 / this.opts.fps / 1000 - 0.002) return;
      this.time += Math.min(dt, 0.1);
      this.lastFrame = now;
      this.render();
    } else {
      this.lastFrame = 0;
      if (this.dirty && this.visible) this.render();
    }
  }

  private u(name: string): WebGLUniformLocation | null {
    if (!this.loc.has(name)) this.loc.set(name, this.gl.getUniformLocation(this.program, name));
    return this.loc.get(name)!;
  }

  private uploadPatterns(): void {
    const key = patternKey(this.config);
    if (key === this.lastPatternKey) return;
    this.lastPatternKey = key;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.tex);
    this.config.windows.slice(0, MAX_WINDOWS).forEach((w, i) => {
      const c = drawPattern(w, this.config.palette, this.config.seed);
      gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, PATTERN_SIZE, PATTERN_SIZE, 1, gl.RGBA, gl.UNSIGNED_BYTE, c);
    });
    gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
  }

  /** 立即渲染一帧 */
  render(): void {
    const gl = this.gl;
    const c = this.config;
    this.measureFocus?.();
    this.dirty = false;
    this.uploadPatterns();

    const W = this.canvas.width;
    const H = this.canvas.height;
    const aspect = W / H;
    gl.viewport(0, 0, W, H);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.tex);
    gl.uniform1i(this.u("uPattern"), 0);

    const cam = makeCamera(c.camera.tilt, c.camera.zoom, c.camera.yaw ?? 0);
    gl.uniform1f(this.u("uAspect"), aspect);
    gl.uniform3fv(this.u("uCamPos"), cam.pos);
    gl.uniform3fv(this.u("uCamF"), cam.f);
    gl.uniform3fv(this.u("uCamR"), cam.r);
    gl.uniform3fv(this.u("uCamU"), cam.u);
    gl.uniform1f(this.u("uCamK"), CAM_K);

    // 动画：窗户位置按"基准太阳"固定，太阳本身缓慢移动 → 光斑像真的随日光滑动
    const m = c.motion;
    const moving = m.mode !== "static";
    const t = this.time * m.speed;
    const dAz = moving ? m.amount * (5 * Math.sin((t / 47) * Math.PI * 2) + 3 * (noise1(t / 23, 1) - 0.5)) : 0;
    const dEl = moving ? m.amount * 2.2 * Math.sin((t / 61) * Math.PI * 2 + 1.3) : 0;
    const cloud = moving ? 1 - m.clouds * 0.55 * clamp(noise1(t / 9, 2) * 1.6 - 0.45, 0, 1) : 1;

    const L = sunDir(c.sun.azimuth + dAz, c.sun.elevation + dEl);
    const Lbase = sunDir(c.sun.azimuth, c.sun.elevation);
    gl.uniform3fv(this.u("uL"), L);
    const sun = kelvinToRgb(c.sun.temperature);
    const k = c.sun.intensity * cloud;
    gl.uniform3f(this.u("uSunColor"), sun[0] * k, sun[1] * k, sun[2] * k);
    gl.uniform1f(this.u("uSoft"), Math.tan(deg(Math.max(c.sun.softness, 0.05) / 2)));

    const wins = c.windows.slice(0, MAX_WINDOWS);
    const C = new Float32Array(MAX_WINDOWS * 3);
    const U = new Float32Array(MAX_WINDOWS * 3);
    const V = new Float32Array(MAX_WINDOWS * 3);
    const N = new Float32Array(MAX_WINDOWS * 3);
    const half = new Float32Array(MAX_WINDOWS * 2);
    const gain = new Float32Array(MAX_WINDOWS);
    const mount = new Int32Array(MAX_WINDOWS);
    const WL = new Float32Array(MAX_WINDOWS * 3);
    const grid = new Float32Array(MAX_WINDOWS * 4);
    const src = new Float32Array(MAX_WINDOWS * 4);
    const room = c.scene.mode === "room";
    wins.forEach((w: WindowGroup, i) => {
      half.set([Math.max(w.width, 0.01) / 2, Math.max(w.height, 0.01) / 2], i * 2);
      gain[i] = w.enabled ? w.gain : 0;
      if (w.kind === "panes") grid.set([clamp(Math.round(w.count), 1, 4), clamp(Math.round(w.segments), 1, 4), panesMullionUv(w.frame), 1], i * 4);
      // 墙上的窗户可以各自偏转光线方向（facing），让几束光汇向同一处；只投影的窗户共用太阳方向
      WL.set(room && w.mount !== "free" ? sunDir(c.sun.azimuth + w.facing + dAz, c.sun.elevation + dEl) : L, i * 3);
      // 发散光：光源放在窗后、沿这扇窗的光线方向，距离由发散角决定
      const setSource = (center: V3) => {
        const sp = clamp(w.spread ?? 0, 0, 120);
        if (sp <= 0.1) return;
        const hd = Math.hypot(w.width, w.height) / 2;
        const D = hd / Math.tan(deg(sp / 2));
        const lw = [WL[i * 3], WL[i * 3 + 1], WL[i * 3 + 2]];
        src.set([center[0] + lw[0] * D, center[1] + lw[1] * D, center[2] + lw[2] * D, D], i * 4);
      };
      if (room && w.mount === "wall") {
        // 挂在后墙上：x/y 是窗户中心在屏幕上的位置
        const center = screenToPlane(cam, aspect, w.x, w.y, 1, c.scene.wallDistance);
        C.set(center, i * 3);
        setSource(center);
        U.set([1, 0, 0], i * 3);
        V.set([0, 0, 1], i * 3);
        N.set([0, -1, 0], i * 3);
        mount[i] = 1;
        return;
      }
      if (room && w.mount === "side" && c.scene.sideWall !== 0) {
        const center = screenToPlane(cam, aspect, w.x, w.y, 0, c.scene.sideWall);
        C.set(center, i * 3);
        setSource(center);
        U.set([0, 1, 0], i * 3);
        V.set([0, 0, 1], i * 3);
        N.set([1, 0, 0], i * 3);
        mount[i] = 2;
        return;
      }
      const anchor = screenToFloor(cam, aspect, w.x, w.y);
      const center: V3 = [0, 1, 2].map((j) => anchor[j] + w.distance * Lbase[j]) as V3;
      const phi = deg(c.sun.azimuth + clamp(w.facing, -75, 75));
      const s = deg(clamp(w.slope, 0, 90));
      const nh: V3 = [Math.cos(phi), Math.sin(phi), 0];
      const uu: V3 = [-Math.sin(phi), Math.cos(phi), 0];
      const vv: V3 = norm([-Math.sin(s) * nh[0], -Math.sin(s) * nh[1], Math.cos(s)]);
      const nn = norm(cross(uu, vv));
      C.set(center, i * 3);
      U.set(uu, i * 3);
      V.set(vv, i * 3);
      N.set(nn, i * 3);
    });
    gl.uniform1i(this.u("uCount"), wins.length);
    gl.uniform3fv(this.u("uWC"), C);
    gl.uniform3fv(this.u("uWU"), U);
    gl.uniform3fv(this.u("uWV"), V);
    gl.uniform3fv(this.u("uWN"), N);
    gl.uniform2fv(this.u("uWHalf"), half);
    gl.uniform1fv(this.u("uWGain"), gain);
    gl.uniform1iv(this.u("uWMount"), mount);
    gl.uniform3fv(this.u("uWL"), WL);
    gl.uniform4fv(this.u("uWGrid"), grid);
    gl.uniform4fv(this.u("uWSrc"), src);

    const sc = c.scene;
    gl.uniform1i(this.u("uRoom"), room ? 1 : 0);
    gl.uniform1f(this.u("uWallY"), sc.wallDistance);
    gl.uniform1f(this.u("uSideX"), sc.sideWall);
    gl.uniform3fv(this.u("uRoomColor"), toLinear(hexToRgb(sc.roomColor)));
    gl.uniform1f(this.u("uAmbient"), sc.ambient);
    gl.uniform1f(this.u("uHaze"), sc.haze);
    gl.uniform1f(this.u("uWinGlow"), sc.windowGlow);
    gl.uniform1f(this.u("uBottomFade"), sc.bottomFade);
    gl.uniform1f(this.u("uPanel"), sc.panel);
    gl.uniform1f(this.u("uGloss"), sc.gloss ?? 0);
    gl.uniform1i(this.u("uFloor"), sc.floor === false ? 0 : 1);
    gl.uniform1f(this.u("uDust"), sc.dust ?? 0);

    gl.uniform3fv(this.u("uBg"), toLinear(hexToRgb(c.surface.background)));
    gl.uniform1i(this.u("uTexture"), { none: 0, mosaic: 1, terrazzo: 2, stone: 3, paper: 4 }[c.surface.texture] ?? 0);
    gl.uniform1f(this.u("uTexScale"), c.surface.textureScale);
    gl.uniform1f(this.u("uTexStrength"), c.surface.textureStrength);
    gl.uniform1i(this.u("uTheme"), c.theme === "light" ? 1 : 0);
    gl.uniform1f(this.u("uOpacity"), c.look.opacity);
    gl.uniform1f(this.u("uExposure"), c.look.exposure);
    gl.uniform1f(this.u("uGlow"), c.look.glow);
    gl.uniform1f(this.u("uCaustics"), c.look.caustics);
    gl.uniform1f(this.u("uSeed"), (c.seed % 1000) * 0.137);
    gl.uniform1f(this.u("uShade"), c.look.shade);
    gl.uniform1f(this.u("uFade"), c.look.fade);
    gl.uniform1f(this.u("uVignette"), c.look.vignette);
    gl.uniform1f(this.u("uGrain"), c.look.grain);
    gl.uniform1f(this.u("uTime"), this.time);

    // 焦点元素：CSS 像素 → 地面坐标（取中心附近的换算比例）
    const fr = this.focus;
    const cw = this.canvas.clientWidth || 1;
    const ch = this.canvas.clientHeight || 1;
    if (fr && fr.width > 0 && fr.height > 0) {
      const toF = (px: number, py: number) => screenToFloor(cam, aspect, px / cw, py / ch);
      const a = toF(fr.x, fr.y);
      const b = toF(fr.x + fr.width, fr.y + fr.height);
      const cx = fr.x + fr.width / 2, cy = fr.y + fr.height / 2;
      const p0 = toF(cx, cy), p1 = toF(cx + 1, cy);
      const perPx = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      const hx = Math.abs(b[0] - a[0]) / 2, hy = Math.abs(b[1] - a[1]) / 2;
      gl.uniform1i(this.u("uFocusOn"), 1);
      gl.uniform2f(this.u("uFocusC"), (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      gl.uniform2f(this.u("uFocusHalf"), hx, hy);
      gl.uniform1f(this.u("uFocusR"), Math.min(fr.radius * perPx, hx, hy));
      gl.uniform1f(this.u("uFocusLift"), c.focus.lift);
      gl.uniform1f(this.u("uFocusShadow"), c.focus.shadow);
      gl.uniform1f(this.u("uFocusRim"), c.focus.rim);
      gl.uniform1f(this.u("uFocusRimW"), Math.max(c.focus.rimWidth, 0.5) * perPx);
      gl.uniform1f(this.u("uFocusInside"), c.focus.inside);
      // 屏幕空间（房间模式用）：单位 = 画布高度，y 向上
      gl.uniform4f(this.u("uFocusS"), (fr.x + fr.width / 2) / ch, 1 - (fr.y + fr.height / 2) / ch, fr.width / 2 / ch, fr.height / 2 / ch);
      gl.uniform2f(this.u("uFocusSR"), Math.min(fr.radius, fr.width / 2, fr.height / 2) / ch, Math.max(c.focus.rimWidth, 0.5) / ch);
    } else {
      gl.uniform1i(this.u("uFocusOn"), 0);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
