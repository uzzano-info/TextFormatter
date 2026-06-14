import { visit } from "unist-util-visit";
import type { Root, List } from "mdast";
import type { NormalizeOptions } from "../types";

/**
 * 리스트 정규화.
 * - normalizeOrderedList: 순서 리스트가 항상 1부터 시작하도록 start=1 설정.
 *   (remark-stringify의 incrementListMarker 기본 동작으로 1,2,3… 재계산됨)
 * - normalizeListMarker(불릿 `-` 통일)는 AST에 마커 문자가 저장되지 않으므로
 *   serialize 단계의 remark-stringify `bullet: '-'` 옵션으로 처리한다.
 */
export function normalizeLists(ast: Root, opts: NormalizeOptions): Root {
  if (!opts.normalizeOrderedList) return ast;

  visit(ast, "list", (node: List) => {
    if (node.ordered) {
      node.start = 1;
    }
  });
  return ast;
}
