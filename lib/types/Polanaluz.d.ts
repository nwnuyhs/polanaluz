import type { DeepPartial, FocusRect, PolanaluzConfig, PolanaluzOptions } from "./types";
export declare class Polanaluz {
    /** 当前浏览器能否运行（WebGL2） */
    static supported(): boolean;
    readonly canvas: HTMLCanvasElement;
    private gl;
    private program;
    private vao;
    private tex;
    private loc;
    private config;
    private opts;
    private lastPatternKey;
    private raf;
    private lastFrame;
    private time;
    private dirty;
    private paused;
    private focus;
    private measureFocus?;
    private untrack?;
    private visible;
    private pageVisible;
    private reducedMotion;
    private destroyed;
    private lost;
    private io?;
    private ro?;
    private mq?;
    private cleanups;
    constructor(canvas: HTMLCanvasElement, config?: DeepPartial<PolanaluzConfig>, options?: PolanaluzOptions);
    getConfig(): PolanaluzConfig;
    /** 局部更新（深合并）。传数组会整体替换对应下标。 */
    set(patch: DeepPartial<PolanaluzConfig>): void;
    /** 整体替换 */
    setConfig(config: DeepPartial<PolanaluzConfig>): void;
    /** 修改渲染选项（例如 renderScale） */
    setOptions(o: PolanaluzOptions): void;
    /**
     * 焦点元素（例如搜索框）的位置，CSS 像素、相对画布左上角。传 null 取消。
     * 光会从它上面掠过：边缘被彩光勾亮，身后投下柔和的影子。
     */
    setFocus(rect: FocusRect | null): void;
    /** 跟踪一个元素：尺寸变化、滚动、窗口缩放时自动更新焦点位置。返回取消函数。 */
    trackFocus(el: Element | null): () => void;
    /** 当前动画时间（秒） */
    get currentTime(): number;
    /** 当前动画时间（秒），导出静态图时可指定 */
    setTime(t: number): void;
    /** 暂停 / 继续动画（不改配置；暂停时画面停在当前帧） */
    pause(): void;
    play(): void;
    get isPaused(): boolean;
    /** 是否处于播放状态（动态模式、未暂停、可见、未开启"减少动态效果"） */
    get animating(): boolean;
    /** 以指定像素尺寸渲染并导出 PNG（不影响屏幕上的显示） */
    toBlob(width: number, height: number, type?: string, quality?: number): Promise<Blob>;
    destroy(): void;
    private initGL;
    private watch;
    private resize;
    private loop;
    private u;
    private uploadPatterns;
    /** 立即渲染一帧 */
    render(): void;
}
