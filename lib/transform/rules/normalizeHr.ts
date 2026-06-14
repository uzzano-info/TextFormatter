import { visit } from "unist-util-visit";
import type { Root, Parent } from "mdast";
import type { NormalizeOptions } from "../types";

/**
 * 수평선(`---` `***` `___`) 노드 제거.
 */
export function normalizeHr(ast: Root, opts: NormalizeOptions): Root {
  if (!opts.removeHr) return ast;

  visit(ast, "thematicBreak", (_node, index, parent: Parent | undefined) => {
    if (parent && typeof index === "number") {
      parent.children.splice(index, 1);
      return index; // 같은 인덱스에서 계속 순회
    }
    return undefined;
  });
  return ast;
}
