"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Code2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import OutputFormatTabs from "./OutputFormatTabs";
import SummaryChips from "./SummaryChips";
import DiffView from "./DiffView";

export default function PreviewPanel() {
  const input = useAppStore((s) => s.input);
  const output = useAppStore((s) => s.output);
  const outputFormat = useAppStore((s) => s.outputFormat);
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const warnedSimplified = useAppStore((s) => s.warnedSimplified);
  const fallback = useAppStore((s) => s.fallback);

  const t = useT();
  const [showHtmlCode, setShowHtmlCode] = useState(false);

  const warnedOnce = useRef(false);
  useEffect(() => {
    if (warnedSimplified && !warnedOnce.current) {
      warnedOnce.current = true;
      toast.warning(t("toast.simplified"));
    }
    if (!warnedSimplified) warnedOnce.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warnedSimplified]);

  const fallbackOnce = useRef(false);
  useEffect(() => {
    if (fallback && !fallbackOnce.current) {
      fallbackOnce.current = true;
      toast.error(t("toast.fallback"));
    }
    if (!fallback) fallbackOnce.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallback]);

  const isEmpty = input.trim().length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* 상단 바: RESULT + Clean/Diff 토글 */}
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[13px] font-semibold tracking-wide text-muted">
          {t("result.label")}
        </span>
        {!isEmpty && (
          <div className="flex rounded-sm border border-border bg-surface-2 p-0.5">
            {(["clean", "diff"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={viewMode === m}
                onClick={() => setViewMode(m)}
                className={`rounded-[4px] px-2.5 py-0.5 text-xs transition-colors ${
                  viewMode === m
                    ? "bg-surface font-medium text-text shadow-sm"
                    : "text-muted hover:text-text"
                }`}
              >
                {m === "clean" ? t("result.clean") : t("result.diff")}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isEmpty && <SummaryChips />}

      {/* 본문 */}
      <div className="min-h-0 flex-1 overflow-auto px-4 py-3">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-faint">{t("result.placeholder")}</p>
          </div>
        ) : viewMode === "diff" ? (
          <DiffView />
        ) : outputFormat === "html" ? (
          <div className="mx-auto max-w-prose">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHtmlCode((v) => !v)}
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-text"
              >
                <Code2 size={13} />
                {showHtmlCode ? t("result.showPreview") : t("result.showHtml")}
              </button>
            </div>
            {showHtmlCode ? (
              <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-text">
                {output}
              </pre>
            ) : (
              <div
                className="result-prose"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            )}
          </div>
        ) : (
          <pre className="mx-auto max-w-prose whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-text">
            {output}
          </pre>
        )}
      </div>

      {/* 포맷 탭 */}
      <div className="border-t border-border px-4 py-2">
        <OutputFormatTabs />
      </div>
    </div>
  );
}
