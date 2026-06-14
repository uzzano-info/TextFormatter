"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { runPipeline } from "@/lib/transform/runPipeline";
import { wordDiff } from "@/lib/transform/diff";

const MAX_DIFF_CHARS = 20000;

export default function DiffView() {
  const input = useAppStore((s) => s.input);
  const options = useAppStore((s) => s.options);

  const segments = useMemo(() => {
    if (input.length > MAX_DIFF_CHARS) return null;
    const cleaned = runPipeline(input, options, "markdown").output;
    return wordDiff(input, cleaned);
  }, [input, options]);

  if (segments === null) {
    return (
      <p className="text-sm text-muted">
        입력이 너무 길어 변화 보기를 건너뜁니다. 결과 보기를 사용하세요.
      </p>
    );
  }

  return (
    <pre className="mx-auto max-w-prose whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-text">
      {segments.map((seg, i) => {
        if (seg.op === "equal") return <span key={i}>{seg.text}</span>;
        if (seg.op === "remove")
          return (
            <span
              key={i}
              className="diff-remove"
              aria-label={`제거됨: ${seg.text}`}
              title="제거됨"
            >
              {seg.text}
            </span>
          );
        return (
          <span
            key={i}
            className="diff-change"
            aria-label={`변경됨: ${seg.text}`}
            title="변경됨"
          >
            {seg.text}
          </span>
        );
      })}
    </pre>
  );
}
