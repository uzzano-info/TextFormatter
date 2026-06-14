import { describe, it, expect } from "vitest";
import { computeStats, totalChanges } from "@/lib/transform/computeStats";
import { wordDiff } from "@/lib/transform/diff";
import { DEFAULT_OPTIONS } from "@/lib/transform/types";

describe("computeStats", () => {
  it("이모지/헤더/구분선/리스트 변경 개수를 센다", () => {
    const input = "## 🚀 제목 😀\n\n* 가\n* 나\n\n---\n\n3. 다\n5. 라";
    const s = computeStats(input, DEFAULT_OPTIONS);
    expect(s.emoji).toBe(2); // 🚀, 😀
    expect(s.headings).toBeGreaterThan(0); // H2 → H1
    expect(s.hr).toBe(1);
    expect(s.list).toBeGreaterThan(0); // * 불릿 통일 + 번호 재정렬
    expect(totalChanges(s)).toBeGreaterThan(0);
  });

  it("빈 입력은 0 통계", () => {
    const s = computeStats("", DEFAULT_OPTIONS);
    expect(totalChanges(s)).toBe(0);
  });

  it("옵션이 꺼지면 해당 통계는 0", () => {
    const s = computeStats("🚀 안녕", {
      ...DEFAULT_OPTIONS,
      stripEmoji: false,
      stripEmojiInHeadings: false,
    });
    expect(s.emoji).toBe(0);
  });
});

describe("wordDiff", () => {
  it("제거된 토큰을 remove로 표시한다", () => {
    const segs = wordDiff("🚀 시작하기", "시작하기");
    expect(segs.some((s) => s.op === "remove" && s.text.includes("🚀"))).toBe(
      true,
    );
    expect(segs.some((s) => s.op === "equal" && s.text.includes("시작하기"))).toBe(
      true,
    );
  });

  it("동일 문자열은 모두 equal", () => {
    const segs = wordDiff("같은 텍스트", "같은 텍스트");
    expect(segs.every((s) => s.op === "equal")).toBe(true);
  });

  it("재구성하면 before/after를 복원한다", () => {
    const before = "## 제목 😀";
    const after = "# 제목";
    const segs = wordDiff(before, after);
    const reBefore = segs
      .filter((s) => s.op !== "add")
      .map((s) => s.text)
      .join("");
    const reAfter = segs
      .filter((s) => s.op !== "remove")
      .map((s) => s.text)
      .join("");
    expect(reBefore).toBe(before);
    expect(reAfter).toBe(after);
  });
});
