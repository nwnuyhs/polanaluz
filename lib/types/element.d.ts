import type { DeepPartial, PolanaluzConfig } from "./types";
export interface PolanaluzBundle {
    dark: DeepPartial<PolanaluzConfig>;
    light: DeepPartial<PolanaluzConfig>;
    style?: string;
}
/** 注册 <polana-luz>（重复调用无害；不在浏览器里时什么也不做） */
export declare function defineElement(name?: string): void;
