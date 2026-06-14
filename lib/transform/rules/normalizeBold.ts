import { visit } from "unist-util-visit";
import type { Root, Paragraph, Strong, PhrasingContent } from "mdast";
import type { NormalizeOptions } from "../types";

/**
 * 과한 굵게 정리.
 * - normalizeBold: 단락 전체가 굵게(`**...**`)인 경우 → 굵게 해제(인라인 콘텐츠로 펼침).
 * - unwrapListLeadBold(true일 때만): 리스트 항목 첫 단락이 strong으로 시작하면 그 strong을 해제.
 */
export function normalizeBold(ast: Root, opts: NormalizeOptions): Root {
  if (!opts.normalizeBold && !opts.unwrapListLeadBold) return ast;

  if (opts.normalizeBold) {
    // 단락 전체가 단일 strong인 경우 펼친다.
    visit(ast, "paragraph", (para: Paragraph) => {
      if (para.children.length === 1 && para.children[0].type === "strong") {
        const strong = para.children[0] as Strong;
        para.children = strong.children as PhrasingContent[];
      }
    });
  }

  if (opts.unwrapListLeadBold) {
    // 리스트 항목 첫 단락이 strong으로 시작하면 해제.
    visit(ast, "listItem", (item) => {
      const first = item.children[0];
      if (first && first.type === "paragraph") {
        const para = first as Paragraph;
        if (para.children.length > 0 && para.children[0].type === "strong") {
          const strong = para.children[0] as Strong;
          para.children.splice(
            0,
            1,
            ...(strong.children as PhrasingContent[]),
          );
        }
      }
    });
  }

  return ast;
}
