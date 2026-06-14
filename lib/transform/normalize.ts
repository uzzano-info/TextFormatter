import type { Root } from "mdast";
import type { NormalizeOptions } from "./types";
import { stripEmoji } from "./rules/stripEmoji";
import { simplifyHeadings } from "./rules/simplifyHeadings";
import { normalizeBold } from "./rules/normalizeBold";
import { normalizeLists } from "./rules/normalizeLists";
import { normalizeHr } from "./rules/normalizeHr";
import { smartQuotes } from "./rules/smartQuotes";

export type Rule = (ast: Root, opts: NormalizeOptions) => Root;

/**
 * 활성화된 규칙을 순서대로 적용.
 * 각 규칙은 자기 옵션이 꺼져 있으면 AST를 그대로 반환한다.
 * 공백 정리(collapseBlankLines / trimTrailingSpaces)는 여기 없음 → postProcess.
 */
export const RULES: Rule[] = [
  stripEmoji,
  simplifyHeadings,
  normalizeBold,
  normalizeLists,
  normalizeHr,
  smartQuotes,
];

export function normalize(ast: Root, opts: NormalizeOptions): Root {
  return RULES.reduce((acc, rule) => rule(acc, opts), ast);
}
