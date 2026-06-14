import { describe, it, expect } from "vitest";
import { detectSource } from "@/lib/transform/detectSource";
import { parseToAst } from "@/lib/transform/parseToAst";
import { normalize } from "@/lib/transform/normalize";
import { toBlog } from "@/lib/export/toBlog";
import { DEFAULT_OPTIONS } from "@/lib/transform/types";

const chatgpt = `## 🚀 시작하기

**중요**: 이건 강조입니다.

- **항목 1**: 설명입니다
- **항목 2**: 또 다른 설명

---

다음 단계로 넘어갑시다.`;

const claude = `## 개요

| 이름 | 값 |
|---|---|
| A | 1 |
| B | 2 |

정돈된 문서입니다. 중첩 리스트도 있습니다.`;

const gemini = `소제목

* 첫 번째 항목
* 두 번째 항목
* 세 번째 항목 ✨`;

describe("detectSource", () => {
  it("ChatGPT 스타일 → chatgpt 또는 점수 반환", () => {
    const r = detectSource(chatgpt);
    expect(r.score).toBeGreaterThan(0);
    expect(["chatgpt", "unknown"]).toContain(r.source);
    // 강한 신호이므로 chatgpt로 감지되길 기대
    expect(r.source).toBe("chatgpt");
  });

  it("Claude 스타일(표) → claude 신호", () => {
    const r = detectSource(claude);
    expect(r.score).toBeGreaterThan(0);
    expect(r.source).toBe("claude");
  });

  it("Gemini 스타일(* 불릿) → gemini 신호", () => {
    const r = detectSource(gemini);
    expect(r.source).toBe("gemini");
  });

  it("빈 입력 → unknown, score 0", () => {
    expect(detectSource("")).toEqual({ source: "unknown", score: 0 });
  });
});

describe("toBlog", () => {
  it("네이버: 표가 텍스트로 변환되고 md 표 기호가 없다", () => {
    const ast = normalize(parseToAst(claude), DEFAULT_OPTIONS);
    const out = toBlog(ast, "naver", DEFAULT_OPTIONS);
    expect(out).not.toContain("|---");
    expect(out).toContain("A");
    expect(out).toContain("1");
  });

  it("네이버: 헤더가 독립 텍스트 줄로 남는다(# 기호 없음)", () => {
    const ast = normalize(parseToAst("## 제목\n\n본문"), DEFAULT_OPTIONS);
    const out = toBlog(ast, "naver", DEFAULT_OPTIONS);
    expect(out).toContain("제목");
    expect(out).not.toContain("##");
  });

  it("티스토리: HTML 출력이며 script 제거", () => {
    const ast = normalize(
      parseToAst("## 제목\n\n본문\n\n<script>x</script>"),
      DEFAULT_OPTIONS,
    );
    const out = toBlog(ast, "tistory", DEFAULT_OPTIONS);
    expect(out).toContain("<h");
    expect(out).not.toContain("<script>");
  });
});
