import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import stripMarkdown from "strip-markdown";
import { visit } from "unist-util-visit";
import type { Root, RootContent, Table, Paragraph, Text } from "mdast";
import type { NormalizeOptions, OutputFormat } from "./types";

/** mdast 테이블 → 텍스트 단락 목록으로 변환 (블로그/플레인 호환용). */
export function tablesToText(ast: Root): Root {
  visit(ast, "table", (node: Table, index, parent) => {
    if (!parent || typeof index !== "number") return;
    const rows = node.children;
    if (rows.length === 0) {
      parent.children.splice(index, 1);
      return index;
    }
    const header = rows[0];
    const headerCells = header.children.map((c) => cellText(c));
    const out: RootContent[] = [];
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r].children.map((c) => cellText(c));
      const line = cells
        .map((v, i) => {
          const label = headerCells[i] ?? "";
          return label ? `${label}: ${v}` : v;
        })
        .join(", ");
      out.push(textParagraph(line));
    }
    parent.children.splice(index, 1, ...out);
    return index;
  });
  return ast;
}

function cellText(cell: { children: unknown[] }): string {
  // 간단 추출: 셀 내부 모든 text/inlineCode 값 이어붙이기
  let s = "";
  visit(cell as never, (n: { type: string; value?: string }) => {
    if (n.type === "text" || n.type === "inlineCode") s += n.value ?? "";
  });
  return s.trim();
}

function textParagraph(value: string): Paragraph {
  const text: Text = { type: "text", value };
  return { type: "paragraph", children: [text] };
}

const mdStringifier = (bullet: "-" | "*") =>
  unified().use(remarkGfm).use(remarkStringify, {
    bullet,
    listItemIndent: "one",
    rule: "-",
  });

/** 선택한 출력 포맷으로 AST를 문자열로 직렬화. */
export function serialize(
  ast: Root,
  format: OutputFormat,
  opts: NormalizeOptions,
): string {
  if (format === "markdown" || format === "blog") {
    const tree = structuredClone(ast);
    if (opts.convertTablesToText) tablesToText(tree);
    const bullet = opts.normalizeListMarker ? "-" : "*";
    return mdStringifier(bullet).stringify(tree);
  }

  if (format === "html") {
    const tree = structuredClone(ast);
    const processor = unified()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify);
    const hast = processor.runSync(tree);
    return processor.stringify(hast);
  }

  // plain
  const tree = structuredClone(ast);
  const stripped = unified().use(stripMarkdown).runSync(tree) as Root;
  return unified().use(remarkStringify).stringify(stripped);
}
