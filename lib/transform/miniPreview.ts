import { runPipeline } from "./runPipeline";
import type { NormalizeOptions, OutputFormat, BlogTarget } from "./types";

// 카드 미니 프리뷰용 대표 스니펫 (전형적 AI 출력의 압축판)
const SNIPPET = "## 🚀 핵심 정리\n\n**중요**: 요점입니다 😀";

export interface MiniPreview {
  before: string;
  after: string;
}

/**
 * 템플릿이 "무엇을 해주는지"를 한눈에 보여줄 before→after 한 줄.
 * 고정 스니펫을 해당 옵션으로 변환해 첫 의미 있는 줄을 추출한다.
 */
export function miniPreview(
  options: NormalizeOptions,
  format: OutputFormat,
  blogTarget: BlogTarget,
): MiniPreview {
  const before = "## 🚀 핵심 정리";
  let after = before;
  try {
    const out = runPipeline(SNIPPET, options, format, blogTarget).output;
    const firstLine =
      out
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0) ?? "";
    after = firstLine || before;
  } catch {
    after = before;
  }
  return { before, after };
}
