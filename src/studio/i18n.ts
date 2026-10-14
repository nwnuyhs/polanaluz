/**
 * 生成器界面的中英文切换。
 * - 面板标签：tr("中文", "English")
 * - 下拉选项：opts([["中文", "English", value], ...])
 * - HTML 里的静态文字：元素带 data-en，切换时与原中文互换（原文自动存进 data-zh）
 */
export type Lang = "zh" | "en";

const KEY = "polanaluz-lang";

function detect(): Lang {
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "zh" || q === "en") return q;
    const saved = localStorage.getItem(KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    /* 隐私模式等读不到存储时按浏览器语言 */
  }
  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export let lang: Lang = detect();

export const tr = (zh: string, en: string) => (lang === "en" ? en : zh);

export const opts = <V>(list: [string, string, V][]) => Object.fromEntries(list.map(([zh, en, v]) => [tr(zh, en), v])) as Record<string, V>;

/** 把页面里带 data-en 的元素切到当前语言 */
export function applyStaticText() {
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.querySelectorAll<HTMLElement>("[data-en]").forEach((el) => {
    if (el.dataset.zh === undefined) el.dataset.zh = el.innerHTML;
    el.innerHTML = lang === "en" ? el.dataset.en! : el.dataset.zh;
  });
  document.querySelectorAll<HTMLElement>("[data-title-en]").forEach((el) => {
    if (el.dataset.titleZh === undefined) el.dataset.titleZh = el.title;
    el.title = lang === "en" ? el.dataset.titleEn! : el.dataset.titleZh;
  });
}

export function setLang(l: Lang) {
  lang = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* 存不了就只在本次生效 */
  }
  applyStaticText();
}
