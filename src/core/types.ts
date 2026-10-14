/**
 * Polanaluz 配置。所有数值都是普通 JSON，方便存进 URL、后台设置或导出文件。
 *
 * 坐标约定（地面 = 屏幕看到的平面）：
 * - 地面单位约等于"米"，相机 zoom=1、俯视角 0 时，屏幕半高 = 4 个单位。
 * - 方位角 azimuth：太阳在地面上的方向，0° = 屏幕右侧，90° = 屏幕上方（远处），逆时针。
 *   光斑会顺着"背向太阳"的方向拉长。
 * - 窗户组的 x / y 是"光斑落点"，用屏幕比例表示（0..1，左上为 0,0），所以换屏幕尺寸、
 *   调太阳角度时，光斑都还落在同一处。
 */

export type Theme = "dark" | "light";

/**
 * 窗型：
 * - panes = 微软式窗格：几块干净的大玻璃 + 细窗棂（默认 2×2），光柱里能看到清晰的窗缝
 * - grid  = 彩色玻璃网格窗（可选圆拱 / 三角外轮廓）
 * - slits = 穹顶竖条光缝
 */
export type WindowKind = "panes" | "grid" | "slits";
export type WindowShape = "rect" | "triangle" | "arch";
export type FloorTexture = "none" | "mosaic" | "terrazzo" | "stone" | "paper";
export type MotionMode = "static" | "drift";

export interface SunConfig {
  /** 太阳方位角（度） */
  azimuth: number;
  /** 太阳高度角（度），越低光斑越长；房间模式可以接近 0 甚至为负（光横穿画面、不落地） */
  elevation: number;
  /** 光照强度 */
  intensity: number;
  /** 色温（K），影响白光段的冷暖 */
  temperature: number;
  /** 柔度：太阳角直径（度），越大边缘越柔，离窗越远越模糊 */
  softness: number;
}

/**
 * 窗户安装方式：
 * - free：只投影，不出现在画面里（x/y 是光斑落点）
 * - wall：装在房间后墙上，画面里能看到发光的窗户（x/y 是窗户中心在屏幕上的位置）
 * - side：装在侧墙上（scene.sideWall 正 = 右墙、负 = 左墙），光从侧面横穿房间（Win10 壁纸那种）
 */
export type WindowMount = "free" | "wall" | "side";

export interface WindowGroup {
  enabled: boolean;
  mount: WindowMount;
  kind: WindowKind;
  shape: WindowShape;
  /** 光斑落点（屏幕比例 0..1） */
  x: number;
  y: number;
  /** 窗户离落点的距离（沿光线方向），越远光斑越模糊、透视越强 */
  distance: number;
  /** 窗户宽、高（地面单位） */
  width: number;
  height: number;
  /** 窗面朝向相对太阳的偏转（度），产生剪切 / 平行四边形 */
  facing: number;
  /** 窗面倾角（度）：0 = 竖直墙面，90 = 水平天窗 */
  slope: number;
  /** slits：光缝条数；grid / panes：列数 */
  count: number;
  /** grid：行数；slits：每条光缝的颜色分段数 */
  segments: number;
  /** slits：光缝宽度占间距的比例（0..1） */
  fill: number;
  /** 窗框 / 铅条粗细（相对值 0..1） */
  frame: number;
  /** panes：每块大窗格里再拼几行几列的彩色玻璃碎片（0 = 一整块干净的玻璃） */
  pieces: number;
  /**
   * 发散角（度）：0 = 平行的太阳光；> 0 = 光源在窗后不远处，光束从窗户呈扇形张开、越远越淡。
   * 只对装在墙上的窗户生效。
   */
  spread: number;
  /** 这一组的亮度倍率 */
  gain: number;
  /** 图案随机种子偏移 */
  seed: number;
}

export interface PaletteConfig {
  /** 玻璃颜色（#rrggbb） */
  colors: string[];
  /** 每种颜色的权重，与 colors 一一对应 */
  weights: number[];
  /** 透明白玻璃的比例（0..1） */
  white: number;
  /** 饱和度倍率 */
  saturation: number;
}

export interface CameraConfig {
  /** 俯视角（度）：0 = 正上方俯视，越大越像斜看地面；房间模式一般 65–80 */
  tilt: number;
  /** 偏航角（度）：相机左右转，负值向左看、正值向右看（斜看侧墙，Win10 那种视角） */
  yaw: number;
  zoom: number;
}

export interface SurfaceConfig {
  /** 背景（地面）颜色 */
  background: string;
  texture: FloorTexture;
  /** 地面纹理尺寸（地面单位，瓷砖边长） */
  textureScale: number;
  /** 纹理强度 0..1 */
  textureStrength: number;
}

export interface LookConfig {
  /** 整体不透明度（与背景色混合） */
  opacity: number;
  /** 曝光：发光模式下光斑的亮度 */
  exposure: number;
  /** 光晕 */
  glow: number;
  /** 玻璃纹理：手工玻璃厚薄不均投下的焦散明暗（0..1） */
  caustics: number;
  /** 染色模式（浅色主题）下，光斑外的环境阴影 */
  shade: number;
  /** 沿光线方向的衰减 */
  fade: number;
  vignette: number;
  grain: number;
}

/**
 * 焦点元素（例如首页搜索框）与光的互动。元素的位置由 setFocus() / trackFocus() 在运行时提供，
 * 这里只放"怎么互动"的参数。
 */
export interface FocusConfig {
  /** 元素离地高度（地面单位）：越高，影子离得越远、越柔 */
  lift: number;
  /** 投影浓度 0..1 */
  shadow: number;
  /** 边缘受光：光扫过元素边缘时的彩色描边光 0..2 */
  rim: number;
  /** 描边光宽度（CSS 像素） */
  rimWidth: number;
  /** 元素内部的光（元素背景半透明时才看得到）0..1 */
  inside: number;
}

/** 焦点元素在画布上的位置（CSS 像素，相对画布左上角） */
export interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
  /** 圆角（CSS 像素） */
  radius: number;
}

/**
 * 场景：
 * - floor：只看地面（俯视），光斑铺满画面
 * - room：一间极简的房间（后墙 + 地面，可选右侧墙），墙上的彩色玻璃窗发光，
 *   光柱穿过空气落到地面（灵感：Windows 10 / 11 壁纸）
 */
export interface SceneConfig {
  mode: "floor" | "room";
  /** 后墙离画面中心的距离（地面单位） */
  wallDistance: number;
  /** 侧墙的位置（地面单位）：正值 = 右侧墙，负值 = 左侧墙，0 = 没有侧墙 */
  sideWall: number;
  /** 是否有地面（关掉后下方是柔和的房间渐变，只看空气中的光柱） */
  floor: boolean;
  /** 空气中的浮尘（只在光柱里看得见，动画时缓慢飘动、闪烁）0..1 */
  dust: number;
  /** 房间主色调（墙和地面的颜色） */
  roomColor: string;
  /** 环境光强度 */
  ambient: number;
  /** 空气中的光柱（体积光）浓度 */
  haze: number;
  /** 窗户本身的发光强度 */
  windowGlow: number;
  /** 画面底部淡出到背景色的高度（0..1，占屏幕比例），方便和下面的网页内容衔接 */
  bottomFade: number;
  /** 墙面面板分缝的间距（地面单位，0 = 不要分缝） */
  panel: number;
  /** 地面光泽：地面隐约映出发光的窗户（0..1） */
  gloss: number;
}

export interface MotionConfig {
  mode: MotionMode;
  /** 速度倍率（1 = 默认的非常缓慢） */
  speed: number;
  /** 幅度倍率 */
  amount: number;
  /** 云层明暗起伏 0..1 */
  clouds: number;
}

export interface PolanaluzConfig {
  theme: Theme;
  seed: number;
  sun: SunConfig;
  windows: WindowGroup[];
  palette: PaletteConfig;
  camera: CameraConfig;
  surface: SurfaceConfig;
  look: LookConfig;
  scene: SceneConfig;
  focus: FocusConfig;
  motion: MotionConfig;
}

/** 深层可选，用于 set() 局部更新 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[] ? DeepPartial<U>[] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface PolanaluzOptions {
  /** 渲染分辨率相对 CSS 像素的比例，默认 0.5（光斑本来就柔，看不出区别） */
  renderScale?: number;
  /** devicePixelRatio 上限，默认 2 */
  maxDpr?: number;
  /** 动画帧率上限，默认 30 */
  fps?: number;
  /** 是否遵守 prefers-reduced-motion（遵守时自动静态），默认 true */
  respectReducedMotion?: boolean;
  /** 导出 PNG 需要保留绘图缓冲 */
  preserveDrawingBuffer?: boolean;
}
