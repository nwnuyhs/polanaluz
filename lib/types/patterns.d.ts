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
export declare const PATTERN_SIZE = 512;
/** 窗棂宽度（纹理像素）。着色器里精确计算光柱时用同一个换算，见 panesMullionUv() */
export declare const PANES_MULLION_PX = 24;
/** 窗棂宽度换算到窗户坐标 uv（-1..1） */
export declare const panesMullionUv: (frame: number) => number;
export declare const PANES_BORDER_UV: number;
/** 生成一组窗户的图案纹理 */
export declare function drawPattern(g: WindowGroup, palette: PaletteConfig, seed: number): HTMLCanvasElement;
