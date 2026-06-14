import { parseToAst, looksLikeHtml, htmlToAst } from "./parseToAst";
import { normalize } from "./normalize";
import { serialize } from "./serialize";
import { postProcess } from "./postProcess";
import { toBlog } from "../export/toBlog";
import type { NormalizeOptions, OutputFormat, BlogTarget } from "./types";

export interface PipelineResult {
  output: string;
  /** HTML 역변환 등에서 손실 위험 구조가 감지되어 경고가 필요한 경우 true */
  warnedSimplified: boolean;
  /** 파이프라인이 실패해 원문을 그대로 반환한 경우 true */
  fallback: boolean;
}

/**
 * 전체 변환 파이프라인.
 * parse → normalize → serialize → postProcess.
 * 어떤 단계든 예외가 나면 입력을 그대로 반환(앱은 절대 크래시하지 않는다).
 */
export function runPipeline(
  input: string,
  opts: NormalizeOptions,
  format: OutputFormat,
  blogTarget: BlogTarget = "naver",
): PipelineResult {
  if (!input.trim()) {
    return { output: "", warnedSimplified: false, fallback: false };
  }

  let warnedSimplified = false;

  try {
    let ast;
    if (looksLikeHtml(input)) {
      try {
        ast = htmlToAst(input);
        // 표가 있으면 손실 가능 → 경고
        if (/<table[\s>]/i.test(input)) warnedSimplified = true;
      } catch {
        // 역변환 실패 → 플레인 텍스트로 간주
        ast = parseToAst(input);
      }
    } else {
      ast = parseToAst(input);
    }

    const normalized = normalize(ast, opts);

    if (format === "blog") {
      const blog = toBlog(normalized, blogTarget, opts);
      // 네이버(텍스트)는 후처리, 티스토리(HTML)는 그대로
      const output =
        blogTarget === "tistory" ? blog : postProcess(blog, opts);
      return { output, warnedSimplified, fallback: false };
    }

    const serialized = serialize(normalized, format, opts);
    const output =
      format === "html" ? serialized : postProcess(serialized, opts);

    return { output, warnedSimplified, fallback: false };
  } catch {
    // 어떤 이유로든 실패하면 원문 그대로
    return { output: input, warnedSimplified: false, fallback: true };
  }
}
