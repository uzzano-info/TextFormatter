import type { NormalizeOptions } from "./types";

/**
 * 직렬화 이후 문자열 정리 (AST에 없는 직렬화 산물 처리).
 * 마크다운/플레인/블로그 출력에만 적용. HTML 출력에는 적용하지 않는다.
 */
export function postProcess(text: string, opts: NormalizeOptions): string {
  let out = text;
  if (opts.trimTrailingSpaces) out = out.replace(/[ \t]+$/gm, "");
  if (opts.collapseBlankLines) out = out.replace(/\n{3,}/g, "\n\n");
  return out.replace(/\s+$/, "") + "\n"; // 파일 끝 개행 1개로 정규화
}
