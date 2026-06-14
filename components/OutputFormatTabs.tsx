"use client";

import { useAppStore } from "@/store/useAppStore";
import { useT } from "@/lib/useT";
import type { OutputFormat } from "@/lib/transform/types";

const TABS: { id: OutputFormat; key: string }[] = [
  { id: "markdown", key: "tab.markdown" },
  { id: "html", key: "tab.html" },
  { id: "plain", key: "tab.plain" },
  { id: "blog", key: "tab.blog" },
];

export default function OutputFormatTabs() {
  const outputFormat = useAppStore((s) => s.outputFormat);
  const setFormat = useAppStore((s) => s.setFormat);
  const blogTarget = useAppStore((s) => s.blogTarget);
  const setBlogTarget = useAppStore((s) => s.setBlogTarget);
  const t = useT();

  return (
    <div className="flex items-center gap-3">
      <div role="tablist" className="flex items-center gap-1">
        {TABS.map((tab) => {
          const activeTab = outputFormat === tab.id;
          const label = t(tab.key);
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab}
              aria-label={t("tab.formatAria", { label })}
              onClick={() => setFormat(tab.id)}
              className={`relative px-2 py-1.5 text-sm transition-colors ${
                activeTab
                  ? "font-medium text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {label}
              {activeTab && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {outputFormat === "blog" && (
        <div className="flex items-center gap-1">
          {(["naver", "tistory"] as const).map((target) => (
            <button
              key={target}
              type="button"
              aria-pressed={blogTarget === target}
              onClick={() => setBlogTarget(target)}
              className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                blogTarget === target
                  ? "bg-accent-soft text-accent"
                  : "bg-surface-2 text-muted hover:text-text"
              }`}
            >
              {target === "naver" ? t("target.naver") : t("target.tistory")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
