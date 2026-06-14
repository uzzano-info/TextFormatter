"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import { runPipeline } from "@/lib/transform/runPipeline";
import { wordDiff } from "@/lib/transform/diff";

const MAX_DIFF_CHARS = 20000;

export default function DiffView() {
  const input = useAppStore((s) => s.input);
  const options = useAppStore((s) => s.options);
  const t = useT();

  const segments = useMemo(() => {
    if (input.length > MAX_DIFF_CHARS) return null;
    const cleaned = runPipeline(input, options, "markdown").output;
    return wordDiff(input, cleaned);
  }, [input, options]);

  if (segments === null) {
    return <p className="text-sm text-muted">{t("diff.tooLong")}</p>;
  }

  return (
    <div className="mx-auto max-w-prose">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span>{t("diff.caption")}</span>
        <span className="inline-flex items-center gap-1">
          <span className="diff-remove px-1">{t("diff.remove")}</span>
          <span className="diff-change px-1">{t("diff.change")}</span>
        </span>
      </div>
      <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-text">
        {segments.map((seg, i) => {
        if (seg.op === "equal") return <span key={i}>{seg.text}</span>;
        if (seg.op === "remove")
          return (
            <span
              key={i}
              className="diff-remove"
              aria-label={t("diff.removeAria", { text: seg.text })}
              title={t("diff.remove")}
            >
              {seg.text}
            </span>
          );
        return (
          <span
            key={i}
            className="diff-change"
            aria-label={t("diff.changeAria", { text: seg.text })}
            title={t("diff.change")}
          >
            {seg.text}
          </span>
        );
      })}
      </pre>
    </div>
  );
}
