import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import type { Root } from "mdast";

const mdProcessor = unified().use(remarkParse).use(remarkGfm);

/** Markdown/Plain 텍스트를 mdast(Root)로 파싱한다. */
export function parseToAst(markdown: string): Root {
  return mdProcessor.parse(markdown) as Root;
}

/**
 * 입력이 HTML로 보이는지 휴리스틱 판정.
 * `<tag ` 또는 `<tag>` 형태가 유의미하게 존재하면 HTML로 간주.
 */
export function looksLikeHtml(input: string): boolean {
  const matches = input.match(/<[a-zA-Z][a-zA-Z0-9]*(\s[^<>]*)?>/g);
  return !!matches && matches.length >= 2;
}

const htmlProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeRemark);

/**
 * HTML 문자열을 mdast(Root)로 역변환한다.
 * 무손실이 아니며(복잡한 표/레이아웃은 단순화될 수 있음), 실패 시 throw.
 */
export function htmlToAst(html: string): Root {
  const hast = htmlProcessor.parse(html);
  const mdast = htmlProcessor.runSync(hast);
  return mdast as Root;
}
