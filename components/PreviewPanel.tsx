"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import OutputFormatTabs from "./OutputFormatTabs";
import CopyExportButtons from "./CopyExportButtons";

export default function PreviewPanel() {
  const input = useAppStore((s) => s.input);
  const output = useAppStore((s) => s.output);
  const outputFormat = useAppStore((s) => s.outputFormat);
  const warnedSimplified = useAppStore((s) => s.warnedSimplified);
  const fallback = useAppStore((s) => s.fallback);

  const warnedOnce = useRef(false);
  useEffect(() => {
    if (warnedSimplified && !warnedOnce.current) {
      warnedOnce.current = true;
      toast.warning("일부 서식은 단순화되었습니다");
    }
    if (!warnedSimplified) warnedOnce.current = false;
  }, [warnedSimplified]);

  const fallbackOnce = useRef(false);
  useEffect(() => {
    if (fallback && !fallbackOnce.current) {
      fallbackOnce.current = true;
      toast.error("변환에 실패해 원문을 그대로 표시합니다");
    }
    if (!fallback) fallbackOnce.current = false;
  }, [fallback]);

  const isEmpty = input.trim().length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
        <OutputFormatTabs />
        <CopyExportButtons />
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3">
        {isEmpty ? (
          <p className="text-sm text-slate-400">
            AI 답변을 왼쪽에 붙여넣으세요.
          </p>
        ) : outputFormat === "html" ? (
          <div
            className="prose-preview text-sm leading-relaxed"
            // 출력은 rehype-sanitize로 정화된 HTML
            dangerouslySetInnerHTML={{ __html: output }}
          />
        ) : (
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-slate-800">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
