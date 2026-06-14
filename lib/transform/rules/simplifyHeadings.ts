import { visit } from "unist-util-visit";
import type { Root, Heading } from "mdast";
import type { NormalizeOptions } from "../types";

/**
 * 헤딩 깊이 정돈.
 * 1) 가장 얕은 헤딩(minLevel)을 찾아 모든 헤딩을 `level - minLevel + 1`로 재배치
 *    → 항상 H1부터 시작.
 * 2) maxHeadingDepth 초과 레벨은 maxHeadingDepth로 클램프.
 * 3) 헤딩 노드는 삭제하지 않는다(텍스트 유지).
 * 헤딩이 하나도 없으면 그대로 통과.
 */
export function simplifyHeadings(ast: Root, opts: NormalizeOptions): Root {
  if (!opts.simplifyHeadings) return ast;

  const headings: Heading[] = [];
  visit(ast, "heading", (node) => {
    headings.push(node);
  });
  if (headings.length === 0) return ast;

  const minLevel = Math.min(...headings.map((h) => h.depth));
  const max = opts.maxHeadingDepth;

  for (const h of headings) {
    const rebased = h.depth - minLevel + 1;
    const clamped = Math.min(rebased, max);
    // mdast depth는 1~6
    h.depth = Math.max(1, Math.min(6, clamped)) as Heading["depth"];
  }
  return ast;
}
