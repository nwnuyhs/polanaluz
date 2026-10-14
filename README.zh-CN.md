<div align="center">

# Polanaluz

**给网页首屏的彩色玻璃光影。**<br />
像 Windows 壁纸那样，光穿过彩色玻璃照进来，在浏览器里实时渲染。<br />
gzip 后约 18 KB · 零依赖 · WebGL2 · 深色 / 浅色两套主题

[**在线演示**](https://nwnuyhs.github.io/polanaluz/) · [组件示例](https://nwnuyhs.github.io/polanaluz/examples/component.html) · [English](README.md)

出品：[**aiknow.cc**](https://www.aiknow.cc/?ref=polanaluz-github)（AI 工具搜索引擎）
和 [**hunt.now**](https://www.hunt.now/?ref=polanaluz-github)（设计资源搜索引擎）

![Polanaluz：彩色光束扫过搜索框（深色）](docs/images/hero-dark-zh.jpg)

</div>

## 为什么做它

大多数首屏动态背景是渐变或色块。Polanaluz 渲染的是一个真实的场景：安静的房间、一扇彩色玻璃窗，光穿过页面照向你的内容。构图围绕一个元素展开，通常是搜索框：光束汇向它，它的边缘染上光的颜色，页面其余部分依然清楚好读。

![浅色主题](docs/images/hero-light-zh.jpg)

## 特点

- **是活的，不是视频**：光线方向在几十秒内缓慢偏移，光强像云层飘过一样起伏，光束里有细小的浮尘飘动，不会重复循环。
- **围绕你的内容构图**：指定一个元素（`focus="#search"`），光朝它照过去，光经过时它的边框会染上光的颜色。
- **微软式彩色玻璃窗格**：和 Windows 10 / 11 壁纸一样的 2×2 大玻璃，可以在格子里拼彩色玻璃碎片。光柱按每块窗格精确求解，窗缝锐利，没有步进采样的噪点。
- **光很灵活**：平行的太阳光或扇形发散光；窗户可以装在后墙、左墙或右墙；光可以落到地面，也可以横扫画面不落地。
- **深色、浅色都有**：每个样式两版。`theme="auto"` 自动跟随 `<html data-mode>`、`data-theme`、`.dark` 或系统设置，切换时平滑过渡。
- **不打扰页面**：首屏先显示静态 WebP 图，再淡入实时画面；动画锁 30 帧，滚出视口或切到后台标签时暂停，系统开启"减少动态效果"时自动静止。在我们的测试电脑上，1080p 默认半分辨率每帧约 4 毫秒，较弱的显卡会更慢。
- **配套生成器**：所有参数都能调，链接即可分享同一个效果，一键导出接入包。

## 内置样式

![内置样式](docs/images/styles.jpg)

| 样式 | 效果 |
|---|---|
| `stained-rays-rl`（默认） | 右侧墙开窗，光束呈扇形向左横扫整个画面 |
| `stained-rays-lr` | 左侧墙开窗，光束向右发散，地面落下彩色窗格 |
| `stained-pair` | 标题两侧各一扇窗，两束光汇向搜索框 |
| `stained-side` | 侧墙开窗，带窗缝的清晰光柱横穿房间 |
| `stained-floor` | 后墙开窗，光落在地面上（Windows 11 的感觉） |
| `microsoft-classic` | 纯净的蓝色 2×2 窗格，致敬 Windows 壁纸 |

## 快速开始

### 1. 调出你要的效果

打开[生成器](https://nwnuyhs.github.io/polanaluz/)，选样式，深色、浅色都调好，然后点 **导出 → 接入包**，得到三个文件：

```
polanaluz.json         深色 + 浅色两版参数
polanaluz-dark.webp    静态图（深色）
polanaluz-light.webp   静态图（浅色）
```

也可以跳过这步，直接用 `preset="…"` 指定内置样式。

### 2. 放进页面

```html
<section class="hero">
  <polana-luz
    config-url="/polanaluz.json"
    poster-dark="/polanaluz-dark.webp"
    poster-light="/polanaluz-light.webp"
    focus="#search-box"
  ></polana-luz>
  <h1>…</h1>
  <div id="search-box">…</div>
</section>

<script src="/polanaluz.min.js"></script>

<style>
  .hero { position: relative; }
  .hero polana-luz { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
  .hero > :not(polana-luz) { position: relative; z-index: 1; }
</style>
```

`polanaluz.min.js` 在 `npm run build` 之后的 `dist/lib/` 里。在线演示也提供了一份：`https://nwnuyhs.github.io/polanaluz/lib/polanaluz.min.js`，可以拿来快速试用；正式上线请放到自己的服务器上。

> 如果背景铺在整个页面后面，页面背景色要设在 `html` 上，不要设在 `body` 上。`body` 的背景会盖住 `z-index` 为负的元素。

### 属性

| 属性 | 默认值 | 说明 |
|---|---|---|
| `preset` | `stained-rays-rl` | 内置样式 id（见上表） |
| `config-url` | – | 生成器导出的 JSON，优先级高于 `preset` |
| `theme` | `auto` | `auto` / `dark` / `light` |
| `focus` | – | 光要围绕的元素（CSS 选择器）；元素晚渲染出来也会自动等它 |
| `mode` | `dynamic` | `static`：只显示静态图，不加载 WebGL |
| `poster-dark` / `poster-light` | – | 静态图：首屏占位、静态模式、不支持 WebGL2 时使用 |
| `render-scale` | `0.5` | 渲染分辨率相对 CSS 像素的比例。光本来就是柔的，0.5 看不出差别 |

JS 里可以直接给配置：`el.config = { dark, light }`；`el.instance` 是底层引擎，可以 `pause()` / `play()`。

## React / Next.js

这个库可以安全地用在服务端渲染项目里：在服务器上 import 什么也不做，进入浏览器后才注册 `<polana-luz>`。把 `dist/lib/polanaluz.esm.js` 复制到项目里（需要类型提示的话，连同 `dist/lib/types/` 一起），在客户端组件中加载：

```tsx
"use client";
import { useEffect } from "react";

export function HeroLight() {
  useEffect(() => {
    import("@/lib/vendor/polanaluz.esm.js"); // 注册 <polana-luz>
  }, []);
  return (
    <polana-luz
      className="absolute inset-0 -z-10 pointer-events-none"
      config-url="/polanaluz/polanaluz.json"
      poster-dark="/polanaluz/polanaluz-dark.webp"
      poster-light="/polanaluz/polanaluz-light.webp"
      focus="#hero-search"
    />
  );
}
```

TypeScript 需要声明一次这个标签：

```ts
// polanaluz.d.ts
import type { DetailedHTMLProps, HTMLAttributes } from "react";
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "polana-luz": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
    }
  }
}
```

## JavaScript API

```js
import { Polanaluz, getStyle } from "./polanaluz.esm.js";

const style = getStyle("stained-rays-rl");
const light = new Polanaluz(canvas, style.dark, { renderScale: 0.5 });

light.trackFocus(document.querySelector("#search")); // 围绕某个元素构图
light.set({ sun: { elevation: 6 }, scene: { dust: 0.8 } }); // 局部更新
light.setConfig(style.light);                               // 整体替换
light.pause(); light.play();
const webp = await light.toBlob(1920, 1080, "image/webp");  // 导出一张静态图
light.destroy();
```

`Polanaluz.supported()` 判断浏览器是否支持 WebGL2。所有参数都是普通 JSON，完整的带注释列表见 [`src/core/types.ts`](src/core/types.ts)。

## 原理

每个像素向一个极简的房间发出一条视线：后墙，可选地面和侧墙。视线落到的表面朝光源方向追踪，穿过窗户平面，在程序生成的玻璃纹理上取色，半影随距离变大。空气中的光柱不靠逐步采样，而是对每块窗格直接解出视线落在光柱里的那一段（平行光是线性方程，发散光是分式线性方程），所以光柱边缘和窗缝都锐利、没有噪点，开销也小。在这之上再加 ACES 色调映射、映出窗户的光泽地面、淡淡的墙面分缝和飘动的浮尘。

## 灵感

名字来自莫桑比克马普托的 **Igreja de Santo António da Polana**（圣安东尼教堂，Nuno Craveiro Lopes 设计，1962 年）。阳光从混凝土折板之间细长的彩色玻璃缝里照进来，在地面铺出一节一节红、黄、绿的长光带。Polanaluz = *Polana* + *luz*（葡萄牙语"光"）。之后又参考了 Windows 10 / 11 的壁纸，把效果打磨成现在的样子。

![圣安东尼教堂里的光](docs/images/inspiration.jpg)

## 本地开发

```bash
npm install
npm run dev     # 生成器：http://localhost:5190
npm run build   # 类型检查 + 生成器（dist/studio）+ 核心库（dist/lib、dist/lib/types）
```

生成器界面可以切换中文和英文。所有参数都写在地址栏的 hash 里，复制链接就能还原同一个效果。

## 谁做的

Polanaluz 由下面两个产品的团队开发，并用在自己的网站上：

- [**aiknow.cc**](https://www.aiknow.cc/?ref=polanaluz-github)：AI 工具搜索引擎。用一句大白话说出需求，帮你找到合适的 AI 助手、大模型、Agent 和开源项目。
- [**hunt.now**](https://www.hunt.now/?ref=polanaluz-github)：设计资源搜索引擎。

如果 Polanaluz 对你有帮助，在 GitHub 上点个 ⭐，或者去这两个网站看看，就是最好的支持。

## 协议

[MIT](LICENSE)。Windows 是 Microsoft 的商标，本项目与 Microsoft 无关，也未获其认可。
