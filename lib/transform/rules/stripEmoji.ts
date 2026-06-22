import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { NormalizeOptions } from "../types";

// 유니코드 이모지 정규식 (Extended_Pictographic + 변형선택자/ZWJ)
const EMOJI_RE = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu;

/**
 * 이모지 제거.
 * - stripEmoji: 모든 text 노드에서 제거
 * - stripEmojiInHeadings: (stripEmoji가 false일 때) 헤딩 내부 text 노드에서만 제거
 */
export function stripEmoji(ast: Root, opts: NormalizeOptions): Root {
  if (!opts.stripEmoji && !opts.stripEmojiInHeadings) return ast;
  visit(ast, "text", (node, index, parent) => {
    const inHeading = parent?.type === "heading";
    if (!opts.stripEmoji && !(opts.stripEmojiInHeadings && inHeading)) return;

    let v = node.value.replace(EMOJI_RE, "").replace(/\s{2,}/g, " ");
    // 인접 텍스트 사이 공백은 보존하고, 블록 경계의 댕글링 공백만 정리한다.
    const isFirst = index === 0;
    const isLast = !!parent && index === parent.children.length - 1;
    if (isFirst) v = v.replace(/^\s+/, "");
    if (isLast) v = v.replace(/\s+$/, "");
    node.value = v;
  });
  return ast;
}
