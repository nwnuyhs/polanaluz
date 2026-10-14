/** 小工具：可复现随机数、颜色换算、一维平滑噪声 */
/** mulberry32：同一种子得到同一序列，保证"同一配置 = 同一画面" */
export declare function rng(seed: number): () => number;
export type RGB = [number, number, number];
export declare function hexToRgb(hex: string): RGB;
export declare function rgbToHex([r, g, b]: RGB): string;
export declare const clamp: (v: number, lo: number, hi: number) => number;
export declare const deg: (d: number) => number;
/** sRGB → 线性（着色器里做线性空间的光照相加，最后再转回去） */
export declare const toLinear: (c: RGB) => RGB;
/** 色温（K）→ 近似 RGB（Tanner Helland 拟合），用于白光段的冷暖 */
export declare function kelvinToRgb(k: number): RGB;
/** 一维值噪声（0..1），用于云层明暗和漂移，平滑且不重复 */
export declare function noise1(x: number, seed?: number): number;
/** 按权重抽取下标 */
export declare function pickWeighted(weights: number[], r: number): number;
/** 深合并（数组按下标合并），用于 set() 局部更新和读取旧配置 */
export declare function deepMerge<T>(base: T, patch: unknown): T;
export declare const clone: <T>(v: T) => T;
