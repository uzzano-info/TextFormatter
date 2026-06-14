import { runPipeline } from "./runPipeline";
import type { Preset } from "./types";

export interface MiniPreview {
  before: string;
  after: string;
}

/**
 * 템플릿별 "차별점"이 드러나는 before→after 한 줄.
 * 각 템플릿이 무엇을 다르게 하는지(표→줄글 / 마크다운 유지 / 기호 제거)를
 * 한눈에 보여주기 위해 대표 예시를 손으로 고른다.
 */
const PREVIEW_BY_ID: Record<string, MiniPreview> = {
  // 표를 줄글로 (네이버 에디터 호환의 핵심)
  "tpl-blog": { before: "| 항목 | 값 |", after: "항목: 값" },
  // 마크다운 구조는 유지, 이모지·과한 서식만
  "tpl-note": { before: "🚀 **굵게**", after: "**굵게**" },
  // 모든 기호·이모지 제거
  "tpl-plain": { before: "## **제목**", after: "제목" },
};

// 사용자 템플릿용 일반 스니펫 (계산해서 보여줌)
const GENERIC_SNIPPET = "## 🚀 핵심 정리";

export function miniPreview(preset: Preset): MiniPreview {
  const known = PREVIEW_BY_ID[preset.id];
  if (known) return known;

  const before = GENERIC_SNIPPET;
  let after = before;
  try {
    const out = runPipeline(
      `## 🚀 핵심 정리\n\n**중요**: 요점입니다 😀`,
      preset.options,
      preset.outputFormat,
      preset.blogTarget ?? "naver",
    ).output;
    after =
      out
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0) ?? before;
  } catch {
    after = before;
  }
  return { before, after };
}
