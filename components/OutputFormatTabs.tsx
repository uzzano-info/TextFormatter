"use client";

import { useAppStore } from "@/store/useAppStore";
import type { OutputFormat } from "@/lib/transform/types";

const TABS: { id: OutputFormat; label: string }[] = [
  { id: "markdown", label: "Markdown" },
  { id: "html", label: "HTML" },
  { id: "plain", label: "Plain" },
  { id: "blog", label: "블로그" },
];

export default function OutputFormatTabs() {
  const outputFormat = useAppStore((s) => s.outputFormat);
  const setFormat = useAppStore((s) => s.setFormat);
  const blogTarget = useAppStore((s) => s.blogTarget);
  const setBlogTarget = useAppStore((s) => s.setBlogTarget);

  return (
    <div className="flex items-center gap-3">
      <div role="tablist" className="flex items-center gap-1">
        {TABS.map((t) => {
          const activeTab = outputFormat === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab}
              aria-label={`${t.label} 포맷`}
              onClick={() => setFormat(t.id)}
              className={`relative px-2 py-1.5 text-sm transition-colors ${
                activeTab
                  ? "font-medium text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {t.label}
              {activeTab && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {outputFormat === "blog" && (
        <div className="flex items-center gap-1">
          {(["naver", "tistory"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={blogTarget === t}
              onClick={() => setBlogTarget(t)}
              className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                blogTarget === t
                  ? "bg-accent-soft text-accent"
                  : "bg-surface-2 text-muted hover:text-text"
              }`}
            >
              {t === "naver" ? "네이버" : "티스토리"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
