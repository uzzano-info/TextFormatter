import { runPipeline } from "./runPipeline";
import type { Preset } from "./types";
import type { Lang } from "../i18n";

export interface MiniPreview {
  before: string;
  after: string;
}

/**
 * 템플릿별 "차별점"이 드러나는 before→after 한 줄 (언어별).
 * 표→줄글 / 마크다운 유지 / 기호 제거 를 한눈에 보여주는 대표 예시.
 */
const PREVIEW_BY_ID: Record<string, Record<Lang, MiniPreview>> = {
  "tpl-blog": {
    en: { before: "| Item | Value |", after: "Item: Value" },
    ko: { before: "| 항목 | 값 |", after: "항목: 값" },
  },
  "tpl-note": {
    en: { before: "🚀 **bold**", after: "**bold**" },
    ko: { before: "🚀 **굵게**", after: "**굵게**" },
  },
  "tpl-plain": {
    en: { before: "## **Title**", after: "Title" },
    ko: { before: "## **제목**", after: "제목" },
  },
};

const GENERIC: Record<Lang, { snippet: string; before: string }> = {
  en: { snippet: `## 🚀 Key points\n\n**Important**: the gist 😀`, before: "## 🚀 Key points" },
  ko: { snippet: `## 🚀 핵심 정리\n\n**중요**: 요점입니다 😀`, before: "## 🚀 핵심 정리" },
};

export function miniPreview(preset: Preset, lang: Lang): MiniPreview {
  const known = PREVIEW_BY_ID[preset.id]?.[lang];
  if (known) return known;

  const g = GENERIC[lang];
  let after = g.before;
  try {
    const out = runPipeline(
      g.snippet,
      preset.options,
      preset.outputFormat,
      preset.blogTarget ?? "naver",
    ).output;
    after =
      out
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0) ?? g.before;
  } catch {
    after = g.before;
  }
  return { before: g.before, after };
}
