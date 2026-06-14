"use client";

import { useAppStore } from "@/store/useAppStore";
import PresetManager from "./PresetManager";
import ThemeToggle from "./ThemeToggle";
import HelpButton from "./HelpButton";

export default function Topbar() {
  const detectedSource = useAppStore((s) => s.detectedSource);
  const detectScore = useAppStore((s) => s.detectScore);
  const hasInput = useAppStore((s) => s.input.trim().length > 0);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <div className="flex items-center gap-2">
        {/* 로고 마크: 반쯤 정리된 원 */}
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <path d="M10 2 A8 8 0 0 1 10 18 Z" fill="var(--accent)" />
        </svg>
        <span className="text-[18px] font-semibold leading-6 text-text">
          AI Text Formatter
        </span>
      </div>

      {hasInput && detectedSource !== "unknown" && (
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
          {detectedSource} 감지 · {Math.round(detectScore * 100)}%
        </span>
      )}

      <div className="ml-auto flex items-center gap-1">
        <PresetManager />
        <ThemeToggle />
        <HelpButton />
      </div>
    </header>
  );
}
