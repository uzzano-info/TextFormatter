"use client";

import { ClipboardPaste, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function EmptyState() {
  const loadSample = useAppStore((s) => s.loadSample);

  return (
    <div className="pointer-events-none flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-surface-2 text-muted">
        <ClipboardPaste size={26} />
      </div>
      <h2 className="text-[16px] font-semibold text-text">
        AI 답변을 여기에 붙여넣으세요
        <span className="ml-1 text-muted">(⌘V)</span>
      </h2>
      <p className="mt-1 max-w-xs text-sm text-muted">
        ChatGPT · Claude · Gemini 어떤 답변이든 정리해 드려요
      </p>
      <button
        type="button"
        onClick={loadSample}
        className="pointer-events-auto mt-5 inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-2"
      >
        <Sparkles size={16} className="text-accent" />
        예시로 체험하기
      </button>
    </div>
  );
}
