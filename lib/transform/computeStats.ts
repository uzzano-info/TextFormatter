import { visit } from "unist-util-visit";
import type { Root, Heading } from "mdast";
import { parseToAst, looksLikeHtml, htmlToAst } from "./parseToAst";
import type { NormalizeOptions } from "./types";

export interface CleanupStats {
  emoji: number; // 제거된 이모지 수
  headings: number; // 레벨이 정돈된 헤딩 수
  hr: number; // 제거된 구분선 수
  bold: number; // 정리된 굵게 수
  list: number; // 통일/재정렬된 리스트 항목 수
}

const EMOJI_RE = /[\p{Extended_Pictographic}]/gu;

export const EMPTY_STATS: CleanupStats = {
  emoji: 0,
  headings: 0,
  hr: 0,
  bold: 0,
  list: 0,
};

/**
 * 정규화로 "무엇이 바뀌는지" 개수를 추정한다 (요약 칩/통계용).
 * 원본 AST를 분석하며, 실제 변형은 하지 않는다. 실패 시 0 통계.
 */
export function computeStats(
  input: string,
  opts: NormalizeOptions,
): CleanupStats {
  if (!input.trim()) return { ...EMPTY_STATS };
  try {
    let ast: Root;
    if (looksLikeHtml(input)) {
      try {
        ast = htmlToAst(input);
      } catch {
        ast = parseToAst(input);
      }
    } else {
      ast = parseToAst(input);
    }

    const stats: CleanupStats = { ...EMPTY_STATS };

    // 이모지
    if (opts.stripEmoji || opts.stripEmojiInHeadings) {
      visit(ast, "text", (node, _i, parent) => {
        const inHeading = parent?.type === "heading";
        if (opts.stripEmoji || (opts.stripEmojiInHeadings && inHeading)) {
          const m = node.value.match(EMOJI_RE);
          if (m) stats.emoji += m.length;
        }
      });
    }

    // 헤딩 레벨 변경 (simplifyHeadings 로직 재현)
    if (opts.simplifyHeadings) {
      const headings: Heading[] = [];
      visit(ast, "heading", (h) => {
        headings.push(h);
      });
      if (headings.length > 0) {
        const minLevel = Math.min(...headings.map((h) => h.depth));
        const max = opts.maxHeadingDepth;
        for (const h of headings) {
          const next = Math.max(
            1,
            Math.min(6, Math.min(h.depth - minLevel + 1, max)),
          );
          if (next !== h.depth) stats.headings += 1;
        }
      }
    }

    // 구분선
    if (opts.removeHr) {
      visit(ast, "thematicBreak", () => {
        stats.hr += 1;
      });
    }

    // 굵게
    if (opts.normalizeBold) {
      visit(ast, "paragraph", (p) => {
        if (p.children.length === 1 && p.children[0].type === "strong") {
          stats.bold += 1;
        }
      });
    }
    if (opts.unwrapListLeadBold) {
      visit(ast, "listItem", (item) => {
        const first = item.children[0];
        if (
          first &&
          first.type === "paragraph" &&
          first.children[0]?.type === "strong"
        ) {
          stats.bold += 1;
        }
      });
    }

    // 리스트 마커/번호 (마커는 원본 텍스트 기준 추정)
    if (opts.normalizeListMarker) {
      const starBullets = (input.match(/^\s*[*+]\s+/gm) ?? []).length;
      stats.list += starBullets;
    }
    if (opts.normalizeOrderedList) {
      visit(ast, "list", (l) => {
        if (l.ordered && (l.start ?? 1) !== 1) stats.list += l.children.length;
      });
    }

    return stats;
  } catch {
    return { ...EMPTY_STATS };
  }
}

export function totalChanges(s: CleanupStats): number {
  return s.emoji + s.headings + s.hr + s.bold + s.list;
}
