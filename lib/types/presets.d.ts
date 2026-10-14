/**
 * 默认配置、色板与内置样式。
 * 每个样式都有 dark（发光）和 light（染色）两版；light 版 = dark 版 + 少量覆盖。
 */
import type { PaletteConfig, PolanaluzConfig, WindowGroup } from "./types";
export interface PaletteDef {
    id: string;
    /** 中文名 */
    name: string;
    /** English name */
    nameEn?: string;
    palette: PaletteConfig;
}
export declare const PALETTES: PaletteDef[];
export declare function makeWindow(p?: Partial<WindowGroup>): WindowGroup;
export declare const DEFAULT_CONFIG: PolanaluzConfig;
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
export declare const STYLES: StyleDef[];
export declare const getStyle: (id: string) => StyleDef | undefined;
