import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { NormalizeOptions } from "../types";

/**
 * 곧은 따옴표 → 둥근 따옴표 (방향=둥근).
 * `"..."` → `“...”`, `'...'` → `‘...’`.
 * text 노드만 순회하므로 코드블록(code)·인라인코드(inlineCode)는 자동 제외된다.
 */
export function smartQuotes(ast: Root, opts: NormalizeOptions): Root {
  if (!opts.smartQuotes) return ast;

  visit(ast, "text", (node) => {
    node.value = node.value
      .replace(/"([^"]*)"/g, "“$1”")
      .replace(/'([^']*)'/g, "‘$1’");
  });
  return ast;
}
