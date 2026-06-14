import { toString } from "mdast-util-to-string";
import type { Root, RootContent, List, Table } from "mdast";
import type { BlogTarget, NormalizeOptions } from "../transform/types";
import { serialize, tablesToText } from "../transform/serialize";

/**
 * 블로그용 출력.
 * - naver: 네이버 에디터 붙여넣기에 맞춘 플레인 텍스트(헤더=독립 줄, 표=텍스트 리스트).
 * - tistory: 단순 HTML(h2/h3/p/ul) — sanitize된 HTML 직렬화 재사용.
 */
export function toBlog(
  ast: Root,
  target: BlogTarget,
  opts: NormalizeOptions,
): string {
  if (target === "tistory") {
    return serialize(ast, "html", opts);
  }
  return naverText(ast);
}

function naverText(ast: Root): string {
  const tree = structuredClone(ast);
  tablesToText(tree); // 네이버는 md 표를 못 받음 → 항상 텍스트화
  const blocks: string[] = [];
  for (const node of tree.children) {
    const rendered = renderBlock(node);
    if (rendered) blocks.push(rendered);
  }
  return blocks.join("\n\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function renderBlock(node: RootContent): string {
  switch (node.type) {
    case "heading":
      return toString(node);
    case "paragraph":
      return toString(node);
    case "blockquote":
      return toString(node);
    case "code":
      return node.value;
    case "thematicBreak":
      return "";
    case "list":
      return renderList(node as List);
    case "table":
      // tablesToText 이후엔 거의 안 옴. 안전망.
      return (node as Table).children
        .map((row) => row.children.map((c) => toString(c)).join(", "))
        .join("\n");
    default:
      return toString(node as never);
  }
}

function renderList(list: List, depth = 0): string {
  const indent = "  ".repeat(depth);
  const lines: string[] = [];
  list.children.forEach((item, i) => {
    const marker = list.ordered ? `${(list.start ?? 1) + i}.` : "-";
    // 항목의 첫 단락 텍스트
    const head =
      item.children.find((c) => c.type === "paragraph") ?? item.children[0];
    const headText = head ? toString(head) : "";
    lines.push(`${indent}${marker} ${headText}`.trimEnd());
    // 중첩 리스트
    for (const child of item.children) {
      if (child.type === "list") {
        lines.push(renderList(child as List, depth + 1));
      }
    }
  });
  return lines.join("\n");
}
