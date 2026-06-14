"use client";

import { SlidersHorizontal } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import TemplateMenu from "./TemplateMenu";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import HelpButton from "./HelpButton";

export default function Topbar() {
  const detectedSource = useAppStore((s) => s.detectedSource);
  const hasInput = useAppStore((s) => s.input.trim().length > 0);
  const optionsOpen = useAppStore((s) => s.optionsOpen);
  const setOptionsOpen = useAppStore((s) => s.setOptionsOpen);
  const t = useT();

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
        <span
          className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted"
          title={t("detect.tooltip", { src: detectedSource })}
        >
          {t("detect.badge")}
        </span>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <TemplateMenu />
        <button
          type="button"
          onClick={() => setOptionsOpen(!optionsOpen)}
          aria-label={t("tune")}
          aria-pressed={optionsOpen}
          className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-sm transition-colors ${
            optionsOpen
              ? "border-accent bg-accent-soft text-accent"
              : "border-border bg-surface text-muted hover:bg-surface-2 hover:text-text"
          }`}
        >
          <SlidersHorizontal size={14} />
          {t("tune")}
        </button>
        <LanguageToggle />
        <ThemeToggle />
        <HelpButton />
      </div>
    </header>
  );
}
