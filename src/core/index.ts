export { Polanaluz } from "./Polanaluz";
export { DEFAULT_CONFIG, PALETTES, STYLES, getStyle, makeWindow } from "./presets";
export { defineElement } from "./element";
export type { PolanaluzBundle } from "./element";
export type { PaletteDef, StyleDef } from "./presets";
export type * from "./types";

import { defineElement } from "./element";
// 在浏览器里自动注册 <polana-luz>（服务端渲染时什么也不做）
defineElement();
