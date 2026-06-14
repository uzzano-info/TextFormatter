import { describe, it, expect } from "vitest";
import { runPipeline } from "@/lib/transform/runPipeline";
import { DEFAULT_OPTIONS } from "@/lib/transform/types";
import type { OutputFormat } from "@/lib/transform/types";

const sample = `# 제목\n\n안녕하세요. 본문입니다.\n\n- 항목 1\n- 항목 2\n`;

describe("runPipeline", () => {
  it("빈 입력은 빈 출력 + fallback 아님", () => {
    const r = runPipeline("   ", DEFAULT_OPTIONS, "markdown");
    expect(r.output).toBe("");
    expect(r.fallback).toBe(false);
  });

  it("4개 포맷 모두 문자열을 반환한다", () => {
    const formats: OutputFormat[] = ["markdown", "html", "plain", "blog"];
    for (const f of formats) {
      const r = runPipeline(sample, DEFAULT_OPTIONS, f);
      expect(typeof r.output).toBe("string");
      expect(r.output.length).toBeGreaterThan(0);
      expect(r.fallback).toBe(false);
    }
  });

  it("markdown 라운드트립 스냅샷", () => {
    const r = runPipeline(sample, DEFAULT_OPTIONS, "markdown");
    expect(r.output).toMatchSnapshot();
  });

  it("html 출력은 sanitize되어 script가 제거된다", () => {
    const r = runPipeline(
      "본문\n\n<script>alert(1)</script>",
      DEFAULT_OPTIONS,
      "html",
    );
    expect(r.output).not.toContain("<script>");
  });

  it("plain 출력은 마크다운 기호를 제거한다", () => {
    const r = runPipeline("# 제목\n\n**굵게**", DEFAULT_OPTIONS, "plain");
    expect(r.output).not.toContain("#");
    expect(r.output).not.toContain("**");
    expect(r.output).toContain("제목");
  });
});
