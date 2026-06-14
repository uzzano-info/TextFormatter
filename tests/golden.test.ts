import { describe, it, expect } from "vitest";
import { runPipeline } from "@/lib/transform/runPipeline";
import { DEFAULT_PRESETS } from "@/lib/presets/defaultPresets";
import {
  chatgptSample,
  claudeSample,
  geminiSample,
} from "./fixtures/samples";

const cleanMemo = DEFAULT_PRESETS.find((p) => p.id === "tpl-note")!; // 깔끔한 메모

describe("골든 스냅샷 - 깔끔한 메모 프리셋", () => {
  it("chatgpt 샘플", () => {
    const out = runPipeline(
      chatgptSample,
      cleanMemo.options,
      cleanMemo.outputFormat,
    ).output;
    expect(out).toMatchSnapshot();
  });

  it("claude 샘플", () => {
    const out = runPipeline(
      claudeSample,
      cleanMemo.options,
      cleanMemo.outputFormat,
    ).output;
    expect(out).toMatchSnapshot();
  });

  it("gemini 샘플", () => {
    const out = runPipeline(
      geminiSample,
      cleanMemo.options,
      cleanMemo.outputFormat,
    ).output;
    expect(out).toMatchSnapshot();
  });
});

describe("골든 스냅샷 - 블로그(네이버)", () => {
  it("claude 샘플 표 → 텍스트", () => {
    const blog = DEFAULT_PRESETS.find((p) => p.id === "tpl-blog")!;
    const out = runPipeline(
      claudeSample,
      blog.options,
      "blog",
      "naver",
    ).output;
    expect(out).toMatchSnapshot();
  });
});
