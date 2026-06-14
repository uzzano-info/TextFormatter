import { describe, it, expect } from "vitest";
import { toString } from "mdast-util-to-string";
import { parseToAst } from "@/lib/transform/parseToAst";
import { stripEmoji } from "@/lib/transform/rules/stripEmoji";
import { simplifyHeadings } from "@/lib/transform/rules/simplifyHeadings";
import { normalizeBold } from "@/lib/transform/rules/normalizeBold";
import { normalizeLists } from "@/lib/transform/rules/normalizeLists";
import { normalizeHr } from "@/lib/transform/rules/normalizeHr";
import { smartQuotes } from "@/lib/transform/rules/smartQuotes";
import { DEFAULT_OPTIONS, NormalizeOptions } from "@/lib/transform/types";
import { visit } from "unist-util-visit";
import type { Heading, List } from "mdast";

const opts = (o: Partial<NormalizeOptions>): NormalizeOptions => ({
  ...DEFAULT_OPTIONS,
  ...o,
});

const EMOJI = /[\p{Extended_Pictographic}]/u;

describe("stripEmoji", () => {
  it("정상: 모든 이모지 제거", () => {
    const ast = parseToAst("# 🚀 시작\n\n안녕 👋");
    stripEmoji(ast, opts({ stripEmoji: true }));
    expect(EMOJI.test(toString(ast))).toBe(false);
    expect(toString(ast)).toContain("시작");
  });

  it("경계: 헤딩만 제거 (stripEmoji=false)", () => {
    const ast = parseToAst("# 🚀 시작\n\n안녕 👋");
    stripEmoji(ast, opts({ stripEmoji: false, stripEmojiInHeadings: true }));
    let headingText = "";
    visit(ast, "heading", (h: Heading) => {
      headingText += toString(h);
    });
    expect(EMOJI.test(headingText)).toBe(false);
    // 본문 이모지는 남아있다
    expect(EMOJI.test(toString(ast))).toBe(true);
  });

  it("비활성: 둘 다 off면 AST 불변", () => {
    const ast = parseToAst("안녕 👋");
    const before = JSON.stringify(ast);
    stripEmoji(ast, opts({ stripEmoji: false, stripEmojiInHeadings: false }));
    expect(JSON.stringify(ast)).toBe(before);
  });
});

describe("simplifyHeadings", () => {
  const depths = (ast: ReturnType<typeof parseToAst>) => {
    const d: number[] = [];
    visit(ast, "heading", (h: Heading) => {
      d.push(h.depth);
    });
    return d;
  };

  it("정상: H3부터 시작 → H1부터 재배치", () => {
    const ast = parseToAst("### A\n\n#### B\n\n##### C");
    simplifyHeadings(ast, opts({ maxHeadingDepth: 3 }));
    expect(depths(ast)).toEqual([1, 2, 3]);
  });

  it("경계: maxHeadingDepth 클램프", () => {
    // ####### (7개)는 헤딩이 아니므로 파싱되지 않음. 헤딩은 H1, H6만.
    const ast = parseToAst("# A\n\n###### B");
    simplifyHeadings(ast, opts({ maxHeadingDepth: 3 }));
    // # A → 1, ###### B → 6 - 1 + 1 = 6 → 클램프 3
    expect(depths(ast)).toEqual([1, 3]);
  });

  it("비활성/경계: 헤딩 없으면 불변", () => {
    const ast = parseToAst("그냥 본문");
    const before = JSON.stringify(ast);
    simplifyHeadings(ast, opts({ simplifyHeadings: true }));
    expect(JSON.stringify(ast)).toBe(before);
  });
});

describe("normalizeBold", () => {
  const hasStrong = (ast: ReturnType<typeof parseToAst>) => {
    let found = false;
    visit(ast, "strong", () => (found = true));
    return found;
  };

  it("정상: 단락 전체 굵게 → 해제", () => {
    const ast = parseToAst("**이건 전부 굵은 문장입니다.**");
    normalizeBold(ast, opts({ normalizeBold: true, unwrapListLeadBold: false }));
    expect(hasStrong(ast)).toBe(false);
    expect(toString(ast)).toContain("굵은 문장");
  });

  it("경계: 리스트 리드 굵게는 유지 (unwrapListLeadBold=false)", () => {
    const ast = parseToAst("- **항목**: 설명");
    normalizeBold(ast, opts({ normalizeBold: true, unwrapListLeadBold: false }));
    expect(hasStrong(ast)).toBe(true);
  });

  it("비활성: off면 strong 유지", () => {
    const ast = parseToAst("**굵게**");
    normalizeBold(
      ast,
      opts({ normalizeBold: false, unwrapListLeadBold: false }),
    );
    expect(hasStrong(ast)).toBe(true);
  });
});

describe("normalizeLists", () => {
  it("정상: 순서 리스트 start=1", () => {
    const ast = parseToAst("3. 가\n4. 나");
    normalizeLists(ast, opts({ normalizeOrderedList: true }));
    let start: number | null | undefined;
    visit(ast, "list", (l: List) => {
      start = l.start;
    });
    expect(start).toBe(1);
  });

  it("경계: 불릿 리스트는 영향 없음", () => {
    const ast = parseToAst("- 가\n- 나");
    const before = JSON.stringify(ast);
    normalizeLists(ast, opts({ normalizeOrderedList: true }));
    expect(JSON.stringify(ast)).toBe(before);
  });

  it("비활성: off면 불변", () => {
    const ast = parseToAst("3. 가\n4. 나");
    const before = JSON.stringify(ast);
    normalizeLists(ast, opts({ normalizeOrderedList: false }));
    expect(JSON.stringify(ast)).toBe(before);
  });
});

describe("normalizeHr", () => {
  const countHr = (ast: ReturnType<typeof parseToAst>) => {
    let n = 0;
    visit(ast, "thematicBreak", () => {
      n++;
    });
    return n;
  };

  it("정상: 수평선 제거", () => {
    const ast = parseToAst("A\n\n---\n\nB");
    normalizeHr(ast, opts({ removeHr: true }));
    expect(countHr(ast)).toBe(0);
    expect(toString(ast)).toContain("A");
    expect(toString(ast)).toContain("B");
  });

  it("경계: 여러 수평선 모두 제거", () => {
    const ast = parseToAst("A\n\n---\n\nB\n\n***\n\nC");
    normalizeHr(ast, opts({ removeHr: true }));
    expect(countHr(ast)).toBe(0);
  });

  it("비활성: off면 유지", () => {
    const ast = parseToAst("A\n\n---\n\nB");
    normalizeHr(ast, opts({ removeHr: false }));
    expect(countHr(ast)).toBe(1);
  });
});

describe("smartQuotes", () => {
  it("정상: 곧은 → 둥근 따옴표", () => {
    const ast = parseToAst('그는 "안녕"이라고 했다');
    smartQuotes(ast, opts({ smartQuotes: true }));
    expect(toString(ast)).toContain("“안녕”");
  });

  it("경계: 인라인 코드 내부는 변환 제외", () => {
    const ast = parseToAst('`"코드"` 와 "본문"');
    smartQuotes(ast, opts({ smartQuotes: true }));
    const s = toString(ast);
    expect(s).toContain('"코드"'); // 코드 내부 곧은 따옴표 유지
    expect(s).toContain("“본문”");
  });

  it("비활성: off면 불변", () => {
    const ast = parseToAst('"안녕"');
    const before = JSON.stringify(ast);
    smartQuotes(ast, opts({ smartQuotes: false }));
    expect(JSON.stringify(ast)).toBe(before);
  });
});
